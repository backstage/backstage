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
import GoogleScopes from './GoogleScopes';

const theFuture = new Date(Date.now() + 3600000);
const thePast = new Date(Date.now() - 10);

describe('GoogleAuth', () => {
  it('should save result form createSession', async () => {
    const createSession = jest.fn().mockResolvedValue({ expiresAt: theFuture });
    const refreshSession = jest.fn().mockRejectedValue(new Error('NOPE'));
    const googleAuth = new GoogleAuth({ createSession, refreshSession } as any);

    await googleAuth.getSession({});
    expect(createSession).toBeCalledTimes(1);

    await googleAuth.getSession({});
    expect(createSession).toBeCalledTimes(1);

    expect(refreshSession).toBeCalledTimes(1);
  });

  it('should ask consent only if scopes have changed', async () => {
    const createSession = jest.fn();
    const refreshSession = jest.fn().mockRejectedValue(new Error('NOPE'));
    const googleAuth = new GoogleAuth({ createSession, refreshSession } as any);

    createSession.mockResolvedValue({
      scopes: GoogleScopes.from('a'),
      expiresAt: theFuture,
    });
    await googleAuth.getSession({ scope: 'a' });
    expect(createSession).toBeCalledTimes(1);

    await googleAuth.getSession({ scope: 'a' });
    expect(createSession).toBeCalledTimes(1);

    await googleAuth.getSession({ scope: 'b' });
    expect(createSession).toBeCalledTimes(2);
  });

  it('should check for session expiry', async () => {
    const createSession = jest.fn();
    const refreshSession = jest
      .fn()
      .mockRejectedValueOnce(new Error('NOPE'))
      .mockResolvedValue({ scopes: GoogleScopes.from('a') });
    const googleAuth = new GoogleAuth({ createSession, refreshSession } as any);

    createSession.mockResolvedValue({
      scopes: GoogleScopes.from('a'),
      expiresAt: thePast,
    });

    await googleAuth.getSession({ scope: 'a' });
    expect(createSession).toBeCalledTimes(1);
    expect(refreshSession).toBeCalledTimes(1);

    await googleAuth.getSession({ scope: 'a' });
    expect(createSession).toBeCalledTimes(1);
    expect(refreshSession).toBeCalledTimes(2);
  });

  it('should handle user closed popup', async () => {
    const createSession = jest.fn();
    const refreshSession = jest.fn().mockRejectedValue(new Error('NOPE'));
    const googleAuth = new GoogleAuth({ createSession, refreshSession } as any);

    createSession.mockRejectedValueOnce(new Error('some error'));
    await expect(googleAuth.getSession({ scope: 'a' })).rejects.toThrow(
      'some error',
    );
  });

  it('should logout and reload', async () => {
    // This is a workaround that is used by Facebook and the Jest core team
    // It is a limitation with the newest versions of JSDOM, and newer browser standards
    // where window.location and all of its properties are read-only. So we re-construct it!
    // See https://github.com/facebook/jest/issues/890#issuecomment-209698782
    const location = { ...window.location };
    delete window.location;
    window.location = location;
    jest.spyOn(window.location, 'reload').mockImplementation();

    const removeSession = jest.fn();
    const googleAuth = new GoogleAuth({ removeSession } as any);

    await googleAuth.logout();
    expect(window.location.reload).toHaveBeenCalled();
    expect(removeSession).toHaveBeenCalled();
  });

  it('should get refreshed access token', async () => {
    const refreshSession = jest
      .fn()
      .mockResolvedValue({ accessToken: 'access-token', expiresAt: theFuture });
    const googleAuth = new GoogleAuth({ refreshSession } as any);

    expect(await googleAuth.getAccessToken()).toBe('access-token');
    expect(refreshSession).toBeCalledTimes(1);
  });

  it('should get refreshed id token', async () => {
    const refreshSession = jest
      .fn()
      .mockResolvedValue({ idToken: 'id-token', expiresAt: theFuture });
    const googleAuth = new GoogleAuth({ refreshSession } as any);

    expect(await googleAuth.getIdToken()).toBe('id-token');
    expect(refreshSession).toBeCalledTimes(1);
  });

  it('should get optional id token', async () => {
    const refreshSession = jest
      .fn()
      .mockResolvedValue({ idToken: 'id-token', expiresAt: theFuture });
    const googleAuth = new GoogleAuth({ refreshSession } as any);

    expect(await googleAuth.getIdToken({ optional: true })).toBe('id-token');
    expect(refreshSession).toBeCalledTimes(1);
  });

  it('should not get optional id token', async () => {
    const refreshSession = jest.fn().mockRejectedValue(new Error('NOPE'));
    const googleAuth = new GoogleAuth({ refreshSession } as any);

    expect(await googleAuth.getIdToken({ optional: true })).toBe('');
    expect(refreshSession).toBeCalledTimes(1);
  });

  it('should share popup closed errors', async () => {
    const error = new Error('NOPE');
    error.name = 'RejectedError';
    const createSession = jest.fn().mockRejectedValue(error);
    const refreshSession = jest.fn().mockResolvedValue({
      accessToken: 'access-token',
      expiresAt: theFuture,
      scopes: GoogleScopes.from('not-enough'),
    });
    const googleAuth = new GoogleAuth({ createSession, refreshSession } as any);

    // Make sure we have a session before we do the double request, so that we get past the !this.currentSession check
    await expect(googleAuth.getAccessToken()).resolves.toBe('access-token');

    const promise1 = googleAuth.getAccessToken('more');
    const promise2 = googleAuth.getAccessToken('more');
    await expect(promise1).rejects.toBe(error);
    await expect(promise2).rejects.toBe(error);
    expect(refreshSession).toBeCalledTimes(1);
    expect(createSession).toBeCalledTimes(2);
  });

  it('should wait for all session refreshes', async () => {
    const initialSession = {
      idToken: 'token1',
      expiresAt: theFuture,
      scopes: GoogleScopes.empty(),
    };
    const refreshSession = jest
      .fn()
      .mockResolvedValueOnce(initialSession)
      .mockResolvedValue({
        idToken: 'token2',
        expiresAt: theFuture,
        scopes: GoogleScopes.empty(),
      });
    const googleAuth = new GoogleAuth({ refreshSession } as any);

    // Grab the expired session first
    await expect(googleAuth.getIdToken()).resolves.toBe('token1');
    expect(refreshSession).toBeCalledTimes(1);

    initialSession.expiresAt = thePast;

    const promise1 = googleAuth.getIdToken();
    const promise2 = googleAuth.getIdToken();
    const promise3 = googleAuth.getIdToken();
    await expect(promise1).resolves.toBe('token2');
    await expect(promise2).resolves.toBe('token2');
    await expect(promise3).resolves.toBe('token2');
    expect(refreshSession).toBeCalledTimes(4); // De-duping of session requests happens in client
  });
});
