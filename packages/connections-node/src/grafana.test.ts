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
import type { Connection, ConnectionsService } from '@backstage/connections';
import { DefaultConnectionsService } from './DefaultConnectionsService';

function createService(baseUrl = 'http://grafana.internal:3000/grafana') {
  return DefaultConnectionsService.create({
    logger: mockServices.logger.mock(),
    config: mockServices.rootConfig({
      data: {
        connections: [
          {
            type: 'grafana',
            host: 'monitoring.example.com:8443',
            baseUrl,
            auth: [
              {
                method: 'token',
                token: 'dummy-other-plugin-token',
                match: { plugins: ['catalog'] },
              },
              {
                method: 'token',
                token: 'dummy-default-token',
                match: { plugins: ['grafana'] },
              },
              {
                method: 'basic',
                username: 'reader',
                password: 'dummy-password',
                orgId: 2,
              },
              { method: 'token', token: 'dummy-last-token' },
            ],
          },
          {
            type: 'grafana',
            host: 'example.grafana.net',
            baseUrl: 'https://example.grafana.net',
            auth: [{ method: 'token', token: 'dummy-cloud-token' }],
          },
        ],
      },
    }),
  });
}

describe('Grafana connections', () => {
  it('looks up exact hosts and ports without selecting by path or organization query', async () => {
    const service = createService().forPlugin('grafana');
    const find = (url: string) =>
      service.find({
        type: 'grafana',
        query: { url },
        authMethods: ['token'],
      });
    const connection = await find(
      'https://monitoring.example.com:8443/grafana/d/example?orgId=2',
    );
    expect(connection.baseUrl).toBe('http://grafana.internal:3000/grafana');
    expect(connection.auth.token).toBe('dummy-default-token');
    expect(
      await find(
        'https://monitoring.example.com:8443/another-instance?orgId=99',
      ),
    ).toEqual(connection);
    expect(
      (await find('https://example.grafana.net/d/example')).auth.token,
    ).toBe('dummy-cloud-token');
    await expect(
      find('https://monitoring.example.com/grafana'),
    ).rejects.toThrow(/Connection not found/);
    await expect(find('https://other.grafana.net')).rejects.toThrow(
      /Connection not found/,
    );
    // The internal destination is not an additional lookup identity.
    await expect(find('http://grafana.internal:3000/grafana')).rejects.toThrow(
      /Connection not found/,
    );
  });

  it('selects the first plugin-visible credential and checks the supported methods', async () => {
    const service = createService();
    const query = { url: 'https://monitoring.example.com:8443/grafana' };
    const grafana = service.forPlugin('grafana');
    expect(
      (
        await service.forPlugin('catalog').find({
          type: 'grafana',
          query,
          authMethods: ['token'],
        })
      ).auth.token,
    ).toBe('dummy-other-plugin-token');
    expect(
      (await grafana.find({ type: 'grafana', query, authMethods: ['token'] }))
        .auth.token,
    ).toBe('dummy-default-token');
    expect(
      (
        await service.forPlugin('basic-consumer').find({
          type: 'grafana',
          query,
          authMethods: ['token', 'basic'],
        })
      ).auth,
    ).toMatchObject({
      method: 'basic',
      username: 'reader',
      password: 'dummy-password',
      orgId: 2,
    });
    expect(
      (
        await grafana.find({
          type: 'grafana',
          query,
          authMethods: ['basic', 'token'],
        })
      ).auth.method,
    ).toBe('token');
    // An available later basic entry is not a fallback for a token-first plugin.
    await expect(
      grafana.find({
        type: 'grafana',
        query,
        authMethods: ['basic'],
      }),
    ).rejects.toThrow(/auth method "token"/);
    await expect(
      grafana.find({
        type: 'grafana',
        query: { url: 'https://example.grafana.net' },
        authMethods: ['basic'],
      }),
    ).rejects.toThrow(/Connection not found/);
  });

  it.each([
    'http://grafana.internal:3000/grafana',
    'http://grafana.internal:3000/grafana/',
  ])(
    'preserves subpaths when consuming %s with a typed token request',
    async baseUrl => {
      const connections: ConnectionsService =
        createService(baseUrl).forPlugin('grafana');
      const connection: Connection<'grafana', 'token'> = await connections.find(
        {
          type: 'grafana',
          query: {
            url: 'https://monitoring.example.com:8443/grafana/d/example',
          },
          authMethods: ['token'],
        },
      );
      const url = new URL(
        'api/search?type=dash-db',
        `${connection.baseUrl.replace(/\/$/, '')}/`,
      );
      const headers = { Authorization: `Bearer ${connection.auth.token}` };
      expect(url.href).toBe(
        'http://grafana.internal:3000/grafana/api/search?type=dash-db',
      );
      expect(headers.Authorization).toBe('Bearer dummy-default-token');
    },
  );

  it('rejects two instances sharing a host even when their base paths differ', () => {
    expect(() =>
      DefaultConnectionsService.create({
        logger: mockServices.logger.mock(),
        config: mockServices.rootConfig({
          data: {
            connections: ['first', 'second'].map(path => ({
              type: 'grafana',
              host: 'monitoring.example.com',
              baseUrl: `https://monitoring.example.com/${path}`,
              auth: [{ method: 'token', token: 'dummy-token' }],
            })),
          },
        }),
      }),
    ).toThrow(/Duplicate/);
  });
});
