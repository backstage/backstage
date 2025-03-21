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

import { createPluginKeySource } from './createPluginKeySource';
import {
  TestDatabases,
  createMockDirectory,
  mockServices,
} from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';

jest.setTimeout(60_000);

describe('createPluginKeySource', () => {
  const databases = TestDatabases.create();
  const mockDir = createMockDirectory();

  it.each(databases.eachSupportedId())(
    'works for implicit database (no config), %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      const getClient = jest.fn(async () => knex);

      const source = await createPluginKeySource({
        config: new ConfigReader({}),
        database: mockServices.database.mock({ getClient }),
        logger: mockServices.logger.mock(),
        keyDuration: { seconds: 10 },
      });

      expect(getClient).toHaveBeenCalled();

      const key = await source.getPrivateSigningKey();
      expect(key).toMatchObject({
        alg: 'ES256',
        d: expect.any(String),
      });

      const keys = await source.listKeys();
      expect(keys).toEqual({
        keys: [
          expect.objectContaining({
            id: key.kid,
            key: expect.objectContaining({
              kid: key.kid,
            }),
          }),
        ],
      });
    },
  );

  it.each(databases.eachSupportedId())(
    'works for explicit database, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      const getClient = jest.fn(async () => knex);

      const source = await createPluginKeySource({
        config: new ConfigReader({
          backend: { auth: { pluginKeyStore: { type: 'database' } } },
        }),
        database: mockServices.database.mock({ getClient }),
        logger: mockServices.logger.mock(),
        keyDuration: { seconds: 10 },
      });

      expect(getClient).toHaveBeenCalled();

      const key = await source.getPrivateSigningKey();
      expect(key).toMatchObject({
        alg: 'ES256',
        d: expect.any(String),
      });

      const keys = await source.listKeys();
      expect(keys).toEqual({
        keys: [
          expect.objectContaining({
            id: key.kid,
            key: expect.objectContaining({
              kid: key.kid,
            }),
          }),
        ],
      });
    },
  );

  it('works for static', async () => {
    const privateKey = `
    -----BEGIN PRIVATE KEY-----
    MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgR8Ja2ppMEgOm1KeY
    Kpje00U1luybndt6yC263vcgeKqhRANCAAS+slUrS9JXgtHB1RcDnmlveuu4H3Zm
    hQRjvYdO+Mg/3FJss6FaExESTzhPSr3X+be/exarkTMchbDXNEdCKwpn
    -----END PRIVATE KEY-----
    `.trim();

    const publicKey = `
    -----BEGIN PUBLIC KEY-----
    MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEvrJVK0vSV4LRwdUXA55pb3rruB92
    ZoUEY72HTvjIP9xSbLOhWhMREk84T0q91/m3v3sWq5EzHIWw1zRHQisKZw==
    -----END PUBLIC KEY-----
    `.trim();

    mockDir.setContent({
      'public.pem': publicKey,
      'private.pem': privateKey,
    });
    const publicKeyPath = mockDir.resolve('public.pem');
    const privateKeyPath = mockDir.resolve('private.pem');

    const getClient = jest.fn();

    const source = await createPluginKeySource({
      config: new ConfigReader({
        backend: {
          auth: {
            pluginKeyStore: {
              type: 'static',
              static: {
                keys: [
                  {
                    publicKeyFile: publicKeyPath,
                    privateKeyFile: privateKeyPath,
                    keyId: '1',
                  },
                ],
              },
            },
          },
        },
      }),
      database: mockServices.database.mock({ getClient }),
      logger: mockServices.logger.mock(),
      keyDuration: { seconds: 10 },
    });

    expect(getClient).not.toHaveBeenCalled();

    const keys = await source.listKeys();
    expect(keys.keys.length).toEqual(1);
    expect(keys.keys[0].key).toMatchObject({
      kid: '1',
      alg: 'ES256',
    });

    const pk = await source.getPrivateSigningKey();
    expect(pk).toMatchObject({
      kid: '1',
      alg: 'ES256',
      d: expect.any(String),
    });
  });
});
