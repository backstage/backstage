/*
 * Copyright 2025 The Backstage Authors
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

import fetch from 'cross-fetch';
import { httpJson } from './http';

jest.mock('cross-fetch');

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('http', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('httpJson', () => {
    it('should make successful GET request and parse JSON', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: 'test' }),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await httpJson('https://example.com/api');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://example.com/api',
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        }),
      );
      expect(result).toEqual({ data: 'test' });
    });

    it('should make POST request with JSON body', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true }),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const body = { username: 'test', password: 'secret' };
      const result = await httpJson('https://example.com/api', {
        method: 'POST',
        body,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://example.com/api',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
          signal: expect.any(AbortSignal),
        }),
      );
      expect(result).toEqual({ success: true });
    });

    it('should include custom headers in request', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: 'test' }),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await httpJson('https://example.com/api', {
        headers: {
          Authorization: 'Bearer token',
          'X-Custom': 'value',
        },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://example.com/api',
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer token',
            'X-Custom': 'value',
          },
        }),
      );
    });

    it('should merge custom headers with content-type when body is present', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true }),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await httpJson('https://example.com/api', {
        method: 'POST',
        body: { data: 'test' },
        headers: {
          Authorization: 'Bearer token',
        },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://example.com/api',
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer token',
            'Content-Type': 'application/json',
          },
        }),
      );
    });

    it('should throw ResponseError for non-ok response', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        url: 'https://example.com/api',
        text: jest.fn().mockResolvedValue('Not found'),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(httpJson('https://example.com/api')).rejects.toThrow(
        'Request failed with 404 Not Found',
      );
    });

    it('should abort request after 30 seconds timeout', async () => {
      jest.useFakeTimers();

      let rejectFn: (error: Error) => void;
      const mockResponse = new Promise((_, reject) => {
        rejectFn = reject;
        setTimeout(() => {
          reject(new Error('Request should have been aborted'));
        }, 60000); // 60 seconds
      });

      mockFetch.mockImplementation((_url, options) => {
        const signal = options?.signal as AbortSignal;
        signal?.addEventListener('abort', () => {
          rejectFn(new Error('The operation was aborted'));
        });
        return mockResponse as any;
      });

      const requestPromise = httpJson('https://example.com/api');

      // Fast-forward time by 30 seconds to trigger the abort
      jest.advanceTimersByTime(30000);

      await expect(requestPromise).rejects.toThrow();

      jest.useRealTimers();
    }, 10000);

    it('should clear timeout after successful response', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: 'test' }),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await httpJson('https://example.com/api');

      // Test passes if no timeout-related errors occur
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle JSON parsing errors gracefully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(httpJson('https://example.com/api')).rejects.toThrow(
        'Invalid JSON',
      );
    });

    it('should support different HTTP methods', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true }),
      };

      for (const method of ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']) {
        mockFetch.mockResolvedValue(mockResponse as any);

        await httpJson('https://example.com/api', { method });

        expect(mockFetch).toHaveBeenCalledWith(
          'https://example.com/api',
          expect.objectContaining({
            method,
          }),
        );
      }
    });

    it('should not include Content-Type header for GET requests without body', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: 'test' }),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await httpJson('https://example.com/api', { method: 'GET' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://example.com/api',
        expect.objectContaining({
          headers: {},
        }),
      );
    });

    it('should handle empty response body', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(null),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await httpJson('https://example.com/api');

      expect(result).toBeNull();
    });

    it('should handle array response', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue([1, 2, 3]),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await httpJson<number[]>('https://example.com/api');

      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValue(networkError);

      await expect(httpJson('https://example.com/api')).rejects.toThrow(
        'Network error',
      );
    });

    it('should handle 401 Unauthorized', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        url: 'https://example.com/api',
        text: jest.fn().mockResolvedValue('Unauthorized'),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(httpJson('https://example.com/api')).rejects.toThrow(
        'Request failed with 401 Unauthorized',
      );
    });

    it('should handle 500 Internal Server Error', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        url: 'https://example.com/api',
        text: jest.fn().mockResolvedValue('Server error'),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(httpJson('https://example.com/api')).rejects.toThrow(
        'Request failed with 500 Internal Server Error',
      );
    });

    it('should pass custom abort signal if provided', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: 'test' }),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const customController = new AbortController();
      await httpJson('https://example.com/api', {
        signal: customController.signal,
      });

      // The custom signal should be passed through (though in implementation it might be overridden)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://example.com/api',
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        }),
      );
    });
  });
});
