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

const createService = (
  baseUrl = 'http://sonarqube.example.com:9000/sonar',
  externalBaseUrl = 'https://quality.example.com/sonar',
) =>
  DefaultConnectionsService.create({
    logger: mockServices.logger.mock(),
    config: mockServices.rootConfig({
      data: {
        connections: [
          {
            type: 'sonarqube',
            host: 'sonarqube.example.com:9000',
            baseUrl,
            externalBaseUrl,
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
            host: 'sonarcloud.io',
            baseUrl: 'https://sonarcloud.io',
            auth: [{ method: 'none' }],
          },
          {
            type: 'sonarqube',
            host: 'sonarqube.us',
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
        url: 'http://sonarqube.example.com:9000/other/dashboard?id=example',
      },
      authMethods: ['token'] as const,
    };
    const read = await dashboard.find(options);
    expect(read.baseUrl).toBe('http://sonarqube.example.com:9000/sonar');
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
    // The display URL is not a lookup alias, and the port must match.
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
        query: { url: 'http://sonarqube.example.com:9000/sonar' },
        authMethods: ['none'],
      }),
    ).rejects.toThrow(/auth method "token"/);
  });

  it.each([
    'http://sonarqube.example.com:9000/sonar',
    'http://sonarqube.example.com:9000/sonar/',
  ])(
    'preserves the context path when joining API and display URLs for %s',
    async baseUrl => {
      const externalBaseUrl = `https://quality.example.com/sonar${
        baseUrl.endsWith('/') ? '/' : ''
      }`;
      const connection = await createService(baseUrl, externalBaseUrl)
        .forPlugin('sonarqube')
        .find({
          type: 'sonarqube',
          query: { url: baseUrl },
          authMethods: ['token'],
        });
      // Keep this joining pattern in sync with the typed consumption guide.
      const apiUrl = new URL(
        'api/metrics/search',
        `${connection.baseUrl.replace(/\/$/, '')}/`,
      );
      const dashboardUrl = new URL(
        'dashboard',
        `${(connection.externalBaseUrl ?? connection.baseUrl).replace(
          /\/$/,
          '',
        )}/`,
      );
      dashboardUrl.searchParams.set('id', 'example');
      expect(connection.baseUrl).toBe(baseUrl);
      expect(apiUrl.href).toBe(
        'http://sonarqube.example.com:9000/sonar/api/metrics/search',
      );
      expect(dashboardUrl.href).toBe(
        'https://quality.example.com/sonar/dashboard?id=example',
      );
    },
  );
});
