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
import { bitbucketAuthenticator } from '@backstage/plugin-auth-backend-module-bitbucket-provider';
import { createOAuthProviderFactory } from '@backstage/plugin-auth-node';
import {
  adaptLegacyOAuthHandler,
  adaptLegacyOAuthSignInResolver,
} from '../../lib/legacy';

/**
 * Auth provider integration for BitBucket auth
 *
 * @public
 */
export const bitbucket = createAuthProviderIntegration({
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
      authenticator: bitbucketAuthenticator,
      profileTransform: adaptLegacyOAuthHandler(options?.authHandler),
      signInResolver: adaptLegacyOAuthSignInResolver(options?.signIn?.resolver),
    });
  },
  resolvers: {
    /**
     * Looks up the user by matching their username to the `bitbucket.org/username` annotation.
     */
    usernameMatchingUserEntityAnnotation(): SignInResolver<OAuthResult> {
      return async (info, ctx) => {
        const { result } = info;

        if (!result.fullProfile.username) {
          throw new Error('Bitbucket profile contained no Username');
        }

        return ctx.signInWithCatalogUser({
          annotations: {
            'bitbucket.org/username': result.fullProfile.username,
          },
        });
      };
    },
    /**
     * Looks up the user by matching their user ID to the `bitbucket.org/user-id` annotation.
     */
    userIdMatchingUserEntityAnnotation(): SignInResolver<OAuthResult> {
      return async (info, ctx) => {
        const { result } = info;

        if (!result.fullProfile.id) {
          throw new Error('Bitbucket profile contained no User ID');
        }

        return ctx.signInWithCatalogUser({
          annotations: {
            'bitbucket.org/user-id': result.fullProfile.id,
          },
        });
      };
    },
  },
});
