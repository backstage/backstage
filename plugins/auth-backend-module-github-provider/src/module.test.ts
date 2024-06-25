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
import { authModuleGithubProvider } from './module';
import request from 'supertest';
import { decodeOAuthState } from '@backstage/plugin-auth-node';

describe('authModuleGithubProvider', () => {
  it('should start', async () => {
    const { server } = await startTestBackend({
      features: [
        import('@backstage/plugin-auth-backend'),
        authModuleGithubProvider,
        mockServices.rootConfig.factory({
          data: {
            app: {
              baseUrl: 'http://localhost:3000',
            },
            auth: {
              providers: {
                github: {
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

    const res = await agent.get('/api/auth/github/start?env=development');

    expect(res.status).toEqual(302);

    const nonceCookie = agent.jar.getCookie('github-nonce', {
      domain: 'localhost',
      path: '/api/auth/github/handler',
      script: false,
      secure: false,
    });
    expect(nonceCookie).toBeDefined();

    const startUrl = new URL(res.get('location'));
    expect(startUrl.origin).toBe('https://github.com');
    expect(startUrl.pathname).toBe('/login/oauth/authorize');
    expect(Object.fromEntries(startUrl.searchParams)).toEqual({
      response_type: 'code',
      client_id: 'my-client-id',
      redirect_uri: `http://localhost:${server.port()}/api/auth/github/handler/frame`,
      state: expect.any(String),
      scope: 'read:user',
    });

    expect(decodeOAuthState(startUrl.searchParams.get('state')!)).toEqual({
      env: 'development',
      nonce: decodeURIComponent(nonceCookie.value),
      scope: 'read:user',
    });
  });
});
