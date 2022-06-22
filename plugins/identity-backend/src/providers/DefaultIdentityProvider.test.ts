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
import { Request } from 'express';
import { DefaultIdentityProvider } from './DefaultIdentityProvider';

describe('DefaultIdentityProvider', () => {
  it('where we are not sending the token header', async () => {
    const identityProvider = new DefaultIdentityProvider();

    const result = identityProvider.userFromRequest({} as Request);
    expect(result).toEqual({});
  });

  it('where we send a basic token header', async () => {
    const header = Buffer.from(
      JSON.stringify({ alg: 'none', type: 'JWT' }),
      'utf8',
    ).toString('base64');
    const payload = Buffer.from(
      JSON.stringify({ sub: 'user:default/guest' }),
      'utf8',
    ).toString('base64');
    const token = [header, payload].join('.');
    const identityProvider = new DefaultIdentityProvider();

    const result = identityProvider.userFromRequest({
      headers: { authorization: `Bearer ${token}` },
    } as Request);
    expect(result).toEqual({ entityRef: 'user:default/guest', token: token });
  });
});
