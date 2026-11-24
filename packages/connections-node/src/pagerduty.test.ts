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

const createService = (apiBaseUrl = 'https://api.eu.pagerduty.com') =>
  DefaultConnectionsService.create({
    logger: mockServices.logger.mock(),
    config: mockServices.rootConfig({
      data: {
        connections: ['alpha', 'beta'].map(account => ({
          type: 'pagerduty',
          baseUrl: `https://${account}.pagerduty.com/`,

          apiBaseUrl,
          auth: [
            {
              method: 'token',
              token: `${account}-catalog-token`,
              match: { plugins: ['catalog'] },
            },
            { method: 'token', token: `${account}-default-token` },
          ],
        })),
      },
    }),
  });

describe('PagerDuty connections', () => {
  it('isolates two accounts sharing a regional endpoint and respects plugin-scoped tokens', async () => {
    const service = createService();
    for (const account of ['alpha', 'beta']) {
      const connection: Connection<'pagerduty', 'token'> = await service
        .forPlugin('catalog')
        .find({
          type: 'pagerduty',
          query: {
            url: `https://${account}.pagerduty.com/service-directory/P123456`,
          },
          authMethods: ['token'],
        });
      const token: string = connection.auth.token;
      expect(connection).toMatchObject({
        baseUrl: `https://${account}.pagerduty.com/`,
        apiBaseUrl: 'https://api.eu.pagerduty.com/',
        auth: { method: 'token', token: `${account}-catalog-token` },
      });
      expect(token).toBe(`${account}-catalog-token`);
      expect(connection).not.toHaveProperty('host');
      const other = await service.forPlugin('scaffolder').find({
        type: 'pagerduty',
        query: { url: `https://${account}.pagerduty.com` },
        authMethods: ['token'],
      });
      expect(other.auth.token).toBe(`${account}-default-token`);
    }
  });

  it('resolves mixed-case configured hosts and query URLs to the same account', async () => {
    const service = DefaultConnectionsService.create({
      logger: mockServices.logger.mock(),
      config: mockServices.rootConfig({
        data: {
          connections: [
            {
              type: 'pagerduty',
              baseUrl: 'https://Example.PagerDuty.com',

              apiBaseUrl: 'https://api.pagerduty.com',
              auth: [{ method: 'token', token: 'example-token' }],
            },
          ],
        },
      }),
    }).forPlugin('catalog');

    for (const host of ['example.pagerduty.com', 'EXAMPLE.PagerDuty.COM']) {
      const connection = await service.find({
        type: 'pagerduty',
        query: { url: `https://${host}/service-directory/P123456` },
        authMethods: ['token'],
      });
      expect(connection).toMatchObject({
        auth: { method: 'token', token: 'example-token' },
      });
    }
  });

  it('requires the account host rather than a shared API host or an unknown account', async () => {
    const service = createService().forPlugin('catalog');
    for (const url of [
      'https://api.eu.pagerduty.com/services',
      'https://unknown.pagerduty.com',
    ]) {
      await expect(
        service.find({
          type: 'pagerduty',
          query: { url },
          authMethods: ['token'],
        }),
      ).rejects.toThrow(/Connection not found/);
    }
    await expect(
      service.find({
        type: 'pagerduty',
        query: { url: 'not-a-url' },
        authMethods: ['token'],
      }),
    ).rejects.toThrow();
  });

  it.each([
    {
      baseUrl: 'https://example.pagerduty.com',
      apiBaseUrl: 'https://internal.example.com/context%2Fname%3F%23/api',
      expected:
        'https://internal.example.com/context%2Fname%3F%23/api/services/P123456',
    },
    {
      baseUrl: 'https://example.pagerduty.com/',
      apiBaseUrl: 'https://internal.example.com/context%2Fname%3F%23/api/',
      expected:
        'https://internal.example.com/context%2Fname%3F%23/api/services/P123456',
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
                type: 'pagerduty',
                baseUrl,
                apiBaseUrl,
                auth: [{ method: 'token', token: 'dummy-token' }],
              },
            ],
          },
        }),
      }).forPlugin('example-plugin');
      const connection: Connection<'pagerduty', 'token'> = await service.find({
        type: 'pagerduty',
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
      const apiRoot = connection.apiBaseUrl;
      expect(new URL('services/P123456', apiRoot).href).toBe(expected);
      await expect(
        service.find({
          type: 'pagerduty',
          query: { url: apiBaseUrl ?? 'https://unconfigured.example.com/' },
          authMethods: ['token'],
        }),
      ).rejects.toThrow(/Connection not found/);
    },
  );
});
