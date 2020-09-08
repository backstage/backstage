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
import OktaAuth from './OktaAuth';

const theFuture = new Date(Date.now() + 3600000);
const thePast = new Date(Date.now() - 10);

const PREFIX = 'okta.';

describe('OktaAuth', () => {
  it('should get refreshed access token', async () => {
    const getSession = jest.fn().mockResolvedValue({
      providerInfo: { accessToken: 'access-token', expiresAt: theFuture },
    });
    const oktaAuth = new OktaAuth({ getSession } as any);

    expect(await oktaAuth.getAccessToken()).toBe('access-token');
    expect(getSession).toBeCalledTimes(1);
  });

  it('should get refreshed id token', async () => {
    const getSession = jest.fn().mockResolvedValue({
      providerInfo: { idToken: 'id-token', expiresAt: theFuture },
    });
    const oktaAuth = new OktaAuth({ getSession } as any);

    expect(await oktaAuth.getIdToken()).toBe('id-token');
    expect(getSession).toBeCalledTimes(1);
  });

  it('should get optional id token', async () => {
    const getSession = jest.fn().mockResolvedValue({
      providerInfo: { idToken: 'id-token', expiresAt: theFuture },
    });
    const oktaAuth = new OktaAuth({ getSession } as any);

    expect(await oktaAuth.getIdToken({ optional: true })).toBe('id-token');
    expect(getSession).toBeCalledTimes(1);
  });

  it('should share popup closed errors', async () => {
    const error = new Error('NOPE');
    error.name = 'RejectedError';
    const getSession = jest
      .fn()
      .mockResolvedValueOnce({
        providerInfo: {
          accessToken: 'access-token',
          expiresAt: theFuture,
          scopes: new Set([`not-a-scope`]),
        },
      })
      .mockRejectedValue(error);
    const oktaAuth = new OktaAuth({ getSession } as any);

    // Make sure we have a session before we do the double request, so that we get past the !this.currentSession check
    await expect(oktaAuth.getAccessToken()).resolves.toBe('access-token');

    const promise1 = oktaAuth.getAccessToken('more');
    const promise2 = oktaAuth.getAccessToken('more');
    await expect(promise1).rejects.toBe(error);
    await expect(promise2).rejects.toBe(error);
    expect(getSession).toBeCalledTimes(3);
  });

  it('should wait for all session refreshes', async () => {
    const initialSession = {
      providerInfo: {
        idToken: 'token1',
        expiresAt: theFuture,
        scopes: new Set(),
      },
    };
    const getSession = jest
      .fn()
      .mockResolvedValueOnce(initialSession)
      .mockResolvedValue({
        providerInfo: {
          idToken: 'token2',
          expiresAt: theFuture,
          scopes: new Set(),
        },
      });
    const oktaAuth = new OktaAuth({ getSession } as any);

    // Grab the expired session first
    await expect(oktaAuth.getIdToken()).resolves.toBe('token1');
    expect(getSession).toBeCalledTimes(1);

    initialSession.providerInfo.expiresAt = thePast;

    const promise1 = oktaAuth.getIdToken();
    const promise2 = oktaAuth.getIdToken();
    const promise3 = oktaAuth.getIdToken();
    await expect(promise1).resolves.toBe('token2');
    await expect(promise2).resolves.toBe('token2');
    await expect(promise3).resolves.toBe('token2');
    expect(getSession).toBeCalledTimes(4); // De-duping of session requests happens in client
  });

  it.each([
    ['openid', ['openid']],
    ['profile email', ['profile', 'email']],
    [`${PREFIX}groups.manage`, [`${PREFIX}groups.manage`]],
    ['groups.read', [`${PREFIX}groups.read`]],
    [
      `${PREFIX}groups.manage groups.read, openid`,
      [`${PREFIX}groups.manage`, `${PREFIX}groups.read`, 'openid'],
    ],
    [`email\t ${PREFIX}groups.read`, ['email', `${PREFIX}groups.read`]],

    // Some incorrect scopes that we don't try to fix
    [`${PREFIX}email`, [`${PREFIX}email`]],
    [`${PREFIX}profile`, [`${PREFIX}profile`]],
    [`${PREFIX}openid`, [`${PREFIX}openid`]],
  ])(`should normalize scopes correctly - %p`, (scope, scopes) => {
    expect(OktaAuth.normalizeScopes(scope)).toEqual(new Set(scopes));
  });
});
