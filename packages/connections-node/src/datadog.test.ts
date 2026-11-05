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
import type { Connection } from '@backstage/connections';
import { NotAllowedError, NotFoundError } from '@backstage/errors';
import { DefaultConnectionsService } from './DefaultConnectionsService';

describe('Datadog connections', () => {
  const sharedAuth = {
    method: 'apiKey',
    apiKey: 'dummy-shared-api-key',
    applicationKey: 'dummy-shared-application-key',
  };
  const syncAuth = {
    method: 'apiKey',
    title: 'Catalog sync organisation',
    match: { plugins: ['datadog-entity-sync'] },
    apiKey: 'dummy-sync-api-key',
    applicationKey: 'dummy-sync-application-key',
  };

  it('resolves regional API hosts and typed credentials without aliasing browser hosts', async () => {
    const hosts = [
      'api.datadoghq.com',
      'api.us3.datadoghq.com',
      'api.us5.datadoghq.com',
      'api.datadoghq.eu',
      'api.ap1.datadoghq.com',
      'api.ap2.datadoghq.com',
      'api.uk1.datadoghq.com',
      'api.ddog-gov.com',
      'api.us2.ddog-gov.com',
    ];
    const service = DefaultConnectionsService.create({
      logger: mockServices.logger.mock(),
      config: mockServices.rootConfig({
        data: {
          connections: hosts.map(host => ({
            type: 'datadog',
            host,
            auth: [{ ...sharedAuth, apiKey: `dummy-${host}` }],
          })),
        },
      }),
    }).forPlugin('datadog-entity-sync');

    for (const host of hosts) {
      const connection: Connection<'datadog', 'apiKey'> = await service.find({
        type: 'datadog',
        query: { url: `https://${host}/api/v2/catalog/entity` },
        authMethods: ['apiKey'],
      });
      const apiKey: string = connection.auth.apiKey;
      const applicationKey: string = connection.auth.applicationKey;
      expect(connection.host).toBe(host);
      expect(connection.auth.method).toBe('apiKey');
      expect(apiKey).toBe(`dummy-${host}`);
      expect(applicationKey).toBe(sharedAuth.applicationKey);
    }
    for (const host of [
      'app.datadoghq.com',
      'datadoghq.com',
      'unknown.example.com',
    ]) {
      await expect(
        service.find({
          type: 'datadog',
          query: { url: `https://${host}` },
          authMethods: ['apiKey'],
        }),
      ).rejects.toThrow(NotFoundError);
    }
  });

  it('selects the first visible key pair with plugin-specific entries first', async () => {
    const service = DefaultConnectionsService.create({
      logger: mockServices.logger.mock(),
      config: mockServices.rootConfig({
        data: {
          connections: [
            {
              type: 'datadog',
              host: 'api.datadoghq.com',
              auth: [
                sharedAuth,
                syncAuth,
                { ...syncAuth, apiKey: 'dummy-later-key' },
              ],
            },
            {
              type: 'datadog',
              host: 'api.datadoghq.eu',
              auth: [syncAuth],
            },
          ],
        },
      }),
    });
    const query = { url: 'https://api.datadoghq.com/api/v2/catalog/entity' };
    const sync = service.forPlugin('datadog-entity-sync');
    const other = service.forPlugin('other');
    expect(
      (await sync.find({ type: 'datadog', query, authMethods: ['apiKey'] }))
        .auth,
    ).toMatchObject(syncAuth);
    expect(
      (await other.find({ type: 'datadog', query, authMethods: ['apiKey'] }))
        .auth,
    ).toMatchObject(sharedAuth);
    await expect(
      other.find({
        type: 'datadog',
        query: { url: 'https://api.datadoghq.eu' },
        authMethods: ['apiKey'],
      }),
    ).rejects.toThrow(NotAllowedError);
    const info = await sync.find({ type: 'datadog', query });
    expect(info).toMatchObject({ host: 'api.datadoghq.com' });
    expect(info).not.toHaveProperty('auth');
  });
});
