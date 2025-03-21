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
import { decodeJwt, importJWK, SignJWT, decodeProtectedHeader } from 'jose';
import { assertError, AuthenticationError } from '@backstage/errors';
import { jwtVerify } from 'jose';
import { tokenTypes } from '@backstage/plugin-auth-node';
import { JwksClient } from '../JwksClient';
import { HumanDuration, durationToMilliseconds } from '@backstage/types';
import { PluginKeySource } from './keys/types';

const SECONDS_IN_MS = 1000;

const ALLOWED_PLUGIN_ID_PATTERN = /^[a-z0-9_-]+$/i;

type Options = {
  ownPluginId: string;
  keyDuration: HumanDuration;
  keySource: PluginKeySource;
  discovery: DiscoveryService;
  logger: LoggerService;
  /**
   * JWS "alg" (Algorithm) Header Parameter value. Defaults to ES256.
   * Must match one of the algorithms defined for IdentityClient.
   * When setting a different algorithm, check if the `key` field
   * of the `signing_keys` table can fit the length of the generated keys.
   * If not, add a knex migration file in the migrations folder.
   * More info on supported algorithms: https://github.com/panva/jose
   */
  algorithm?: string;
};

/**
 * @public
 * Issues and verifies {@link https://backstage.iceio/docs/auth/service-to-service-auth | service-to-service tokens}.
 */
export interface PluginTokenHandler {
  verifyToken(
    token: string,
  ): Promise<{ subject: string; limitedUserToken?: string } | undefined>;
  issueToken(options: {
    pluginId: string;
    targetPluginId: string;
    onBehalfOf?: { limitedUserToken: string; expiresAt: Date };
  }): Promise<{ token: string }>;
}

export class DefaultPluginTokenHandler implements PluginTokenHandler {
  private jwksMap = new Map<string, JwksClient>();

  // Tracking state for isTargetPluginSupported
  private supportedTargetPlugins = new Set<string>();
  private targetPluginInflightChecks = new Map<string, Promise<boolean>>();

  static create(options: Options) {
    return new DefaultPluginTokenHandler(
      options.logger,
      options.ownPluginId,
      options.keySource,
      options.algorithm ?? 'ES256',
      Math.round(durationToMilliseconds(options.keyDuration) / 1000),
      options.discovery,
    );
  }

  private constructor(
    private readonly logger: LoggerService,
    private readonly ownPluginId: string,
    private readonly keySource: PluginKeySource,
    private readonly algorithm: string,
    private readonly keyDurationSeconds: number,
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
      this.logger.warn('Failed to verify incoming plugin token', e);
      throw new AuthenticationError('Failed plugin token verification');
    });

    return { subject: `plugin:${payload.sub}`, limitedUserToken: payload.obo };
  }

  async issueToken(options: {
    pluginId: string;
    targetPluginId: string;
    onBehalfOf?: { limitedUserToken: string; expiresAt: Date };
  }): Promise<{ token: string }> {
    const { pluginId, targetPluginId, onBehalfOf } = options;
    const key = await this.keySource.getPrivateSigningKey();

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

    const claims = { sub, aud, iat, exp, obo: onBehalfOf?.limitedUserToken };
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

  private async isTargetPluginSupported(
    targetPluginId: string,
  ): Promise<boolean> {
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
        assertError(error);
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
        `Received a plugin token where the source '${pluginId}' plugin unexpectedly does not have a JWKS endpoint. ` +
          'The target plugin needs to be migrated to be installed in an app using the new backend system.',
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
}
