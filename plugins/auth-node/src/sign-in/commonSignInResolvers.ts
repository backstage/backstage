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

import { z } from 'zod';
import { createSignInResolverFactory } from './createSignInResolverFactory';
import { NotAllowedError } from '@backstage/errors';
import { handleSignInUserNotFound } from './handleSignInUserNotFound';

// This splits an email "joe+work@acme.com" into ["joe", "+work", "@acme.com"]
// so that we can remove the plus addressing. May output a shorter array:
// ["joe", "@acme.com"], if no plus addressing was found.
const reEmail = /^([^@+]+)(\+[^@]+)?(@.*)$/;

/**
 * A collection of common sign-in resolvers that work with any auth provider.
 *
 * @public
 */
export namespace commonSignInResolvers {
  /**
   * A common sign-in resolver that looks up the user using their email address
   * as email of the entity.
   */
  export const emailMatchingUserEntityProfileEmail =
    createSignInResolverFactory({
      optionsSchema: z
        .object({
          dangerouslyAllowSignInWithoutUserInCatalog: z.boolean().optional(),
        })
        .optional(),
      create(options = {}) {
        return async (info, ctx) => {
          const { profile } = info;

          if (!profile.email) {
            throw new Error(
              'Login failed, user profile does not contain an email',
            );
          }

          try {
            return await ctx.signInWithCatalogUser({
              filter: {
                'spec.profile.email': profile.email,
              },
            });
          } catch (err) {
            if (err?.name === 'NotFoundError') {
              // Try removing the plus addressing from the email address
              const m = profile.email.match(reEmail);
              if (m?.length === 4) {
                const [_, name, _plus, domain] = m;
                const noPlusEmail = `${name}${domain}`;

                try {
                  return await ctx.signInWithCatalogUser({
                    filter: {
                      'spec.profile.email': noPlusEmail,
                    },
                  });
                } catch {
                  // Email had no plus addressing or is missing in the catalog
                  return await handleSignInUserNotFound({
                    ctx,
                    error: err,
                    userEntityName: noPlusEmail,
                    dangerouslyAllowSignInWithoutUserInCatalog:
                      options?.dangerouslyAllowSignInWithoutUserInCatalog,
                  });
                }
              }
              return await handleSignInUserNotFound({
                ctx,
                error: err,
                userEntityName: profile.email,
                dangerouslyAllowSignInWithoutUserInCatalog:
                  options?.dangerouslyAllowSignInWithoutUserInCatalog,
              });
            }
            throw err;
          }
        };
      },
    });

  /**
   * A common sign-in resolver that looks up the user using the local part of
   * their email address as the entity name.
   */
  export const emailLocalPartMatchingUserEntityName =
    createSignInResolverFactory({
      optionsSchema: z
        .object({
          allowedDomains: z.array(z.string()).optional(),
          dangerouslyAllowSignInWithoutUserInCatalog: z.boolean().optional(),
        })
        .optional(),
      create(options = {}) {
        const { allowedDomains } = options;
        return async (info, ctx) => {
          const { profile } = info;

          if (!profile.email) {
            throw new Error(
              'Login failed, user profile does not contain an email',
            );
          }
          const [localPart] = profile.email.split('@');
          const domain = profile.email.slice(localPart.length + 1);

          if (allowedDomains && !allowedDomains.includes(domain)) {
            throw new NotAllowedError(
              'Sign-in user email is not from an allowed domain',
            );
          }
          try {
            return await ctx.signInWithCatalogUser({
              entityRef: { name: localPart },
            });
          } catch (error) {
            return await handleSignInUserNotFound({
              ctx,
              error,
              userEntityName: localPart,
              dangerouslyAllowSignInWithoutUserInCatalog:
                options?.dangerouslyAllowSignInWithoutUserInCatalog,
            });
          }
        };
      },
    });
}
