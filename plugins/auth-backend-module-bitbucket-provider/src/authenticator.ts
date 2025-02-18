/*
 * Copyright 2024 The Backstage Authors
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

import { Strategy as BitbucketStrategy } from 'passport-bitbucket-oauth2';
import {
  createOAuthAuthenticator,
  PassportOAuthAuthenticatorHelper,
  PassportOAuthDoneCallback,
  PassportProfile,
} from '@backstage/plugin-auth-node';

/** @public */
export const bitbucketAuthenticator = createOAuthAuthenticator({
  defaultProfileTransform:
    PassportOAuthAuthenticatorHelper.defaultProfileTransform,
  scopes: {
    required: ['account'],
    persist: true,
  },
  initialize({ callbackUrl, config }) {
    const clientID = config.getString('clientId');
    const clientSecret = config.getString('clientSecret');
    const baseURL = 'https://bitbucket.org/site/oauth2';

    return PassportOAuthAuthenticatorHelper.from(
      new BitbucketStrategy(
        {
          clientID,
          clientSecret,
          callbackURL: callbackUrl,
          passReqToCallback: false,
          baseURL,
          authorizationURL: `${baseURL}/authorize`,
          tokenURL: `${baseURL}/access_token`,
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
    return helper.authenticate(input);
  },

  async refresh(input, helper) {
    return helper.refresh(input);
  },
});
