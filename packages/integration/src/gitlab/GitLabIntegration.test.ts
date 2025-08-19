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

import { ConfigReader } from '@backstage/config';
import { GitLabIntegration, replaceGitLabUrlType } from './GitLabIntegration';

// Mock pThrottle to make testing easier
jest.mock('p-throttle', () => {
  return jest.fn(() => (fn: any) => fn);
});

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('GitLabIntegration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue(new Response('{}', { status: 200 }));
  });

  it('has a working factory', () => {
    const integrations = GitLabIntegration.factory({
      config: new ConfigReader({
        integrations: {
          gitlab: [
            {
              host: 'h.com',
              token: 't',
              apiBaseUrl: 'https://h.com/api/v4',
              baseUrl: 'https://h.com',
            },
          ],
        },
      }),
    });
    expect(integrations.list().length).toBe(2); // including default
    expect(integrations.list()[0].config.host).toBe('h.com');
    expect(integrations.list()[1].config.host).toBe('gitlab.com');
  });

  it('returns the basics', () => {
    const integration = new GitLabIntegration({ host: 'h.com' } as any);
    expect(integration.type).toBe('gitlab');
    expect(integration.title).toBe('h.com');
  });

  it('resolve edit URL', () => {
    const integration = new GitLabIntegration({
      host: 'h.com',
      apiBaseUrl: 'https://h.com/api/v4',
      baseUrl: 'https://h.com',
      maxRetries: 0,
      retryStatusCodes: [],
      limitPerMinute: -1,
    });

    expect(
      integration.resolveEditUrl(
        'https://gitlab.com/my-org/my-project/-/blob/develop/README.md',
      ),
    ).toBe('https://gitlab.com/my-org/my-project/-/edit/develop/README.md');
  });

  describe('fetch strategy', () => {
    it('uses plain fetch when no throttling or retries configured', async () => {
      const integration = new GitLabIntegration({
        host: 'h.com',
        apiBaseUrl: 'https://h.com/api/v4',
        baseUrl: 'https://h.com',
        maxRetries: 0,
        retryStatusCodes: [],
        limitPerMinute: -1,
      });

      await integration.fetch('https://example.com');

      expect(mockFetch).toHaveBeenCalledWith('https://example.com', {
        mode: 'same-origin',
      });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('applies retry logic when maxRetries > 0', async () => {
      mockFetch
        .mockResolvedValueOnce(new Response('{}', { status: 429 }))
        .mockResolvedValueOnce(new Response('{}', { status: 200 }));

      const integration = new GitLabIntegration({
        host: 'h.com',
        apiBaseUrl: 'https://h.com/api/v4',
        baseUrl: 'https://h.com',
        maxRetries: 3,
        retryStatusCodes: [429],
        limitPerMinute: -1,
      });

      const response = await integration.fetch('https://example.com');

      expect(response.status).toBe(200);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('does not retry when status code is not in retryStatusCodes', async () => {
      mockFetch.mockResolvedValueOnce(new Response('{}', { status: 404 }));

      const integration = new GitLabIntegration({
        host: 'h.com',
        apiBaseUrl: 'https://h.com/api/v4',
        baseUrl: 'https://h.com',
        maxRetries: 3,
        retryStatusCodes: [429, 500],
        limitPerMinute: -1,
      });

      const response = await integration.fetch('https://example.com');

      expect(response.status).toBe(404);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('stops retrying after maxRetries attempts', async () => {
      mockFetch.mockResolvedValue(new Response('{}', { status: 429 }));

      const integration = new GitLabIntegration({
        host: 'h.com',
        apiBaseUrl: 'https://h.com/api/v4',
        baseUrl: 'https://h.com',
        maxRetries: 2,
        retryStatusCodes: [429],
        limitPerMinute: -1,
      });

      const response = await integration.fetch('https://example.com');

      expect(response.status).toBe(429);
      expect(mockFetch).toHaveBeenCalledTimes(3); // initial + 2 retries
    });

    it('applies throttling when limitPerMinute > 0', async () => {
      const pThrottle = require('p-throttle');
      const throttleMock = jest.fn(() => (fn: any) => fn);
      pThrottle.mockReturnValue(throttleMock);

      const integration = new GitLabIntegration({
        host: 'h.com',
        apiBaseUrl: 'https://h.com/api/v4',
        baseUrl: 'https://h.com',
        maxRetries: 0,
        retryStatusCodes: [],
        limitPerMinute: 60,
      });

      await integration.fetch('https://example.com');

      expect(pThrottle).toHaveBeenCalledWith({
        limit: 60,
        interval: 60_000,
      });
      expect(throttleMock).toHaveBeenCalled();
    });

    it('applies both throttling and retry when both are configured', async () => {
      const pThrottle = require('p-throttle');
      const throttleMock = jest.fn((fn: any) => fn);
      pThrottle.mockReturnValue(throttleMock);

      mockFetch
        .mockResolvedValueOnce(new Response('{}', { status: 429 }))
        .mockResolvedValueOnce(new Response('{}', { status: 200 }));

      const integration = new GitLabIntegration({
        host: 'h.com',
        apiBaseUrl: 'https://h.com/api/v4',
        baseUrl: 'https://h.com',
        maxRetries: 3,
        retryStatusCodes: [429],
        limitPerMinute: 60,
      });

      const response = await integration.fetch('https://example.com');

      expect(response.status).toBe(200);
      expect(pThrottle).toHaveBeenCalledWith({
        limit: 60,
        interval: 60_000,
      });
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('retries based on configured status codes', async () => {
      // Use setTimeout mock that resolves immediately
      jest.spyOn(global, 'setTimeout').mockImplementation((callback: any) => {
        callback();
        return 0 as any;
      });

      const retryAfterResponse = new Response('{}', {
        status: 429,
        headers: { 'Retry-After': '2' },
      });
      const successResponse = new Response('{}', { status: 200 });

      mockFetch
        .mockResolvedValueOnce(retryAfterResponse)
        .mockResolvedValueOnce(successResponse);

      const integration = new GitLabIntegration({
        host: 'h.com',
        apiBaseUrl: 'https://h.com/api/v4',
        baseUrl: 'https://h.com',
        maxRetries: 3,
        retryStatusCodes: [429],
        limitPerMinute: -1,
      });

      const response = await integration.fetch('https://example.com');

      expect(response.status).toBe(200);
      expect(mockFetch).toHaveBeenCalledTimes(2);

      jest.restoreAllMocks();
    });

    it('retries multiple times for persistent failures', async () => {
      // Use setTimeout mock that resolves immediately
      jest.spyOn(global, 'setTimeout').mockImplementation((callback: any) => {
        callback();
        return 0 as any;
      });

      mockFetch
        .mockResolvedValueOnce(new Response('{}', { status: 500 }))
        .mockResolvedValueOnce(new Response('{}', { status: 500 }))
        .mockResolvedValueOnce(new Response('{}', { status: 200 }));

      const integration = new GitLabIntegration({
        host: 'h.com',
        apiBaseUrl: 'https://h.com/api/v4',
        baseUrl: 'https://h.com',
        maxRetries: 3,
        retryStatusCodes: [500],
        limitPerMinute: -1,
      });

      const response = await integration.fetch('https://example.com');

      expect(response.status).toBe(200);
      expect(mockFetch).toHaveBeenCalledTimes(3);

      jest.restoreAllMocks();
    });
  });
});

describe('replaceGitLabUrlType', () => {
  it('should replace with expected type', () => {
    expect(
      replaceGitLabUrlType(
        'https://gitlab.com/my-org/my-project/-/blob/develop/README.md',
        'edit',
      ),
    ).toBe('https://gitlab.com/my-org/my-project/-/edit/develop/README.md');
    expect(
      replaceGitLabUrlType(
        'https://gitlab.com/webmodules/blob/-/blob/develop/test',
        'tree',
      ),
    ).toBe('https://gitlab.com/webmodules/blob/-/tree/develop/test');
    expect(
      replaceGitLabUrlType(
        'https://gitlab.com/blob/blob/-/blob/develop/test',
        'tree',
      ),
    ).toBe('https://gitlab.com/blob/blob/-/tree/develop/test');
    expect(
      replaceGitLabUrlType(
        'https://gitlab.com/blob/blob/-/edit/develop/README.md',
        'tree',
      ),
    ).toBe('https://gitlab.com/blob/blob/-/tree/develop/README.md');
  });
});
