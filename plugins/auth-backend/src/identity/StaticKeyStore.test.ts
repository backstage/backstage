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
import { promises as fs } from 'fs';
import { StaticKeyStore, StaticKeyStoreConfig } from './StaticKeyStore';
import { AnyJWK } from './types';

const publicKeyPath = '/mnt/public.pem';
const privateKeyPath = 'mnt/private.pem';
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

jest.mock('fs/promises');

describe('StaticKeyStore', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should provide keys from disk', async () => {
    fs.readFile = jest.fn().mockImplementation(async (path: string, _: any) => {
      if (path === publicKeyPath) {
        return Promise.resolve(publicKey);
      }
      if (path === privateKeyPath) {
        return Promise.resolve(privateKey);
      }

      throw new Error('Unexpected path');
    });

    const staticKeyStoreConfig: StaticKeyStoreConfig = {
      keys: [
        {
          publicKeyFile: publicKeyPath,
          privateKeyFile: privateKeyPath,
          keyId: '1',
          algorithm: 'ES256',
        },
        {
          publicKeyFile: publicKeyPath,
          privateKeyFile: privateKeyPath,
          keyId: '2',
          algorithm: 'ES256',
        },
      ],
    };
    const staticKeyStore = await StaticKeyStore.create(staticKeyStoreConfig);

    const keys = await staticKeyStore.listKeys();
    expect(keys.items.length).toEqual(2);
    expect(keys.items[0].key).toMatchObject({
      kid: '1',
      alg: 'ES256',
    });
    expect(keys.items[1].key).toMatchObject({
      kid: '2',
      alg: 'ES256',
    });

    const pk = staticKeyStore.getPrivateKey('1');
    expect(pk).toMatchObject({
      kid: '1',
      alg: 'ES256',
    });
    expect(pk.d).toBeDefined();
  });

  it('should not allow users to add keys', async () => {
    const staticKeyStoreConfig: StaticKeyStoreConfig = { keys: [] };
    const staticKeyStore = await StaticKeyStore.create(staticKeyStoreConfig);

    const key: AnyJWK = {
      use: 'sig',
      alg: 'ES256',
      kid: '1',
      kty: '1',
    };
    expect(() => staticKeyStore.addKey(key)).toThrow(
      'Cannot add keys to the static key store',
    );
  });

  it('should not allow users to remove keys', async () => {
    const staticKeyStoreConfig: StaticKeyStoreConfig = { keys: [] };
    const staticKeyStore = await StaticKeyStore.create(staticKeyStoreConfig);
    expect(() => staticKeyStore.removeKeys(['1'])).toThrow(
      'Cannot remove keys from the static key store',
    );
  });
});
