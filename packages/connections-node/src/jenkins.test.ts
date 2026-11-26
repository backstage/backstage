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

const controllerBaseUrl = 'https://ci.example.com:8443/jenkins';
const createService = (url = controllerBaseUrl, apiBaseUrl?: string) =>
  DefaultConnectionsService.create({
    logger: mockServices.logger.mock(),
    config: mockServices.rootConfig({
      data: {
        connections: [
          {
            type: 'jenkins',

            baseUrl: url,
            apiBaseUrl,
            auth: [
              {
                method: 'apiToken',
                username: 'reader',
                apiToken: 'dummy-read-token',
              },
              {
                method: 'apiToken',
                username: 'builder',
                apiToken: 'dummy-build-token',
                match: { plugins: ['scaffolder'] },
              },
              { method: 'none', match: { plugins: ['anonymous'] } },
            ],
          },
        ],
      },
    }),
  });

// The same URL joining and Basic encoding used in the consumption guide.
async function requestOptions(connections: ConnectionsService) {
  const connection: Connection<'jenkins', 'apiToken'> = await connections.find({
    type: 'jenkins',
    query: { url: `${controllerBaseUrl}/job/example` },
    authMethods: ['apiToken'],
  });
  const controllerUrl = connection.apiBaseUrl ?? connection.baseUrl;
  return {
    url: new URL('job/example/api/json', controllerUrl).toString(),
    authorization: `Basic ${Buffer.from(
      `${connection.auth.username}:${connection.auth.apiToken}`,
      'utf8',
    ).toString('base64')}`,
  };
}

describe('Jenkins connections', () => {
  it('preserves the context path with and without a trailing slash and encodes username plus token', async () => {
    for (const url of [controllerBaseUrl, `${controllerBaseUrl}/`]) {
      const service = createService(url);
      expect(await requestOptions(service.forPlugin('jenkins'))).toEqual({
        url: `${controllerBaseUrl}/job/example/api/json`,
        authorization: 'Basic cmVhZGVyOmR1bW15LXJlYWQtdG9rZW4=',
      });
      const scoped = await service.forPlugin('scaffolder').find({
        type: 'jenkins',
        query: { url: `${controllerBaseUrl}/job/example` },
        authMethods: ['apiToken'],
      });
      expect(scoped.auth).toMatchObject({
        method: 'apiToken',
        username: 'builder',
        apiToken: 'dummy-build-token',
      });
    }
  });

  it('matches only the URL host including port, ignoring scheme and path', async () => {
    const connections = createService().forPlugin('jenkins');
    for (const url of [
      `${controllerBaseUrl}/job/example`,
      'http://ci.example.com:8443/other-controller/job/example',
    ]) {
      const connection = await connections.find({
        type: 'jenkins',
        query: { url },
      });
      expect(connection.baseUrl).toBe(`${controllerBaseUrl}/`);
      expect(connection).not.toHaveProperty('host');
      expect(connection).not.toHaveProperty('auth');
    }
    for (const url of [
      'https://ci.example.com/jenkins',
      'https://other.example.com:8443/jenkins',
    ]) {
      await expect(
        connections.find({
          type: 'jenkins',
          query: { url },
          authMethods: ['apiToken'],
        }),
      ).rejects.toThrow('Connection not found');
    }
  });

  it('selects explicit anonymous access without falling back between auth methods', async () => {
    const service = createService();
    const query = { url: `${controllerBaseUrl}/job/example` };
    expect(
      (
        await service
          .forPlugin('anonymous')
          .find({ type: 'jenkins', query, authMethods: ['none'] })
      ).auth.method,
    ).toBe('none');
    await expect(
      service
        .forPlugin('anonymous')
        .find({ type: 'jenkins', query, authMethods: ['apiToken'] }),
    ).rejects.toThrow('with auth method "none"');
    await expect(
      service
        .forPlugin('jenkins')
        .find({ type: 'jenkins', query, authMethods: ['none'] }),
    ).rejects.toThrow('with auth method "apiToken"');
  });

  it.each([
    {
      baseUrl: 'https://jenkins.example.com/context',
      apiBaseUrl: 'http://internal.example.com/context%2Fname%3F%23/api',
      expected:
        'http://internal.example.com/context%2Fname%3F%23/api/job/example/api/json',
    },
    {
      baseUrl: 'https://ci.example.com/jenkins',
      apiBaseUrl: undefined,
      expected: 'https://ci.example.com/jenkins/job/example/api/json',
    },
    {
      baseUrl: 'https://ci.example.com/jenkins',
      apiBaseUrl: 'https://internal.example.com/context%2Fname%3F%23/api',
      expected:
        'https://internal.example.com/context%2Fname%3F%23/api/job/example/api/json',
    },
    {
      baseUrl: 'https://ci.example.com/jenkins/',
      apiBaseUrl: undefined,
      expected: 'https://ci.example.com/jenkins/job/example/api/json',
    },
    {
      baseUrl: 'https://ci.example.com/jenkins/',
      apiBaseUrl: 'https://internal.example.com/context%2Fname%3F%23/api/',
      expected:
        'https://internal.example.com/context%2Fname%3F%23/api/job/example/api/json',
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
                type: 'jenkins',
                baseUrl,
                apiBaseUrl,
                auth: [
                  {
                    method: 'apiToken',
                    username: 'bot',
                    apiToken: 'dummy-token',
                  },
                ],
              },
            ],
          },
        }),
      }).forPlugin('example-plugin');
      const connection: Connection<'jenkins', 'apiToken'> = await service.find({
        type: 'jenkins',
        query: { url: baseUrl },
        authMethods: ['apiToken'],
      });
      expect(connection).not.toHaveProperty('host');
      // @ts-expect-error - lookup metadata is not public connection data
      expect(connection.host).toBeUndefined();
      let expectedApiBaseUrl = apiBaseUrl;
      if (expectedApiBaseUrl && !expectedApiBaseUrl.endsWith('/')) {
        expectedApiBaseUrl += '/';
      }
      expect(connection.apiBaseUrl).toBe(expectedApiBaseUrl);
      const apiRoot = connection.apiBaseUrl ?? connection.baseUrl;
      expect(new URL('job/example/api/json', apiRoot).href).toBe(expected);
      await expect(
        service.find({
          type: 'jenkins',
          query: { url: apiBaseUrl ?? 'https://unconfigured.example.com/' },
          authMethods: ['apiToken'],
        }),
      ).rejects.toThrow(/Connection not found/);
    },
  );
});
