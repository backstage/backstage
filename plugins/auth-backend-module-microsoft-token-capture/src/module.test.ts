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
import { providerTokenServiceRef } from '@devhub/plugin-provider-token-node';
import request from 'supertest';
import { authMicrosoftTokenCaptureModule } from './module';

const TEST_CONFIG = {
  data: {
    app: { baseUrl: 'http://localhost:3000' },
    auth: {
      providers: {
        microsoft: {
          development: {
            clientId: 'test-ms-client-id',
            clientSecret: 'test-ms-secret',
            tenantId: 'test-tenant-id',
          },
        },
      },
    },
    providerToken: {
      encryptionSecret: Buffer.from(
        'test-secret-32-bytes-minimum-xxxx',
      ).toString('base64'),
    },
  },
};

describe('authMicrosoftTokenCaptureModule', () => {
  it('starts and redirects to Microsoft OAuth', async () => {
    const { server } = await startTestBackend({
      features: [
        import('@backstage/plugin-auth-backend'),
        authMicrosoftTokenCaptureModule,
        mockServices.rootConfig.factory({ data: TEST_CONFIG.data }),
        // Provide a mock database so migration can run
        mockServices.database.factory(),
        // Mock the providerTokenService so the real factory (which needs DB migration
        // and provider configs) does not run during this smoke test.
        // Note: upsertToken is not called during the /start redirect — it would be called
        // during the /handler/frame callback when sign-in completes. That path requires a
        // full OAuth mock server and is beyond the scope of this smoke test. The token
        // capture logic is exercised in integration testing.
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
      '/api/auth/microsoft/start?env=development',
    );
    expect(res.status).toEqual(302);

    const startUrl = new URL(res.get('location'));
    expect(startUrl.hostname).toBe('login.microsoftonline.com');
    expect(startUrl.searchParams.get('client_id')).toBe('test-ms-client-id');
  });

  it('calls deleteTokens with the userEntityRef when a user logs out (G3)', async () => {
    const deleteTokens = jest.fn().mockResolvedValue(undefined);

    const { server } = await startTestBackend({
      features: [
        import('@backstage/plugin-auth-backend'),
        authMicrosoftTokenCaptureModule,
        mockServices.rootConfig.factory({ data: TEST_CONFIG.data }),
        mockServices.database.factory(),
        // Mock httpAuth: any unauthenticated request falls back to user:default/mock
        mockServices.httpAuth.factory(),
        createServiceFactory({
          service: providerTokenServiceRef,
          deps: {},
          factory: () => ({
            upsertToken: jest.fn(),
            getToken: jest.fn(),
            deleteTokens,
            deleteToken: jest.fn(),
          }),
        }),
      ],
    });

    const res = await request(server)
      .post('/api/auth/microsoft/logout?env=development')
      .set('X-Requested-With', 'XMLHttpRequest');

    expect(res.status).toEqual(200);
    expect(deleteTokens).toHaveBeenCalledWith('user:default/mock');
  });
});
