/*
 * Copyright 2024 The Backstage Authors
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

import { mockServices } from '@backstage/backend-test-utils';
import { createCloudflareAccessAuthenticator } from './authenticator';

describe('authenticator', () => {
  it('works for normal users', async () => {
    const auth = createCloudflareAccessAuthenticator({
      cache: mockServices.cache.mock(),
    });

    const profile = await auth.defaultProfileTransform(
      {
        cfIdentity: { name: 'Name', email: 'hello@example.com' } as any,
        claims: { email: 'hello@example.com' } as any,
        token: 'fake',
      },
      {} as any,
    );
    expect(profile).toEqual({
      profile: {
        displayName: 'Name',
        email: 'hello@example.com',
      },
    });
  });

  it('works for service tokens', async () => {
    const auth = createCloudflareAccessAuthenticator({
      cache: mockServices.cache.mock(),
    });

    const profile = await auth.defaultProfileTransform(
      {
        cfIdentity: { name: 'Name', email: 'hello@example.com' } as any,
        claims: {} as any,
        token: 'fake',
      },
      {} as any,
    );
    expect(profile).toEqual({
      profile: {
        displayName: 'Name',
        email: 'hello@example.com',
      },
    });
  });
});
