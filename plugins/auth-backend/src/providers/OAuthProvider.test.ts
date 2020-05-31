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
  removeRefreshTokenCookie,
  setRefreshTokenCookie,
  THOUSAND_DAYS_MS,
  setNonceCookie,
  TEN_MINUTES_MS,
  verifyNonce,
} from './OAuthProvider';
import { AuthResponse } from './types';

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

  describe('setNonceCookie', () => {
    it('should set nonce cookie', () => {
      const mockResponse = ({
        cookie: jest.fn().mockReturnThis(),
      } as unknown) as express.Response;
      setNonceCookie(mockResponse, 'providera');
      expect(mockResponse.cookie).toBeCalledTimes(1);
      expect(mockResponse.cookie).toBeCalledWith(
        'providera-nonce',
        expect.any(String),
        expect.objectContaining({ maxAge: TEN_MINUTES_MS }),
      );
    });
  });

  describe('setRefreshTokenCookie', () => {
    it('should set refresh token cookie', () => {
      const mockResponse = ({
        cookie: jest.fn().mockReturnThis(),
      } as unknown) as express.Response;
      setRefreshTokenCookie(mockResponse, 'providera', 'REFRESH_TOKEN');
      expect(mockResponse.cookie).toBeCalledTimes(1);
      expect(mockResponse.cookie).toBeCalledWith(
        'providera-refresh-token',
        'REFRESH_TOKEN',
        expect.objectContaining({ maxAge: THOUSAND_DAYS_MS }),
      );
    });
  });

  describe('removeRefreshTokenCookie', () => {
    it('should remove refresh token cookie', () => {
      const mockResponse = ({
        cookie: jest.fn().mockReturnThis(),
      } as unknown) as express.Response;
      removeRefreshTokenCookie(mockResponse, 'providera');
      expect(mockResponse.cookie).toBeCalledTimes(1);
      expect(mockResponse.cookie).toBeCalledWith(
        'providera-refresh-token',
        '',
        expect.objectContaining({ maxAge: 0 }),
      );
    });
  });

  describe('postMessageResponse', () => {
    it('should post a message back with payload success', () => {
      const mockResponse = ({
        end: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
      } as unknown) as express.Response;

      const data: AuthResponse = {
        type: 'auth-result',
        payload: {
          accessToken: 'ACCESS_TOKEN',
          idToken: 'ID_TOKEN',
          expiresInSeconds: 10,
          scope: 'email',
        },
      };
      const jsonData = JSON.stringify(data);
      const base64Data = Buffer.from(jsonData, 'utf8').toString('base64');

      postMessageResponse(mockResponse, data);
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

      const data: AuthResponse = {
        type: 'auth-result',
        error: new Error('Unknown error occured'),
      };
      const jsonData = JSON.stringify(data);
      const base64Data = Buffer.from(jsonData, 'utf8').toString('base64');

      postMessageResponse(mockResponse, data);
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
