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
          host,
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
        expect(connection.host).toBe(host);
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
    expect(metadata.host).toBe('api.snyk.io');
    expect(metadata).not.toHaveProperty('auth');

    const scopedOnly = DefaultConnectionsService.create({
      logger: mockServices.logger.mock(),
      config: mockServices.rootConfig({
        data: {
          connections: [
            {
              type: 'snyk',
              host: 'api.eu.snyk.io',
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
});
