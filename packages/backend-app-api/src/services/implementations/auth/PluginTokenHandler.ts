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
} from 'jose';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import { InternalKey, KeyStore } from './types';
import { AuthenticationError } from '@backstage/errors';
import { createRemoteJWKSet, jwtVerify } from 'jose';

type Options = {
  publicKeyStore: KeyStore;
  discovery: DiscoveryService;
  logger: LoggerService;
  /** Value of the issuer claim in issued tokens */
  issuer: string;
  /** Expiration time of signing keys in seconds */
  keyDurationSeconds: number;
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
  private jwksMap: Record<string, ReturnType<typeof createRemoteJWKSet>> = {};

  static create(options: Options) {
    return new PluginTokenHandler(
      options.logger,
      options.publicKeyStore,
      options.keyDurationSeconds,
      options.algorithm ?? 'ES256',
      options.discovery,
    );
  }

  private constructor(
    readonly logger: LoggerService,
    readonly publicKeyStore: KeyStore,
    readonly keyDurationSeconds: number,
    readonly algorithm: string,
    readonly discovery: DiscoveryService,
  ) {}

  async verifyToken(token: string): Promise<{ subject: string }> {
    const claims = decodeJwt(token);
    const pluginId = claims.sub;
    if (!pluginId) {
      throw new AuthenticationError('Invalid subject');
    }

    const JWKS = await this.getJWKS(pluginId);
    try {
      const { payload, protectedHeader } = await jwtVerify(token, JWKS, {
        issuer: 'backstage-plugin',
        // TODO(vinzscam): add audience verification
      });

      if (!payload.sub) {
        throw new AuthenticationError('Missing subject');
      }
      console.log('payload', payload);
      console.log('protected header', protectedHeader);
      return { subject: payload.sub };
    } catch (e) {
      // TODO(vinzscam): here we need to handle errors properly
      throw e;
    }
  }

  async issueToken(options: {
    pluginId: string;
    targetPluginId: string;
  }): Promise<{ token: string }> {
    const key = await this.getKey();

    const iss = 'backstage-plugin';
    const sub = options.pluginId;
    const aud = options.targetPluginId;
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + this.keyDurationSeconds;

    this.logger.info(`Issuing token for ${sub} with audentice ${aud}`);

    const claims = { iss, sub, aud, iat, exp };
    const token = await new SignJWT(claims)
      .setProtectedHeader({ alg: this.algorithm, kid: key.kid })
      .setIssuer(iss)
      .setAudience(aud)
      .setSubject(sub)
      .setIssuedAt(iat)
      .setExpirationTime(exp)
      .sign(await importJWK(key));

    return { token };
  }

  private async getJWKS(pluginId: string) {
    if (!this.jwksMap[pluginId]) {
      const url = `${await this.discovery.getBaseUrl(
        pluginId,
      )}/.backstage/auth/v1/jwks.json`;
      this.jwksMap[pluginId] = createRemoteJWKSet(new URL(url));
    }
    return this.jwksMap[pluginId];
  }
  private async getKey(): Promise<JWK> {
    // Make sure that we only generate one key at a time
    if (this.privateKeyPromise) {
      if (
        this.keyExpiry &&
        DateTime.fromJSDate(this.keyExpiry) > DateTime.local()
      ) {
        return this.privateKeyPromise;
      }
      this.logger.info(`Signing key has expired, generating new key`);
      delete this.privateKeyPromise;
    }

    const keyExpiry = DateTime.utc()
      .plus({
        seconds: this.keyDurationSeconds,
      })
      .toJSDate();
    this.keyExpiry = keyExpiry;

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
      console.log(`DEBUG: publicKey=`, publicKey);
      await this.publicKeyStore.addKey({
        id: kid,
        key: publicKey as InternalKey,
        expiresAt: keyExpiry,
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
