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

import {
  AuthResolverContext,
  OAuthAuthenticatorResult,
  SignInInfo,
} from '@backstage/plugin-auth-node';

import { GithubProfile } from './authenticator';
import { githubSignInResolvers } from './resolvers';

describe('resolvers', () => {
  it('emailMatchingUserEntityProfileEmail works', async () => {
    const resolver =
      githubSignInResolvers.emailMatchingUserEntityProfileEmail();

    const info: SignInInfo<OAuthAuthenticatorResult<GithubProfile>> = {
      profile: { email: 'hello@example.com' },
      result: {
        fullProfile: { email: 'hello@example.com' } as any,
        session: {} as any,
      },
    };

    const context = {
      signInWithCatalogUser: jest.fn().mockResolvedValue(undefined),
    } satisfies Partial<AuthResolverContext>;

    await resolver(info, context as any);
    expect(context.signInWithCatalogUser).toHaveBeenCalledWith(
      {
        filter: { 'spec.profile.email': 'hello@example.com' },
      },
      {
        dangerousEntityRefFallback: undefined,
      },
    );
  });
});
