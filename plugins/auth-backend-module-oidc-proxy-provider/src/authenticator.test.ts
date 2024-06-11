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

import { mockServices } from '@backstage/backend-test-utils';
import { Request } from 'express';
import { createHolosProxyAuthenticator } from './authenticator';

const mockLogger = mockServices.logger.mock();

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock('./helpers', () => ({
  createTokenValidator() {
    return async () => ({ sub: 's', email: 'e' });
  },
}));

describe('OidcProxyProvider', () => {
  it('should find default id token header', async () => {
    const authenticator = createHolosProxyAuthenticator(mockLogger);
    const ctx = authenticator.initialize({
      config: mockServices.rootConfig({
        data: {
          issuer: 'https://login.example.com',
          audience: '999999999999999999@holos_platform',
        },
      }),
    });
    await expect(
      authenticator.authenticate(
        {
          req: {
            header(name: string) {
              return name === 'x-oidc-id-token' ? 'my-token' : undefined;
            },
          } as Request,
        },
        ctx,
      ),
    ).resolves.toEqual({
      result: { idToken: { sub: 's', email: 'e' } },
      providerInfo: { idToken: { sub: 's', email: 'e' } },
    });
  });

  it('should find custom id token header', async () => {
    const authenticator = createHolosProxyAuthenticator(mockLogger);
    const oidcIdTokenHeader = 'x-custom-header';
    const ctx = authenticator.initialize({
      config: mockServices.rootConfig({
        data: {
          issuer: 'https://login.example.com',
          audience: '999999999999999999@holos_platform',
          oidcIdTokenHeader: oidcIdTokenHeader,
        },
      }),
    });
    await expect(
      authenticator.authenticate(
        {
          req: {
            header(name: string) {
              return name === oidcIdTokenHeader ? 'my-token' : undefined;
            },
          } as Request,
        },
        ctx,
      ),
    ).resolves.toEqual({
      result: { idToken: { sub: 's', email: 'e' } },
      providerInfo: { idToken: { sub: 's', email: 'e' } },
    });
  });

  it('should throw if header is missing', async () => {
    const authenticator = createHolosProxyAuthenticator(mockLogger);
    const ctx = authenticator.initialize({
      config: mockServices.rootConfig({
        data: {
          issuer: 'https://login.example.com',
          audience: '999999999999999999@holos_platform',
        },
      }),
    });
    await expect(
      authenticator.authenticate(
        {
          req: {
            header(_name: string) {
              return undefined;
            },
          } as Request,
        },
        ctx,
      ),
    ).rejects.toThrow('could not authenticate: missing header x-oidc-id-token');
  });
});
