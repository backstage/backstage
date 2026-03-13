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
import {
  createBackendModule,
  coreServices,
} from '@backstage/backend-plugin-api';
import {
  authProvidersExtensionPoint,
  commonSignInResolvers,
  createOAuthProviderFactory,
  createSignInResolverFactory,
  OAuthAuthenticatorLogoutInput,
  OAuthAuthenticatorResult,
  PassportProfile,
  SignInInfo,
} from '@backstage/plugin-auth-node';
import { atlassianAuthenticator } from '@backstage/plugin-auth-backend-module-atlassian-provider';
import { z } from 'zod';
import type { ProviderTokenService } from '@devhub/plugin-provider-token-node';
import { providerTokenServiceRef } from '@devhub/plugin-provider-token-node';

/** Validates catalog namespace values (RFC 1123 DNS label, lowercase). */
const NAMESPACE_RE = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;

/**
 * Validates Atlassian account usernames before constructing entity refs.
 * Allows alphanumeric, dots, @, +, -, and underscores — rejecting characters
 * that could enable path traversal or entity-ref injection.
 */
const USERNAME_RE = /^[\w.@+-]{1,255}$/;

function createAtlassianTokenCapturingResolver(
  tokenService: ProviderTokenService,
) {
  return createSignInResolverFactory({
    optionsSchema: z
      .object({
        dangerouslyAllowSignInWithoutUserInCatalog: z.boolean().optional(),
        /** Catalog namespace for User entities. Default: 'default'. */
        userEntityNamespace: z.string().optional(),
      })
      .optional(),
    create(options = {}) {
      const namespace = options.userEntityNamespace ?? 'default';

      // Validate namespace at resolver-creation time so misconfiguration is
      // caught at startup rather than silently constructing malformed entity refs.
      if (!NAMESPACE_RE.test(namespace)) {
        throw new Error(
          `Invalid userEntityNamespace "${namespace}": must be a lowercase RFC 1123 DNS label`,
        );
      }

      return async (
        info: SignInInfo<OAuthAuthenticatorResult<PassportProfile>>,
        ctx,
      ) => {
        const username = info.result.fullProfile.username;
        if (!username) {
          throw new Error('Atlassian user profile does not contain a username');
        }

        // Validate the username before constructing an entity ref.
        // Prevents path-traversal and entity-ref injection via crafted usernames.
        if (!USERNAME_RE.test(username)) {
          throw new Error(
            `Atlassian username "${username}" contains characters not allowed in catalog entity refs`,
          );
        }

        // Step 1: Complete sign-in first so we only persist a token for users
        // that actually exist in the catalog. If the catalog lookup fails (user
        // not found, sign-in disabled) the token is never written, preventing
        // orphaned rows for rejected sign-ins.
        const userEntityRef = `user:${namespace}/${username}`;
        const signInResult = await ctx.signInWithCatalogUser(
          { entityRef: { namespace, name: username } },
          {
            dangerousEntityRefFallback:
              options?.dangerouslyAllowSignInWithoutUserInCatalog
                ? { entityRef: { namespace, name: username } }
                : undefined,
          },
        );

        // Step 2: Persist the token now that sign-in succeeded.
        await tokenService.upsertToken(
          userEntityRef,
          'atlassian',
          info.result.session,
        );

        return signInResult;
      };
    },
  });
}

/**
 * Replaces @backstage/plugin-auth-backend-module-atlassian-provider.
 * Uses the same moduleId ('atlassian-provider') so the two cannot coexist.
 * Remove the upstream module from packages/backend/src/index.ts before adding this one.
 */
export const authAtlassianTokenCaptureModule = createBackendModule({
  pluginId: 'auth',
  moduleId: 'atlassian-provider',
  register(reg) {
    reg.registerInit({
      deps: {
        providers: authProvidersExtensionPoint,
        tokenService: providerTokenServiceRef,
        httpAuth: coreServices.httpAuth,
        logger: coreServices.logger,
      },
      async init({ providers, tokenService, httpAuth, logger }) {
        /**
         * Wraps the upstream authenticator to add a logout hook that deletes the
         * user's stored provider tokens when they sign out of Backstage (G3 fix).
         *
         * The hook extracts the user entity ref from the Backstage limited-access
         * cookie (sent via `credentials: 'include'` from the frontend). Failures
         * are logged as warnings rather than propagated — logout itself must succeed
         * even if token cleanup encounters an error.
         */
        const authenticatorWithLogout: typeof atlassianAuthenticator = {
          ...atlassianAuthenticator,
          async logout(
            input: OAuthAuthenticatorLogoutInput,
            ctx: Parameters<typeof atlassianAuthenticator.authenticate>[1],
          ) {
            if (atlassianAuthenticator.logout) {
              await atlassianAuthenticator.logout(input, ctx);
            }
            try {
              const credentials = await httpAuth.credentials(input.req, {
                allow: ['user'],
                allowLimitedAccess: true,
              });
              await tokenService.deleteTokens(
                credentials.principal.userEntityRef,
              );
              logger.info('Provider tokens deleted on Atlassian sign-out', {
                userEntityRef: credentials.principal.userEntityRef,
              });
            } catch (err) {
              logger.warn(
                'Failed to delete Atlassian provider tokens on sign-out',
                { error: err instanceof Error ? err.message : String(err) },
              );
            }
          },
        };

        providers.registerProvider({
          providerId: 'atlassian',
          factory: createOAuthProviderFactory({
            authenticator: authenticatorWithLogout,
            signInResolverFactories: {
              usernameMatchingUserEntityName:
                createAtlassianTokenCapturingResolver(tokenService),
              ...commonSignInResolvers,
            },
          }),
        });
      },
    });
  },
});
