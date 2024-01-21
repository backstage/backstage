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

import { SignInResolver, AuthHandler } from '../types';
import { OAuthResult } from '../../lib/oauth';
import { createAuthProviderIntegration } from '../createAuthProviderIntegration';
import {
  commonSignInResolvers,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import {
  adaptLegacyOAuthHandler,
  adaptLegacyOAuthSignInResolver,
  adaptOAuthSignInResolverToLegacy,
} from '../../lib/legacy';
import {
  microsoftAuthenticator,
  microsoftSignInResolvers,
} from '@backstage/plugin-auth-backend-module-microsoft-provider';

/**
 * Auth provider integration for Microsoft auth
 *
 * @public
 */
export const microsoft = createAuthProviderIntegration({
  create(options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<OAuthResult>;

    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
      resolver: SignInResolver<OAuthResult>;
    };
  }) {
    return createOAuthProviderFactory({
      authenticator: microsoftAuthenticator,
      profileTransform: adaptLegacyOAuthHandler(options?.authHandler),
      signInResolver: adaptLegacyOAuthSignInResolver(options?.signIn?.resolver),
    });
  },
  resolvers: adaptOAuthSignInResolverToLegacy({
    emailLocalPartMatchingUserEntityName:
      commonSignInResolvers.emailLocalPartMatchingUserEntityName(),
    emailMatchingUserEntityProfileEmail:
      commonSignInResolvers.emailMatchingUserEntityProfileEmail(),
    emailMatchingUserEntityAnnotation:
      microsoftSignInResolvers.emailMatchingUserEntityAnnotation(),
  }),
});
