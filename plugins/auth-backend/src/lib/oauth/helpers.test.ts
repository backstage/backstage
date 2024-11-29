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
import {
  verifyNonce,
  encodeState,
  readState,
  defaultCookieConfigurer,
} from './helpers';

describe('OAuthProvider Utils', () => {
  describe('encodeState', () => {
    it('should serialized values', () => {
      const state = {
        nonce: '123',
        env: 'development',
        origin: 'https://example.com',
      };

      const encoded = encodeState(state);
      expect(encoded).toBe(
        Buffer.from(
          'nonce=123&env=development&origin=https%3A%2F%2Fexample.com',
        ).toString('hex'),
      );

      expect(readState(encoded)).toEqual(state);
    });

    it('should not include undefined values', () => {
      const state = { nonce: '123', env: 'development', origin: undefined };

      const encoded = encodeState(state);
      expect(encoded).toBe(
        Buffer.from('nonce=123&env=development').toString('hex'),
      );

      expect(readState(encoded)).toEqual(state);
    });
  });

  describe('verifyNonce', () => {
    it('should throw error if cookie nonce missing', () => {
      const state = { nonce: 'NONCE', env: 'development' };
      const mockRequest = {
        cookies: {},
        query: {
          state: encodeState(state),
        },
      } as unknown as express.Request;
      expect(() => {
        verifyNonce(mockRequest, 'providera');
      }).toThrow('Auth response is missing cookie nonce');
    });

    it('should throw error if state nonce missing', () => {
      const mockRequest = {
        cookies: {
          'providera-nonce': 'NONCE',
        },
        query: {},
      } as unknown as express.Request;
      expect(() => {
        verifyNonce(mockRequest, 'providera');
      }).toThrow('OAuth state is invalid, missing env');
    });

    it('should throw error if nonce mismatch', () => {
      const state = { nonce: 'NONCEB', env: 'development' };
      const mockRequest = {
        cookies: {
          'providera-nonce': 'NONCEA',
        },
        query: {
          state: encodeState(state),
        },
      } as unknown as express.Request;
      expect(() => {
        verifyNonce(mockRequest, 'providera');
      }).toThrow('Invalid nonce');
    });

    it('should not throw any error if nonce matches', () => {
      const state = { nonce: 'NONCE', env: 'development' };
      const mockRequest = {
        cookies: {
          'providera-nonce': 'NONCE',
        },
        query: {
          state: encodeState(state),
        },
      } as unknown as express.Request;
      expect(() => {
        verifyNonce(mockRequest, 'providera');
      }).not.toThrow();
    });
  });

  describe('defaultCookieConfigurer', () => {
    it('should set the correct domain and path for a base url', () => {
      expect(
        defaultCookieConfigurer({
          baseUrl: '',
          providerId: 'test-provider',
          callbackUrl: 'http://domain.org/auth',
          appOrigin: 'http://domain.org',
        }),
      ).toMatchObject({
        domain: 'domain.org',
        path: '/auth/test-provider',
        secure: false,
      });
    });

    it('should set the correct domain and path for a url containing a frame handler', () => {
      expect(
        defaultCookieConfigurer({
          baseUrl: '',
          providerId: 'test-provider',
          callbackUrl: 'http://domain.org/auth/test-provider/handler/frame',
          appOrigin: 'http://domain.org',
        }),
      ).toMatchObject({
        domain: 'domain.org',
        path: '/auth/test-provider',
        secure: false,
      });
    });

    it('should set the secure flag if url is using https', () => {
      expect(
        defaultCookieConfigurer({
          baseUrl: '',
          providerId: 'test-provider',
          callbackUrl: 'https://domain.org/auth',
          appOrigin: 'http://domain.org',
        }),
      ).toMatchObject({
        secure: true,
      });
    });

    it('should set sameSite to lax for https on the same domain', () => {
      expect(
        defaultCookieConfigurer({
          baseUrl: '',
          providerId: 'test-provider',
          callbackUrl: 'https://domain.org/auth',
          appOrigin: 'http://domain.org',
        }),
      ).toMatchObject({
        sameSite: 'lax',
        secure: true,
      });
    });

    it('should set sameSite to lax for http on the same domain', () => {
      expect(
        defaultCookieConfigurer({
          baseUrl: '',
          providerId: 'test-provider',
          callbackUrl: 'http://domain.org/auth',
          appOrigin: 'http://domain.org',
        }),
      ).toMatchObject({
        sameSite: 'lax',
        secure: false,
      });
    });

    it('should set sameSite to lax if not secure and on different domains', () => {
      expect(
        defaultCookieConfigurer({
          baseUrl: '',
          providerId: 'test-provider',
          callbackUrl: 'http://authdomain.org/auth',
          appOrigin: 'http://domain.org',
        }),
      ).toMatchObject({
        sameSite: 'lax',
        secure: false,
      });
    });

    it('should set sameSite to none if secure and on different domains', () => {
      expect(
        defaultCookieConfigurer({
          baseUrl: '',
          providerId: 'test-provider',
          callbackUrl: 'https://authdomain.org/auth',
          appOrigin: 'http://domain.org',
        }),
      ).toMatchObject({
        sameSite: 'none',
        secure: true,
      });
    });
  });
});
