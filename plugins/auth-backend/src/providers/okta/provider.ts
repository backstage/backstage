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
import { OAuthResult } from '../../lib/oauth';

import { createAuthProviderIntegration } from '../createAuthProviderIntegration';
import {
  SignInResolver,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import {
  adaptLegacyOAuthHandler,
  adaptLegacyOAuthSignInResolver,
} from '../../lib/legacy';
import { oktaAuthenticator } from '@backstage/plugin-auth-backend-module-okta-provider';
import {
  commonByEmailLocalPartResolver,
  commonByEmailResolver,
} from '../resolvers';

/**
 * Auth provider integration for Okta auth
 *
 * @public
 * @deprecated Migrate the auth plugin to the new backend system https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin
 */
export const okta = createAuthProviderIntegration({
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
      authenticator: oktaAuthenticator,
      profileTransform: adaptLegacyOAuthHandler(options?.authHandler),
      signInResolver: adaptLegacyOAuthSignInResolver(options?.signIn?.resolver),
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
    /**
     * Looks up the user by matching their email to the `okta.com/email` annotation.
     */
    emailMatchingUserEntityAnnotation(): SignInResolver<OAuthResult> {
      return async (info, ctx) => {
        const { profile } = info;

        if (!profile.email) {
          throw new Error('Okta profile contained no email');
        }

        return ctx.signInWithCatalogUser({
          annotations: {
            'okta.com/email': profile.email,
          },
        });
      };
    },
  },
});
