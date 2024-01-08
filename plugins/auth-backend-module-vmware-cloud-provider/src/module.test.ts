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

import { Config } from '../config';
import { authModuleVmwareCloudProvider } from './module';

describe('authModuleVmwareCloudProvider', () => {
  it('should start', async () => {
    const backend = await startTestBackend({
      features: [
        import('@backstage/plugin-auth-backend'),
        authModuleVmwareCloudProvider,
        mockServices.rootConfig.factory({
          data: {
            app: {
              baseUrl: 'http://localhost:3000',
            },
            auth: {
              session: { secret: 'test' },
              providers: {
                vmwareCloudServices: {
                  development: {
                    clientId: 'placeholderClientId',
                    organizationId: 'orgId',
                  },
                },
              },
            } as Config['auth'],
          },
        }),
      ],
    });

    const { server } = backend;

    const agent = request.agent(server);

    const res = await agent.get(
      '/api/auth/vmwareCloudServices/start?env=development',
    );

    expect(res.status).toEqual(302);

    const nonceCookie = agent.jar.getCookie('vmwareCloudServices-nonce', {
      domain: 'localhost',
      path: '/api/auth/vmwareCloudServices/handler',
      script: false,
      secure: false,
    });
    expect(nonceCookie).toBeDefined();

    const startUrl = new URL(res.get('location'));
    expect(startUrl.origin).toBe('https://console.cloud.vmware.com');
    expect(startUrl.pathname).toBe('/csp/gateway/discovery');
    expect(Object.fromEntries(startUrl.searchParams)).toEqual({
      response_type: 'code',
      client_id: 'placeholderClientId',
      redirect_uri: `http://localhost:${server.port()}/api/auth/vmwareCloudServices/handler/frame`,
      code_challenge: expect.any(String),
      state: expect.any(String),
      scope: 'openid offline_access',
      orgId: 'orgId',
      code_challenge_method: 'S256',
    });

    expect(decodeOAuthState(startUrl.searchParams.get('state')!)).toEqual({
      env: 'development',
      handle: expect.any(String),
      nonce: decodeURIComponent(nonceCookie.value),
    });

    backend.stop();
  });
});
