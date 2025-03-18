/*
 * Copyright 2024 The Backstage Authors
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
import authPlugin from '@backstage/plugin-auth-backend';
import { authModuleAuth0Provider } from './module';
import request from 'supertest';
import { decodeOAuthState } from '@backstage/plugin-auth-node';

describe('authModuleAuth0Provider', () => {
  it('should start', async () => {
    const { server } = await startTestBackend({
      features: [
        authPlugin,
        authModuleAuth0Provider,
        mockServices.rootConfig.factory({
          data: {
            app: {
              baseUrl: 'http://localhost:3000',
            },
            auth: {
              providers: {
                auth0: {
                  development: {
                    clientId: 'clientId',
                    clientSecret: 'clientSecret',
                    domain: 'domain',
                    connection: 'connection',
                    connectionScope: 'connectionScope',
                  },
                },
              },
              session: {
                secret: 'secret',
              },
            },
          },
        }),
      ],
    });

    const agent = request.agent(server);

    const res = await agent.get('/api/auth/auth0/start?env=development');

    expect(res.status).toEqual(302);

    const nonceCookie = agent.jar.getCookie('auth0-nonce', {
      domain: 'localhost',
      path: '/api/auth/auth0/handler',
      script: false,
      secure: false,
    });
    expect(nonceCookie).toBeDefined();

    const startUrl = new URL(res.get('location'));
    expect(startUrl.origin).toBe('https://domain');
    expect(startUrl.pathname).toBe('/authorize');
    expect(Object.fromEntries(startUrl.searchParams)).toEqual({
      response_type: 'code',
      scope: '',
      client_id: 'clientId',
      redirect_uri: `http://localhost:${server.port()}/api/auth/auth0/handler/frame`,
      prompt: 'consent',
      accessType: 'offline',
      connection: 'connection',
      connection_scope: 'connectionScope',
      nonce: expect.any(String),
      state: expect.any(String),
    });

    expect(decodeOAuthState(startUrl.searchParams.get('state')!)).toEqual({
      env: 'development',
      nonce: decodeURIComponent(nonceCookie.value),
    });
  });
});
