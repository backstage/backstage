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
  createSignInResolverFactory,
  OAuthAuthenticatorResult,
  PassportProfile,
  SignInInfo,
} from '@backstage/plugin-auth-node';

/**
 * Available sign-in resolvers for the Bitbucket auth provider.
 *
 * @public
 */
export namespace bitbucketSignInResolvers {
  /**
   * Looks up the user by matching their Bitbucket user ID with the `bitbucket.org/user-id` annotation.
   */
  export const userIdMatchingUserEntityAnnotation = createSignInResolverFactory(
    {
      create() {
        return async (
          info: SignInInfo<OAuthAuthenticatorResult<PassportProfile>>,
          ctx,
        ) => {
          const { result } = info;

          const id = result.fullProfile.id;
          if (!id) {
            throw new Error('Bitbucket user profile does not contain an ID');
          }

          return ctx.signInWithCatalogUser({
            annotations: {
              'bitbucket.org/user-id': id,
            },
          });
        };
      },
    },
  );

  /**
   * Looks up the user by matching their Bitbucket username with the `bitbucket.org/username` annotation.
   */
  export const usernameMatchingUserEntityAnnotation =
    createSignInResolverFactory({
      create() {
        return async (
          info: SignInInfo<OAuthAuthenticatorResult<PassportProfile>>,
          ctx,
        ) => {
          const { result } = info;

          const username = result.fullProfile.username;
          if (!username) {
            throw new Error(
              'Bitbucket user profile does not contain a Username',
            );
          }

          return ctx.signInWithCatalogUser({
            annotations: {
              'bitbucket.org/username': username,
            },
          });
        };
      },
    });
}
