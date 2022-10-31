/*
 * Copyright 2020 The Backstage Authors
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
import { THOUSAND_DAYS_MS, TEN_MINUTES_MS, OAuthAdapter } from './OAuthAdapter';
import { encodeState } from './helpers';
import { OAuthHandlers, OAuthLogoutRequest, OAuthState } from './types';
import { CookieConfigurer } from '../../providers/types';

const mockResponseData = {
  providerInfo: {
    accessToken: 'ACCESS_TOKEN',
    token: 'ID_TOKEN',
    expiresInSeconds: 10,
    scope: 'email',
  },
  profile: {
    email: 'foo@bar.com',
  },
  backstageIdentity: {
    token:
      'eyblob.eyJzdWIiOiJ1c2VyOmRlZmF1bHQvamltbXltYXJrdW0iLCJlbnQiOlsidXNlcjpkZWZhdWx0L2ppbW15bWFya3VtIl19.eyblob',
  },
};

describe('OAuthAdapter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  class MyAuthProvider implements OAuthHandlers {
    async start() {
      return {
        url: '/url',
        status: 301,
      };
    }
    async handler() {
      return {
        response: mockResponseData,
        refreshToken: 'token',
      };
    }
    async refresh() {
      return {
        response: mockResponseData,
        refreshToken: 'token',
      };
    }
    async logout(_: OAuthLogoutRequest) {}
  }
  const providerInstance = new MyAuthProvider();
  const mockCookieConfig: ReturnType<CookieConfigurer> = {
    domain: 'domain.org',
    path: '/auth/test-provider',
    secure: false,
  };
  const mockCookieConfigurer = jest.fn().mockReturnValue(mockCookieConfig);

  const oAuthProviderOptions = {
    providerId: 'test-provider',
    appOrigin: 'http://localhost:3000',
    baseUrl: 'http://domain.org/auth',
    cookieConfigurer: mockCookieConfigurer,
    tokenIssuer: {
      issueToken: async () => 'my-id-token',
      listPublicKeys: async () => ({ keys: [] }),
    },
    isOriginAllowed: () => false,
    callbackUrl: 'http://domain.org/auth/test-provider/handler/frame',
  };

  it('sets the correct headers in start', async () => {
    const oauthProvider = new OAuthAdapter(
      providerInstance,
      oAuthProviderOptions,
    );
    const mockRequest = {
      query: {
        scope: 'user',
        env: 'development',
      },
    } as unknown as express.Request;

    const mockResponse = {
      cookie: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      statusCode: jest.fn().mockReturnThis(),
    } as unknown as express.Response;

    await oauthProvider.start(mockRequest, mockResponse);
    // nonce cookie checks
    expect(mockResponse.cookie).toHaveBeenCalledTimes(1);
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      `${oAuthProviderOptions.providerId}-nonce`,
      expect.any(String),
      expect.objectContaining({
        httpOnly: true,
        path: '/auth/test-provider/handler',
        maxAge: TEN_MINUTES_MS,
        domain: 'domain.org',
        sameSite: 'lax',
        secure: false,
      }),
    );
    // redirect checks
    expect(mockResponse.setHeader).toHaveBeenCalledTimes(2);
    expect(mockResponse.setHeader).toHaveBeenCalledWith('Location', '/url');
    expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Length', '0');
    expect(mockResponse.statusCode).toEqual(301);
    expect(mockResponse.end).toHaveBeenCalledTimes(1);
  });

  it('sets the refresh cookie if refresh is enabled', async () => {
    const oauthProvider = new OAuthAdapter(providerInstance, {
      ...oAuthProviderOptions,
      isOriginAllowed: () => false,
    });

    const state = { nonce: 'nonce', env: 'development' };
    const mockRequest = {
      cookies: {
        'test-provider-nonce': 'nonce',
      },
      query: {
        state: encodeState(state),
      },
    } as unknown as express.Request;

    const mockResponse = {
      cookie: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
    } as unknown as express.Response;

    await oauthProvider.frameHandler(mockRequest, mockResponse);
    expect(mockCookieConfigurer).toHaveBeenCalledTimes(1);
    expect(mockResponse.cookie).toHaveBeenCalledTimes(1);
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      expect.stringContaining('test-provider-refresh-token'),
      expect.stringContaining('token'),
      expect.objectContaining({
        httpOnly: true,
        path: '/auth/test-provider',
        maxAge: THOUSAND_DAYS_MS,
        domain: 'domain.org',
        secure: false,
        sameSite: 'lax',
      }),
    );
  });

  it('persists scope through cookie if enabled', async () => {
    const handlers = {
      start: jest.fn(async (_req: { state: OAuthState }) => ({
        url: '/url',
        status: 301,
      })),
      handler: jest.fn(async () => ({ response: mockResponseData })),
      refresh: jest.fn(async () => ({ response: mockResponseData })),
    };
    const oauthProvider = new OAuthAdapter(handlers, {
      ...oAuthProviderOptions,
      persistScopes: true,
    });

    // First we test the /start request, making sure state is set
    const mockStartReq = {
      query: {
        scope: 'user',
        env: 'development',
      },
    } as unknown as express.Request;
    const mockStartRes = {
      cookie: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      statusCode: jest.fn().mockReturnThis(),
    } as unknown as express.Response;

    await oauthProvider.start(mockStartReq, mockStartRes);

    expect(handlers.start).toHaveBeenCalledTimes(1);
    expect(handlers.start).toHaveBeenCalledWith({
      query: {
        scope: 'user',
        env: 'development',
      },
      scope: 'user',
      state: {
        nonce: expect.any(String),
        env: 'development',
        origin: undefined,
        scope: 'user',
      },
    });

    // Then test the /handler, making sure the granted scope cookie is set
    const providedState = handlers.start.mock.calls[0][0].state;
    const mockHandleReq = {
      cookies: {
        'test-provider-nonce': providedState.nonce,
      },
      query: {
        state: encodeState(providedState),
      },
    } as unknown as express.Request;
    const mockHandleRes = {
      cookie: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
    } as unknown as express.Response;

    await oauthProvider.frameHandler(mockHandleReq, mockHandleRes);
    expect(mockHandleRes.cookie).toHaveBeenCalledTimes(1);
    expect(mockHandleRes.cookie).toHaveBeenCalledWith(
      'test-provider-granted-scope',
      'user',
      expect.objectContaining({
        httpOnly: true,
        path: '/auth/test-provider',
        maxAge: THOUSAND_DAYS_MS,
        domain: 'domain.org',
        secure: false,
        sameSite: 'lax',
      }),
    );

    // Them make sure scopes are forwarded correctly during refresh
    const mockRefreshReq = {
      query: { scope: 'ignore-me' },
      cookies: {
        'test-provider-granted-scope': 'user',
        'test-provider-refresh-token': 'refresh-token',
      },
      header: jest.fn().mockReturnValue('XMLHttpRequest'),
    } as unknown as express.Request;
    const mockRefreshRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as express.Response;
    await oauthProvider.refresh(mockRefreshReq, mockRefreshRes);
    expect(handlers.refresh).toHaveBeenCalledTimes(1);
    expect(handlers.refresh).toHaveBeenCalledWith(
      expect.objectContaining({
        scope: 'user',
        refreshToken: 'refresh-token',
      }),
    );
  });

  it('removes refresh cookie and calls logout handler when logging out', async () => {
    const logoutSpy = jest.spyOn(providerInstance, 'logout');
    const oauthProvider = new OAuthAdapter(providerInstance, {
      ...oAuthProviderOptions,
      isOriginAllowed: () => false,
    });

    const mockRequest = {
      cookies: {
        'test-provider-refresh-token': 'token',
      },
      header: () => 'XMLHttpRequest',
      get: jest.fn(),
    } as unknown as express.Request;

    const mockResponse = {
      cookie: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as unknown as express.Response;

    await oauthProvider.logout(mockRequest, mockResponse);
    expect(mockRequest.get).toHaveBeenCalledTimes(1);
    expect(logoutSpy).toHaveBeenCalledTimes(1);
    expect(mockResponse.cookie).toHaveBeenCalledTimes(1);
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      expect.stringContaining('test-provider-refresh-token'),
      '',
      expect.objectContaining({ path: '/auth/test-provider' }),
    );
    expect(mockResponse.end).toHaveBeenCalledTimes(1);
  });

  it('gets new access-token when refreshing', async () => {
    const oauthProvider = new OAuthAdapter(providerInstance, {
      ...oAuthProviderOptions,
      isOriginAllowed: () => false,
    });

    const mockRequest = {
      header: () => 'XMLHttpRequest',
      cookies: {
        'test-provider-refresh-token': 'token',
      },
      query: {},
    } as unknown as express.Request;

    const mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as unknown as express.Response;

    await oauthProvider.refresh(mockRequest, mockResponse);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      ...mockResponseData,
      backstageIdentity: {
        token: mockResponseData.backstageIdentity.token,
        identity: {
          type: 'user',
          userEntityRef: 'user:default/jimmymarkum',
          ownershipEntityRefs: ['user:default/jimmymarkum'],
        },
      },
    });
  });

  it('sets new access-token when old cookie exists', async () => {
    const oauthProvider = new OAuthAdapter(providerInstance, {
      ...oAuthProviderOptions,
      isOriginAllowed: () => false,
    });

    const mockRequest = {
      header: () => 'XMLHttpRequest',
      cookies: {
        'test-provider-refresh-token': 'old-token',
      },
      query: {},
      get: jest.fn(),
    } as unknown as express.Request;

    const mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
    } as unknown as express.Response;

    await oauthProvider.refresh(mockRequest, mockResponse);
    expect(mockRequest.get).toHaveBeenCalledTimes(1);
    expect(mockCookieConfigurer).toHaveBeenCalledTimes(1);
    expect(mockResponse.cookie).toHaveBeenCalledTimes(1);
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      'test-provider-refresh-token',
      'token',
      expect.objectContaining({
        httpOnly: true,
        path: '/auth/test-provider',
        maxAge: THOUSAND_DAYS_MS,
        domain: 'domain.org',
        secure: false,
        sameSite: 'lax',
      }),
    );
  });

  it('sets the correct nonce cookie configuration', async () => {
    const config = {
      baseUrl: 'http://domain.org/auth',
      appUrl: 'http://domain.org',
      isOriginAllowed: () => false,
    };

    const oauthProvider = OAuthAdapter.fromConfig(config, providerInstance, {
      ...oAuthProviderOptions,
    });

    const mockRequest = {
      query: {
        scope: 'user',
        env: 'development',
        origin: 'http://domain.org',
      },
    } as unknown as express.Request;

    const mockResponse = {
      cookie: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      statusCode: jest.fn().mockReturnThis(),
    } as unknown as express.Response;

    await oauthProvider.start(mockRequest, mockResponse);
    expect(mockCookieConfigurer).not.toHaveBeenCalled();
    expect(mockResponse.cookie).toHaveBeenCalledTimes(1);
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      `${oAuthProviderOptions.providerId}-nonce`,
      expect.any(String),
      expect.objectContaining({
        httpOnly: true,
        domain: 'domain.org',
        maxAge: TEN_MINUTES_MS,
        path: '/auth/test-provider/handler',
        secure: false,
        sameSite: 'lax',
      }),
    );
  });

  it('sets the correct nonce cookie configuration using origin from request', async () => {
    const config = {
      baseUrl: 'http://domain.org/auth',
      appUrl: 'http://domain.org',
      isOriginAllowed: () => false,
    };

    const oauthProvider = OAuthAdapter.fromConfig(config, providerInstance, {
      ...oAuthProviderOptions,
      callbackUrl: 'https://domain.org/auth/test-provider/handler/frame',
    });

    const mockRequest = {
      query: {
        scope: 'user',
        env: 'development',
        origin: 'http://other.domain',
      },
    } as unknown as express.Request;

    const mockResponse = {
      cookie: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      statusCode: jest.fn().mockReturnThis(),
    } as unknown as express.Response;

    await oauthProvider.start(mockRequest, mockResponse);
    expect(mockCookieConfigurer).not.toHaveBeenCalled();
    expect(mockResponse.cookie).toHaveBeenCalledTimes(1);
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      `${oAuthProviderOptions.providerId}-nonce`,
      expect.any(String),
      expect.objectContaining({
        httpOnly: true,
        domain: 'domain.org',
        maxAge: TEN_MINUTES_MS,
        path: '/auth/test-provider/handler',
        secure: true,
        sameSite: 'none',
      }),
    );
  });

  it('sets the correct cookie configuration using an secure callbackUrl', async () => {
    const config = {
      baseUrl: 'https://domain.org/auth',
      appUrl: 'http://domain.org',
      isOriginAllowed: () => false,
    };

    const oauthProvider = OAuthAdapter.fromConfig(config, providerInstance, {
      ...oAuthProviderOptions,
      callbackUrl: 'https://domain.org/auth/test-provider/handler/frame',
    });

    const state = {
      nonce: 'nonce',
      env: 'development',
    };

    const mockRequest = {
      cookies: {
        'test-provider-nonce': 'nonce',
      },
      query: {
        state: encodeState(state),
      },
    } as unknown as express.Request;

    const mockResponse = {
      cookie: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
    } as unknown as express.Response;

    await oauthProvider.frameHandler(mockRequest, mockResponse);
    expect(mockCookieConfigurer).not.toHaveBeenCalled();
    expect(mockResponse.cookie).toHaveBeenCalledTimes(1);
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      expect.stringContaining('test-provider-refresh-token'),
      expect.stringContaining('token'),
      expect.objectContaining({
        httpOnly: true,
        domain: 'domain.org',
        path: '/auth/test-provider',
        secure: true,
        sameSite: 'lax',
      }),
    );
  });

  it('sets the correct cookie configuration when on different domains and secure', async () => {
    const config = {
      baseUrl: 'https://domain.org/auth',
      appUrl: 'http://domain.org',
      isOriginAllowed: () => false,
    };

    const oauthProvider = OAuthAdapter.fromConfig(config, providerInstance, {
      ...oAuthProviderOptions,
      callbackUrl: 'https://authdomain.org/auth/test-provider/handler/frame',
    });

    const state = {
      nonce: 'nonce',
      env: 'development',
    };

    const mockRequest = {
      cookies: {
        'test-provider-nonce': 'nonce',
      },
      query: {
        state: encodeState(state),
      },
    } as unknown as express.Request;

    const mockResponse = {
      cookie: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
    } as unknown as express.Response;

    await oauthProvider.frameHandler(mockRequest, mockResponse);
    expect(mockCookieConfigurer).not.toHaveBeenCalled();
    expect(mockResponse.cookie).toHaveBeenCalledTimes(1);
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      expect.stringContaining('test-provider-refresh-token'),
      expect.stringContaining('token'),
      expect.objectContaining({
        httpOnly: true,
        domain: 'authdomain.org',
        path: '/auth/test-provider',
        secure: true,
        sameSite: 'none',
      }),
    );
  });

  it('sets the correct cookie configuration using origin from state', async () => {
    const config = {
      baseUrl: 'https://domain.org/auth',
      appUrl: 'http://domain.org',
      isOriginAllowed: () => true,
    };

    const oauthProvider = OAuthAdapter.fromConfig(config, providerInstance, {
      ...oAuthProviderOptions,
      callbackUrl: 'https://domain.org/auth/test-provider/handler/frame',
    });

    const state = {
      nonce: 'nonce',
      env: 'development',
      origin: 'http://other.domain',
    };

    const mockRequest = {
      cookies: {
        'test-provider-nonce': 'nonce',
      },
      query: {
        state: encodeState(state),
      },
    } as unknown as express.Request;

    const mockResponse = {
      cookie: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
    } as unknown as express.Response;

    await oauthProvider.frameHandler(mockRequest, mockResponse);
    expect(mockCookieConfigurer).not.toHaveBeenCalled();
    expect(mockResponse.cookie).toHaveBeenCalledTimes(1);
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      expect.stringContaining('test-provider-refresh-token'),
      expect.stringContaining('token'),
      expect.objectContaining({
        httpOnly: true,
        domain: 'domain.org',
        path: '/auth/test-provider',
        secure: true,
        sameSite: 'none',
      }),
    );
  });

  it('sets the correct cookie configuration using origin from header', async () => {
    const config = {
      baseUrl: 'https://domain.org/auth',
      appUrl: 'http://domain.org',
      isOriginAllowed: () => false,
    };

    const oauthProvider = OAuthAdapter.fromConfig(config, providerInstance, {
      ...oAuthProviderOptions,
      callbackUrl: 'https://domain.org/auth/test-provider/handler/frame',
    });

    const mockRequest = {
      header: () => 'XMLHttpRequest',
      cookies: {
        'test-provider-refresh-token': 'old-token',
      },
      query: {},
      get: jest.fn().mockReturnValue('http://other.domain'),
    } as unknown as express.Request;

    const mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
    } as unknown as express.Response;

    await oauthProvider.refresh(mockRequest, mockResponse);
    expect(mockRequest.get).toHaveBeenCalledTimes(1);
    expect(mockCookieConfigurer).not.toHaveBeenCalled();
    expect(mockResponse.cookie).toHaveBeenCalledTimes(1);
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      'test-provider-refresh-token',
      'token',
      expect.objectContaining({
        httpOnly: true,
        path: '/auth/test-provider',
        maxAge: THOUSAND_DAYS_MS,
        domain: 'domain.org',
        secure: true,
        sameSite: 'none',
      }),
    );
  });
});
