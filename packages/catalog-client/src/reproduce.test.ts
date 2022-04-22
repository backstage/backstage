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

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import fetch from 'cross-fetch';

const server = setupServer();

async function doFetch() {
  try {
    await fetch('https://backstage/');
    return undefined;
  } catch (error) {
    return error;
  }
}

describe('MSW', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  it('should be flaky', async () => {
    server.use(
      rest.get('https://backstage/', (_, res, ctx) => {
        return res(ctx.json({ ok: true }));
      }),
    );

    for (let i = 0; i < 1000; i++) {
      const error = await doFetch();
      if (error) {
        console.log('DEBUG: error =', i, error);
      }
    }
    expect(true).toBe(true);
  });
});
