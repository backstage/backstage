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

const createService = () =>
  DefaultConnectionsService.create({
    logger: mockServices.logger.mock(),
    config: mockServices.rootConfig({
      data: {
        connections: ['alpha', 'beta'].map(account => ({
          type: 'pagerduty',
          host: `${account}.pagerduty.com`,
          apiBaseUrl: 'https://api.eu.pagerduty.com',
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
        host: `${account}.pagerduty.com`,
        apiBaseUrl: 'https://api.eu.pagerduty.com',
        auth: { method: 'token', token: `${account}-catalog-token` },
      });
      expect(token).toBe(`${account}-catalog-token`);
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
              host: 'Example.PagerDuty.com',
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
        host: 'example.pagerduty.com',
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
});
