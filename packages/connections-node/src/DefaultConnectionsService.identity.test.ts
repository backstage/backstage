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
import { connectionTypes } from '@backstage/connections';
import { buildConnectionsFromConfig } from '@backstage/connections/config';
import { DefaultConnectionsService } from './DefaultConnectionsService';

jest.mock('@backstage/connections/config', () => ({
  ...jest.requireActual('@backstage/connections/config'),
  buildConnectionsFromConfig: jest.fn(),
}));

// Configuration parsing is covered in connections. This service fixture models
// an opted-in descriptor without changing the registered GitHub schema.
const originalIdentity = connectionTypes.github.getLookupIdentity;
const query = { url: 'https://PUBLIC.EXAMPLE.COM:443/other-path/items' };
const fixture = {
  type: 'github' as const,
  title: 'Instance',
  baseUrl: 'https://public.example.com/context/',
  apiBaseUrl: 'http://internal.example.com:8080/api/',
  auth: [
    { method: 'token', title: 'General', token: 'general-secret' },
    {
      method: 'token',
      title: 'Catalog',
      token: 'catalog-secret',
      match: { plugins: ['catalog'] },
    },
  ],
};

function service() {
  return DefaultConnectionsService.create({
    config: mockServices.rootConfig(),
    logger: mockServices.logger.mock(),
  });
}

describe('URL identity service lookup', () => {
  beforeEach(() => {
    connectionTypes.github.getLookupIdentity = config => {
      if (
        !config ||
        typeof config !== 'object' ||
        !('baseUrl' in config) ||
        typeof config.baseUrl !== 'string'
      ) {
        throw new Error('Expected parsed instance configuration');
      }
      return new URL(config.baseUrl).host;
    };
    jest.mocked(buildConnectionsFromConfig).mockReturnValue([fixture]);
  });
  afterEach(() => {
    connectionTypes.github.getLookupIdentity = originalIdentity;
  });

  it('finds the instance by host and returns no identity metadata with or without credentials', async () => {
    const catalog = service().forPlugin('catalog');
    const connection = await catalog.find({
      type: 'github',
      query,
      authMethods: ['token'],
    });
    expect(connection).toMatchObject({
      baseUrl: fixture.baseUrl,
      apiBaseUrl: fixture.apiBaseUrl,
      auth: { method: 'token', token: 'catalog-secret' },
    });
    expect(connection).not.toHaveProperty('host');
    expect(JSON.parse(JSON.stringify(connection))).not.toHaveProperty('host');
    const info = await catalog.find({ type: 'github', query });
    expect(info).toMatchObject({
      baseUrl: fixture.baseUrl,
      apiBaseUrl: fixture.apiBaseUrl,
    });
    expect(info).not.toHaveProperty('host');
    expect(info).not.toHaveProperty('auth');
    expect(JSON.stringify(info)).not.toContain('secret');
    expect(JSON.parse(JSON.stringify(info))).not.toHaveProperty(
      'getLookupIdentity',
    );
    await expect(
      catalog.find({
        type: 'github',
        query: { url: fixture.apiBaseUrl },
        authMethods: ['token'],
      }),
    ).rejects.toThrow('Connection not found');
  });

  it('preserves plugin-scoped auth ordering and connection visibility', async () => {
    const connections = service();
    const other = await connections
      .forPlugin('scaffolder')
      .find({ type: 'github', query, authMethods: ['token'] });
    expect(other.auth.token).toBe('general-secret');
    const catalog = await connections
      .forPlugin('catalog')
      .find({ type: 'github', query, authMethods: ['token'] });
    expect(catalog.auth.token).toBe('catalog-secret');
    jest
      .mocked(buildConnectionsFromConfig)
      .mockReturnValue([{ ...fixture, match: { plugins: ['catalog'] } }]);
    const scoped = service();
    await expect(
      scoped
        .forPlugin('scaffolder')
        .find({ type: 'github', query, authMethods: ['token'] }),
    ).rejects.toThrow('Connection not found');
    expect(
      await scoped.forPlugin('catalog').find({ type: 'github', query }),
    ).not.toHaveProperty('host');
  });
});
