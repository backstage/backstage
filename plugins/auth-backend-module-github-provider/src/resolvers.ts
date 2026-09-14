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
  DEFAULT_NAMESPACE,
  stringifyEntityRef,
  type Entity,
} from '@backstage/catalog-model';
import type { AuthService } from '@backstage/backend-plugin-api';
import { ConflictError, isError, NotFoundError } from '@backstage/errors';
import {
  type AuthResolverContext,
  createSignInResolverFactory,
  OAuthAuthenticatorResult,
  SignInInfo,
} from '@backstage/plugin-auth-node';
import type { CatalogService } from '@backstage/plugin-catalog-node';
import { z } from 'zod/v3';

import { GithubProfile } from './authenticator';

const GITHUB_USER_ID_ANNOTATION = 'github.com/user-id';

function requireMatchingGithubUserId(entity: Entity, userId: string) {
  if (entity.metadata.annotations?.[GITHUB_USER_ID_ANNOTATION] !== userId) {
    throw new Error(`GitHub user ID does not match the catalog user`);
  }
}

async function signInWithCatalogEntity(
  entity: Entity,
  ctx: AuthResolverContext,
) {
  const { ownershipEntityRefs } = await ctx.resolveOwnershipEntityRefs(entity);
  return ctx.issueToken({
    claims: {
      sub: stringifyEntityRef(entity),
      ent: ownershipEntityRefs,
    },
  });
}

async function signInWithoutCatalogUser(
  name: string,
  ctx: AuthResolverContext,
) {
  const userEntityRef = stringifyEntityRef({
    kind: 'User',
    namespace: DEFAULT_NAMESPACE,
    name,
  });
  return ctx.issueToken({
    claims: {
      sub: userEntityRef,
      ent: [userEntityRef],
    },
  });
}

/**
 * Available sign-in resolvers for the GitHub auth provider.
 *
 * @public
 */
export namespace githubSignInResolvers {
  /**
   * Looks up the user by matching their GitHub username to the entity name.
   *
   * @deprecated Use {@link githubSignInResolvers.userIdMatchingUserEntityAnnotation}
   * instead, because GitHub usernames can change and be reassigned.
   */
  export const usernameMatchingUserEntityName = createSignInResolverFactory({
    optionsSchema: z
      .object({
        dangerouslyAllowSignInWithoutUserInCatalog: z.boolean().optional(),
      })
      .optional(),
    create(options = {}) {
      return async (
        info: SignInInfo<OAuthAuthenticatorResult<GithubProfile>>,
        ctx,
      ) => {
        const { fullProfile } = info.result;

        const userId = fullProfile.username;
        if (!userId) {
          throw new Error(`GitHub user profile does not contain a username`);
        }

        return ctx.signInWithCatalogUser(
          {
            entityRef: { name: userId },
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
  });

  /**
   * Looks up the user by matching their GitHub user ID to the github.com/user-id annotation.
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
          info: SignInInfo<OAuthAuthenticatorResult<GithubProfile>>,
          ctx,
        ) => {
          const { fullProfile } = info.result;

          const userId = fullProfile.nodeId;
          if (!userId) {
            throw new Error(`GitHub user profile does not contain a user ID`);
          }

          const query = {
            annotations: {
              [GITHUB_USER_ID_ANNOTATION]: userId,
            },
          };

          let entity;
          try {
            ({ entity } = await ctx.findCatalogUser(query));
          } catch (error) {
            if (
              !isError(error) ||
              error.name !== 'NotFoundError' ||
              !options.dangerouslyAllowSignInWithoutUserInCatalog
            ) {
              throw error;
            }

            return signInWithoutCatalogUser(userId, ctx);
          }

          requireMatchingGithubUserId(entity, userId);
          return signInWithCatalogEntity(entity, ctx);
        };
      },
    },
  );
}

/**
 * Creates the resolver map used by the built-in GitHub provider module.
 *
 * @remarks
 *
 * The service-aware user ID resolver can inspect all case-insensitive catalog
 * matches and select the exact ID. The public resolver remains fail-closed when
 * its context reports an ambiguous lookup.
 *
 * @internal
 */
export function createGithubProviderSignInResolvers(options: {
  auth: AuthService;
  catalog: CatalogService;
}) {
  return {
    ...githubSignInResolvers,
    userIdMatchingUserEntityAnnotation: createSignInResolverFactory({
      optionsSchema: z
        .object({
          dangerouslyAllowSignInWithoutUserInCatalog: z.boolean().optional(),
        })
        .optional(),
      create(resolverOptions = {}) {
        return async (
          info: SignInInfo<OAuthAuthenticatorResult<GithubProfile>>,
          ctx: AuthResolverContext,
        ) => {
          const userId = info.result.fullProfile.nodeId;
          if (!userId) {
            throw new Error(`GitHub user profile does not contain a user ID`);
          }

          const credentials = await options.auth.getOwnServiceCredentials();
          const { items } = await options.catalog.getEntities(
            {
              filter: {
                kind: 'user',
                [`metadata.annotations.${GITHUB_USER_ID_ANNOTATION}`]: userId,
              },
            },
            { credentials },
          );
          const exactMatches = items.filter(
            item =>
              item.metadata.annotations?.[GITHUB_USER_ID_ANNOTATION] === userId,
          );

          if (exactMatches.length > 1) {
            throw new ConflictError(
              'User lookup resulted in multiple exact matches',
            );
          }
          if (exactMatches.length === 1) {
            return signInWithCatalogEntity(exactMatches[0], ctx);
          }
          if (items.length > 0) {
            throw new Error(`GitHub user ID does not match the catalog user`);
          }
          if (resolverOptions.dangerouslyAllowSignInWithoutUserInCatalog) {
            return signInWithoutCatalogUser(userId, ctx);
          }
          throw new NotFoundError('User not found');
        };
      },
    }),
  };
}
