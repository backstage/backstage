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

import express from 'express';
import {
  ensuresXRequestedWith,
  postMessageResponse,
  THOUSAND_DAYS_MS,
  TEN_MINUTES_MS,
  verifyNonce,
  OAuthProvider,
} from './OAuthProvider';
import {
  WebMessageResponse,
  OAuthProviderHandlers,
  OAuthResponse,
} from '../providers/types';

const mockResponseData: OAuthResponse = {
  providerInfo: {
    accessToken: 'ACCESS_TOKEN',
    idToken: 'ID_TOKEN',
    expiresInSeconds: 10,
    scope: 'email',
  },
  profile: {
    email: 'foo@bar.com',
  },
};

describe('OAuthProvider Utils', () => {
  describe('verifyNonce', () => {
    it('should throw error if cookie nonce missing', () => {
      const mockRequest = ({
        cookies: {},
        query: {
          state: 'NONCE',
        },
      } as unknown) as express.Request;
      expect(() => {
        verifyNonce(mockRequest, 'providera');
      }).toThrowError('Missing nonce');
    });

    it('should throw error if state nonce missing', () => {
      const mockRequest = ({
        cookies: {
          'providera-nonce': 'NONCE',
        },
        query: {},
      } as unknown) as express.Request;
      expect(() => {
        verifyNonce(mockRequest, 'providera');
      }).toThrowError('Missing nonce');
    });

    it('should throw error if nonce mismatch', () => {
      const mockRequest = ({
        cookies: {
          'providera-nonce': 'NONCEA',
        },
        query: {
          state: 'NONCEB',
        },
      } as unknown) as express.Request;
      expect(() => {
        verifyNonce(mockRequest, 'providera');
      }).toThrowError('Invalid nonce');
    });

    it('should not throw any error if nonce matches', () => {
      const mockRequest = ({
        cookies: {
          'providera-nonce': 'NONCE',
        },
        query: {
          state: 'NONCE',
        },
      } as unknown) as express.Request;
      expect(() => {
        verifyNonce(mockRequest, 'providera');
      }).not.toThrow();
    });
  });

  describe('postMessageResponse', () => {
    const appOrigin = 'http://localhost:3000';
    it('should post a message back with payload success', () => {
      const mockResponse = ({
        end: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
      } as unknown) as express.Response;

      const data: WebMessageResponse = {
        type: 'authorization_response',
        response: {
          providerInfo: {
            accessToken: 'ACCESS_TOKEN',
            idToken: 'ID_TOKEN',
            expiresInSeconds: 10,
            scope: 'email',
          },
          profile: {
            email: 'foo@bar.com',
          },
          userIdToken: 'a.b.c',
        },
      };
      const jsonData = JSON.stringify(data);
      const base64Data = Buffer.from(jsonData, 'utf8').toString('base64');

      postMessageResponse(mockResponse, appOrigin, data);
      expect(mockResponse.setHeader).toBeCalledTimes(2);
      expect(mockResponse.end).toBeCalledTimes(1);
      expect(mockResponse.end).toBeCalledWith(
        expect.stringContaining(base64Data),
      );
    });

    it('should post a message back with payload error', () => {
      const mockResponse = ({
        end: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
      } as unknown) as express.Response;

      const data: WebMessageResponse = {
        type: 'authorization_response',
        error: new Error('Unknown error occured'),
      };
      const jsonData = JSON.stringify(data);
      const base64Data = Buffer.from(jsonData, 'utf8').toString('base64');

      postMessageResponse(mockResponse, appOrigin, data);
      expect(mockResponse.setHeader).toBeCalledTimes(2);
      expect(mockResponse.end).toBeCalledTimes(1);
      expect(mockResponse.end).toBeCalledWith(
        expect.stringContaining(base64Data),
      );
    });
  });

  describe('ensuresXRequestedWith', () => {
    it('should return false if no header present', () => {
      const mockRequest = ({
        header: () => jest.fn(),
      } as unknown) as express.Request;
      expect(ensuresXRequestedWith(mockRequest)).toBe(false);
    });

    it('should return false if header present with incorrect value', () => {
      const mockRequest = ({
        header: () => 'INVALID',
      } as unknown) as express.Request;
      expect(ensuresXRequestedWith(mockRequest)).toBe(false);
    });

    it('should return true if header present with correct value', () => {
      const mockRequest = ({
        header: () => 'XMLHttpRequest',
      } as unknown) as express.Request;
      expect(ensuresXRequestedWith(mockRequest)).toBe(true);
    });
  });
});

