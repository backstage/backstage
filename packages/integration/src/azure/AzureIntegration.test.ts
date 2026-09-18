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
import { registerMswTestHooks } from '@backstage/backend-test-utils';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { AzureIntegration } from './AzureIntegration';

// Mock pThrottle to make testing easier
jest.mock('p-throttle', () => {
  return jest.fn(() => (fn: any) => fn);
});

describe('AzureIntegration', () => {
  it('has a working factory', () => {
    const integrations = AzureIntegration.factory({
      config: new ConfigReader({
        integrations: {
          azure: [
            {
              host: 'h.com',
              credentials: [{ personalAccessToken: 'token' }],
            },
          ],
        },
      }),
    });
    expect(integrations.list().length).toBe(2); // including default
    expect(integrations.list()[0].config.host).toBe('h.com');
    expect(integrations.list()[1].config.host).toBe('dev.azure.com');
  });

  it('returns the basics', () => {
    const integration = new AzureIntegration({ host: 'h.com' } as any);
    expect(integration.type).toBe('azure');
    expect(integration.title).toBe('h.com');
  });

  describe('resolveUrl', () => {
    it('works for valid urls', () => {
      const integration = new AzureIntegration({
        host: 'dev.azure.com',
      } as any);

      expect(
        integration.resolveUrl({
          url: '../a.yaml',
          base: 'https://dev.azure.com/organization/project/_git/repository?path=%2Ffolder%2Fcatalog-info.yaml',
        }),
      ).toBe(
        'https://dev.azure.com/organization/project/_git/repository?path=%2Fa.yaml',
      );

      expect(
        integration.resolveUrl({
          url: '/a.yaml',
          base: 'https://internal.com/organization/project/_git/repository?path=%2Ffolder%2Fcatalog-info.yaml',
          lineNumber: 14,
        }),
      ).toBe(
        'https://internal.com/organization/project/_git/repository?path=%2Fa.yaml&line=14&lineEnd=15&lineStartColumn=1&lineEndColumn=1',
      );

      expect(
        integration.resolveUrl({
          url: './a.yaml',
          base: 'https://dev.azure.com/organization/_git/project',
        }),
      ).toBe('https://dev.azure.com/organization/_git/project?path=%2Fa.yaml');

      expect(
        integration.resolveUrl({
          url: 'https://dev.azure.com/organization/_git/project?path=%2Fa.yaml',
          base: 'https://dev.azure.com/organization/_git/project',
        }),
      ).toBe('https://dev.azure.com/organization/_git/project?path=%2Fa.yaml');

      expect(
        integration.resolveUrl({
          url: 'https://dev.azure.com/other-organization/_git/other-project?path=%2Fa.yaml',
          base: 'https://dev.azure.com/organization/_git/project',
        }),
      ).toBe(
        'https://dev.azure.com/other-organization/_git/other-project?path=%2Fa.yaml',
      );

      expect(
        integration.resolveUrl({
          url: './a.yaml',
          base: 'http://not-azure.com/organization/_git/project',
        }),
      ).toBe('http://not-azure.com/organization/_git/project?path=%2Fa.yaml');

      expect(
        integration.resolveUrl({
          url: 'https://absolute.com/path',
          base: 'https://dev.azure.com/organization/project/_git/repository?path=%2Fcatalog-info.yaml',
        }),
      ).toBe('https://absolute.com/path');
    });

    it('falls back to regular URL resolution if not in a repo', () => {
      const integration = new AzureIntegration({
        host: 'dev.azure.com',
      } as any);

      expect(
        integration.resolveUrl({
          url: './test',
          base: 'https://dev.azure.com/organization/project/_git',
        }),
      ).toBe('https://dev.azure.com/organization/project/test');
    });
  });

  it('resolve edit URL', () => {
    const integration = new AzureIntegration({ host: 'h.com' } as any);

    // TODO: The Azure integration doesn't support resolving an edit URL yet,
    // instead we keep the input URL.
    expect(
      integration.resolveEditUrl(
        'https://dev.azure.com/organization/project/_git/repository?path=%2Fcatalog-info.yaml',
      ),
    ).toBe(
      'https://dev.azure.com/organization/project/_git/repository?path=%2Fcatalog-info.yaml',
    );
  });

  describe('fetch strategy', () => {
    const worker = setupServer();
    registerMswTestHooks(worker);

    const url = 'https://dev.azure.com/org/project/_apis/git/repositories';

    beforeAll(() => {
      jest.useFakeTimers();
    });
    afterAll(() => {
      jest.useRealTimers();
    });
    beforeEach(() => {
      jest.clearAllTimers();
    });

    it('leaves requests alone when no retry config is given', async () => {
      let callCount = 0;
      worker.use(
        http.get(url, () => {
          callCount += 1;
          return new HttpResponse(null, { status: 429 });
        }),
      );

      const integration = new AzureIntegration({
        host: 'dev.azure.com',
      } as any);

      const response = await integration.fetch(url);

      expect(response.status).toBe(429);
      expect(callCount).toBe(1);
    });

    it('waits for the cooldown Azure DevOps asks for before retrying', async () => {
      const responses = [
        new HttpResponse(null, {
          status: 429,
          headers: { 'Retry-After': '5' },
        }),
        new HttpResponse(null, {
          status: 429,
          headers: { 'x-ratelimit-delay': '2' },
        }),
        HttpResponse.json({}),
      ];
      let callCount = 0;
      worker.use(http.get(url, () => responses[callCount++]));

      const integration = new AzureIntegration({
        host: 'dev.azure.com',
        retry: { maxRetries: 3, retryStatusCodes: [429] },
      } as any);

      const responsePromise = integration.fetch(url);

      // The exponential backoff would have retried well before this, so the
      // call count proves that the header values were the ones being honored.
      await jest.advanceTimersByTimeAsync(4999);
      expect(callCount).toBe(1);
      await jest.advanceTimersByTimeAsync(1);
      expect(callCount).toBe(2);
      await jest.advanceTimersByTimeAsync(2000);

      expect((await responsePromise).status).toBe(200);
      expect(callCount).toBe(3);
    });

    it('gives up after maxRetries and applies the requests per minute limit', async () => {
      const pThrottle = require('p-throttle');
      let callCount = 0;
      worker.use(
        http.get(url, () => {
          callCount += 1;
          return new HttpResponse(null, { status: 503 });
        }),
      );

      const integration = new AzureIntegration({
        host: 'dev.azure.com',
        retry: {
          maxRetries: 2,
          retryStatusCodes: [503],
          maxApiRequestsPerMinute: 60,
        },
      } as any);

      const responsePromise = integration.fetch(url);
      await jest.advanceTimersByTimeAsync(10000);

      expect((await responsePromise).status).toBe(503);
      expect(callCount).toBe(3); // initial + 2 retries
      expect(pThrottle).toHaveBeenCalledWith({ limit: 60, interval: 60_000 });
    });
  });

  describe('parseRateLimitInfo', () => {
    const integration = new AzureIntegration({
      host: 'dev.azure.com',
    } as any);

    it.each`
      status | delay        | expected
      ${429} | ${undefined} | ${true}
      ${203} | ${'3.5'}     | ${true}
      ${200} | ${'1'}       | ${true}
      ${203} | ${undefined} | ${false}
      ${200} | ${'0'}       | ${false}
      ${404} | ${'nope'}    | ${false}
    `(
      '(status: $status, x-ratelimit-delay: $delay) === $expected',
      ({ status, delay, expected }) => {
        const headers = new Headers(
          delay === undefined ? {} : { 'x-ratelimit-delay': delay },
        );

        expect(
          integration.parseRateLimitInfo({ status, headers } as Response),
        ).toMatchObject({ isRateLimited: expected });
      },
    );
  });
});
