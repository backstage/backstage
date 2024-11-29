/*
 * Copyright 2023 The Backstage Authors
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

import { StaticConfigPluginKeySource } from './StaticConfigPluginKeySource';
import { ConfigReader } from '@backstage/config';
import { createMockDirectory } from '@backstage/backend-test-utils';

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

describe('StaticConfigPluginKeySource', () => {
  const mockDir = createMockDirectory({
    content: {
      'public.pem': publicKey,
      'private.pem': privateKey,
    },
  });
  const publicKeyPath = mockDir.resolve('public.pem');
  const privateKeyPath = mockDir.resolve('private.pem');

  it('should provide keys from disk', async () => {
    const staticKeyStore = await StaticConfigPluginKeySource.create({
      sourceConfig: new ConfigReader({
        type: 'static',
        static: {
          keys: [
            {
              publicKeyFile: publicKeyPath,
              privateKeyFile: privateKeyPath,
              keyId: '1',
              algorithm: 'ES256',
            },
            {
              // intentionally only private key
              // skipping explicit alg
              publicKeyFile: publicKeyPath,
              keyId: '2',
            },
          ],
        },
      }),
      keyDuration: { hours: 1 },
    });

    const keys = await staticKeyStore.listKeys();
    expect(keys.keys.length).toEqual(2);
    expect(keys.keys[0].key).toMatchObject({
      kid: '1',
      alg: 'ES256',
    });
    expect(keys.keys[1].key).toMatchObject({
      kid: '2',
      alg: 'ES256',
    });

    const pk = await staticKeyStore.getPrivateSigningKey();
    expect(pk).toMatchObject({
      kid: '1',
      alg: 'ES256',
    });
    expect(pk.d).toBeDefined();
  });

  it('throws an error for misconfigurations', async () => {
    await expect(
      StaticConfigPluginKeySource.create({
        sourceConfig: new ConfigReader({
          type: 'static',
          static: {
            keys: [],
          },
        }),
        keyDuration: { hours: 1 },
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"At least one key pair must be provided in static.keys, when the static key store type is used"`,
    );

    await expect(
      StaticConfigPluginKeySource.create({
        sourceConfig: new ConfigReader({
          type: 'static',
          static: {
            keys: [
              {
                publicKeyFile: publicKeyPath,
                keyId: '1',
                algorithm: 'ES256',
              },
            ],
          },
        }),
        keyDuration: { hours: 1 },
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Private key for signing must be provided in the first key pair in static.keys, when the static key store type is used"`,
    );
  });
});
