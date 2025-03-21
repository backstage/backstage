/*
 * Copyright 2023 The Backstage Authors
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

import { Profile as PassportProfile } from 'passport';
import {
  AuthResolverContext,
  createOAuthProviderFactory,
  SignInResolver,
} from '@backstage/plugin-auth-node';
import {
  bitbucketServerAuthenticator,
  bitbucketServerSignInResolvers,
} from '@backstage/plugin-auth-backend-module-bitbucket-server-provider';
import { OAuthProviderOptions } from '../../lib/oauth';
import {
  adaptLegacyOAuthHandler,
  adaptLegacyOAuthSignInResolver,
} from '../../lib/legacy';
import { AuthHandler } from '../types';
import { createAuthProviderIntegration } from '../createAuthProviderIntegration';

/**
 * @public
 * @deprecated The Bitbucket Server auth provider was extracted to `@backstage/plugin-auth-backend-module-bitbucket-server-provider`.
 */
export type BitbucketServerOAuthResult = {
  fullProfile: PassportProfile;
  params: {
    scope: string;
    access_token?: string;
    token_type?: string;
    expires_in?: number;
  };
  accessToken: string;
  refreshToken?: string;
};

/**
 * @public
 * @deprecated The Bitbucket Server auth provider was extracted to `@backstage/plugin-auth-backend-module-bitbucket-server-provider`.
 */
export type BitbucketServerAuthProviderOptions = OAuthProviderOptions & {
  host: string;
  authorizationUrl: string;
  tokenUrl: string;
  authHandler: AuthHandler<BitbucketServerOAuthResult>;
  signInResolver?: SignInResolver<BitbucketServerOAuthResult>;
  resolverContext: AuthResolverContext;
};

export const bitbucketServer = createAuthProviderIntegration({
  create(options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<BitbucketServerOAuthResult>;

    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
      /**
       * Maps an auth result to a Backstage identity for the user.
       */
      resolver: SignInResolver<BitbucketServerOAuthResult>;
    };
  }) {
    return createOAuthProviderFactory({
      authenticator: bitbucketServerAuthenticator,
      profileTransform: adaptLegacyOAuthHandler(options?.authHandler),
      signInResolver: adaptLegacyOAuthSignInResolver(options?.signIn?.resolver),
    });
  },
  resolvers: {
    /**
     * Looks up the user by matching their email to the entity email.
     */
    emailMatchingUserEntityProfileEmail:
      (): SignInResolver<BitbucketServerOAuthResult> => {
        const resolver =
          bitbucketServerSignInResolvers.emailMatchingUserEntityProfileEmail();
        return async (info, ctx) => {
          return resolver(
            {
              profile: info.profile,
              result: {
                fullProfile: info.result.fullProfile,
                session: {
                  accessToken: info.result.accessToken,
                  tokenType: info.result.params.token_type ?? 'bearer',
                  scope: info.result.params.scope,
                  expiresInSeconds: info.result.params.expires_in,
                  refreshToken: info.result.refreshToken,
                },
              },
            },
            ctx,
          );
        };
      },
  },
});
