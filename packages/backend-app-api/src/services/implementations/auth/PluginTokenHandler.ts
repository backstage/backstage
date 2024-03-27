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

import {
  LoggerService,
  PublicKeyStoreService,
} from '@backstage/backend-plugin-api';
import { exportJWK, generateKeyPair, JWK } from 'jose';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';

type Options = {
  publicKeyStore: PublicKeyStoreService;
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

  static create(options: Options) {
    return new PluginTokenHandler(
      options.logger,
      options.publicKeyStore,
      options.keyDurationSeconds,
      options.algorithm ?? 'ES256',
    );
  }

  private constructor(
    readonly logger: LoggerService,
    readonly publicKeyStore: PublicKeyStoreService,
    readonly keyDurationSeconds: number,
    readonly algorithm: string,
  ) {}

  async issueToken(options: {
    pluginId: string;
    targetPluginId: string;
  }): Promise<{ token: string }> {
    await this.getKey();
    return { token: undefined! };
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
      await this.publicKeyStore.addKey({
        id: kid,
        key: publicKey,
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
