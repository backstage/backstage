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

import express from 'express';
import {
  OAuthAuthenticator,
  OAuthAuthenticatorResult,
  OAuthAuthenticatorScopeOptions,
} from './types';
import { OAuthCookieManager } from './OAuthCookieManager';
import { OAuthState } from './state';
import { CookieScopeManager } from './CookieScopeManager';
import { ConfigReader } from '@backstage/config';

function makeReq(scope?: string): express.Request {
  return {
    query: { scope },
    res: {},
    get: _name => 'https://example.com',
  } as express.Request<any, any, any, any>;
}

const baseOpts = {
  authenticator: {} as OAuthAuthenticator<any, any>,
  cookieManager: {} as OAuthCookieManager,
};

describe('CookieScopeManager', () => {
  it('should work with minimal config', async () => {
    const manager = CookieScopeManager.create({
      authenticator: {} as OAuthAuthenticator<any, any>,
      cookieManager: {} as OAuthCookieManager,
    });

    await expect(manager.start(makeReq())).resolves.toEqual({
      scope: '',
    });
    await expect(manager.start(makeReq('x'))).resolves.toEqual({
      scope: 'x',
    });
    await expect(manager.start(makeReq('x,y'))).resolves.toEqual({
      scope: 'x y',
    });

    await expect(
      manager.handleCallback(makeReq(), {
        result: { session: { scope: 'x,y' } } as OAuthAuthenticatorResult<any>,
        state: {} as OAuthState,
      }),
    ).resolves.toEqual('x y');

    await expect(manager.clear(makeReq())).resolves.toBe(undefined);

    const refresh = await manager.refresh(makeReq('x,y'));
    expect(refresh.scope).toBe('x y');

    await expect(
      refresh.commit({
        session: { scope: 'y,z' },
      } as OAuthAuthenticatorResult<any>),
    ).resolves.toEqual('y z');
  });

  it('should include additional scopes', async () => {
    const manager = CookieScopeManager.create({
      additionalScopes: ['a', 'b'],
      ...baseOpts,
    });

    await expect(manager.start(makeReq())).resolves.toEqual({
      scope: 'a b',
    });
    await expect(manager.start(makeReq('x'))).resolves.toEqual({
      scope: 'x a b',
    });
    await expect(manager.start(makeReq('x,y'))).resolves.toEqual({
      scope: 'x y a b',
    });

    const refresh = await manager.refresh(makeReq('x|y'));
    expect(refresh.scope).toBe('x y a b');

    await expect(
      refresh.commit({
        session: { scope: 'y,z a' },
      } as OAuthAuthenticatorResult<any>),
    ).resolves.toEqual('y z a');
  });

  it('should include additional scopes from config', async () => {
    await expect(
      CookieScopeManager.create({
        additionalScopes: ['a'],
        ...baseOpts,
      }).start(makeReq()),
    ).resolves.toEqual({ scope: 'a' });

    await expect(
      CookieScopeManager.create({
        config: new ConfigReader({ additionalScopes: 'a,b' }),
        additionalScopes: ['c'],
        ...baseOpts,
      }).start(makeReq()),
    ).resolves.toEqual({ scope: 'a b c' });

    await expect(
      CookieScopeManager.create({
        config: new ConfigReader({ additionalScopes: ['a', 'b'] }),
        additionalScopes: ['c'],
        ...baseOpts,
      }).start(makeReq()),
    ).resolves.toEqual({ scope: 'a b c' });
  });

  it('should persist scopes', async () => {
    const setGrantedScopes = jest.fn();
    const removeGrantedScopes = jest.fn();
    const manager = CookieScopeManager.create({
      authenticator: {
        scopes: {
          persist: true,
        } as OAuthAuthenticatorScopeOptions,
      } as OAuthAuthenticator<any, any>,
      cookieManager: {
        getGrantedScopes: () => 'g',
        setGrantedScopes,
        removeGrantedScopes,
      } as unknown as OAuthCookieManager,
    });

    await expect(manager.start(makeReq())).resolves.toEqual({
      scope: 'g',
      scopeState: {
        scope: 'g',
      },
    });
    await expect(manager.start(makeReq('x'))).resolves.toEqual({
      scope: 'x g',
      scopeState: {
        scope: 'x g',
      },
    });

    expect(setGrantedScopes).not.toHaveBeenCalled();
    await expect(
      manager.handleCallback(makeReq(), {
        // The state is prioritized even if scope is present in the result
        result: { session: { scope: 'x,y' } } as OAuthAuthenticatorResult<any>,
        state: { scope: 'x g' } as OAuthState,
        origin: 'https://other.example.com',
      }),
    ).resolves.toEqual('x g');
    expect(setGrantedScopes).toHaveBeenCalledWith(
      expect.anything(),
      'x g',
      'https://other.example.com',
    );
    setGrantedScopes.mockClear();

    expect(removeGrantedScopes).not.toHaveBeenCalled();
    await expect(manager.clear(makeReq())).resolves.toBe(undefined);
    expect(removeGrantedScopes).toHaveBeenCalledWith(
      expect.anything(),
      'https://example.com',
    );

    const refresh = await manager.refresh(makeReq('x,y'));
    expect(refresh.scope).toBe('x y g');

    expect(setGrantedScopes).not.toHaveBeenCalled();
    await expect(
      refresh.commit({
        session: { scope: 'y,z a' },
      } as OAuthAuthenticatorResult<any>),
    ).resolves.toEqual('x y g');
    expect(setGrantedScopes).toHaveBeenCalledWith(
      expect.anything(),
      'x y g',
      'https://example.com',
    );
  });

  it('should signal whether persisted scopes have already been granted when refreshing', async () => {
    const getGrantedScopes = jest.fn();
    const manager = CookieScopeManager.create({
      authenticator: {
        scopes: {
          persist: true,
        } as OAuthAuthenticatorScopeOptions,
      } as OAuthAuthenticator<any, any>,
      cookieManager: {
        getGrantedScopes,
      } as unknown as OAuthCookieManager,
    });

    getGrantedScopes.mockReturnValue('x y');
    await expect(manager.refresh(makeReq('x,y'))).resolves.toEqual({
      scope: 'x y',
      scopeAlreadyGranted: true,
      commit: expect.any(Function),
    });

    getGrantedScopes.mockReturnValueOnce('x y');
    await expect(manager.refresh(makeReq('x'))).resolves.toEqual({
      scope: 'x y',
      scopeAlreadyGranted: true,
      commit: expect.any(Function),
    });

    getGrantedScopes.mockReturnValueOnce('x y');
    await expect(manager.refresh(makeReq('x,y,z'))).resolves.toEqual({
      scope: 'x y z',
      scopeAlreadyGranted: false,
      commit: expect.any(Function),
    });

    getGrantedScopes.mockReturnValueOnce('');
    await expect(manager.refresh(makeReq('x,y'))).resolves.toEqual({
      scope: 'x y',
      scopeAlreadyGranted: false,
      commit: expect.any(Function),
    });

    getGrantedScopes.mockReturnValueOnce(undefined);
    await expect(manager.refresh(makeReq('x,y'))).resolves.toEqual({
      scope: 'x y',
      scopeAlreadyGranted: false,
      commit: expect.any(Function),
    });
  });

  it('should use custom scope transform', async () => {
    const manager = CookieScopeManager.create({
      additionalScopes: ['b'],
      authenticator: {
        scopes: {
          persist: true,
          required: ['a'],
          transform: ({ required, additional, requested, granted }) =>
            new Set([
              ...[...requested].map(s => `requested-${s}`),
              ...[...granted].map(s => `granted-${s}`),
              ...[...required].map(s => `required-${s}`),
              ...[...additional].map(s => `additional-${s}`),
            ]),
        } as OAuthAuthenticatorScopeOptions,
      } as OAuthAuthenticator<any, any>,
      cookieManager: {
        getGrantedScopes: _req => 'g',
        setGrantedScopes: (_req, _scope, _origin) => {},
      } as OAuthCookieManager,
    });

    await expect(manager.start(makeReq())).resolves.toEqual({
      scope: 'granted-g required-a additional-b',
      scopeState: {
        scope: 'granted-g required-a additional-b',
      },
    });
    await expect(manager.start(makeReq('x'))).resolves.toEqual({
      scope: 'requested-x granted-g required-a additional-b',
      scopeState: {
        scope: 'requested-x granted-g required-a additional-b',
      },
    });

    const refresh = await manager.refresh(makeReq('x,y'));
    expect(refresh.scope).toBe(
      'requested-x requested-y granted-g required-a additional-b',
    );

    await expect(
      refresh.commit({
        session: { scope: 'y,z a' },
      } as OAuthAuthenticatorResult<any>),
    ).resolves.toEqual(
      'requested-x requested-y granted-g required-a additional-b',
    );
  });

  it('should fail on invalid input', async () => {
    const manager = CookieScopeManager.create({
      authenticator: {
        scopes: {
          persist: true,
        } as OAuthAuthenticatorScopeOptions,
      } as OAuthAuthenticator<any, any>,
      cookieManager: {} as OAuthCookieManager,
    });

    await expect(
      manager.handleCallback(makeReq(), {
        result: { session: { scope: 'x,y' } } as OAuthAuthenticatorResult<any>,
        state: {} as OAuthState,
      }),
    ).rejects.toThrow('No scope found in OAuth state');

    await expect(manager.clear({} as express.Request)).rejects.toThrow(
      'No response object found in request',
    );
  });
});
