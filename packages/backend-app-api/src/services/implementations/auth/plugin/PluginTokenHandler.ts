/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DiscoveryService, LoggerService } from '@backstage/backend-plugin-api';
import {
  decodeJwt,
  exportJWK,
  generateKeyPair,
  JWK,
  importJWK,
  SignJWT,
  decodeProtectedHeader,
} from 'jose';
import { v4 as uuid } from 'uuid';
import { InternalKey, KeyStore } from '../types';
import { AuthenticationError } from '@backstage/errors';
import { jwtVerify } from 'jose';
import { tokenTypes } from '@backstage/plugin-auth-node';
import { JwksClient } from '../JwksClient';
import { HumanDuration, durationToMilliseconds } from '@backstage/types';

/**
 * The margin for how many times longer we make the public key available
 * compared to how long we use the private key to sign new tokens.
 */
const KEY_EXPIRATION_MARGIN_FACTOR = 3;
const SECONDS_IN_MS = 1000;

const ALLOWED_PLUGIN_ID_PATTERN = /^[a-z0-9_-]+$/i;

type Options = {
  ownPluginId: string;
  publicKeyStore: KeyStore;
  discovery: DiscoveryService;
  logger: LoggerService;
  /** Expiration time of signing keys */
  keyDuration: HumanDuration;
  /** JWS "alg" (Algorithm) Header Parameter value. Defaults to ES256.
   * Must match one of the algorithms defined for IdentityClient.
   * When setting a different algorithm, check if the `key` field
   * of the `signing_keys` table can fit the length of the generated keys.
   * If not, add a knex migration file in the migrations folder.
   * More info on supported algorithms: https://github.com/panva/jose */
  algorithm?: string;
};

export class PluginTokenHandler {
  private privateKeyPromise?: Promise<JWK>;
  private keyExpiry?: Date;
  private jwksMap = new Map<string, JwksClient>();

  // Tracking state for isTargetPluginSupported
  private supportedTargetPlugins = new Set<string>();
  private targetPluginInflightChecks = new Map<string, Promise<boolean>>();

  static create(options: Options) {
    return new PluginTokenHandler(
      options.logger,
      options.ownPluginId,
      options.publicKeyStore,
      Math.round(durationToMilliseconds(options.keyDuration) / 1000),
      options.algorithm ?? 'ES256',
      options.discovery,
    );
  }

  private constructor(
    private readonly logger: LoggerService,
    private readonly ownPluginId: string,
    private readonly publicKeyStore: KeyStore,
    private readonly keyDurationSeconds: number,
    private readonly algorithm: string,
    private readonly discovery: DiscoveryService,
  ) {}

  async verifyToken(
    token: string,
  ): Promise<{ subject: string; limitedUserToken?: string } | undefined> {
    try {
      const { typ } = decodeProtectedHeader(token);
      if (typ !== tokenTypes.plugin.typParam) {
        return undefined;
      }
    } catch {
      return undefined;
    }

    const pluginId = String(decodeJwt(token).sub);
    if (!pluginId) {
      throw new AuthenticationError('Invalid plugin token: missing subject');
    }
    if (!ALLOWED_PLUGIN_ID_PATTERN.test(pluginId)) {
      throw new AuthenticationError(
        'Invalid plugin token: forbidden subject format',
      );
    }

    const jwksClient = await this.getJwksClient(pluginId);
    await jwksClient.refreshKeyStore(token); // TODO(Rugvip): Refactor so that this isn't needed

    const { payload } = await jwtVerify<{ sub: string; obo?: string }>(
      token,
      jwksClient.getKey,
      {
        typ: tokenTypes.plugin.typParam,
        audience: this.ownPluginId,
        requiredClaims: ['iat', 'exp', 'sub', 'aud'],
      },
    ).catch(e => {
      throw new AuthenticationError('Invalid plugin token', e);
    });

    return { subject: `plugin:${payload.sub}`, limitedUserToken: payload.obo };
  }

  async issueToken(options: {
    pluginId: string;
    targetPluginId: string;
    onBehalfOf?: { token: string; expiresAt: Date };
  }): Promise<{ token: string }> {
    const { pluginId, targetPluginId, onBehalfOf } = options;
    const key = await this.getKey();

    const sub = pluginId;
    const aud = targetPluginId;
    const iat = Math.floor(Date.now() / SECONDS_IN_MS);
    const ourExp = iat + this.keyDurationSeconds;
    const exp = onBehalfOf
      ? Math.min(
          ourExp,
          Math.floor(onBehalfOf.expiresAt.getTime() / SECONDS_IN_MS),
        )
      : ourExp;

    const claims = { sub, aud, iat, exp, obo: onBehalfOf?.token };
    const token = await new SignJWT(claims)
      .setProtectedHeader({
        typ: tokenTypes.plugin.typParam,
        alg: this.algorithm,
        kid: key.kid,
      })
      .setAudience(aud)
      .setSubject(sub)
      .setIssuedAt(iat)
      .setExpirationTime(exp)
      .sign(await importJWK(key));

    return { token };
  }

