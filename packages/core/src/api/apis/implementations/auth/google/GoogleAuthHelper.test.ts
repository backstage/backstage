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

import GoogleAuthHelper from './GoogleAuthHelper';
import GoogleScopes from './GoogleScopes';
import MockOAuthApi from '../../OAuthRequestManager/MockOAuthApi';

const anyFetch = fetch as any;

describe('GoogleAuthHelper', () => {
  afterEach(() => {
    jest.resetAllMocks();
    anyFetch.resetMocks();
  });

  it('should refresh a session', async () => {
    anyFetch.mockResponseOnce(
      JSON.stringify({
        idToken: 'mock-id-token',
        accessToken: 'mock-access-token',
        scopes: 'a b c',
        expiresInSeconds: '60',
      }),
    );

    const helper = new GoogleAuthHelper(
      { apiOrigin: 'my-origin', dev: false },
      new MockOAuthApi(),
    );
    const session = await helper.refreshSession();
    expect(session.idToken).toBe('mock-id-token');
    expect(session.accessToken).toBe('mock-access-token');
    expect(session.scopes.hasScopes('a b c')).toBe(true);
    expect(session.expiresAt.getTime()).toBeLessThan(Date.now() + 70000);
    expect(session.expiresAt.getTime()).toBeGreaterThan(Date.now() + 50000);
  });

  it('should handle failure to refresh session', async () => {
    anyFetch.mockRejectOnce(new Error('Network NOPE'));

    const helper = new GoogleAuthHelper(
      { apiOrigin: 'my-origin', dev: true },
      new MockOAuthApi(),
    );
    await expect(helper.refreshSession()).rejects.toThrow(
      'Auth refresh request failed, Error: Network NOPE',
    );
  });

  it('should handle failure response when refreshing session', async () => {
    anyFetch.mockResponseOnce({}, { status: 401, statusText: 'NOPE' });

    const helper = new GoogleAuthHelper(
      { apiOrigin: 'my-origin', dev: false },
      new MockOAuthApi(),
    );
    await expect(helper.refreshSession()).rejects.toThrow(
      'Auth refresh request failed with status NOPE',
    );
  });

  it('should fail if popup was rejected', async () => {
    const mockOauth = new MockOAuthApi();
    const helper = new GoogleAuthHelper(
      { apiOrigin: 'my-origin', dev: false },
      mockOauth,
    );
    const promise = helper.createSession('a b');
    await mockOauth.rejectAll();
    await expect(promise).rejects.toMatchObject({ name: 'RejectedError' });
  });

  it('should create a session', async () => {
    const mockOauth = new MockOAuthApi({
      idToken: 'my-id-token',
      accessToken: 'my-access-token',
      scopes: 'a b',
      expiresInSeconds: 3600,
    });
    const popupSpy = jest.spyOn(mockOauth, 'showLoginPopup');
    const helper = new GoogleAuthHelper(
      { apiOrigin: 'my-origin', dev: false },
      mockOauth,
    );

    const sessionPromise = helper.createSession('a b');

    await mockOauth.triggerAll();

    expect(popupSpy).toBeCalledTimes(1);
    expect(popupSpy.mock.calls[0][0]).toMatchObject({
      url:
        'my-origin/api/backend/auth/start?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fa%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fb',
    });

    await expect(sessionPromise).resolves.toEqual({
      idToken: 'my-id-token',
      accessToken: 'my-access-token',
      scopes: expect.any(GoogleScopes),
      expiresAt: expect.any(Date),
    });
  });
});
