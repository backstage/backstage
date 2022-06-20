/*
 * Copyright 2022 The Backstage Authors
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

import { ConfigReader } from '@backstage/config';
import { getVaultConfig } from './config';

describe('GetVaultConfig', () => {
  it('fails by missing keys', () => {
    expect(() => getVaultConfig(new ConfigReader({}))).toThrow();
    expect(() =>
      getVaultConfig(
        new ConfigReader({
          vault: {},
        }),
      ),
    ).toThrow();
  });

  it('loads default params', () => {
    const config = new ConfigReader({
      vault: {
        baseUrl: 'http://www.example.com',
        token: '123',
      },
    });

    const vaultConfig = getVaultConfig(config);
    expect(vaultConfig).toStrictEqual({
      baseUrl: 'http://www.example.com',
      token: '123',
      kvVersion: 2,
      secretEngine: 'secrets',
    });
  });

  it('loads custom params', () => {
    const config = new ConfigReader({
      vault: {
        baseUrl: 'http://www.example.com',
        token: '123',
        kvVersion: 1,
        secretEngine: 'test',
      },
    });

    const vaultConfig = getVaultConfig(config);
    expect(vaultConfig).toStrictEqual({
      baseUrl: 'http://www.example.com',
      token: '123',
      kvVersion: 1,
      secretEngine: 'test',
    });
  });
});
