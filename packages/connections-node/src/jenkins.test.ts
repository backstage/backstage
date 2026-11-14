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

const baseUrl = 'https://ci.example.com:8443/jenkins';
const createService = (url = baseUrl) =>
  DefaultConnectionsService.create({
    logger: mockServices.logger.mock(),
    config: mockServices.rootConfig({
      data: {
        connections: [
          {
            type: 'jenkins',
            host: 'ci.example.com:8443',
            baseUrl: url,
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
    query: { url: `${baseUrl}/job/example` },
    authMethods: ['apiToken'],
  });
  const controllerUrl = `${connection.baseUrl.replace(/\/+$/, '')}/`;
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
    for (const url of [baseUrl, `${baseUrl}/`]) {
      const service = createService(url);
      expect(await requestOptions(service.forPlugin('jenkins'))).toEqual({
        url: `${baseUrl}/job/example/api/json`,
        authorization: 'Basic cmVhZGVyOmR1bW15LXJlYWQtdG9rZW4=',
      });
      const scoped = await service.forPlugin('scaffolder').find({
        type: 'jenkins',
        query: { url: `${baseUrl}/job/example` },
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
      `${baseUrl}/job/example`,
      'http://ci.example.com:8443/other-controller/job/example',
    ]) {
      const connection = await connections.find({
        type: 'jenkins',
        query: { url },
      });
      expect(connection.baseUrl).toBe(baseUrl);
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
    const query = { url: `${baseUrl}/job/example` };
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
});
