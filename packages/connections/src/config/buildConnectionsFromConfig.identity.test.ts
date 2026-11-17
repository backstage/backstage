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
import { buildConnectionsFromConfig } from './buildConnectionsFromConfig';
import { getLegacyIntegrations } from './getLegacyIntegrations';

jest.mock('../definitions/types', () => {
  const { z } = jest.requireActual<typeof import('zod/v4')>('zod/v4');
  const { createConnectionType } = jest.requireActual<
    typeof import('../system/createConnectionType')
  >('../system/createConnectionType');
  const { withConnectionBaseUrl } = jest.requireActual<
    typeof import('../system/withConnectionBaseUrl')
  >('../system/withConnectionBaseUrl');
  const { connectionBaseUrlSchema } = jest.requireActual<
    typeof import('../system/connectionBaseUrlSchema')
  >('../system/connectionBaseUrlSchema');
  return {
    connectionTypes: {
      legacy: createConnectionType({
        configSchema: z.object({
          host: z.string(),
          baseUrl: z.string().optional(),
        }),
        type: 'legacy',
        title: 'Legacy',
        authMethods: [
          { method: 'none', title: 'None', configSchema: z.object({}) },
        ],
      }),
      instance: createConnectionType({
        ...withConnectionBaseUrl(
          z.object({
            baseUrl: connectionBaseUrlSchema,
            apiBaseUrl: connectionBaseUrlSchema.optional(),
          }),
        ),
        type: 'instance',
        title: 'Instance',
        authMethods: [
          { method: 'none', title: 'None', configSchema: z.object({}) },
        ],
      }),
    },
  };
});
jest.mock('./getLegacyIntegrations', () => ({
  getLegacyIntegrations: jest.fn(() => []),
}));

const auth = [{ method: 'none' }];

describe('URL-based connection identity', () => {
  beforeEach(() => jest.mocked(getLegacyIntegrations).mockReturnValue([]));

  it('uses instance hosts for titles and keeps identity out of parsed/serialized data', () => {
    const connections = buildConnectionsFromConfig({
      config: new ConfigReader({
        connections: [
          {
            type: 'instance',
            baseUrl: 'HTTPS://ONE.EXAMPLE.COM:443/site',
            apiBaseUrl: 'http://internal.example.com/api',
            auth,
          },
          {
            type: 'instance',
            baseUrl: 'https://two.example.com:8443/site',
            auth,
          },
        ],
      }),
    });
    expect(connections).toEqual([
      expect.objectContaining({
        title: 'Instance (one.example.com)',
        baseUrl: 'HTTPS://ONE.EXAMPLE.COM:443/site/',
        apiBaseUrl: 'http://internal.example.com/api/',
      }),
      expect.objectContaining({
        title: 'Instance (two.example.com:8443)',
        baseUrl: 'https://two.example.com:8443/site/',
        apiBaseUrl: 'https://two.example.com:8443/site/',
      }),
    ]);
    for (const connection of connections) {
      expect(connection).not.toHaveProperty('host');
      expect(JSON.parse(JSON.stringify(connection))).not.toHaveProperty('host');
    }
  });

  it('rejects duplicate instance hosts despite different paths or API endpoints', () => {
    expect(() =>
      buildConnectionsFromConfig({
        config: new ConfigReader({
          connections: [
            {
              type: 'instance',
              baseUrl: 'https://EXAMPLE.COM/first',
              apiBaseUrl: 'https://one.internal/api',
              auth,
            },
            {
              type: 'instance',
              baseUrl: 'https://example.com:443/second',
              apiBaseUrl: 'https://two.internal/api',
              auth,
            },
          ],
        }),
      }),
    ).toThrow('Duplicate connection of type "instance" for host "example.com"');
    expect(() =>
      buildConnectionsFromConfig({
        config: new ConfigReader({
          connections: [
            {
              type: 'instance',
              host: 'example.com',
              baseUrl: 'https://example.com',
              auth,
            },
          ],
        }),
      }),
    ).toThrow('Unrecognized key: "host"');
  });

  it('keeps explicit host identity independent of base URL for existing types', () => {
    const connections = [
      {
        type: 'legacy',
        host: 'one.example.com',
        baseUrl: 'https://shared.example.com/first',
        auth,
      },
      {
        type: 'legacy',
        host: 'two.example.com',
        baseUrl: 'https://shared.example.com/second',
        auth,
      },
    ];
    expect(
      buildConnectionsFromConfig({
        config: new ConfigReader({ connections }),
      }),
    ).toEqual([
      expect.objectContaining({
        host: 'one.example.com',
        title: 'Legacy (one.example.com)',
      }),
      expect.objectContaining({
        host: 'two.example.com',
        title: 'Legacy (two.example.com)',
      }),
    ]);
    expect(() =>
      buildConnectionsFromConfig({
        config: new ConfigReader({
          connections: [
            connections[0],
            { ...connections[1], host: 'one.example.com' },
          ],
        }),
      }),
    ).toThrow(
      'Duplicate connection of type "legacy" for host "one.example.com"',
    );
  });

  it('deduplicates converted legacy entries by instance host and keeps the first', () => {
    jest.mocked(getLegacyIntegrations).mockReturnValue([
      { type: 'instance', baseUrl: 'https://example.com/first', auth },
      { type: 'instance', baseUrl: 'https://EXAMPLE.COM:443/second', auth },
    ]);
    const warn = jest.fn();
    const logger = {
      warn,
      error: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
    };
    const connections = buildConnectionsFromConfig({
      config: new ConfigReader({}),
      logger,
    });
    expect(connections).toHaveLength(1);
    expect(connections[0]).toMatchObject({
      baseUrl: 'https://example.com/first/',
      apiBaseUrl: 'https://example.com/first/',
    });
    expect(connections[0]).not.toHaveProperty('host');
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('instance example.com'),
    );
  });
});
