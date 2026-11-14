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

const apiBaseUrl =
  'https://api.atlassian.com/ex/jira/00000000-0000-4000-8000-000000000000';

function createService() {
  return DefaultConnectionsService.create({
    logger: mockServices.logger.mock(),
    config: mockServices.rootConfig({
      data: {
        connections: [
          {
            type: 'jira',
            host: 'example.atlassian.net',
            deployment: 'cloud',
            baseUrl: 'https://example.atlassian.net',
            apiBaseUrl,
            auth: [
              { method: 'none' },
              {
                method: 'apiToken',
                email: 'reader@example.com',
                token: 'dummy-cloud-token',
                match: { plugins: ['jira-dashboard'] },
              },
            ],
          },
          {
            type: 'jira',
            host: 'jira.example.com:8443',
            deployment: 'datacenter',
            baseUrl: 'https://jira.example.com:8443/jira/',
            auth: [{ method: 'pat', token: 'dummy-pat' }],
          },
        ],
      },
    }),
  });
}

describe('Jira connections', () => {
  it('looks up Cloud site identity independently of its API host and scopes credentials', async () => {
    const service = createService();
    const jira = service.forPlugin('jira-dashboard');
    const connection = await jira.find({
      type: 'jira',
      query: { url: 'https://example.atlassian.net/browse/EXAMPLE-1' },
      authMethods: ['apiToken'],
    });
    expect(connection.host).toBe('example.atlassian.net');
    expect(connection.deployment).toBe('cloud');
    expect(connection.auth).toMatchObject({
      method: 'apiToken',
      email: 'reader@example.com',
      token: 'dummy-cloud-token',
    });
    expect(connection.apiBaseUrl).toBe(apiBaseUrl);
    const endpoint = new URL(
      'rest/api/3/myself',
      `${(connection.apiBaseUrl ?? connection.baseUrl).replace(/\/$/, '')}/`,
    );
    expect(endpoint.href).toBe(`${apiBaseUrl}/rest/api/3/myself`);
    expect(
      `Basic ${Buffer.from(
        `${connection.auth.email}:${connection.auth.token}`,
      ).toString('base64')}`,
    ).toBe('Basic cmVhZGVyQGV4YW1wbGUuY29tOmR1bW15LWNsb3VkLXRva2Vu');
    await expect(
      jira.find({
        type: 'jira',
        query: { url: `${apiBaseUrl}/rest/api/3/myself` },
        authMethods: ['apiToken'],
      }),
    ).rejects.toThrow(/Connection not found/);

    const anonymous = await service.forPlugin('catalog').find({
      type: 'jira',
      query: { url: connection.baseUrl },
      authMethods: ['none'],
    });
    expect(anonymous.auth.method).toBe('none');
    await expect(
      service.forPlugin('catalog').find({
        type: 'jira',
        query: { url: connection.baseUrl },
        authMethods: ['apiToken'],
      }),
    ).rejects.toThrow(/Connection not found/);
  });

  it('preserves Data Center context paths and ports and does not fall back to another auth method', async () => {
    const jira = createService().forPlugin('jira-dashboard');
    const connection = await jira.find({
      type: 'jira',
      query: { url: 'https://jira.example.com:8443/jira/browse/EXAMPLE-1' },
      authMethods: ['pat'],
    });
    expect(connection.deployment).toBe('datacenter');
    expect(connection.auth.token).toBe('dummy-pat');
    const endpoint = new URL('rest/api/2/myself', connection.baseUrl);
    expect(endpoint.href).toBe(
      'https://jira.example.com:8443/jira/rest/api/2/myself',
    );
    await expect(
      jira.find({
        type: 'jira',
        query: { url: connection.baseUrl },
        authMethods: ['apiToken'],
      }),
    ).rejects.toThrow(/Connection not found/);
    await expect(
      jira.find({
        type: 'jira',
        query: { url: 'https://jira.example.com/jira' },
        authMethods: ['pat'],
      }),
    ).rejects.toThrow(/Connection not found/);
    await expect(
      jira.find({
        type: 'jira',
        query: { url: 'https://example.atlassian.net' },
        authMethods: ['none'],
      }),
    ).rejects.toThrow(/Connection not found/);
  });
});
