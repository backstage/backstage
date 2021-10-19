/*
 * Copyright 2021 The Backstage Authors
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

import { Logger } from 'winston';

import { PluginDatabaseManager } from '@backstage/backend-common';
import { Config } from '@backstage/config';

import { DatabaseKeyStore } from './DatabaseKeyStore';
import { MemoryKeyStore } from './MemoryKeyStore';
import {
  FirestoreKeyStore,
  FirestoreKeyStoreSettings,
} from './FirestoreKeyStore';
import { KeyStore } from './types';

type Options = {
  logger?: Logger;
  database?: PluginDatabaseManager;
};

export class KeyStores {
  /**
   * Looks at the `auth.keyStore` section in the application configuration
   * and returns a KeyStore store. Defaults to `postgres`
   *
   * @returns a KeyStore store
   */
  static async fromConfig(
    config: Config,
    options?: Options,
  ): Promise<KeyStore> {
    const { logger, database } = options ?? {};

    const ks = config.getOptionalConfig('auth.keyStore');
    const provider = ks?.getOptionalString('provider') ?? 'postgres';

    logger?.info(`Configuring "${provider}" as KeyStore provider`);

    if (provider === 'postgres') {
      if (!database) {
        throw new Error('This KeyStore provider requires a database');
      }

      return await DatabaseKeyStore.create({
        database: await database.getClient(),
      });
    }

    if (provider === 'memory') {
      return new MemoryKeyStore();
    }

    if (provider === 'firestore') {
      const settings = ks?.getOptional(provider) as FirestoreKeyStoreSettings;
      const keyStore = await FirestoreKeyStore.create(settings);
      await FirestoreKeyStore.verifyConnection(keyStore, logger);

      return keyStore;
    }

    throw new Error(`Unknown KeyStore provider: ${provider}`);
  }
}
