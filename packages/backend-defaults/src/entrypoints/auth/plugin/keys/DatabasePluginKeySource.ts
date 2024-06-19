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

import { DatabaseService, LoggerService } from '@backstage/backend-plugin-api';
import { HumanDuration, durationToMilliseconds } from '@backstage/types';
import { JWK, exportJWK, generateKeyPair } from 'jose';
import { v4 as uuid } from 'uuid';
import { DatabaseKeyStore } from './DatabaseKeyStore';
import { InternalKey, KeyPayload, KeyStore } from './types';
import { PluginKeySource } from './types';

const SECONDS_IN_MS = 1000;

/**
 * The margin for how many times longer we make the public key available
 * compared to how long we use the private key to sign new tokens.
 */
const KEY_EXPIRATION_MARGIN_FACTOR = 3;

export class DatabasePluginKeySource implements PluginKeySource {
  private privateKeyPromise?: Promise<JWK>;
  private keyExpiry?: Date;

  constructor(
    private readonly keyStore: KeyStore,
    private readonly logger: LoggerService,
    private readonly keyDurationSeconds: number,
    private readonly algorithm: string,
  ) {}

  public static async create(options: {
    logger: LoggerService;
    database: DatabaseService;
    keyDuration: HumanDuration;
    algorithm?: string;
  }): Promise<PluginKeySource> {
    const keyStore = await DatabaseKeyStore.create({
      database: options.database,
      logger: options.logger,
    });

    return new DatabasePluginKeySource(
      keyStore,
      options.logger,
      Math.round(durationToMilliseconds(options.keyDuration) / 1000),
      options.algorithm ?? 'ES256',
    );
  }

  async getPrivateSigningKey(): Promise<JWK> {
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

      await this.keyStore.addKey({
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

  listKeys(): Promise<{ keys: KeyPayload[] }> {
    return this.keyStore.listKeys();
  }
}
