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

import { Request } from 'express';
import { MockHttpAuthService } from './MockHttpAuthService';
import { mockCredentials } from './mockCredentials';
import { AuthenticationError } from '@backstage/errors';

describe('MockHttpAuthService', () => {
  const httpAuth = new MockHttpAuthService('test', mockCredentials.none());

  function makeAuthReq(authorization?: string) {
    return { headers: { authorization } } as Request;
  }
  function makeCookieAuthReq(cookie?: string) {
    return { headers: { cookie } } as Request;
  }

  it('should authenticate unauthenticated requests', async () => {
    await expect(httpAuth.credentials(makeAuthReq())).resolves.toEqual(
      mockCredentials.none(),
    );

    await expect(
      httpAuth.credentials(makeAuthReq(), { allow: ['none'] }),
    ).resolves.toEqual(mockCredentials.none());

    await expect(
      httpAuth.credentials(makeAuthReq(), { allow: ['user'] }),
    ).rejects.toThrow(AuthenticationError);

    await expect(httpAuth.credentials(makeAuthReq())).resolves.toEqual(
      mockCredentials.none(),
    );
  });

  it('should authenticate user requests', async () => {
    await expect(
      httpAuth.credentials(makeAuthReq(mockCredentials.user.header())),
    ).resolves.toEqual(mockCredentials.user());

    await expect(
      httpAuth.credentials(makeAuthReq(mockCredentials.user.header()), {
        allow: ['user'],
      }),
    ).resolves.toEqual(mockCredentials.user());

    await expect(
      httpAuth.credentials(makeAuthReq(mockCredentials.user.header()), {
        allow: ['none', 'service'],
      }),
    ).rejects.toThrow("This endpoint does not allow 'user' credentials");

    await expect(
      httpAuth.credentials(
        makeAuthReq(mockCredentials.user.header('user:default/other')),
      ),
    ).resolves.toEqual(mockCredentials.user('user:default/other'));
  });

  it('should authenticate limited user requests', async () => {
    await expect(
      httpAuth.credentials(
        makeCookieAuthReq(mockCredentials.limitedUser.cookie()),
      ),
    ).resolves.toEqual(mockCredentials.none());

    await expect(
      httpAuth.credentials(
        makeCookieAuthReq(mockCredentials.limitedUser.cookie()),
        { allowLimitedAccess: true },
      ),
    ).resolves.toEqual(mockCredentials.user());

    await expect(
      httpAuth.credentials(makeAuthReq(mockCredentials.user.header()), {
        allowLimitedAccess: true,
      }),
    ).resolves.toEqual(mockCredentials.user());

    await expect(
      httpAuth.credentials(
        makeCookieAuthReq(mockCredentials.limitedUser.cookie()),
        {
          allow: ['user'],
        },
      ),
    ).rejects.toThrow('Missing credentials');

    await expect(
      httpAuth.credentials(
        makeCookieAuthReq(mockCredentials.limitedUser.cookie()),
        {
          allow: ['none', 'service'],
          allowLimitedAccess: true,
        },
      ),
    ).rejects.toThrow("This endpoint does not allow 'user' credentials");

    await expect(
      httpAuth.credentials(
        makeAuthReq(`Bearer ${mockCredentials.limitedUser.token()}`),
        { allowLimitedAccess: true },
      ),
    ).resolves.toEqual(mockCredentials.user());

    await expect(
      httpAuth.credentials(
        makeAuthReq(`Bearer ${mockCredentials.limitedUser.token()}`),
      ),
    ).rejects.toThrow('Limited user token is not allowed');
  });

  it('should authenticate service requests', async () => {
    await expect(
      httpAuth.credentials(makeAuthReq(mockCredentials.service.header())),
    ).resolves.toEqual(mockCredentials.service());

    await expect(
      httpAuth.credentials(makeAuthReq(mockCredentials.service.header()), {
        allow: ['none', 'service'],
      }),
    ).resolves.toEqual(mockCredentials.service());

    await expect(
      httpAuth.credentials(
        makeAuthReq(
          mockCredentials.service.header({
            onBehalfOf: mockCredentials.service('plugin:other'),
            targetPluginId: 'test',
          }),
        ),
      ),
    ).resolves.toEqual(mockCredentials.service('plugin:other'));

    await expect(
      httpAuth.credentials(makeAuthReq(mockCredentials.service.header()), {
        allow: ['user'],
      }),
    ).rejects.toThrow("This endpoint does not allow 'service' credentials");
  });

  it('should default to different credential types', async () => {
    const noneAuth = new MockHttpAuthService('test', mockCredentials.none());
    const userAuth = new MockHttpAuthService('test', mockCredentials.user());
    const serviceAuth = new MockHttpAuthService(
      'test',
      mockCredentials.service(),
    );

    await expect(noneAuth.credentials(makeAuthReq())).resolves.toEqual(
      mockCredentials.none(),
    );
    await expect(
      noneAuth.credentials(makeAuthReq(mockCredentials.none.header())),
    ).resolves.toEqual(mockCredentials.none());
    await expect(
      noneAuth.credentials(makeAuthReq(mockCredentials.user.header())),
    ).resolves.toEqual(mockCredentials.user());
    await expect(
      noneAuth.credentials(makeAuthReq(mockCredentials.service.header())),
    ).resolves.toEqual(mockCredentials.service());

    await expect(userAuth.credentials(makeAuthReq())).resolves.toEqual(
      mockCredentials.user(),
    );
    await expect(
      userAuth.credentials(makeAuthReq(mockCredentials.none.header())),
    ).resolves.toEqual(mockCredentials.none());
    await expect(
      userAuth.credentials(makeAuthReq(mockCredentials.user.header())),
    ).resolves.toEqual(mockCredentials.user());
    await expect(
      userAuth.credentials(makeAuthReq(mockCredentials.service.header())),
    ).resolves.toEqual(mockCredentials.service());

    await expect(serviceAuth.credentials(makeAuthReq())).resolves.toEqual(
      mockCredentials.service(),
    );
    await expect(
      serviceAuth.credentials(makeAuthReq(mockCredentials.none.header())),
    ).resolves.toEqual(mockCredentials.none());
    await expect(
      serviceAuth.credentials(makeAuthReq(mockCredentials.user.header())),
    ).resolves.toEqual(mockCredentials.user());
    await expect(
      serviceAuth.credentials(makeAuthReq(mockCredentials.service.header())),
    ).resolves.toEqual(mockCredentials.service());
  });

  it('should reject invalid credentials', async () => {
    await expect(
      httpAuth.credentials(makeAuthReq('Bearer bad')),
    ).rejects.toThrow("Unknown mock token 'bad'");

    await expect(
      httpAuth.credentials(makeAuthReq(mockCredentials.user.invalidHeader())),
    ).rejects.toThrow('User token is invalid');

    await expect(
      httpAuth.credentials(
        makeAuthReq(mockCredentials.service.invalidHeader()),
      ),
    ).rejects.toThrow('Service token is invalid');
  });

  it('should issue user cookie from request credentials', async () => {
    const setHeader = jest.fn();

    await expect(
      httpAuth.issueUserCookie({
        req: makeAuthReq(mockCredentials.user.header()),
        setHeader,
      } as any),
    ).resolves.toEqual({
      expiresAt: expect.any(Date),
    });

    expect(setHeader).toHaveBeenCalledWith(
      'Set-Cookie',
      mockCredentials.limitedUser.cookie(),
    );
  });

  it('should issue user cookie from explicit credentials', async () => {
    const setHeader = jest.fn();

    await expect(
      httpAuth.issueUserCookie(
        {
          req: makeAuthReq(mockCredentials.user.header()),
          setHeader,
        } as any,
        { credentials: mockCredentials.user('user:default/other') },
      ),
    ).resolves.toEqual({
      expiresAt: expect.any(Date),
    });

    expect(setHeader).toHaveBeenCalledWith(
      'Set-Cookie',
      mockCredentials.limitedUser.cookie('user:default/other'),
    );
  });
});
