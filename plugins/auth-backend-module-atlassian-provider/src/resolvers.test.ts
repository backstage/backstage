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

import { atlassianSignInResolvers } from './resolvers';

describe('atlassianSignInResolvers', () => {
  it('explains that usernameMatchingUserEntityName can not be used', async () => {
    const resolver = atlassianSignInResolvers.usernameMatchingUserEntityName();
    const ctx = { signInWithCatalogUser: jest.fn() };

    await expect(
      resolver(
        {
          profile: { email: 'user@example.com' },
          result: {
            fullProfile: {
              id: 'account-id',
              provider: 'atlassian',
              displayName: 'User',
              emails: [{ value: 'user@example.com' }],
            },
            session: { accessToken: 'token', tokenType: 'bearer', scope: '' },
          },
        },
        ctx as any,
      ),
    ).rejects.toThrow(
      /usernameMatchingUserEntityName sign-in resolver can not be used\. Use the emailMatchingUserEntityProfileEmail or emailLocalPartMatchingUserEntityName resolver instead/,
    );
    expect(ctx.signInWithCatalogUser).not.toHaveBeenCalled();
  });
});
