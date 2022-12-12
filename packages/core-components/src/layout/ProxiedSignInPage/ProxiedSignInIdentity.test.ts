/*
 * Copyright 2022 The Backstage Authors
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

import { setupRequestMockHandlers } from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  DEFAULTS,
  ProxiedSignInIdentity,
  tokenToExpiry,
} from './ProxiedSignInIdentity';

const validBackstageTokenExpClaim = 1641216199;
const validBackstageToken =
  'eyJhbGciOiJFUzI1NiIsImtpZCI6ImMxNTMzNDRiLWZjYzktNGIwOS1iN2ZhLTU3ZmM5MDhjMjBiNiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjcwMDcvYXBpL2F1dGgiLCJzdWIiOiJmcmViZW4iLCJhdWQiOiJiYWNrc3RhZ2UiLCJpYXQiOjE2NDEyMTI1OTksImV4cCI6MTY0MTIxNjE5OSwiZW50IjpbInVzZXI6ZGVmYXVsdC9mcmViZW4iXX0.4nOTmPHPwhzaKTzikgUsHcszfcP-JamcojMnRfyfsKhyHCCEywe6uLFlvvmK5NbaX5Z7IIji-kg7bxKU58kwoQ';

describe('ProxiedSignInIdentity', () => {
  describe('tokenToExpiry', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('handles undefined', async () => {
      expect(tokenToExpiry(undefined)).toEqual(
        new Date(Date.now() + DEFAULTS.defaultTokenExpiryMillis),
      );
    });

    it('handles a valid token', async () => {
      expect(tokenToExpiry(validBackstageToken)).toEqual(
        new Date(
          validBackstageTokenExpClaim * 1000 - DEFAULTS.tokenExpiryMarginMillis,
        ),
      );
    });

    it('handles a token that has no exp', async () => {
      const [a, _b, c] = validBackstageToken.split('.');
      const botched = `${a}.${window.btoa(JSON.stringify({}))}.${c}`;
      expect(tokenToExpiry(botched)).toEqual(
        new Date(new Date(Date.now() + DEFAULTS.defaultTokenExpiryMillis)),
      );
    });
  });

  describe('ProxiedSignInIdentity', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    const worker = setupServer();
    setupRequestMockHandlers(worker);

    it('runs the happy path', async () => {
      const getBaseUrl = jest.fn();
      const serverCalled = jest.fn();

      function makeToken() {
        const iat = Math.floor(Date.now() / 1000);
        const exp = iat + 3600;
        return {
          providerInfo: {
            stuff: 1,
          },
          profile: {
            email: 'e',
            displayName: 'd',
            picture: 'p',
          },
          backstageIdentity: {
            token: [
              'eyJhbGciOiJFUzI1NiIsImtpZCI6ImMxNTMzNDRiLWZjYzktNGIwOS1iN2ZhLTU3ZmM5MDhjMjBiNiJ9',
              window
                .btoa(
                  JSON.stringify({
                    iss: 'http://localhost:7007/api/auth',
                    sub: 'user:default/freben',
                    aud: 'backstage',
                    iat,
                    exp,
                    ent: ['group:default/my-team'],
                  }),
                )
                .replace(/=/g, ''),
              '4nOTmPHPwhzaKTzikgUsHcszfcP-JamcojMnRfyfsKhyHCCEywe6uLFlvvmK5NbaX5Z7IIji-kg7bxKU58kwoQ',
            ].join('.'),
            identity: {
              type: 'user',
              userEntityRef: 'k:ns/ue',
              ownershipEntityRefs: ['k:ns/oe'],
            },
          },
        };
      }
      worker.events.on('request:match', serverCalled);
      worker.use(
        rest.get('http://example.com/api/auth/foo/refresh', (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(makeToken()),
          ),
        ),
      );

      const identity = new ProxiedSignInIdentity({
        provider: 'foo',
        discoveryApi: { getBaseUrl },
      });

      getBaseUrl.mockResolvedValue('http://example.com/api/auth');

      await identity.start(); // should not throw
      expect(getBaseUrl).toHaveBeenCalledTimes(1);
      expect(getBaseUrl).toHaveBeenLastCalledWith('auth');
      expect(serverCalled).toHaveBeenCalledTimes(1);

      // All information should now be available
      await expect(identity.getBackstageIdentity()).resolves.toEqual({
        type: 'user',
        userEntityRef: 'k:ns/ue',
        ownershipEntityRefs: ['k:ns/oe'],
      });
      await expect(identity.getIdToken()).resolves.toEqual(expect.any(String));
      await expect(identity.getCredentials()).resolves.toEqual({
        token: expect.any(String),
      });
      await expect(identity.getProfileInfo()).resolves.toEqual({
        email: 'e',
        displayName: 'd',
        picture: 'p',
      });
      expect(identity.getUserId()).toBe('ue');
      expect(identity.getProfile()).toEqual({
        email: 'e',
        displayName: 'd',
        picture: 'p',
      });

      await identity.getSessionAsync(); // no need to fetch again just yet
      expect(serverCalled).toHaveBeenCalledTimes(1);

      // Use a fairly large margin (1000) since the iat and exp are clamped to
      // full seconds, but the "local current time" isn't
      jest.advanceTimersByTime(
        3600 * 1000 - DEFAULTS.tokenExpiryMarginMillis - 1000,
      );
      await identity.getSessionAsync(); // still no need to fetch again
      expect(serverCalled).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(1001);
      await identity.getSessionAsync(); // now the expiry has passed
      expect(serverCalled).toHaveBeenCalledTimes(2);
    });

    // dummy response for tests which are only testing the request behaviour
    const dummySessionResponse = {
      providerInfo: {},
      profile: {},
      backstageIdentity: {
        token: '',
        identity: {
          ownershipEntityRefs: [''],
          userEntityRef: '',
          type: 'user',
        },
      },
    };

    it('handles headers passed as a promise', async () => {
      let req1: Request;
      const getBaseUrl = jest.fn();
      const serverCalled = jest.fn().mockImplementation(req => {
        req1 = req;
      });

      worker.events.on('request:match', serverCalled);
      worker.use(
        rest.get('http://example.com/api/auth/foo/refresh', (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(dummySessionResponse),
          ),
        ),
      );

      const getHeaders = jest.fn().mockResolvedValue({ 'x-foo': 'bars' });
      const identity = new ProxiedSignInIdentity({
        provider: 'foo',
        discoveryApi: { getBaseUrl },
        headers: getHeaders,
      });

      getBaseUrl.mockResolvedValue('http://example.com/api/auth');

      await identity.start(); // should not throw
      expect(getBaseUrl).toHaveBeenCalledTimes(1);
      expect(getBaseUrl).toHaveBeenLastCalledWith('auth');
      expect(getHeaders).toHaveBeenCalledTimes(1);
      expect(serverCalled).toHaveBeenCalledTimes(1);

      expect(req1!).not.toBeUndefined();
      // required header should be present
      expect(req1!.headers.get('x-requested-with')).toEqual('XMLHttpRequest');
      // optional header should be present when passed
      expect(req1!.headers.get('x-foo')).toEqual('bars');
    });

    it('handles headers passed as an object', async () => {
      let req1: Request;
      const getBaseUrl = jest.fn();
      const serverCalled = jest.fn().mockImplementation(req => {
        req1 = req;
      });

      worker.events.on('request:match', serverCalled);
      worker.use(
        rest.get('http://example.com/api/auth/foo/refresh', (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(dummySessionResponse),
          ),
        ),
      );

      const identity = new ProxiedSignInIdentity({
        provider: 'foo',
        discoveryApi: { getBaseUrl },
        headers: { 'x-foo': 'bars' },
      });

      getBaseUrl.mockResolvedValue('http://example.com/api/auth');

      await identity.start(); // should not throw
      expect(getBaseUrl).toHaveBeenCalledTimes(1);
      expect(getBaseUrl).toHaveBeenLastCalledWith('auth');
      expect(serverCalled).toHaveBeenCalledTimes(1);

      expect(req1!).not.toBeUndefined();
      // required header should be present
      expect(req1!.headers.get('x-requested-with')).toEqual('XMLHttpRequest');
      // optional header should be present when passed
      expect(req1!.headers.get('x-foo')).toEqual('bars');
    });

    it('handles headers passed as a function', async () => {
      let req1: Request;
      const getBaseUrl = jest.fn();
      const serverCalled = jest.fn().mockImplementation(req => {
        req1 = req;
      });

      worker.events.on('request:match', serverCalled);
      worker.use(
        rest.get('http://example.com/api/auth/foo/refresh', (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(dummySessionResponse),
          ),
        ),
      );

      const getHeaders = jest.fn().mockReturnValue({ 'x-foo': 'bars' });
      const identity = new ProxiedSignInIdentity({
        provider: 'foo',
        discoveryApi: { getBaseUrl },
        headers: getHeaders,
      });

      getBaseUrl.mockResolvedValue('http://example.com/api/auth');

      await identity.start(); // should not throw
      expect(getBaseUrl).toHaveBeenCalledTimes(1);
      expect(getBaseUrl).toHaveBeenLastCalledWith('auth');
      expect(getHeaders).toHaveBeenCalledTimes(1);
      expect(serverCalled).toHaveBeenCalledTimes(1);

      expect(req1!).not.toBeUndefined();
      // required header should be present
      expect(req1!.headers.get('x-requested-with')).toEqual('XMLHttpRequest');
      // optional header should be present when passed
      expect(req1!.headers.get('x-foo')).toEqual('bars');
    });
  });
});
