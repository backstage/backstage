/*
 * Copyright 2020 The Backstage Authors
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

import { AuthHandler } from '../types';
import { createAuthProviderIntegration } from '../createAuthProviderIntegration';
import {
  createOAuthProviderFactory,
  AuthResolverContext,
  BackstageSignInResult,
  OAuthAuthenticatorResult,
  SignInInfo,
  SignInResolver,
} from '@backstage/plugin-auth-node';
import {
  oidcAuthenticator,
  OidcAuthResult,
} from '@backstage/plugin-auth-backend-module-oidc-provider';
import {
  commonByEmailLocalPartResolver,
  commonByEmailResolver,
} from '../resolvers';

/**
 * Auth provider integration for generic OpenID Connect auth
 *
 * @public
 * @deprecated Migrate the auth plugin to the new backend system https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin
 */
export const oidc = createAuthProviderIntegration({
  create(options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<OidcAuthResult>;

    /**
     * Configure sign-in for this provider; convert user profile respones into
     * Backstage identities.
     */
    signIn?: {
      resolver: SignInResolver<OidcAuthResult>;
    };
  }) {
    const authHandler = options?.authHandler;
    const signInResolver = options?.signIn?.resolver;
    return createOAuthProviderFactory({
      authenticator: oidcAuthenticator,
      profileTransform:
        authHandler &&
        ((
          result: OAuthAuthenticatorResult<OidcAuthResult>,
          context: AuthResolverContext,
        ) => authHandler(result.fullProfile, context)),
      signInResolver:
        signInResolver &&
        ((
          info: SignInInfo<OAuthAuthenticatorResult<OidcAuthResult>>,
          context: AuthResolverContext,
        ): Promise<BackstageSignInResult> =>
          signInResolver(
            {
              result: info.result.fullProfile,
              profile: info.profile,
            },
            context,
          )),
    });
  },
  resolvers: {
    /**
     * Looks up the user by matching their email local part to the entity name.
     */
    emailLocalPartMatchingUserEntityName: () => commonByEmailLocalPartResolver,
    /**
     * Looks up the user by matching their email to the entity email.
     */
    emailMatchingUserEntityProfileEmail: () => commonByEmailResolver,
  },
});