  async isTargetPluginSupported(targetPluginId: string): Promise<boolean> {
    if (this.supportedTargetPlugins.has(targetPluginId)) {
      return true;
    }
    const inFlight = this.targetPluginInflightChecks.get(targetPluginId);
    if (inFlight) {
      return inFlight;
    }

    const doCheck = async () => {
      try {
        const res = await fetch(
          `${await this.discovery.getBaseUrl(
            targetPluginId,
          )}/.backstage/auth/v1/jwks.json`,
        );
        if (res.status === 404) {
          return false;
        }

        if (!res.ok) {
          throw new Error(`Failed to fetch jwks.json, ${res.status}`);
        }

        const data = await res.json();
        if (!data.keys) {
          throw new Error(`Invalid jwks.json response, missing keys`);
        }

        this.supportedTargetPlugins.add(targetPluginId);
        return true;
      } catch (error) {
        this.logger.error('Unexpected failure for target JWKS check', error);
        return false;
      } finally {
        this.targetPluginInflightChecks.delete(targetPluginId);
      }
    };

    const check = doCheck();
    this.targetPluginInflightChecks.set(targetPluginId, check);
    return check;
  }

  private async getJwksClient(pluginId: string) {
    const client = this.jwksMap.get(pluginId);
    if (client) {
      return client;
    }

    // Double check that the target plugin has a valid JWKS endpoint, otherwise avoid creating a remote key set
    if (!(await this.isTargetPluginSupported(pluginId))) {
      throw new AuthenticationError(
        `Received a plugin token where the source '${pluginId}' plugin unexpectedly does not have a JWKS endpoint`,
      );
    }

    const newClient = new JwksClient(async () => {
      return new URL(
        `${await this.discovery.getBaseUrl(
          pluginId,
        )}/.backstage/auth/v1/jwks.json`,
      );
    });

    this.jwksMap.set(pluginId, newClient);
    return newClient;
  }

  private async getKey(): Promise<JWK> {
    // Make sure that we only generate one key at a time
    if (this.privateKeyPromise) {
      if (this.keyExpiry && this.keyExpiry.getTime() > Date.now()) {
        return this.privateKeyPromise;
      }
      this.logger.info(`Signing key has expired, generating new key`);
      delete this.privateKeyPromise;
    }

    this.keyExpiry = new Date(
      Date.now() + this.keyDurationSeconds * SECONDS_IN_MS,
    );

    const promise = (async () => {
      // This generates a new signing key to be used to sign tokens until the next key rotation
      const kid = uuid();
      const key = await generateKeyPair(this.algorithm);
      const publicKey = await exportJWK(key.publicKey);
      const privateKey = await exportJWK(key.privateKey);
      publicKey.kid = privateKey.kid = kid;
      publicKey.alg = privateKey.alg = this.algorithm;

      // We're not allowed to use the key until it has been successfully stored
      // TODO: some token verification implementations aggressively cache the list of keys, and
      //       don't attempt to fetch new ones even if they encounter an unknown kid. Therefore we
      //       may want to keep using the existing key for some period of time until we switch to
      //       the new one. This also needs to be implemented cross-service though, meaning new services
      //       that boot up need to be able to grab an existing key to use for signing.
      this.logger.info(`Created new signing key ${kid}`);

      await this.publicKeyStore.addKey({
        id: kid,
        key: publicKey as InternalKey,
        expiresAt: new Date(
          Date.now() +
            this.keyDurationSeconds *
              SECONDS_IN_MS *
              KEY_EXPIRATION_MARGIN_FACTOR,
        ),
      });

      // At this point we are allowed to start using the new key
      return privateKey;
    })();

    this.privateKeyPromise = promise;

    try {
      // If we fail to generate a new key, we need to clear the state so that
      // the next caller will try to generate another key.
      await promise;
    } catch (error) {
      this.logger.error(`Failed to generate new signing key, ${error}`);
      delete this.keyExpiry;
      delete this.privateKeyPromise;
    }

    return promise;
  }
}
