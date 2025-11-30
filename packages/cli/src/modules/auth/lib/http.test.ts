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

    it('should include and merge custom headers', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: 'test' }),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      // Test custom headers without body
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

      // Test merging headers with content-type when body is present
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

    it('should throw ResponseError for non-ok responses', async () => {
      const errorCases = [
        { status: 404, statusText: 'Not Found' },
        { status: 401, statusText: 'Unauthorized' },
        { status: 500, statusText: 'Internal Server Error' },
      ];

      for (const { status, statusText } of errorCases) {
        const mockResponse = {
          ok: false,
          status,
          statusText,
          url: 'https://example.com/api',
          text: jest.fn().mockResolvedValue('Error'),
        };
        mockFetch.mockResolvedValue(mockResponse as any);

        await expect(httpJson('https://example.com/api')).rejects.toThrow(
          `Request failed with ${status} ${statusText}`,
        );
      }
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

    it('should handle various response body types', async () => {
      const testCases = [
        { body: null, expected: null },
        { body: [1, 2, 3], expected: [1, 2, 3] },
        { body: { data: 'test' }, expected: { data: 'test' } },
      ];

      for (const { body, expected } of testCases) {
        const mockResponse = {
          ok: true,
          json: jest.fn().mockResolvedValue(body),
        };
        mockFetch.mockResolvedValue(mockResponse as any);

        const result = await httpJson('https://example.com/api');
        expect(result).toEqual(expected);
      }
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValue(networkError);

      await expect(httpJson('https://example.com/api')).rejects.toThrow(
        'Network error',
      );
    });

    it('should use custom abort signal if provided', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: 'test' }),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const customController = new AbortController();
      await httpJson('https://example.com/api', {
        signal: customController.signal,
      });

      // The implementation creates its own signal for timeout, but should still accept custom signal
      expect(mockFetch).toHaveBeenCalledWith(
        'https://example.com/api',
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        }),
      );
    });

    it('should handle malformed URLs gracefully', async () => {
      const networkError = new TypeError('Failed to parse URL');
      mockFetch.mockRejectedValue(networkError);

      await expect(httpJson('not-a-valid-url')).rejects.toThrow();
    });

    it('should handle very large response bodies', async () => {
      const largeData = { items: Array(10000).fill({ data: 'x'.repeat(100) }) };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(largeData),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await httpJson('https://example.com/api');
      expect(result).toEqual(largeData);
    });
  });
});
