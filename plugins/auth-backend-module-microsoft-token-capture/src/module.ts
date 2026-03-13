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
import { microsoftAuthenticator } from '@backstage/plugin-auth-backend-module-microsoft-provider';
import { z } from 'zod';
import type { ProviderTokenService } from '@devhub/plugin-provider-token-node';
import { providerTokenServiceRef } from '@devhub/plugin-provider-token-node';

function createMicrosoftTokenCapturingResolver(
  tokenService: ProviderTokenService,
) {
  return createSignInResolverFactory({
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
        const email = info.profile.email;
        if (!email) {
          throw new Error(
            'Microsoft user profile does not contain an email address',
          );
        }

        // Step 1: Complete sign-in first so we only persist a token for users
        // that actually exist in the catalog. If the catalog lookup fails (user
        // not found, sign-in disabled) the token is never written, preventing
        // orphaned rows for rejected sign-ins.
        // Uses the microsoft.com/email annotation — the same annotation that the
        // upstream emailMatchingUserEntityAnnotation resolver uses.
        const signInResult = await ctx.signInWithCatalogUser(
          { annotations: { 'microsoft.com/email': email } },
          {
            dangerousEntityRefFallback:
              options?.dangerouslyAllowSignInWithoutUserInCatalog
                ? { entityRef: { name: email.split('@')[0] } }
                : undefined,
          },
        );

        // Step 2: Persist the token now that sign-in succeeded.
        // Derive userEntityRef from the sign-in result — no second catalog lookup needed.
        const userEntityRef = signInResult.identity.userEntityRef;
        await tokenService.upsertToken(
          userEntityRef,
          'microsoft',
          info.result.session,
        );

        return signInResult;
      };
    },
  });
}

/**
 * Replaces @backstage/plugin-auth-backend-module-microsoft-provider.
 * Uses the same moduleId ('microsoft-provider') — remove upstream before adding this.
 *
 * Note: Standard Microsoft OAuth tokens expire (typically 1 hour). The refresher
 * handles the expiring case — getToken triggers a refresh before the buffer expires.
 */
export const authMicrosoftTokenCaptureModule = createBackendModule({
  pluginId: 'auth',
  moduleId: 'microsoft-provider',
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
        const authenticatorWithLogout: typeof microsoftAuthenticator = {
          ...microsoftAuthenticator,
          async logout(
            input: OAuthAuthenticatorLogoutInput,
            ctx: Parameters<typeof microsoftAuthenticator.authenticate>[1],
          ) {
            if (microsoftAuthenticator.logout) {
              await microsoftAuthenticator.logout(input, ctx);
            }
            try {
              const credentials = await httpAuth.credentials(input.req, {
                allow: ['user'],
                allowLimitedAccess: true,
              });
              await tokenService.deleteTokens(
                credentials.principal.userEntityRef,
              );
              logger.info('Provider tokens deleted on Microsoft sign-out', {
                userEntityRef: credentials.principal.userEntityRef,
              });
            } catch (err) {
              logger.warn(
                'Failed to delete Microsoft provider tokens on sign-out',
                { error: err instanceof Error ? err.message : String(err) },
              );
            }
          },
        };

        providers.registerProvider({
          providerId: 'microsoft',
          factory: createOAuthProviderFactory({
            authenticator: authenticatorWithLogout,
            signInResolverFactories: {
              emailMatchingUserEntityAnnotation:
                createMicrosoftTokenCapturingResolver(tokenService),
              ...commonSignInResolvers,
            },
          }),
        });
      },
    });
  },
});
