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

import {
  googleAuthenticator,
  googleSignInResolvers,
} from '@backstage/plugin-auth-backend-module-google-provider';
import {
  SignInResolver,
  commonSignInResolvers,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import {
  adaptLegacyOAuthHandler,
  adaptLegacyOAuthSignInResolver,
  adaptOAuthSignInResolverToLegacy,
} from '../../lib/legacy';
import { OAuthResult } from '../../lib/oauth';
import { createAuthProviderIntegration } from '../createAuthProviderIntegration';
import { AuthHandler } from '../types';

/**
 * Auth provider integration for Google auth
 *
 * @public
 * @deprecated Migrate the auth plugin to the new backend system https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin
 */
export const google = createAuthProviderIntegration({
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
      /**
       * Maps an auth result to a Backstage identity for the user.
       */
      resolver: SignInResolver<OAuthResult>;
    };
  }) {
    return createOAuthProviderFactory({
      authenticator: googleAuthenticator,
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
      googleSignInResolvers.emailMatchingUserEntityAnnotation(),
  }),
});
