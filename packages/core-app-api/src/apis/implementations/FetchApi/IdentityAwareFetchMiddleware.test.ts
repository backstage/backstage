/*
 * Copyright 2021 The Backstage Authors
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

import { IdentityAwareFetchMiddleware } from './IdentityAwareFetchMiddleware';

describe('IdentityAwareFetchMiddleware', () => {
  it('injects the header only when a token is available', async () => {
    const tokenFunction = jest.fn();
    const middleware = new IdentityAwareFetchMiddleware(tokenFunction);
    const inner = jest.fn();
    const outer = middleware.apply(inner);

    // No token available
    tokenFunction.mockResolvedValueOnce(undefined);
    await outer(new Request('https://example.com'));
    expect([...inner.mock.calls[0][0].headers.entries()]).toEqual([]);

    // Supply a token, header gets added
    tokenFunction.mockResolvedValueOnce('token');
    await outer(new Request('https://example.com'));
    expect([...inner.mock.calls[1][0].headers.entries()]).toEqual([
      ['backstage-token', 'token'],
    ]);

    // Token no longer available
    tokenFunction.mockResolvedValueOnce(undefined);
    await outer(new Request('https://example.com'));
    expect([...inner.mock.calls[2][0].headers.entries()]).toEqual([]);
  });
});
