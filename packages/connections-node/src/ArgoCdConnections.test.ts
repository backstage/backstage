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
import { DefaultConnectionsService } from './DefaultConnectionsService';

function createService(baseUrl: string) {
  return DefaultConnectionsService.create({
    logger: mockServices.logger.mock(),
    config: mockServices.rootConfig({
      data: {
        connections: [
          {
            type: 'argocd',
            host: 'argocd.example.com',
            baseUrl,
            auth: [
              { method: 'token', token: 'default-token' },
              {
                method: 'token',
                token: 'plugin-token',
                match: { plugins: ['argocd'] },
              },
              { method: 'token', token: 'later-token' },
            ],
          },
          {
            type: 'argocd',
            host: 'argocd.example.com:8443',
            baseUrl: 'https://argocd.example.com:8443/staging',
            auth: [{ method: 'token', token: 'staging-token' }],
          },
        ],
      },
    }),
  });
}

describe('Argo CD connection lookup', () => {
  it.each([
    'https://argocd.example.com/argo-cd',
    'https://argocd.example.com/argo-cd/',
    'https://argocd.example.com',
    'https://argocd.example.com/',
  ])('preserves the deployment prefix when consuming %s', async baseUrl => {
    const service = createService(baseUrl).forPlugin('argocd');
    const connection: Connection<'argocd', 'token'> = await service.find({
      type: 'argocd',
      query: {
        url: `${baseUrl.replace(/\/+$/, '')}/applications/default/example`,
      },
      authMethods: ['token'],
    });
    const request = {
      url: new URL(
        'api/v1/applications',
        `${connection.baseUrl.replace(/\/+$/, '')}/`,
      ),
      headers: { Authorization: `Bearer ${connection.auth.token}` },
    };
    expect(connection.baseUrl).toBe(baseUrl);
    expect(connection.auth.method).toBe('token');
    expect(request.url.toString()).toBe(
      `${baseUrl.replace(/\/+$/, '')}/api/v1/applications`,
    );
    expect(request.headers.Authorization).toBe('Bearer plugin-token');
  });

  it('matches only host and port, with standard plugin-scoped token selection', async () => {
    const root = createService('https://argocd.example.com/argo-cd');
    const service = root.forPlugin('catalog');
    const connection = await service.find({
      type: 'argocd',
      query: { url: 'http://argocd.example.com/unrelated/path' },
      authMethods: ['token'],
    });
    expect(connection.baseUrl).toBe('https://argocd.example.com/argo-cd');
    expect(connection.auth.token).toBe('default-token');
    const staging = await service.find({
      type: 'argocd',
      query: { url: 'https://argocd.example.com:8443/applications/example' },
      authMethods: ['token'],
    });
    expect(staging.auth.token).toBe('staging-token');
    expect(staging.baseUrl).toBe('https://argocd.example.com:8443/staging');
    await expect(
      service.find({
        type: 'argocd',
        query: { url: 'https://missing.example.com' },
        authMethods: ['token'],
      }),
    ).rejects.toThrow('Connection not found for type "argocd"');
    const info = await service.find({
      type: 'argocd',
      query: { url: connection.baseUrl },
    });
    expect(info).not.toHaveProperty('auth');
  });
});
