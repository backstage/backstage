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
  SignInInfo,
} from '@backstage/plugin-auth-node';
import { OAuth2ProxyResult } from './types';
import { z } from 'zod/v3';

/**
 * @public
 */
export namespace oauth2ProxySignInResolvers {
  export const forwardedUserMatchingUserEntityName =
    createSignInResolverFactory({
      optionsSchema: z
        .object({
          dangerouslyAllowSignInWithoutUserInCatalog: z.boolean().optional(),
        })
        .optional(),
      create(options = {}) {
        return async (info: SignInInfo<OAuth2ProxyResult>, ctx) => {
          const name = info.result.getHeader('x-forwarded-user');
          if (!name) {
            throw new Error('Request did not contain a user');
          }

          return ctx.signInWithCatalogUser(
            {
              entityRef: { name },
            },
            {
              dangerousEntityRefFallback:
                options?.dangerouslyAllowSignInWithoutUserInCatalog
                  ? { entityRef: { name } }
                  : undefined,
            },
          );
        };
      },
    });

  /**
   * A sign-in resolver that looks up the user using the 'x-forwarded-preferred-username' header.
   *
   * @public
   */
  export const forwardedPreferredUsernameMatchingUserEntityName =
    createSignInResolverFactory({
      optionsSchema: z
        .object({
          dangerouslyAllowSignInWithoutUserInCatalog: z.boolean().optional(),
        })
        .optional(),
      create(options = {}) {
        return async (info: SignInInfo<OAuth2ProxyResult>, ctx) => {
          const preferredUsername = info.result.getHeader(
            'x-forwarded-preferred-username',
          );
          if (!preferredUsername) {
            throw new Error('Request did not contain a preferred username');
          }
          return ctx.signInWithCatalogUser(
            {
              entityRef: { name: preferredUsername },
            },
            {
              dangerousEntityRefFallback:
                options?.dangerouslyAllowSignInWithoutUserInCatalog
                  ? { entityRef: { name: preferredUsername } }
                  : undefined,
            },
          );
        };
      },
    });
}
