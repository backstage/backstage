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

import {
  PassportOAuthAuthenticatorHelper,
  PassportOAuthDoneCallback,
  PassportProfile,
  createOAuthAuthenticator,
} from '@backstage/plugin-auth-node';
import { OAuth2Client } from 'google-auth-library';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

/** @public */
export const googleAuthenticator = createOAuthAuthenticator({
  defaultProfileTransform:
    PassportOAuthAuthenticatorHelper.defaultProfileTransform,
  initialize({ callbackUrl, config }) {
    const clientId = config.getString('clientId');
    const clientSecret = config.getString('clientSecret');

    return PassportOAuthAuthenticatorHelper.from(
      new GoogleStrategy(
        {
          clientID: clientId,
          clientSecret: clientSecret,
          callbackURL: callbackUrl,
          passReqToCallback: false,
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
            {
              fullProfile,
              params,
              accessToken,
            },
            {
              refreshToken,
            },
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
    return helper.authenticate(input);
  },

  async refresh(input, helper) {
    return helper.refresh(input);
  },

  async logout(input) {
    if (input.refreshToken) {
      const oauthClient = new OAuth2Client();
      await oauthClient.revokeToken(input.refreshToken);
    }
  },
});
