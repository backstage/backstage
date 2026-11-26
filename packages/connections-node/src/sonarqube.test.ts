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

const createService = (
  baseUrl = 'https://quality.example.com:8443/sonar',
  apiBaseUrl?: string,
) =>
  DefaultConnectionsService.create({
    logger: mockServices.logger.mock(),
    config: mockServices.rootConfig({
      data: {
        connections: [
          {
            type: 'sonarqube',

            baseUrl,
            apiBaseUrl,
            auth: [
              { method: 'token', token: 'read-token' },
              { method: 'token', token: 'second-token' },
              {
                method: 'token',
                token: 'create-token',
                authType: 'basic',
                match: { plugins: ['scaffolder'] },
              },
              { method: 'none' },
            ],
          },
          {
            type: 'sonarqube',

            baseUrl: 'https://sonarcloud.io',
            auth: [{ method: 'none' }],
          },
          {
            type: 'sonarqube',

            baseUrl: 'https://sonarqube.us',
            auth: [{ method: 'token', token: 'us-token' }],
          },
        ],
      },
    }),
  });

describe('SonarQube connections', () => {
  it('matches only the URL host, including the port, and selects the first visible auth entry', async () => {
    const service = createService();
    const dashboard = service.forPlugin('sonarqube');
    const options = {
      type: 'sonarqube' as const,
      query: {
        url: 'https://quality.example.com:8443/other/dashboard?id=example',
      },
      authMethods: ['token'] as const,
    };
    const read = await dashboard.find(options);
    expect(read.baseUrl).toBe('https://quality.example.com:8443/sonar/');
    expect(read.auth).toMatchObject({
      method: 'token',
      token: 'read-token',
      authType: 'bearer',
    });
    const create = await service.forPlugin('scaffolder').find(options);
    expect(create.auth).toMatchObject({
      method: 'token',
      token: 'create-token',
      authType: 'basic',
    });
    // The canonical URL supplies lookup identity, including its port.
    for (const url of [
      'http://sonarqube.example.com/sonar',
      'https://quality.example.com/sonar',
    ]) {
      await expect(
        dashboard.find({ ...options, query: { url } }),
      ).rejects.toThrow(/Connection not found/);
    }
    expect(
      await dashboard.find({
        ...options,
        query: { url: 'https://sonarqube.us/dashboard?id=example' },
      }),
    ).toMatchObject({ auth: { token: 'us-token' } });
    const info = await dashboard.find({
      type: 'sonarqube',
      query: options.query,
    });
    expect(info).not.toHaveProperty('auth');
  });

  it('requires explicit acceptance of anonymous access and does not fall back from a selected token', async () => {
    const service = createService().forPlugin('sonarqube');
    const query = { url: 'https://sonarcloud.io/dashboard?id=public-example' };
    expect(
      await service.find({ type: 'sonarqube', query, authMethods: ['none'] }),
    ).toMatchObject({ auth: { method: 'none' } });
    await expect(
      service.find({ type: 'sonarqube', query, authMethods: ['token'] }),
    ).rejects.toThrow(/auth method "none"/);
    await expect(
      service.find({
        type: 'sonarqube',
        query: { url: 'https://quality.example.com:8443/sonar' },
        authMethods: ['none'],
      }),
    ).rejects.toThrow(/auth method "token"/);
  });

  it.each([
    {
      baseUrl: 'https://sonarqube.example.com/context',
      apiBaseUrl: 'http://internal.example.com/context%2Fname%3F%23/api',
      expected:
        'http://internal.example.com/context%2Fname%3F%23/api/metrics/search',
    },
    {
      baseUrl: 'https://quality.example.com/sonar',
      apiBaseUrl: undefined,
      expected: 'https://quality.example.com/sonar/api/metrics/search',
    },
    {
      baseUrl: 'https://quality.example.com/sonar',
      apiBaseUrl: 'https://internal.example.com/context%2Fname%3F%23/api',
      expected:
        'https://internal.example.com/context%2Fname%3F%23/api/metrics/search',
    },
    {
      baseUrl: 'https://quality.example.com/sonar/',
      apiBaseUrl: undefined,
      expected: 'https://quality.example.com/sonar/api/metrics/search',
    },
    {
      baseUrl: 'https://quality.example.com/sonar/',
      apiBaseUrl: 'https://internal.example.com/context%2Fname%3F%23/api/',
      expected:
        'https://internal.example.com/context%2Fname%3F%23/api/metrics/search',
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
                type: 'sonarqube',
                baseUrl,
                apiBaseUrl,
                auth: [{ method: 'token', token: 'dummy-token' }],
              },
            ],
          },
        }),
      }).forPlugin('example-plugin');
      const connection: Connection<'sonarqube', 'token'> = await service.find({
        type: 'sonarqube',
        query: { url: baseUrl },
        authMethods: ['token'],
      });
      expect(connection).not.toHaveProperty('host');
      // @ts-expect-error - lookup metadata is not public connection data
      expect(connection.host).toBeUndefined();
      let expectedApiBaseUrl = apiBaseUrl;
      if (expectedApiBaseUrl && !expectedApiBaseUrl.endsWith('/')) {
        expectedApiBaseUrl += '/';
      }
      expect(connection.apiBaseUrl).toBe(expectedApiBaseUrl);
      const apiRoot =
        connection.apiBaseUrl ?? new URL('api/', connection.baseUrl);
      expect(new URL('metrics/search', apiRoot).href).toBe(expected);
      await expect(
        service.find({
          type: 'sonarqube',
          query: { url: apiBaseUrl ?? 'https://unconfigured.example.com/' },
          authMethods: ['token'],
        }),
      ).rejects.toThrow(/Connection not found/);
    },
  );
});
