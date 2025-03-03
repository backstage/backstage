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

import { Strategy as GithubStrategy } from 'passport-github2';
import {
  createOAuthAuthenticator,
  PassportOAuthAuthenticatorHelper,
  PassportOAuthDoneCallback,
  PassportProfile,
} from '@backstage/plugin-auth-node';

const ACCESS_TOKEN_PREFIX = 'access-token-v2.';

/** @public */
export const githubAuthenticator = createOAuthAuthenticator({
  defaultProfileTransform:
    PassportOAuthAuthenticatorHelper.defaultProfileTransform,
  scopes: {
    persist: true,
    required: ['read:user'],
  },
  initialize({ callbackUrl, config }) {
    const clientId = config.getString('clientId');
    const clientSecret = config.getString('clientSecret');
    const enterpriseInstanceUrl = config
      .getOptionalString('enterpriseInstanceUrl')
      ?.replace(/\/$/, '');
    const authorizationUrl = enterpriseInstanceUrl
      ? `${enterpriseInstanceUrl}/login/oauth/authorize`
      : undefined;
    const tokenUrl = enterpriseInstanceUrl
      ? `${enterpriseInstanceUrl}/login/oauth/access_token`
      : undefined;
    const userProfileUrl = enterpriseInstanceUrl
      ? `${enterpriseInstanceUrl}/api/v3/user`
      : undefined;

    return PassportOAuthAuthenticatorHelper.from(
      new GithubStrategy(
        {
          clientID: clientId,
          clientSecret: clientSecret,
          callbackURL: callbackUrl,
          tokenURL: tokenUrl,
          userProfileURL: userProfileUrl,
          authorizationURL: authorizationUrl,
        },
        (
          accessToken: string,
          refreshToken: string,
          params: any,
          fullProfile: PassportProfile,
          done: PassportOAuthDoneCallback,
        ) => {
          done(
            undefined,
            { fullProfile, params, accessToken },
            { refreshToken },
          );
        },
      ),
    );
  },

  async start(input, helper) {
    return helper.start(input, {
      accessType: 'offline',
      prompt: 'consent',
    });
  },

  async authenticate(input, helper) {
    const { fullProfile, session } = await helper.authenticate(input);

    // If we do not have a real refresh token and we have a non-expiring
    // access token, then we use that as our refresh token.
    if (!session.refreshToken && !session.expiresInSeconds) {
      session.refreshToken = ACCESS_TOKEN_PREFIX + session.accessToken;
    }
    return { fullProfile, session };
  },

  async refresh(input, helper) {
    // This is the OAuth App flow. A non-expiring access token is stored in the
    // refresh token cookie. We use that token to fetch the user profile and
    // refresh the Backstage session when needed.
    if (input.refreshToken?.startsWith(ACCESS_TOKEN_PREFIX)) {
      if (!input.scopeAlreadyGranted) {
        throw new Error(
          'Refresh failed, session has not been granted the requested scope',
        );
      }
      const accessToken = input.refreshToken.slice(ACCESS_TOKEN_PREFIX.length);

      const fullProfile = await helper
        .fetchProfile(accessToken)
        .catch(error => {
          if (error.oauthError?.statusCode === 401) {
            throw new Error('Invalid access token');
          }
          throw error;
        });

      return {
        fullProfile,
        session: {
          accessToken,
          tokenType: 'bearer',
          scope: input.scope,
          refreshToken: input.refreshToken,
          // No expiration
        },
      };
    }

    // This is the App flow, which is close to a standard OAuth refresh flow. It has a
    // pretty long session expiration, and it also ignores the requested scope, instead
    // just allowing access to whatever is configured as part of the app installation.
    return helper.refresh(input);
  },
});
