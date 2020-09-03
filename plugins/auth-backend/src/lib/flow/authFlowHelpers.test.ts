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
import { ensuresXRequestedWith, postMessageResponse } from './authFlowHelpers';
import { WebMessageResponse } from './types';

describe('oauth helpers', () => {
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
          backstageIdentity: {
            id: 'a',
            idToken: 'a.b.c',
          },
        },
      };
      const jsonData = JSON.stringify(data);
      const base64Data = Buffer.from(jsonData, 'utf8').toString('base64');

      postMessageResponse(mockResponse, appOrigin, data);
      expect(mockResponse.setHeader).toBeCalledTimes(3);
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
      expect(mockResponse.setHeader).toBeCalledTimes(3);
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
