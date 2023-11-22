/*
 * Copyright 2023 The Backstage Authors
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
import { stringifyEntityRef } from '@backstage/catalog-model';
import {
  createSignInResolverFactory,
  OAuthAuthenticatorResult,
  PassportProfile,
  SignInInfo,
} from '@backstage/plugin-auth-node';

/**
 * Available sign-in resolvers for the VMware Cloud auth provider.
 *
 * @public
 */
export namespace vmwareCloudSignInResolvers {
  /**
   * Looks up the user by matching their profile email to the entity's profile email.
   * If that fails, sign in the user without associating with a catalog user.
   */
  export const profileEmailMatchingUserEntityEmail =
    createSignInResolverFactory({
      create() {
        return async (
          info: SignInInfo<OAuthAuthenticatorResult<PassportProfile>>,
          ctx,
        ) => {
          const email = info.profile.email;

          if (!email) {
            throw new Error(
              'VMware login failed, user profile does not contain an email',
            );
          }

          const userEntityRef = stringifyEntityRef({
            kind: 'User',
            name: email,
          });

          try {
            // we await here so that signInWithCatalogUser throws in the current `try`
            return await ctx.signInWithCatalogUser({
              filter: {
                'spec.profile.email': email,
              },
            });
          } catch (e) {
            if (e.name !== 'NotFoundError') {
              throw e;
            }
            return ctx.issueToken({
              claims: {
                sub: userEntityRef,
                ent: [userEntityRef],
              },
            });
          }
        };
      },
    });
}
