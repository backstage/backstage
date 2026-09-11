/*
 * Copyright 2026 The Backstage Authors
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
import { buildConnectionsFromConfig } from '../config/buildConnectionsFromConfig';
import { connectionTypes } from '../definitions/types';
import { VaultConnectionType } from './vault';

describe('VaultConnectionType', () => {
  it('defines a host-based HashiCorp Vault connection with token authentication', () => {
    expect(VaultConnectionType).toMatchObject({
      type: 'vault',
      title: 'HashiCorp Vault',
      cardinality: 'multiton',
      lookupStrategy: 'host',
    });
    expect(VaultConnectionType.authMethods.map(({ method }) => method)).toEqual(
      ['token'],
    );
    expect(connectionTypes.vault).toBe(VaultConnectionType);
  });

  it('validates connection and token configuration', () => {
    expect(
      VaultConnectionType.configSchema.parse({
        host: 'vault.example.com:8200',
        baseUrl: 'https://vault.example.com:8200',
      }),
    ).toEqual({
      host: 'vault.example.com:8200',
      baseUrl: 'https://vault.example.com:8200',
    });
    expect(
      VaultConnectionType.authMethods[0].configSchema.parse({
        token: 'vault-token',
      }),
    ).toEqual({ token: 'vault-token' });

    expect(() => VaultConnectionType.configSchema.parse({})).toThrow(
      /Invalid configuration for connection type "vault"/,
    );
    expect(() =>
      VaultConnectionType.authMethods[0].configSchema.parse({}),
    ).toThrow(/Invalid configuration for auth method "token"/);
  });

  it('builds a fully typed Vault connection from configuration', () => {
    const connections = buildConnectionsFromConfig({
      config: new ConfigReader({
        connections: [
          {
            type: 'vault',
            host: 'vault.example.com',
            baseUrl: 'https://vault.example.com',
            auth: [{ method: 'token', token: 'vault-token' }],
          },
        ],
      }),
    });

    expect(connections).toEqual([
      {
        type: 'vault',
        title: 'HashiCorp Vault',
        host: 'vault.example.com',
        baseUrl: 'https://vault.example.com',
        auth: [{ method: 'token', title: 'Token', token: 'vault-token' }],
      },
    ]);
  });
});
