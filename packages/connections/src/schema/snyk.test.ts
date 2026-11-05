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
import { connectionTypes } from '../index';
import { buildConnectionsFromConfig } from '../config';
import { SnykConnectionType } from './snyk';

describe('SnykConnectionType', () => {
  const hosts = [
    'api.snyk.io',
    'api.us.snyk.io',
    'api.eu.snyk.io',
    'api.au.snyk.io',
  ];

  it('registers portable schemas and normalizes regional and custom API hosts', () => {
    expect(connectionTypes.snyk).toBe(SnykConnectionType);
    expect(SnykConnectionType).toMatchObject({
      type: 'snyk',
      cardinality: 'multiton',
      lookupStrategy: 'host',
    });
    for (const host of [...hosts, 'snyk.example.com']) {
      expect(SnykConnectionType.configSchema.parse({ host })).toEqual({ host });
    }
    expect(
      SnykConnectionType.configSchema.parse({ host: 'API.EU.SNYK.IO' }),
    ).toEqual({
      host: 'api.eu.snyk.io',
    });
    expect(SnykConnectionType.configSchema.schema().schema).toMatchObject({
      type: 'object',
      required: ['host'],
      additionalProperties: false,
      properties: { host: { type: 'string', format: 'hostname' } },
    });
    expect(SnykConnectionType.authMethods.map(a => a.method)).toEqual([
      'token',
    ]);
    const tokenSchema = SnykConnectionType.authMethods[0].configSchema;
    expect(tokenSchema.parse({ token: 'dummy-snyk-token' })).toEqual({
      token: 'dummy-snyk-token',
    });
    expect(tokenSchema.schema().schema).toMatchObject({
      type: 'object',
      required: ['token'],
      properties: { token: { type: 'string', pattern: '^\\S+$' } },
    });
  });

  it('rejects malformed endpoint and credential configuration', () => {
    for (const host of [
      '',
      'https://api.snyk.io',
      'api.snyk.io/rest',
      ' api.snyk.io',
      'api.snyk.io:443',
    ]) {
      expect(() => SnykConnectionType.configSchema.parse({ host })).toThrow(
        'Invalid configuration for connection type "snyk"',
      );
    }
    expect(() => SnykConnectionType.configSchema.parse({})).toThrow();
    expect(() =>
      SnykConnectionType.configSchema.parse({
        host: hosts[0],
        orgId: 'not-a-connection-field',
      }),
    ).toThrow();
    for (const token of [undefined, '', ' ', 'token with spaces', 'token\n']) {
      expect(() =>
        SnykConnectionType.authMethods[0].configSchema.parse({ token }),
      ).toThrow('Invalid configuration for auth method "token"');
    }
    for (const auth of [
      [],
      [{ method: 'none' }],
      [{ method: 'bearer', token: 'dummy' }],
    ]) {
      expect(() =>
        buildConnectionsFromConfig({
          config: new ConfigReader({
            connections: [{ type: 'snyk', host: hosts[0], auth }],
          }),
        }),
      ).toThrow('Invalid connection of type "snyk"');
    }
  });

  it('loads independent regions with default titles and rejects duplicate normalized hosts', () => {
    const connections = hosts.map(host => ({
      type: 'snyk',
      host,
      auth: [{ method: 'token', token: 'dummy-token' }],
    }));
    expect(
      buildConnectionsFromConfig({
        config: new ConfigReader({ connections }),
      }),
    ).toEqual(
      hosts.map(host => ({
        type: 'snyk',
        host,
        title: `Snyk (${host})`,
        match: undefined,
        auth: [
          {
            method: 'token',
            token: 'dummy-token',
            title: 'Token',
            match: undefined,
          },
        ],
      })),
    );
    expect(() =>
      buildConnectionsFromConfig({
        config: new ConfigReader({
          connections: [
            connections[0],
            { ...connections[0], host: 'API.SNYK.IO' },
          ],
        }),
      }),
    ).toThrow('Duplicate connection of type "snyk" for host "api.snyk.io"');
  });
});
