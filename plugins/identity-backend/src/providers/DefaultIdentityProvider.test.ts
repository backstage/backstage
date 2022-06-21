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
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyOmRlZmF1bHQvZ3Vlc3QifQ.elzBaDb3wYEcy9GNERD0uXaJCUqBlzfALLQHQT6CST4';
    const identityProvider = new DefaultIdentityProvider();

    const result = identityProvider.userFromRequest({
      headers: { authorization: `Bearer ${token}` },
    } as Request);
    expect(result).toEqual({ entityRef: 'user:default/guest', token: token });
  });
});
