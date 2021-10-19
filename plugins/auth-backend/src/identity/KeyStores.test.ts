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

import { DatabaseManager } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';

import { MemoryKeyStore } from './MemoryKeyStore';
import { DatabaseKeyStore } from './DatabaseKeyStore';
import { FirestoreKeyStore } from './FirestoreKeyStore';
import { KeyStores } from './KeyStores';

describe('KeyStores', () => {
  const defaultConfigOptions = {
    auth: {
      keyStore: {
        provider: 'memory',
      },
    },
  };
  const defaultConfig = new ConfigReader(defaultConfigOptions);

  it('reads auth section from config', async () => {
    const configSpy = jest.spyOn(defaultConfig, 'getOptionalConfig');
    const keyStore = await KeyStores.fromConfig(defaultConfig);

    expect(keyStore).toBeInstanceOf(MemoryKeyStore);
    expect(configSpy).toHaveBeenCalledWith('auth.keyStore');
    expect(
      defaultConfig
        .getOptionalConfig('auth.keyStore')
        ?.getOptionalString('provider'),
    ).toBe(defaultConfigOptions.auth.keyStore.provider);
  });

  it('can handle without auth config', async () => {
    const config = new ConfigReader({
      backend: {
        database: {
          client: 'sqlite3',
          connection: ':memory:',
        },
      },
    });
    const database =
      DatabaseManager.fromConfig(config).forPlugin('auth-backend');
    const keyStore = await KeyStores.fromConfig(config, { database });

    expect(keyStore).toBeInstanceOf(DatabaseKeyStore);
  });

  it('can handle additional provider config', async () => {
    jest.spyOn(FirestoreKeyStore, 'verifyConnection').mockResolvedValue();

    const configOptions = {
      auth: {
        keyStore: {
          provider: 'firestore',
          firestore: {
            projectId: 'my-project',
          },
        },
      },
    };
    const config = new ConfigReader(configOptions);
    const keyStore = await KeyStores.fromConfig(config);

    expect(keyStore).toBeInstanceOf(FirestoreKeyStore);
    expect(
      config
        .getOptionalConfig('auth.keyStore')
        ?.getOptionalConfig('firestore')
        ?.getOptionalString('projectId'),
    ).toBe(configOptions.auth.keyStore.firestore.projectId);
  });
});
