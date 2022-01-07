/*
 * Copyright 2022 The Backstage Authors
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

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { setupRequestMockHandlers } from '../../msw';
import { MockFetchApi } from './MockFetchApi';

describe('MockFetchApi', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  it('works with default constructor', async () => {
    worker.use(
      rest.get('http://example.com/data.json', (_, res, ctx) =>
        res(ctx.status(200), ctx.json({ a: 'foo' })),
      ),
    );
    const m = new MockFetchApi();
    const response = await m.fetch('http://example.com/data.json');
    await expect(response.json()).resolves.toEqual({ a: 'foo' });
  });

  describe('baseImplementation', () => {
    it('works with a mock implementation', async () => {
      const inner = jest.fn();
      const m = new MockFetchApi({ baseImplementation: inner });
      await m.fetch('http://example.com/data.json');
      expect(inner).lastCalledWith('http://example.com/data.json');
    });
  });

  describe('resolvePluginProtocol', () => {
    it('works', async () => {
      const inner = jest.fn();
      const m = new MockFetchApi({
        baseImplementation: inner,
        resolvePluginProtocol: {
          discoveryApi: {
            getBaseUrl: async id => `https://blah.com/api/${id}`,
          },
        },
      });
      await m.fetch('plugin://the-plugin/a/data.json');
      expect(inner.mock.calls[0][0]).toBe(
        'https://blah.com/api/the-plugin/a/data.json',
      );
    });
  });

  describe('injectIdentityAuth', () => {
    it('works with token', async () => {
      const inner = jest.fn();
      const m = new MockFetchApi({
        baseImplementation: inner,
        injectIdentityAuth: { token: 'hello' },
      });
      await m.fetch('http://example.com/data.json');
      expect(inner.mock.calls[0][0].headers?.get('authorization')).toBe(
        'Bearer hello',
      );
    });

    it('works with identityApi', async () => {
      const inner = jest.fn();
      const m = new MockFetchApi({
        baseImplementation: inner,
        injectIdentityAuth: {
          identityApi: {
            async getCredentials() {
              return { token: 'hello2' };
            },
          },
        },
      });
      await m.fetch('http://example.com/data.json');
      expect(inner.mock.calls[0][0].headers?.get('authorization')).toBe(
        'Bearer hello2',
      );
    });
  });
});
