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
import {
  authProvidersExtensionPoint,
  commonSignInResolvers,
  createOAuthProviderFactory,
  createSignInResolverFactory,
  OAuthAuthenticatorResult,
  SignInInfo,
} from '@backstage/plugin-auth-node';
import {
  githubAuthenticator,
  GithubProfile,
} from '@backstage/plugin-auth-backend-module-github-provider';
import { z } from 'zod';
import type { ProviderTokenService } from '@devhub/plugin-provider-token-backend';
import { providerTokenServiceRef } from '@devhub/plugin-provider-token-backend';

function createGithubTokenCapturingResolver(
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
      return async (
        info: SignInInfo<OAuthAuthenticatorResult<GithubProfile>>,
        ctx,
      ) => {
        const username = info.result.fullProfile.username;
        if (!username) {
          throw new Error('GitHub user profile does not contain a username');
        }

        // Token is persisted FIRST — sign-in aborts if this fails.
        // GitHub usernames map directly to catalog names.
        const userEntityRef = `user:${namespace}/${username}`;
        await tokenService.upsertToken(
          userEntityRef,
          'github',
          info.result.session,
        );

        return ctx.signInWithCatalogUser(
          { entityRef: { namespace, name: username } },
          {
            dangerousEntityRefFallback:
              options?.dangerouslyAllowSignInWithoutUserInCatalog
                ? { entityRef: { namespace, name: username } }
                : undefined,
          },
        );
      };
    },
  });
}

/**
 * Replaces @backstage/plugin-auth-backend-module-github-provider.
 * Uses moduleId 'github-provider' — remove upstream module before adding this.
 * Note: The existing packages/backend/src/authModuleGithubProvider.ts also uses
 * moduleId 'githubProvider' (different ID). If using the custom provider file,
 * remove that file from index.ts instead.
 *
 * Note: Standard GitHub OAuth tokens don't expire, but fine-grained GitHub App
 * tokens do. The refresher handles the expiring case — for classic tokens,
 * getToken simply returns the stored token without refresh.
 */
export const authGithubTokenCaptureModule = createBackendModule({
  pluginId: 'auth',
  moduleId: 'github-provider',
  register(reg) {
    reg.registerInit({
      deps: {
        providers: authProvidersExtensionPoint,
        tokenService: providerTokenServiceRef,
      },
      async init({ providers, tokenService }) {
        providers.registerProvider({
          providerId: 'github',
          factory: createOAuthProviderFactory({
            authenticator: githubAuthenticator,
            signInResolverFactories: {
              usernameMatchingUserEntityName:
                createGithubTokenCapturingResolver(tokenService),
              ...commonSignInResolvers,
            },
          }),
        });
      },
    });
  },
});
