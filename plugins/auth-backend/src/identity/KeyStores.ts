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

import { pickBy } from 'lodash';
import { LoggerService } from '@backstage/backend-plugin-api';

import { Config } from '@backstage/config';
import { AuthDatabase } from '../database/AuthDatabase';
import { DatabaseKeyStore } from './DatabaseKeyStore';
import { FirestoreKeyStore } from './FirestoreKeyStore';
import { MemoryKeyStore } from './MemoryKeyStore';
import { KeyStore } from './types';
import { StaticKeyStore } from './StaticKeyStore';

type Options = {
  logger: LoggerService;
  database: AuthDatabase;
};

export class KeyStores {
  /**
   * Looks at the `auth.keyStore` section in the application configuration
   * and returns a KeyStore store. Defaults to `database`
   *
   * @returns a KeyStore store
   */
  static async fromConfig(config: Config, options: Options): Promise<KeyStore> {
    const { logger, database } = options;

    const ks = config.getOptionalConfig('auth.keyStore');
    const provider = ks?.getOptionalString('provider') ?? 'database';

    logger.info(`Configuring "${provider}" as KeyStore provider`);

    if (provider === 'database') {
      return new DatabaseKeyStore(await database.get());
    }

    if (provider === 'memory') {
      return new MemoryKeyStore();
    }

    if (provider === 'firestore') {
      const settings = ks?.getConfig(provider);

      const keyStore = await FirestoreKeyStore.create(
        pickBy(
          {
            projectId: settings?.getOptionalString('projectId'),
            keyFilename: settings?.getOptionalString('keyFilename'),
            host: settings?.getOptionalString('host'),
            port: settings?.getOptionalNumber('port'),
            ssl: settings?.getOptionalBoolean('ssl'),
            path: settings?.getOptionalString('path'),
            timeout: settings?.getOptionalNumber('timeout'),
          },
          value => value !== undefined,
        ),
      );
      await FirestoreKeyStore.verifyConnection(keyStore, logger);

      return keyStore;
    }

    if (provider === 'static') {
      return await StaticKeyStore.fromConfig(config);
    }

    throw new Error(`Unknown KeyStore provider: ${provider}`);
  }
}
