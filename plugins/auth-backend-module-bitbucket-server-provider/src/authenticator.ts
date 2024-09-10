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

import { Strategy as OAuth2Strategy, VerifyCallback } from 'passport-oauth2';
import {
  createOAuthAuthenticator,
  PassportOAuthAuthenticatorHelper,
  PassportProfile,
} from '@backstage/plugin-auth-node';
import { fetchProfile } from './helpers';

/** @public */
export const bitbucketServerAuthenticator = createOAuthAuthenticator({
  defaultProfileTransform:
    PassportOAuthAuthenticatorHelper.defaultProfileTransform,
  initialize({ callbackUrl, config }) {
    const clientID = config.getString('clientId');
    const clientSecret = config.getString('clientSecret');
    const host = config.getString('host');
    const callbackURL = config.getOptionalString('callbackUrl') ?? callbackUrl;

    const helper = PassportOAuthAuthenticatorHelper.from(
      new OAuth2Strategy(
        {
          clientID,
          clientSecret,
          callbackURL,
          authorizationURL: `https://${host}/rest/oauth2/latest/authorize`,
          tokenURL: `https://${host}/rest/oauth2/latest/token`,
        },
        (
          accessToken: string,
          refreshToken: string,
          params: any,
          fullProfile: PassportProfile,
          done: VerifyCallback,
        ) => {
          done(
            undefined,
            { fullProfile, params, accessToken },
            { refreshToken },
          );
        },
      ),
    );

    return { helper, host };
  },

  async start(input, { helper }) {
    return helper.start(input, {
      accessType: 'offline',
      prompt: 'consent',
    });
  },

  async authenticate(input, { helper, host }) {
    const result = await helper.authenticate(input);

    // The OAuth2 strategy does not return a user profile, so we fetch it manually
    const fullProfile = await fetchProfile({
      host,
      accessToken: result.session.accessToken,
    });

    return { ...result, fullProfile };
  },

  async refresh(input, { helper, host }) {
    const result = await helper.refresh(input);

    // The OAuth2 strategy does not return a user profile, so we fetch it manually
    const fullProfile = await fetchProfile({
      host,
      accessToken: result.session.accessToken,
    });

    return { ...result, fullProfile };
  },
});
