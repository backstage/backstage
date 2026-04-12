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

import { ClarifyFailuresFetchMiddleware } from './ClarifyFailuresFetchMiddleware';

describe('ClarifyFailuresFetchMiddleware', () => {
  it('passes through successful responses', async () => {
    const response = new Response('ok');
    const inner = jest.fn().mockResolvedValue(response);
    const middleware = new ClarifyFailuresFetchMiddleware();
    const result = await middleware.apply(inner)('https://example.com/api');
    expect(result).toBe(response);
    expect(inner).toHaveBeenCalled();
  });

  it('replaces "Failed to fetch" TypeError with one that includes the URL', async () => {
    const inner = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    const middleware = new ClarifyFailuresFetchMiddleware();
    await expect(
      middleware.apply(inner)('https://example.com/api/catalog'),
    ).rejects.toThrow(
      new TypeError('Failed to fetch: GET https://example.com/api/catalog'),
    );
  });

  it('handles Request object input without constructing a new Request', async () => {
    const inner = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    const middleware = new ClarifyFailuresFetchMiddleware();
    const request = new Request('https://example.com/api/data', {
      method: 'POST',
      body: JSON.stringify({ key: 'value' }),
    });
    await expect(middleware.apply(inner)(request)).rejects.toThrow(
      new TypeError('Failed to fetch: POST https://example.com/api/data'),
    );
  });

  it('does not modify other TypeErrors', async () => {
    const error = new TypeError('some other error');
    const inner = jest.fn().mockRejectedValue(error);
    const middleware = new ClarifyFailuresFetchMiddleware();
    await expect(
      middleware.apply(inner)('https://example.com/api'),
    ).rejects.toThrow(error);
  });

  it('does not modify non-TypeError errors', async () => {
    const error = new Error('Failed to fetch');
    const inner = jest.fn().mockRejectedValue(error);
    const middleware = new ClarifyFailuresFetchMiddleware();
    await expect(
      middleware.apply(inner)('https://example.com/api'),
    ).rejects.toThrow(error);
  });
});
