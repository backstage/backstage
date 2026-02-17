/*
 * Copyright 2025 The Backstage Authors
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
  createOAuthAuthenticator,
  PassportOAuthAuthenticatorHelper,
  PassportOAuthDoneCallback,
  PassportProfile,
} from '@backstage/plugin-auth-node';
import { createHash } from 'node:crypto';
import OAuth2Strategy from 'passport-oauth2';
import { z } from 'zod/v3';

/** @public */
export interface OpenShiftAuthenticatorContext {
  openshiftApiServerUrl: string;
  helper: PassportOAuthAuthenticatorHelper;
}

/** @private
 * Schema for user.openshift.io/v1,
 * see https://docs.redhat.com/en/documentation/openshift_container_platform/latest/html/user_and_group_apis/user-user-openshift-io-v1#user-user-openshift-io-v1
 */
const OpenShiftUser = z.object({
  metadata: z.object({
    name: z.string(),
  }),
});

/** @public */
export const openshiftAuthenticator = createOAuthAuthenticator<
  OpenShiftAuthenticatorContext,
  PassportProfile
>({
  defaultProfileTransform:
    PassportOAuthAuthenticatorHelper.defaultProfileTransform,
  scopes: {
    required: ['user:full'],
  },
  initialize({ callbackUrl, config }) {
    const clientId = config.getString('clientId');
    const clientSecret = config.getString('clientSecret');
    const authorizationUrl = config.getString('authorizationUrl');
    const tokenUrl = config.getString('tokenUrl');
    const openshiftApiServerUrl = config.getString('openshiftApiServerUrl');

    // userUrl: `${openshiftApiServerUrl}/apis/user.openshift.io/v1/users/~`,
    const strategy = new OAuth2Strategy(
      {
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: callbackUrl,
        authorizationURL: authorizationUrl,
        tokenURL: tokenUrl,
        passReqToCallback: false,
      },
      (
        accessToken: any,
        refreshToken: string,
        params: any,
        fullProfile: PassportProfile,
        done: PassportOAuthDoneCallback,
      ) => {
        done(undefined, { fullProfile, params, accessToken }, { refreshToken });
      },
    );

    strategy.userProfile = function userProfile(
      accessToken: string,
      done: (err?: unknown, profile?: any) => void,
    ): void {
      this._oauth2.useAuthorizationHeaderforGET(true);

      this._oauth2.get(
        `${openshiftApiServerUrl}/apis/user.openshift.io/v1/users/~`,
        accessToken,
        (error, data, _) => {
          if (error !== null && error.statusCode !== 200) {
            done(new Error(`HTTP error! Status: ${error.statusCode}`));
            return;
          }

          if (!data) {
            done(new Error('No data provided!'));
            return;
          }

          if (typeof data !== 'string') {
            done(new Error('Data of type Buffer is not supported!'));
            return;
          }

          const user = OpenShiftUser.parse(JSON.parse(data));
          done(null, { displayName: user.metadata.name });
        },
      );
    };

    return {
      openshiftApiServerUrl,
      helper: PassportOAuthAuthenticatorHelper.from(strategy),
    };
  },
  async start(input, { helper }) {
    return helper.start(input, {
      accessType: 'offline',
      prompt: 'consent',
    });
  },
  async authenticate(input, { helper }) {
    // Same workaround as the GitHub provider; see https://github.com/backstage/backstage/issues/25383
    const { fullProfile, session } = await helper.authenticate(input);
    session.refreshToken = session.accessToken;
    session.refreshTokenExpiresInSeconds = session.expiresInSeconds;
    return { fullProfile, session };
  },
  async refresh(input, { helper }) {
    // Because the session is refreshed on login, this override is crucial,
    // see https://github.com/backstage/backstage/issues/25383
    const accessToken = input.refreshToken;

    const fullProfile = await helper.fetchProfile(accessToken).catch(error => {
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
      },
    };
  },
  async logout(input, { openshiftApiServerUrl, helper }) {
    // Due to the implementation of createOAuthRouteHandlers, only the refresh token is set.
    // In this provider, the refresh token actually IS the access token.
    const accessToken = input.refreshToken;
    if (!accessToken) {
      throw new Error('access token/refresh token needs to be set for logout');
    }

    // Check if access token is still valid.
    try {
      await helper.fetchProfile(accessToken);
    } catch {
      // Invalid token, no need to delete OAuthAccessToken.
      return;
    }

    // Calculate token name, see:
    // https://docs.redhat.com/en/documentation/openshift_container_platform/latest/html/oauth_apis/oauthaccesstoken-oauth-openshift-io-v1#apis-oauth-openshift-io-v1-oauthaccesstokens
    const tokenName = createHash('sha256')
      .update(accessToken.slice('sha256~'.length))
      .digest()
      .toString('base64url');

    const response = await fetch(
      `${openshiftApiServerUrl}/apis/oauth.openshift.io/v1/oauthaccesstokens/sha256~${tokenName}`,
      { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (response.status === 401) {
      throw new Error('unauthorized');
    }
  },
});
