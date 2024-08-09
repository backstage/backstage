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
  SignInInfo,
} from '@backstage/plugin-auth-node';
import {
  stringifyEntityRef,
  DEFAULT_NAMESPACE,
} from '@backstage/catalog-model';
import { OidcProxyResult } from './types';

/**
 * Available sign-in resolvers for the auth provider to assoicate oidc id tokens
 * with a backstage User entity.
 *
 * @public
 */
export namespace oidcProxySignInResolvers {
  /**
   * singInWithoutCatalogUser signs the user in without requiring a pre-existing
   * User entity in the catalog.  Refer to
   * https://backstage.io/docs/auth/identity-resolver/#sign-in-without-users-in-the-catalog
   */
  export const signInWithoutCatalogUser = createSignInResolverFactory({
    create() {
      return async ({ profile }, ctx) => {
        if (!profile.email) {
          throw new Error(
            'could not sign in: oidc-proxy provider: missing email claim from id token',
          );
        }

        const [localPart] = profile.email.split('@');

        const userEntity = stringifyEntityRef({
          kind: 'User',
          name: localPart,
          namespace: DEFAULT_NAMESPACE,
        });

        return ctx.issueToken({
          claims: {
            sub: userEntity,
            ent: [userEntity],
          },
        });
      };
    },
  });

  /**
   * emailMatchingUserEntityProfileEmail resolves the id token email claim with
   * the spec.profile.email field of an existing User entity in the catalog.
   */
  export const emailMatchingUserEntityProfileEmail =
    createSignInResolverFactory({
      create() {
        return async (info: SignInInfo<OidcProxyResult>, ctx) => {
          const { profile } = info;

          if (!profile.email) {
            throw new Error(
              'could not sign in: emailMatchingUserEntityProfileEmail: missing profile email',
            );
          }

          return ctx.signInWithCatalogUser({
            filter: {
              'spec.profile.email': profile.email,
            },
          });
        };
      },
    });
}
