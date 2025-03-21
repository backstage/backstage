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
  bitbucketAuthenticator,
  bitbucketSignInResolvers,
} from '@backstage/plugin-auth-backend-module-bitbucket-provider';
import {
  SignInResolver,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import { Profile as PassportProfile } from 'passport';
import {
  adaptLegacyOAuthHandler,
  adaptLegacyOAuthSignInResolver,
  adaptOAuthSignInResolverToLegacy,
} from '../../lib/legacy';
import { OAuthResult } from '../../lib/oauth';
import { createAuthProviderIntegration } from '../createAuthProviderIntegration';
import { AuthHandler } from '../types';

/**
 * @public
 * @deprecated The Bitbucket auth provider was extracted to `@backstage/plugin-auth-backend-module-bitbucket-provider`.
 */
export type BitbucketOAuthResult = {
  fullProfile: BitbucketPassportProfile;
  params: {
    id_token?: string;
    scope: string;
    expires_in: number;
  };
  accessToken: string;
  refreshToken?: string;
};

/**
 * @public
 * @deprecated The Bitbucket auth provider was extracted to `@backstage/plugin-auth-backend-module-bitbucket-provider`.
 */
export type BitbucketPassportProfile = PassportProfile & {
  id?: string;
  displayName?: string;
  username?: string;
  avatarUrl?: string;
  _json?: {
    links?: {
      avatar?: {
        href?: string;
      };
    };
  };
};

/**
 * Auth provider integration for Bitbucket auth
 *
 * @public
 * @deprecated Migrate the auth plugin to the new backend system https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin
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
      resolver: SignInResolver<OAuthResult>;
    };
  }) {
    return createOAuthProviderFactory({
      authenticator: bitbucketAuthenticator,
      profileTransform: adaptLegacyOAuthHandler(options?.authHandler),
      signInResolver: adaptLegacyOAuthSignInResolver(options?.signIn?.resolver),
    });
  },
  resolvers: adaptOAuthSignInResolverToLegacy({
    userIdMatchingUserEntityAnnotation:
      bitbucketSignInResolvers.userIdMatchingUserEntityAnnotation(),
    usernameMatchingUserEntityAnnotation:
      bitbucketSignInResolvers.usernameMatchingUserEntityAnnotation(),
  }),
});
