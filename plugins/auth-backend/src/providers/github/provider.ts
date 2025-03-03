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

import { Profile as PassportProfile } from 'passport';
import { AuthHandler, StateEncoder } from '../types';
import { createAuthProviderIntegration } from '../createAuthProviderIntegration';
import {
  createOAuthProviderFactory,
  OAuthAuthenticatorResult,
  ProfileTransform,
  SignInResolver,
} from '@backstage/plugin-auth-node';
import { githubAuthenticator } from '@backstage/plugin-auth-backend-module-github-provider';

/**
 * @public
 * @deprecated Migrate the auth plugin to the new backend system https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin
 */
export type GithubOAuthResult = {
  fullProfile: PassportProfile;
  params: {
    scope: string;
    expires_in?: string;
    refresh_token_expires_in?: string;
  };
  accessToken: string;
  refreshToken?: string;
};

/**
 * Auth provider integration for GitHub auth
 *
 * @public
 * @deprecated Migrate the auth plugin to the new backend system https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin
 */
export const github = createAuthProviderIntegration({
  create(options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<GithubOAuthResult>;

    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
      /**
       * Maps an auth result to a Backstage identity for the user.
       */
      resolver: SignInResolver<GithubOAuthResult>;
    };

    /**
     * The state encoder used to encode the 'state' parameter on the OAuth request.
     *
     * It should return a string that takes the state params (from the request), url encodes the params
     * and finally base64 encodes them.
     *
     * Providing your own stateEncoder will allow you to add addition parameters to the state field.
     *
     * It is typed as follows:
     *   `export type StateEncoder = (input: OAuthState) => Promise<{encodedState: string}>;`
     *
     * Note: the stateEncoder must encode a 'nonce' value and an 'env' value. Without this, the OAuth flow will fail
     * (These two values will be set by the req.state by default)
     *
     * For more information, please see the helper module in ../../oauth/helpers #readState
     */
    stateEncoder?: StateEncoder;
  }) {
    const authHandler = options?.authHandler;
    const signInResolver = options?.signIn?.resolver;
    return createOAuthProviderFactory({
      authenticator: githubAuthenticator,
      profileTransform:
        authHandler &&
        ((async (result, ctx) =>
          authHandler!(
            {
              fullProfile: result.fullProfile,
              accessToken: result.session.accessToken,
              params: {
                scope: result.session.scope,
                expires_in: result.session.expiresInSeconds
                  ? String(result.session.expiresInSeconds)
                  : '',
                refresh_token_expires_in: result.session
                  .refreshTokenExpiresInSeconds
                  ? String(result.session.refreshTokenExpiresInSeconds)
                  : '',
              },
            },
            ctx,
          )) as ProfileTransform<OAuthAuthenticatorResult<PassportProfile>>),
      signInResolver:
        signInResolver &&
        ((async ({ profile, result }, ctx) =>
          signInResolver(
            {
              profile: profile,
              result: {
                fullProfile: result.fullProfile,
                accessToken: result.session.accessToken,
                refreshToken: result.session.refreshToken,
                params: {
                  scope: result.session.scope,
                  expires_in: result.session.expiresInSeconds
                    ? String(result.session.expiresInSeconds)
                    : '',
                  refresh_token_expires_in: result.session
                    .refreshTokenExpiresInSeconds
                    ? String(result.session.refreshTokenExpiresInSeconds)
                    : '',
                },
              },
            },
            ctx,
          )) as SignInResolver<OAuthAuthenticatorResult<PassportProfile>>),
    });
  },
  resolvers: {
    /**
     * Looks up the user by matching their GitHub username to the entity name.
     */
    usernameMatchingUserEntityName: (): SignInResolver<GithubOAuthResult> => {
      return async (info, ctx) => {
        const { fullProfile } = info.result;

        const userId = fullProfile.username;
        if (!userId) {
          throw new Error(`GitHub user profile does not contain a username`);
        }

        return ctx.signInWithCatalogUser({ entityRef: { name: userId } });
      };
    },
  },
});
