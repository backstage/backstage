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

import { fetchIdentity } from './identity';

describe('fetchIdentity', () => {
  it('calls userinfo with the bearer token and returns subject and ownership', async () => {
    const fetchFn = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          claims: {
            sub: 'user:default/jane',
            ent: ['user:default/jane', 'group:default/team-a'],
          },
        }),
        { status: 200 },
      ),
    );
    await expect(
      fetchIdentity('https://backstage.example.com', 'tok', fetchFn),
    ).resolves.toEqual({
      sub: 'user:default/jane',
      ent: ['user:default/jane', 'group:default/team-a'],
    });
    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(fetchFn.mock.calls[0][0]).toBe(
      'https://backstage.example.com/api/auth/v1/userinfo',
    );
    expect(fetchFn.mock.calls[0][1].headers).toEqual({
      Authorization: 'Bearer tok',
    });
  });

  it('treats a missing ent claim as empty and rejects bad tokens with login guidance', async () => {
    const ok = jest
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ claims: { sub: 'user:default/jane' } })),
      );
    await expect(
      fetchIdentity('https://b.example.com', 't', ok),
    ).resolves.toEqual({ sub: 'user:default/jane', ent: [] });

    const rejected = jest
      .fn()
      .mockResolvedValue(new Response('', { status: 401 }));
    await expect(
      fetchIdentity('https://b.example.com', 't', rejected),
    ).rejects.toThrow(/HTTP 401.*backstage-cli auth login/);

    const noSub = jest
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ claims: {} })));
    await expect(
      fetchIdentity('https://b.example.com', 't', noSub),
    ).rejects.toThrow(/subject/);
  });
});
