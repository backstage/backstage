/*
 * Copyright 2020 The Backstage Authors
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
import { gcpIapAuthenticator } from './authenticator';

beforeEach(() => {
  jest.clearAllMocks();
});
jest.mock('./helpers', () => ({
  createTokenValidator() {
    return async () => ({ sub: 's', email: 'e' });
  },
}));

describe('GcpIapProvider', () => {
  it('should find default JWT header', async () => {
    const ctx = gcpIapAuthenticator.initialize({
      config: mockServices.rootConfig({ data: { audience: 'my-audience' } }),
    });
    await expect(
      gcpIapAuthenticator.authenticate(
        {
          req: {
            header(name: string) {
              return name === 'x-goog-iap-jwt-assertion'
                ? 'my-token'
                : undefined;
            },
          } as Request,
        },
        ctx,
      ),
    ).resolves.toEqual({
      result: { iapToken: { sub: 's', email: 'e' } },
      providerInfo: { iapToken: { sub: 's', email: 'e' } },
    });
  });

  it('should find custom JWT header', async () => {
    const jwtHeader = 'x-custom-header';
    const ctx = gcpIapAuthenticator.initialize({
      config: mockServices.rootConfig({
        data: { audience: 'my-audience', jwtHeader },
      }),
    });
    await expect(
      gcpIapAuthenticator.authenticate(
        {
          req: {
            header(name: string) {
              return name === jwtHeader ? 'my-token' : undefined;
            },
          } as Request,
        },
        ctx,
      ),
    ).resolves.toEqual({
      result: { iapToken: { sub: 's', email: 'e' } },
      providerInfo: { iapToken: { sub: 's', email: 'e' } },
    });
  });

  it('should throw if header is missing', async () => {
    const ctx = gcpIapAuthenticator.initialize({
      config: mockServices.rootConfig({
        data: { audience: 'my-audience' },
      }),
    });
    await expect(
      gcpIapAuthenticator.authenticate(
        {
          req: {
            header(_name: string) {
              return undefined;
            },
          } as Request,
        },
        ctx,
      ),
    ).rejects.toThrow('Missing Google IAP header');
  });
});
