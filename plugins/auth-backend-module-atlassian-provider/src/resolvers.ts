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

import {
  createSignInResolverFactory,
  OAuthAuthenticatorResult,
  PassportProfile,
  SignInInfo,
} from '@backstage/plugin-auth-node';
import { z } from 'zod/v3';

/**
 * Available sign-in resolvers for the Atlassian auth provider.
 *
 * @public
 */
export namespace atlassianSignInResolvers {
  /**
   * Looks up the user by matching their Atlassian username to the entity name.
   *
   * @deprecated Atlassian user profiles do not contain a username, so this
   * resolver always fails. Use the `emailMatchingUserEntityProfileEmail` or
   * `emailLocalPartMatchingUserEntityName` resolvers instead.
   */
  export const usernameMatchingUserEntityName = createSignInResolverFactory({
    optionsSchema: z
      .object({
        dangerouslyAllowSignInWithoutUserInCatalog: z.boolean().optional(),
      })
      .optional(),
    create(options = {}) {
      return async (
        info: SignInInfo<OAuthAuthenticatorResult<PassportProfile>>,
        ctx,
      ) => {
        const { result } = info;

        const id = result.fullProfile.username;
        if (!id) {
          throw new Error(
            `Atlassian user profiles do not contain a username, so the usernameMatchingUserEntityName sign-in resolver can not be used. Use the emailMatchingUserEntityProfileEmail or emailLocalPartMatchingUserEntityName resolver instead.`,
          );
        }

        return ctx.signInWithCatalogUser(
          { entityRef: { name: id } },
          {
            dangerousEntityRefFallback:
              options?.dangerouslyAllowSignInWithoutUserInCatalog
                ? { entityRef: { name: id } }
                : undefined,
          },
        );
      };
    },
  });
}
