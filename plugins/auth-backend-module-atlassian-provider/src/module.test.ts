/*
 * Copyright 2023 The Backstage Authors
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

import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import { decodeOAuthState } from '@backstage/plugin-auth-node';
import request from 'supertest';
import { authModuleAtlassianProvider } from './module';

describe('authModuleAtlassianProvider', () => {
  it('should start', async () => {
    const { server } = await startTestBackend({
      features: [
        import('@backstage/plugin-auth-backend'),
        authModuleAtlassianProvider,
        mockServices.rootConfig.factory({
          data: {
            app: {
              baseUrl: 'http://localhost:3000',
            },
            auth: {
              providers: {
                atlassian: {
                  development: {
                    clientId: 'my-client-id',
                    clientSecret: 'my-client-secret',
                  },
                },
              },
            },
          },
        }),
      ],
    });

    const agent = request.agent(server);

    const res = await agent.get('/api/auth/atlassian/start?env=development');

    expect(res.status).toEqual(302);

    const nonceCookie = agent.jar.getCookie('atlassian-nonce', {
      domain: 'localhost',
      path: '/api/auth/atlassian/handler',
      script: false,
      secure: false,
    });
    expect(nonceCookie).toBeDefined();

    const startUrl = new URL(res.get('location'));
    expect(startUrl.origin).toBe('https://auth.atlassian.com');
    expect(startUrl.pathname).toBe('/authorize');
    expect(Object.fromEntries(startUrl.searchParams)).toEqual({
      response_type: 'code',
      audience: 'api.atlassian.com',
      client_id: 'my-client-id',
      prompt: 'consent',
      redirect_uri: `http://localhost:${server.port()}/api/auth/atlassian/handler/frame`,
      state: expect.any(String),
      scope: 'offline_access read:me read:jira-work read:jira-user',
    });

    expect(decodeOAuthState(startUrl.searchParams.get('state')!)).toEqual({
      env: 'development',
      nonce: decodeURIComponent(nonceCookie.value),
    });
  });

  it('should start with and use custom scopes from additionalScopes config field', async () => {
    const { server } = await startTestBackend({
      features: [
        import('@backstage/plugin-auth-backend'),
        authModuleAtlassianProvider,
        mockServices.rootConfig.factory({
          data: {
            app: {
              baseUrl: 'http://localhost:3000',
            },
            auth: {
              providers: {
                atlassian: {
                  development: {
                    clientId: 'my-client-id',
                    clientSecret: 'my-client-secret',
                    additionalScopes: 'read:filter:jira read:jira-work', // 2nd is already required
                  },
                },
              },
            },
          },
        }),
      ],
    });

    const agent = request.agent(server);

    const res = await agent.get('/api/auth/atlassian/start?env=development');

    expect(res.status).toEqual(302);

    const nonceCookie = agent.jar.getCookie('atlassian-nonce', {
      domain: 'localhost',
      path: '/api/auth/atlassian/handler',
      script: false,
      secure: false,
    });
    expect(nonceCookie).toBeDefined();

    const startUrl = new URL(res.get('location'));
    expect(startUrl.origin).toBe('https://auth.atlassian.com');
    expect(startUrl.pathname).toBe('/authorize');
    expect(Object.fromEntries(startUrl.searchParams)).toEqual({
      audience: 'api.atlassian.com',
      response_type: 'code',
      client_id: 'my-client-id',
      prompt: 'consent',
      redirect_uri: `http://localhost:${server.port()}/api/auth/atlassian/handler/frame`,
      state: expect.any(String),
      scope:
        'offline_access read:me read:jira-work read:jira-user read:filter:jira',
    });

    expect(decodeOAuthState(startUrl.searchParams.get('state')!)).toEqual({
      env: 'development',
      nonce: decodeURIComponent(nonceCookie.value),
    });
  });

  it('should fail to start with scope or scopes config', async () => {
    await expect(
      startTestBackend({
        features: [
          import('@backstage/plugin-auth-backend'),
          authModuleAtlassianProvider,
          mockServices.rootConfig.factory({
            data: {
              app: {
                baseUrl: 'http://localhost:3000',
              },
              auth: {
                providers: {
                  atlassian: {
                    development: {
                      clientId: 'my-client-id',
                      clientSecret: 'my-client-secret',
                      scope: 'foo',
                    },
                  },
                },
              },
            },
          }),
        ],
      }),
    ).rejects.toThrow(
      /atlassian provider no longer supports the "scope" or "scopes" configuration options/,
    );
  });
});
