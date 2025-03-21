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
  safelyEncodeURIComponent,
  sendWebMessageResponse,
  type WebMessageResponse,
} from './sendWebMessageResponse';
import { parseWebMessageResponse } from './__testUtils__/parseWebMessageResponse';

describe('oauth helpers', () => {
  describe('safelyEncodeURIComponent', () => {
    it('encodes all occurrences of single quotes', () => {
      expect(safelyEncodeURIComponent("a'ö'b")).toBe('a%27%C3%B6%27b');
    });
  });

  describe('sendWebMessageResponse', () => {
    const appOrigin = 'http://localhost:3000';
    it('should post a message back with payload success', () => {
      const mockResponse = {
        end: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
      } as unknown as express.Response;

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
            token: 'a.b.c',
            identity: {
              type: 'user',
              ownershipEntityRefs: [],
              userEntityRef: 'a',
            },
          },
        },
      };
      const encoded = safelyEncodeURIComponent(JSON.stringify(data));

      sendWebMessageResponse(mockResponse, appOrigin, data);
      expect(mockResponse.setHeader).toHaveBeenCalledTimes(3);
      expect(mockResponse.end).toHaveBeenCalledTimes(1);
      expect(mockResponse.end).toHaveBeenCalledWith(
        expect.stringContaining(encoded),
      );
    });

    it('should post a message back with payload error', () => {
      const mockResponse = {
        end: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
      } as unknown as express.Response;

      const data: WebMessageResponse = {
        type: 'authorization_response',
        error: new Error('Unknown error occurred'),
      };
      const encoded = safelyEncodeURIComponent(
        JSON.stringify({
          type: 'authorization_response',
          error: { name: 'Error', message: 'Unknown error occurred' },
        }),
      );

      sendWebMessageResponse(mockResponse, appOrigin, data);
      expect(mockResponse.setHeader).toHaveBeenCalledTimes(3);
      expect(mockResponse.end).toHaveBeenCalledTimes(1);
      expect(mockResponse.end).toHaveBeenCalledWith(
        expect.stringContaining(encoded),
      );
    });

    it('should call postMessage twice but only one of them with target *', () => {
      let responseBody = '';

      const mockResponse = {
        end: jest.fn(body => {
          responseBody = body;
          return this;
        }),
        setHeader: jest.fn().mockReturnThis(),
      } as unknown as express.Response;

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
            token: 'a.b.c',
            identity: {
              type: 'user',
              ownershipEntityRefs: [],
              userEntityRef: 'a',
            },
          },
        },
      };
      sendWebMessageResponse(mockResponse, appOrigin, data);
      expect(parseWebMessageResponse(responseBody).response).toEqual({
        type: 'authorization_response',
        response: {
          providerInfo: expect.any(Object),
          profile: {
            email: 'foo@bar.com',
          },
          backstageIdentity: expect.any(Object),
        },
      });

      const errData: WebMessageResponse = {
        type: 'authorization_response',
        error: new Error('Unknown error occurred'),
      };
      sendWebMessageResponse(mockResponse, appOrigin, errData);
      expect(parseWebMessageResponse(responseBody).response).toEqual({
        type: 'authorization_response',
        error: {
          name: 'Error',
          message: 'Unknown error occurred',
        },
      });
    });

    it('handles single quotes and unicode chars safely', () => {
      const mockResponse = {
        end: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
      } as unknown as express.Response;

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
            displayName: "Adam l'Hôpital",
          },
          backstageIdentity: {
            token: 'a.b.c',
            identity: {
              type: 'user',
              ownershipEntityRefs: [],
              userEntityRef: 'a',
            },
          },
        },
      };

      sendWebMessageResponse(mockResponse, appOrigin, data);
      expect(mockResponse.setHeader).toHaveBeenCalledTimes(3);
      expect(mockResponse.end).toHaveBeenCalledTimes(1);
      expect(mockResponse.end).toHaveBeenCalledWith(
        expect.stringContaining('Adam%20l%27H%C3%B4pital'),
      );
    });
  });
});
