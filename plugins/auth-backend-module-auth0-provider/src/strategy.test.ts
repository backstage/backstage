/*
 * Copyright 2026 The Backstage Authors
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

import { Auth0Strategy } from './strategy';
import { InputError } from '@backstage/errors';
import express from 'express';

jest.mock('passport-auth0', () => {
  class MockAuth0Strategy {
    authenticate() {}
    authorizationParams() {
      return {};
    }
  }
  return { __esModule: true, default: MockAuth0Strategy };
});

describe('Auth0Strategy', () => {
  const defaultOptions = {
    clientID: 'test-client-id',
    clientSecret: 'test-client-secret',
    callbackURL: 'http://localhost/callback',
    domain: 'test.auth0.com',
    passReqToCallback: true as const,
    store: {
      store(_req: express.Request, cb: any) {
        cb(null, null);
      },
      verify(_req: express.Request, _state: string, cb: any) {
        cb(null, true);
      },
    },
  };

  const noopVerify = () => {};

  function createRequest(query: Record<string, string> = {}): express.Request {
    return { query } as unknown as express.Request;
  }

  describe('authenticate', () => {
    it('forwards organization and invitation from req.query', () => {
      const strategy = new Auth0Strategy(defaultOptions, noopVerify);
      const superAuth = jest.spyOn(
        Object.getPrototypeOf(Object.getPrototypeOf(strategy)),
        'authenticate',
      );

      const req = createRequest({
        organization: 'org_abc',
        invitation: 'uinv_123',
      });

      strategy.authenticate(req, { scope: 'openid' });

      expect(superAuth).toHaveBeenCalledWith(req, {
        scope: 'openid',
        organization: 'org_abc',
        invitation: 'uinv_123',
      });
    });

    it('forwards screen_hint and login_hint from req.query', () => {
      const strategy = new Auth0Strategy(defaultOptions, noopVerify);
      const superAuth = jest.spyOn(
        Object.getPrototypeOf(Object.getPrototypeOf(strategy)),
        'authenticate',
      );

      const req = createRequest({
        screen_hint: 'signup',
        login_hint: 'user@example.com',
      });

      strategy.authenticate(req, { scope: 'openid' });

      expect(superAuth).toHaveBeenCalledWith(req, {
        scope: 'openid',
        screen_hint: 'signup',
        login_hint: 'user@example.com',
      });
    });

    it('does not include absent query params', () => {
      const strategy = new Auth0Strategy(defaultOptions, noopVerify);
      const superAuth = jest.spyOn(
        Object.getPrototypeOf(Object.getPrototypeOf(strategy)),
        'authenticate',
      );

      const req = createRequest({});

      strategy.authenticate(req, { scope: 'openid' });

      expect(superAuth).toHaveBeenCalledWith(req, { scope: 'openid' });
    });

    it('throws InputError on organization mismatch', () => {
      const strategy = new Auth0Strategy(
        { ...defaultOptions, organization: 'org_configured' },
        noopVerify,
      );

      const req = createRequest({ organization: 'org_different' });

      expect(() => strategy.authenticate(req, {})).toThrow(InputError);
    });

    it('allows matching organization', () => {
      const strategy = new Auth0Strategy(
        { ...defaultOptions, organization: 'org_abc' },
        noopVerify,
      );
      const superAuth = jest.spyOn(
        Object.getPrototypeOf(Object.getPrototypeOf(strategy)),
        'authenticate',
      );

      const req = createRequest({ organization: 'org_abc' });

      strategy.authenticate(req, {});

      expect(superAuth).toHaveBeenCalledWith(req, { organization: 'org_abc' });
    });
  });

  describe('authorizationParams', () => {
    it('includes organization from config when not in options', () => {
      const strategy = new Auth0Strategy(
        { ...defaultOptions, organization: 'org_configured' },
        noopVerify,
      );

      const params = strategy.authorizationParams({});

      expect(params.organization).toBe('org_configured');
    });

    it('prefers organization from options over config', () => {
      const strategy = new Auth0Strategy(
        { ...defaultOptions, organization: 'org_configured' },
        noopVerify,
      );

      const params = strategy.authorizationParams({
        organization: 'org_override',
      });

      expect(params.organization).toBe('org_override');
    });

    it('forwards invitation', () => {
      const strategy = new Auth0Strategy(defaultOptions, noopVerify);

      const params = strategy.authorizationParams({
        invitation: 'uinv_123',
      });

      expect(params.invitation).toBe('uinv_123');
    });

    it('forwards screen_hint', () => {
      const strategy = new Auth0Strategy(defaultOptions, noopVerify);

      const params = strategy.authorizationParams({
        screen_hint: 'signup',
      });

      expect(params.screen_hint).toBe('signup');
    });

    it('forwards login_hint', () => {
      const strategy = new Auth0Strategy(defaultOptions, noopVerify);

      const params = strategy.authorizationParams({
        login_hint: 'user@example.com',
      });

      expect(params.login_hint).toBe('user@example.com');
    });

    it('does not include absent params', () => {
      const strategy = new Auth0Strategy(defaultOptions, noopVerify);

      const params = strategy.authorizationParams({});

      expect(params).toEqual({});
    });

    it('forwards all params together', () => {
      const strategy = new Auth0Strategy(
        { ...defaultOptions, organization: 'org_abc' },
        noopVerify,
      );

      const params = strategy.authorizationParams({
        invitation: 'uinv_123',
        screen_hint: 'signup',
        login_hint: 'user@example.com',
      });

      expect(params).toEqual({
        organization: 'org_abc',
        invitation: 'uinv_123',
        screen_hint: 'signup',
        login_hint: 'user@example.com',
      });
    });
  });
});
