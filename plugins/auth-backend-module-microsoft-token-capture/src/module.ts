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
import { createBackendModule } from '@backstage/backend-plugin-api';
import { stringifyEntityRef } from '@backstage/catalog-model';
import {
  authProvidersExtensionPoint,
  commonSignInResolvers,
  createOAuthProviderFactory,
  createSignInResolverFactory,
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

        // Step 1: Resolve the catalog entity to get the correct userEntityRef.
        // Uses the microsoft.com/email annotation — the same annotation that the
        // upstream emailMatchingUserEntityAnnotation resolver uses.
        // findCatalogUser throws if no entity matches (sign-in aborts cleanly).
        const { entity } = await ctx.findCatalogUser({
          annotations: { 'microsoft.com/email': email },
        });
        const userEntityRef = stringifyEntityRef(entity);

        // Step 2: Persist the token now that we have the correct userEntityRef.
        await tokenService.upsertToken(
          userEntityRef,
          'microsoft',
          info.result.session,
        );

        // Step 3: Complete sign-in (second catalog lookup is idempotent).
        return ctx.signInWithCatalogUser(
          { annotations: { 'microsoft.com/email': email } },
          {
            dangerousEntityRefFallback:
              options?.dangerouslyAllowSignInWithoutUserInCatalog
                ? { entityRef: { name: email.split('@')[0] } }
                : undefined,
          },
        );
      };
    },
  });
}

/**
 * Replaces @backstage/plugin-auth-backend-module-microsoft-provider.
 * Uses the same moduleId ('microsoft-provider') — remove upstream before adding this.
 */
export const authMicrosoftTokenCaptureModule = createBackendModule({
  pluginId: 'auth',
  moduleId: 'microsoft-provider',
  register(reg) {
    reg.registerInit({
      deps: {
        providers: authProvidersExtensionPoint,
        tokenService: providerTokenServiceRef,
      },
      async init({ providers, tokenService }) {
        providers.registerProvider({
          providerId: 'microsoft',
          factory: createOAuthProviderFactory({
            authenticator: microsoftAuthenticator,
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