describe('OAuthProvider', () => {
  class MyAuthProvider implements OAuthProviderHandlers {
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
      return mockResponseData;
    }
  }
  const providerInstance = new MyAuthProvider();
  const oAuthProviderOptions = {
    providerId: 'test-provider',
    secure: false,
    disableRefresh: true,
    baseUrl: 'http://localhost:7000/auth',
    appOrigin: 'http://localhost:3000',
    tokenIssuer: {
      issueToken: async () => 'my-id-token',
      listPublicKeys: async () => ({ keys: [] }),
    },
  };

  it('sets the correct headers in start', async () => {
    const oauthProvider = new OAuthProvider(
      providerInstance,
      oAuthProviderOptions,
    );
    const mockRequest = ({
      query: {
        scope: 'user',
      },
    } as unknown) as express.Request;

    const mockResponse = ({
      cookie: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      statusCode: jest.fn().mockReturnThis(),
    } as unknown) as express.Response;

    await oauthProvider.start(mockRequest, mockResponse);
    // nonce cookie checks
    expect(mockResponse.cookie).toBeCalledTimes(1);
    expect(mockResponse.cookie).toBeCalledWith(
      `${oAuthProviderOptions.providerId}-nonce`,
      expect.any(String),
      expect.objectContaining({ maxAge: TEN_MINUTES_MS }),
    );
    // redirect checks
    expect(mockResponse.setHeader).toHaveBeenCalledTimes(2);
    expect(mockResponse.setHeader).toHaveBeenCalledWith('Location', '/url');
    expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Length', '0');
    expect(mockResponse.statusCode).toEqual(301);
    expect(mockResponse.end).toHaveBeenCalledTimes(1);
  });

  it('sets the refresh cookie if refresh is enabled', async () => {
    const oauthProvider = new OAuthProvider(providerInstance, {
      ...oAuthProviderOptions,
      disableRefresh: false,
    });

    const mockRequest = ({
      cookies: {
        'test-provider-nonce': 'nonce',
      },
      query: {
        state: 'nonce',
      },
    } as unknown) as express.Request;

    const mockResponse = ({
      cookie: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
    } as unknown) as express.Response;

    await oauthProvider.frameHandler(mockRequest, mockResponse);
    expect(mockResponse.cookie).toHaveBeenCalledTimes(1);
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      expect.stringContaining('test-provider-refresh-token'),
      expect.stringContaining('token'),
      expect.objectContaining({
        path: '/auth/test-provider',
        maxAge: THOUSAND_DAYS_MS,
      }),
    );
  });

  it('does not set the refresh cookie if refresh is disabled', async () => {
    const oauthProvider = new OAuthProvider(providerInstance, {
      ...oAuthProviderOptions,
      disableRefresh: true,
    });

    const mockRequest = ({
      cookies: {
        'test-provider-nonce': 'nonce',
      },
      query: {
        state: 'nonce',
      },
    } as unknown) as express.Request;

    const mockResponse = ({
      cookie: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
    } as unknown) as express.Response;

    await oauthProvider.frameHandler(mockRequest, mockResponse);
    expect(mockResponse.cookie).toHaveBeenCalledTimes(0);
  });

  it('removes refresh cookie when logging out', async () => {
    const oauthProvider = new OAuthProvider(providerInstance, {
      ...oAuthProviderOptions,
      disableRefresh: false,
    });

    const mockRequest = ({
      header: () => 'XMLHttpRequest',
    } as unknown) as express.Request;

    const mockResponse = ({
      cookie: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown) as express.Response;

    await oauthProvider.logout(mockRequest, mockResponse);
    expect(mockResponse.cookie).toHaveBeenCalledTimes(1);
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      expect.stringContaining('test-provider-refresh-token'),
      '',
      expect.objectContaining({ path: '/auth/test-provider' }),
    );
  });

  it('gets new access-token when refreshing', async () => {
    oAuthProviderOptions.disableRefresh = false;
    const oauthProvider = new OAuthProvider(providerInstance, {
      ...oAuthProviderOptions,
      disableRefresh: false,
    });

    const mockRequest = ({
      header: () => 'XMLHttpRequest',
      cookies: {
        'test-provider-refresh-token': 'token',
      },
      query: {},
    } as unknown) as express.Request;

    const mockResponse = ({
      send: jest.fn().mockReturnThis(),
    } as unknown) as express.Response;

    await oauthProvider.refresh(mockRequest, mockResponse);
    expect(mockResponse.send).toHaveBeenCalledTimes(1);
    expect(mockResponse.send).toHaveBeenCalledWith({
      ...mockResponseData,
      userIdToken: 'my-id-token',
    });
  });

  it('handles refresh without capabilities', async () => {
    const oauthProvider = new OAuthProvider(providerInstance, {
      ...oAuthProviderOptions,
      disableRefresh: true,
    });

    const mockRequest = ({
      header: () => 'XMLHttpRequest',
      cookies: {
        'test-provider-refresh-token': 'token',
      },
      query: {},
    } as unknown) as express.Request;

    const mockResponse = ({
      send: jest.fn().mockReturnThis(),
    } as unknown) as express.Response;

    await oauthProvider.refresh(mockRequest, mockResponse);
    expect(mockResponse.send).toHaveBeenCalledTimes(1);
    expect(mockResponse.send).toHaveBeenCalledWith(
      'Refresh token not supported for provider: test-provider',
    );
  });
});
