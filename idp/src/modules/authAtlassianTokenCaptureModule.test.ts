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
import { createServiceFactory } from '@backstage/backend-plugin-api';
import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import { providerTokenServiceRef } from '@devhub/plugin-provider-token-backend';
import request from 'supertest';
import { authAtlassianTokenCaptureModule } from './authAtlassianTokenCaptureModule';

describe('authAtlassianTokenCaptureModule', () => {
  it('starts and redirects to Atlassian OAuth', async () => {
    const { server } = await startTestBackend({
      features: [
        import('@backstage/plugin-auth-backend'),
        authAtlassianTokenCaptureModule,
        mockServices.rootConfig.factory({
          data: {
            app: { baseUrl: 'http://localhost:3000' },
            auth: {
              providers: {
                atlassian: {
                  development: {
                    clientId: 'test-client-id',
                    clientSecret: 'test-client-secret',
                  },
                },
              },
            },
          },
        }),
        // Provide a mock database so migration can run
        mockServices.database.factory(),
        // Mock the providerTokenService so the real factory (which needs DB migration
        // and provider configs) does not run during this smoke test.
        createServiceFactory({
          service: providerTokenServiceRef,
          deps: {},
          factory: () => ({
            upsertToken: jest.fn(),
            getToken: jest.fn(),
            deleteTokens: jest.fn(),
            deleteToken: jest.fn(),
          }),
        }),
      ],
    });

    const res = await request(server).get(
      '/api/auth/atlassian/start?env=development',
    );
    expect(res.status).toEqual(302);

    const startUrl = new URL(res.get('location'));
    expect(startUrl.origin).toBe('https://auth.atlassian.com');
    expect(startUrl.pathname).toBe('/authorize');
    expect(startUrl.searchParams.get('client_id')).toBe('test-client-id');
  });
});
