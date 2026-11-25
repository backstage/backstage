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
import type { Connection } from '@backstage/connections';
import { mockServices } from '@backstage/backend-test-utils';
import { DefaultConnectionsService } from './DefaultConnectionsService';

const hosts = [
  'api.snyk.io',
  'api.us.snyk.io',
  'api.eu.snyk.io',
  'api.au.snyk.io',
];

function createService() {
  return DefaultConnectionsService.create({
    logger: mockServices.logger.mock(),
    config: mockServices.rootConfig({
      data: {
        connections: hosts.map(host => ({
          type: 'snyk',
          baseUrl: `https://${host}/`,
          auth: [
            { method: 'token', token: `fallback-${host}` },
            {
              method: 'token',
              token: `catalog-${host}`,
              match: { plugins: ['catalog'] },
            },
            {
              method: 'token',
              token: `snyk-${host}`,
              match: { plugins: ['snyk'] },
            },
            { method: 'token', token: `unused-${host}` },
          ],
        })),
      },
    }),
  });
}

describe('Snyk connections', () => {
  it('matches regional API URLs for REST and V1 without confusing UI hosts', async () => {
    const connections = createService().forPlugin('snyk');
    for (const host of hosts) {
      for (const path of [
        '/rest/orgs/11111111-1111-4111-8111-111111111111/projects?version=2024-10-15',
        '/v1/org/11111111-1111-4111-8111-111111111111/project/example',
      ]) {
        const connection = await connections.find({
          type: 'snyk',
          query: { url: `https://${host}${path}` },
          authMethods: ['token'],
        });
        expect(connection.baseUrl).toBe(`https://${host}/`);
        expect(connection).not.toHaveProperty('host');
        expect(connection.auth).toMatchObject({
          method: 'token',
          token: `snyk-${host}`,
        });
      }
    }
    for (const url of [
      'https://app.snyk.io/org/example',
      'https://api.unknown.example/rest/self',
    ]) {
      await expect(
        connections.find({
          type: 'snyk',
          query: { url },
          authMethods: ['token'],
        }),
      ).rejects.toThrow('Connection not found');
    }
  });

  it('selects the first plugin-visible token regardless of organisation paths', async () => {
    const service = createService();
    for (const [plugin, token] of [
      ['catalog', 'catalog-api.snyk.io'],
      ['snyk', 'snyk-api.snyk.io'],
      ['other', 'fallback-api.snyk.io'],
    ]) {
      for (const path of [
        '/rest/orgs/org-one/projects',
        '/rest/orgs/org-two/projects',
        '/v1/org/org-three/project/example',
      ]) {
        const connection = await service.forPlugin(plugin).find({
          type: 'snyk',
          query: { url: `https://api.snyk.io${path}` },
          authMethods: ['token'],
        });
        expect(connection.auth.token).toBe(token);
      }
    }
    const metadata = await service.forPlugin('snyk').find({
      type: 'snyk',
      query: { url: 'https://api.snyk.io/rest/self' },
    });
    expect(metadata.baseUrl).toBe('https://api.snyk.io/');
    expect(metadata).not.toHaveProperty('host');
    expect(metadata).not.toHaveProperty('auth');

    const scopedOnly = DefaultConnectionsService.create({
      logger: mockServices.logger.mock(),
      config: mockServices.rootConfig({
        data: {
          connections: [
            {
              type: 'snyk',
              baseUrl: 'https://api.eu.snyk.io/',

              auth: [
                {
                  method: 'token',
                  token: 'dummy-scoped-token',
                  match: { plugins: ['snyk'] },
                },
              ],
            },
          ],
        },
      }),
    });
    await expect(
      scopedOnly.forPlugin('other').find({
        type: 'snyk',
        query: { url: 'https://api.eu.snyk.io/rest/self' },
        authMethods: ['token'],
      }),
    ).rejects.toThrow('has no auth method available to this plugin');
  });

  it.each([
    {
      baseUrl: 'https://api.snyk.io/context',
      apiBaseUrl: undefined,
      expected: 'https://api.snyk.io/context/rest/orgs/example/projects',
    },
    {
      baseUrl: 'https://api.snyk.io/context',
      apiBaseUrl: 'https://internal.example.com/context%2Fname%3F%23/api',
      expected:
        'https://internal.example.com/context%2Fname%3F%23/api/rest/orgs/example/projects',
    },
    {
      baseUrl: 'https://api.snyk.io/context/',
      apiBaseUrl: undefined,
      expected: 'https://api.snyk.io/context/rest/orgs/example/projects',
    },
    {
      baseUrl: 'https://api.snyk.io/context/',
      apiBaseUrl: 'https://internal.example.com/context%2Fname%3F%23/api/',
      expected:
        'https://internal.example.com/context%2Fname%3F%23/api/rest/orgs/example/projects',
    },
  ])(
    'joins requests directly against returned normalized roots: $baseUrl / $apiBaseUrl',
    async ({ baseUrl, apiBaseUrl, expected }) => {
      const service = DefaultConnectionsService.create({
        logger: mockServices.logger.mock(),
        config: mockServices.rootConfig({
          data: {
            connections: [
              {
                type: 'snyk',
                baseUrl,
                apiBaseUrl,
                auth: [{ method: 'token', token: 'dummy-token' }],
              },
            ],
          },
        }),
      }).forPlugin('example-plugin');
      const connection: Connection<'snyk', 'token'> = await service.find({
        type: 'snyk',
        query: { url: baseUrl },
        authMethods: ['token'],
      });
      expect(connection).not.toHaveProperty('host');
      // @ts-expect-error - lookup metadata is not public connection data
      expect(connection.host).toBeUndefined();
      expect(connection.apiBaseUrl).toBe(
        apiBaseUrl === undefined
          ? undefined
          : 'https://internal.example.com/context%2Fname%3F%23/api/',
      );
      const apiRoot = connection.apiBaseUrl ?? connection.baseUrl;
      expect(new URL('rest/orgs/example/projects', apiRoot).href).toBe(
        expected,
      );
      await expect(
        service.find({
          type: 'snyk',
          query: { url: apiBaseUrl ?? 'https://unconfigured.example.com/' },
          authMethods: ['token'],
        }),
      ).rejects.toThrow(/Connection not found/);
    },
  );
});
