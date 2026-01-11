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
  SignInInfo,
} from '@backstage/plugin-auth-node';
import { z } from 'zod/v3';

import { GitlabProfile } from './authenticator';

/**
 * Available sign-in resolvers for the GitLab auth provider.
 *
 * @public
 */
export namespace gitlabSignInResolvers {
  /**
   * Looks up the user by matching their GitLab username to the entity name.
   */
  export const usernameMatchingUserEntityName = createSignInResolverFactory({
    optionsSchema: z
      .object({
        dangerouslyAllowSignInWithoutUserInCatalog: z.boolean().optional(),
      })
      .optional(),
    create(options = {}) {
      return async (
        info: SignInInfo<OAuthAuthenticatorResult<GitlabProfile>>,
        ctx,
      ) => {
        const { result } = info;

        const id = result.fullProfile.username;
        if (!id) {
          throw new Error(`GitLab user profile does not contain a username`);
        }

        return ctx.signInWithCatalogUser(
          {
            entityRef: { name: id },
          },
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

  /**
   * Looks up the user by matching their GitLab user ID to the user-id annotation.
   */
  export const userIdMatchingUserEntityAnnotation = createSignInResolverFactory(
    {
      optionsSchema: z
        .object({
          dangerouslyAllowSignInWithoutUserInCatalog: z.boolean().optional(),
        })
        .optional(),
      create(options = {}) {
        return async (
          info: SignInInfo<OAuthAuthenticatorResult<GitlabProfile>>,
          ctx,
        ) => {
          const { fullProfile } = info.result;

          const userId = fullProfile.id;
          if (!userId) {
            throw new Error(`GitLab user profile does not contain a user ID`);
          }

          if (!fullProfile.profileUrl) {
            throw new Error(
              `GitLab user profile does not contain a profile URL`,
            );
          }
          const host = new URL(fullProfile.profileUrl).hostname;

          return ctx.signInWithCatalogUser(
            {
              annotations: {
                [`${host}/user-id`]: userId,
              },
            },
            {
              dangerousEntityRefFallback:
                options?.dangerouslyAllowSignInWithoutUserInCatalog
                  ? { entityRef: { name: userId } }
                  : undefined,
            },
          );
        };
      },
    },
  );
}
