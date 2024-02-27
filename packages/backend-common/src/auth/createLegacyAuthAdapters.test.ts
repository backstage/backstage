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
import { createLegacyAuthAdapters } from './createLegacyAuthAdapters';
import { Request } from 'express';

describe('createLegacyAuthAdapters', () => {
  it('should pass through auth if only auth is provided', () => {
    const auth = {};
    const ret = createLegacyAuthAdapters({
      auth: auth as any,
      tokenManager: mockServices.tokenManager(),
      discovery: {} as any,
      identity: mockServices.identity(),
    });

    expect(ret.auth).toBe(auth);
  });

  it('should pass through httpAuth if only httpAuth is provided', () => {
    const httpAuth = {};
    const ret = createLegacyAuthAdapters({
      httpAuth: httpAuth as any,
      tokenManager: mockServices.tokenManager(),
      discovery: {} as any,
      identity: mockServices.identity(),
    });

    expect(ret.httpAuth).toBe(httpAuth);
  });

  it('should pass through both auth and httpAuth if both are provided', () => {
    const auth = {};
    const httpAuth = {};
    const ret = createLegacyAuthAdapters({
      auth: auth as any,
      httpAuth: httpAuth as any,
      tokenManager: mockServices.tokenManager(),
      discovery: {} as any,
      identity: mockServices.identity(),
    });

    expect(ret.auth).toBe(auth);
    expect(ret.httpAuth).toBe(httpAuth);
  });

  it('should pass through userInfo if it is provided', () => {
    const auth = {};
    const userInfo = {};
    const ret = createLegacyAuthAdapters({
      auth: auth as any,
      userInfo: userInfo as any,
      tokenManager: mockServices.tokenManager(),
      discovery: {} as any,
      identity: mockServices.identity(),
    });

    expect(ret.auth).toBe(auth);
    expect(ret.userInfo).toBe(userInfo);
  });

  it('should adapt all services if none are provided', () => {
    const ret = createLegacyAuthAdapters({
      auth: undefined,
      httpAuth: undefined,
      tokenManager: mockServices.tokenManager(),
      discovery: {} as any,
      identity: mockServices.identity(),
    });

    expect(ret).toEqual({
      auth: expect.any(Object),
      httpAuth: expect.any(Object),
      userInfo: expect.any(Object),
    });
  });

  it('should forward tokens if no token manager is provided', async () => {
    const { auth, httpAuth } = createLegacyAuthAdapters({
      auth: undefined,
      httpAuth: undefined,
      discovery: {} as any,
      identity: mockServices.identity(),
    });

    const credentials = await httpAuth.credentials({
      headers: {
        authorization: 'Bearer my-token',
      },
    } as Request);

    await expect(
      auth.getPluginRequestToken({
        onBehalfOf: credentials,
        targetPluginId: 'test',
      }),
    ).resolves.toEqual({ token: 'my-token' });
  });

  it('should issue a new token if a token manager is provided', async () => {
    const { auth, httpAuth } = createLegacyAuthAdapters({
      auth: undefined,
      httpAuth: undefined,
      tokenManager: {
        ...mockServices.tokenManager(),
        async getToken() {
          return { token: 'new-token' };
        },
      },
      discovery: {} as any,
      identity: mockServices.identity(),
    });

    const credentials = await httpAuth.credentials({
      headers: {
        authorization: 'Bearer mock-token',
      },
    } as Request);

    await expect(
      auth.getPluginRequestToken({
        onBehalfOf: credentials,
        targetPluginId: 'test',
      }),
    ).resolves.toEqual({ token: 'new-token' });
  });
});
