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
import fetch from 'cross-fetch';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  DEFAULTS,
  DelegatedSignInIdentity,
  sleep,
  tokenToExpiryMillis,
} from './DelegatedSignInIdentity';

const flushPromises = () => new Promise(setImmediate);

const validBackstageTokenExpClaim = 1641216199;
const validBackstageToken =
  'eyJhbGciOiJFUzI1NiIsImtpZCI6ImMxNTMzNDRiLWZjYzktNGIwOS1iN2ZhLTU3ZmM5MDhjMjBiNiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjcwMDcvYXBpL2F1dGgiLCJzdWIiOiJmcmViZW4iLCJhdWQiOiJiYWNrc3RhZ2UiLCJpYXQiOjE2NDEyMTI1OTksImV4cCI6MTY0MTIxNjE5OSwiZW50IjpbInVzZXI6ZGVmYXVsdC9mcmViZW4iXX0.4nOTmPHPwhzaKTzikgUsHcszfcP-JamcojMnRfyfsKhyHCCEywe6uLFlvvmK5NbaX5Z7IIji-kg7bxKU58kwoQ';

describe('DelegatedSignInIdentity', () => {
  describe('tokenToExpiryMillis', () => {
    beforeEach(() => jest.useFakeTimers('modern'));
    afterEach(() => jest.useRealTimers());

    it('handles undefined', async () => {
      expect(tokenToExpiryMillis(undefined)).toEqual(
        DEFAULTS.defaultTokenExpiryMillis,
      );
    });

    it('handles a valid token', async () => {
      jest.setSystemTime(
        validBackstageTokenExpClaim * 1000 -
          (3600 + DEFAULTS.tokenExpiryMarginMillis),
      );
      expect(tokenToExpiryMillis(validBackstageToken)).toEqual(3600);
    });
  });

  describe('sleep', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('normally sleeps', async () => {
      const fn = jest.fn();
      sleep(100, new AbortController().signal).then(fn);

      await flushPromises();
      expect(fn).toBeCalledTimes(0);

      jest.advanceTimersByTime(99);
      await flushPromises();
      expect(fn).toBeCalledTimes(0);

      jest.advanceTimersByTime(2);
      await flushPromises();
      expect(fn).toBeCalledTimes(1);
    });

    it('can be aborted', async () => {
      const controller = new AbortController();
      const fn = jest.fn();
      sleep(100, controller.signal).then(fn);

      jest.advanceTimersByTime(50);
      await flushPromises();
      expect(fn).toBeCalledTimes(0);

      controller.abort();
      await flushPromises();
      expect(fn).toBeCalledTimes(1);
    });

    it('reuses the same controller nicely', async () => {
      const controller = new AbortController();

      for (let i = 0; i < 50; ++i) {
        const fn = jest.fn();
        sleep(100, controller.signal).then(fn);

        jest.advanceTimersByTime(99);
        await flushPromises();
        expect(fn).toBeCalledTimes(0);

        jest.advanceTimersByTime(2);
        await flushPromises();
        expect(fn).toBeCalledTimes(1);
      }
    });
  });

  describe('DelegatedSignInIdentity', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    const worker = setupServer();
    setupRequestMockHandlers(worker);

    it('runs the happy path', async () => {
      const getBaseUrl = jest.fn();
      const postError = jest.fn();
      const serverCalled = jest.fn();

      function makeToken() {
        const iat = Math.floor(Date.now() / 1000);
        const exp = iat + 100;
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
            id: 'i',
            token: [
              'eyJhbGciOiJFUzI1NiIsImtpZCI6ImMxNTMzNDRiLWZjYzktNGIwOS1iN2ZhLTU3ZmM5MDhjMjBiNiJ9',
              btoa(
                JSON.stringify({
                  iss: 'http://localhost:7007/api/auth',
                  sub: 'user:default/freben',
                  aud: 'backstage',
                  iat,
                  exp,
                  ent: ['group:default/my-team'],
                }),
              ).replace(/=/g, ''),
              '4nOTmPHPwhzaKTzikgUsHcszfcP-JamcojMnRfyfsKhyHCCEywe6uLFlvvmK5NbaX5Z7IIji-kg7bxKU58kwoQ',
            ].join('.'),
            identity: {
              type: 'user',
              userEntityRef: 'ue',
              ownershipEntityRefs: ['oe'],
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

      const identity = new DelegatedSignInIdentity({
        provider: 'foo',
        discoveryApi: { getBaseUrl },
        errorApi: { post: postError } as any,
        fetchApi: { fetch },
      });

      getBaseUrl.mockResolvedValue('http://example.com/api/auth');

      await identity.start(); // should not throw

      expect(getBaseUrl).toBeCalledTimes(1);
      expect(getBaseUrl).lastCalledWith('auth');
      expect(postError).toBeCalledTimes(0);
      expect(serverCalled).toBeCalledTimes(1);

      // Use a fairly large margin (1000) since the iat and exp are clamped to
      // full seconds, but the "local current time" isn't
      jest.advanceTimersByTime(
        100 * 1000 - DEFAULTS.tokenExpiryMarginMillis - 1000,
      );
      await flushPromises();
      expect(serverCalled).toBeCalledTimes(1);

      jest.advanceTimersByTime(1001);
      await flushPromises();
      expect(serverCalled).toBeCalledTimes(2);
    });
  });
});
