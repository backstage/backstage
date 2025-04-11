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
import { OpenShiftStrategy } from './strategy';

/** @public */
export const openshiftAuthenticator = createOAuthAuthenticator({
  defaultProfileTransform:
    PassportOAuthAuthenticatorHelper.defaultProfileTransform,
  scopes: {
    required: ['user:info'],
  },
  initialize({ callbackUrl, config }) {
    const clientId = config.getString('clientId');
    const clientSecret = config.getString('clientSecret');
    const authorizationUrl = config.getString('authorizationUrl');
    const tokenUrl = config.getString('tokenUrl');
    const userUrl = config.getString('userUrl');

    return PassportOAuthAuthenticatorHelper.from(
      new OpenShiftStrategy(
        {
          clientID: clientId,
          clientSecret: clientSecret,
          callbackURL: callbackUrl,
          authorizationURL: authorizationUrl,
          tokenURL: tokenUrl,
          passReqToCallback: false,
          userUrl: userUrl,
        },
        (
          accessToken: any,
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
    // Same workaround as the GitHub provider; see https://github.com/backstage/backstage/issues/25383
    const { fullProfile, session } = await helper.authenticate(input);
    session.refreshToken = session.accessToken;
    session.refreshTokenExpiresInSeconds = session.expiresInSeconds;
    return { fullProfile, session };
  },
  async refresh(input, helper) {
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
});
