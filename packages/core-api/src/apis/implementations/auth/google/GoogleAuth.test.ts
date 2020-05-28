/*
 * Copyright 2020 Spotify AB
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

import GoogleAuth from './GoogleAuth';

const theFuture = new Date(Date.now() + 3600000);
const thePast = new Date(Date.now() - 10);

const PREFIX = 'https://www.googleapis.com/auth/';

describe('GoogleAuth', () => {
  it('should get refreshed access token', async () => {
    const getSession = jest
      .fn()
      .mockResolvedValue({ accessToken: 'access-token', expiresAt: theFuture });
    const googleAuth = new GoogleAuth({ getSession } as any);

    expect(await googleAuth.getAccessToken()).toBe('access-token');
    expect(getSession).toBeCalledTimes(1);
  });

  it('should get refreshed id token', async () => {
    const getSession = jest
      .fn()
      .mockResolvedValue({ idToken: 'id-token', expiresAt: theFuture });
    const googleAuth = new GoogleAuth({ getSession } as any);

    expect(await googleAuth.getIdToken()).toBe('id-token');
    expect(getSession).toBeCalledTimes(1);
  });

  it('should get optional id token', async () => {
    const getSession = jest
      .fn()
      .mockResolvedValue({ idToken: 'id-token', expiresAt: theFuture });
    const googleAuth = new GoogleAuth({ getSession } as any);

    expect(await googleAuth.getIdToken({ optional: true })).toBe('id-token');
    expect(getSession).toBeCalledTimes(1);
  });

  it('should share popup closed errors', async () => {
    const error = new Error('NOPE');
    error.name = 'RejectedError';
    const getSession = jest
      .fn()
      .mockResolvedValueOnce({
        accessToken: 'access-token',
        expiresAt: theFuture,
        scopes: new Set([`${PREFIX}not-enough`]),
      })
      .mockRejectedValue(error);
    const googleAuth = new GoogleAuth({ getSession } as any);

    // Make sure we have a session before we do the double request, so that we get past the !this.currentSession check
    await expect(googleAuth.getAccessToken()).resolves.toBe('access-token');

    const promise1 = googleAuth.getAccessToken('more');
    const promise2 = googleAuth.getAccessToken('more');
    await expect(promise1).rejects.toBe(error);
    await expect(promise2).rejects.toBe(error);
    expect(getSession).toBeCalledTimes(3);
  });

  it('should wait for all session refreshes', async () => {
    const initialSession = {
      idToken: 'token1',
      expiresAt: theFuture,
      scopes: new Set(),
    };
    const getSession = jest
      .fn()
      .mockResolvedValueOnce(initialSession)
      .mockResolvedValue({
        idToken: 'token2',
        expiresAt: theFuture,
        scopes: new Set(),
      });
    const googleAuth = new GoogleAuth({ getSession } as any);

    // Grab the expired session first
    await expect(googleAuth.getIdToken()).resolves.toBe('token1');
    expect(getSession).toBeCalledTimes(1);

    initialSession.expiresAt = thePast;

    const promise1 = googleAuth.getIdToken();
    const promise2 = googleAuth.getIdToken();
    const promise3 = googleAuth.getIdToken();
    await expect(promise1).resolves.toBe('token2');
    await expect(promise2).resolves.toBe('token2');
    await expect(promise3).resolves.toBe('token2');
    expect(getSession).toBeCalledTimes(4); // De-duping of session requests happens in client
  });

  it.each([
    ['email', [`${PREFIX}userinfo.email`]],
    ['profile', [`${PREFIX}userinfo.profile`]],
    ['openid', ['openid']],
    ['userinfo.email', [`${PREFIX}userinfo.email`]],
    [
      'userinfo.profile email',
      [`${PREFIX}userinfo.profile`, `${PREFIX}userinfo.email`],
    ],
    [
      `profile        ${PREFIX}userinfo.email`,
      [`${PREFIX}userinfo.profile`, `${PREFIX}userinfo.email`],
    ],
    [`${PREFIX}userinfo.profile`, [`${PREFIX}userinfo.profile`]],
    ['a', [`${PREFIX}a`]],
    ['a b\tc', [`${PREFIX}a`, `${PREFIX}b`, `${PREFIX}c`]],
    [`${PREFIX}a b`, [`${PREFIX}a`, `${PREFIX}b`]],
    [`${PREFIX}a`, [`${PREFIX}a`]],

    // Some incorrect scopes that we don't try to fix
    [`${PREFIX}email`, [`${PREFIX}email`]],
    [`${PREFIX}profile`, [`${PREFIX}profile`]],
    [`${PREFIX}openid`, [`${PREFIX}openid`]],
  ])(`should normalize scopes correctly - %p`, (scope, scopes) => {
    expect(GoogleAuth.normalizeScopes(scope)).toEqual(new Set(scopes));
  });
});
