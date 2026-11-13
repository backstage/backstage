/*
 * Copyright 2026 The Backstage Authors
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

import { DefaultApiFrontendClient } from './generated';

describe('DefaultApiFrontendClient', () => {
  it('sends requests to plugin:// urls and only authenticates with an explicit token', async () => {
    const fetch = jest.fn(async () => new Response('{}'));
    const client = new DefaultApiFrontendClient({ fetchApi: { fetch } });
    const request = {
      path: { kind: 'component', namespace: 'default', name: 'a' },
    };

    await client.getEntityByName(request);
    expect(fetch).toHaveBeenLastCalledWith(
      'plugin://catalog/entities/by-name/component/default/a',
      expect.objectContaining({
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await client.getEntityByName(request, { token: 'my-token' });
    expect(fetch).toHaveBeenLastCalledWith(
      'plugin://catalog/entities/by-name/component/default/a',
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer my-token',
        },
      }),
    );
  });
});
