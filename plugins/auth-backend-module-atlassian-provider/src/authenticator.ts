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
  createOAuthAuthenticator,
  PassportOAuthAuthenticatorHelper,
  PassportOAuthDoneCallback,
  PassportProfile,
} from '@backstage/plugin-auth-node';
import AtlassianStrategy from 'passport-atlassian-oauth2';

/** @public */
export const atlassianAuthenticator = createOAuthAuthenticator({
  defaultProfileTransform:
    PassportOAuthAuthenticatorHelper.defaultProfileTransform,
  scopes: {
    required: ['offline_access', 'read:me', 'read:jira-work', 'read:jira-user'],
  },
  initialize({ callbackUrl, config }) {
    const clientId = config.getString('clientId');
    const clientSecret = config.getString('clientSecret');
    const baseUrl = 'https://auth.atlassian.com';

    if (config.has('scope') || config.has('scopes')) {
      throw new Error(
        'The atlassian provider no longer supports the "scope" or "scopes" configuration options. Please use the "additionalScopes" option instead.',
      );
    }

    return PassportOAuthAuthenticatorHelper.from(
      new AtlassianStrategy(
        {
          clientID: clientId,
          clientSecret: clientSecret,
          callbackURL: callbackUrl,
          baseURL: baseUrl,
          authorizationURL: `${baseUrl}/authorize`,
          tokenURL: `${baseUrl}/oauth/token`,
          profileURL: 'https://api.atlassian.com/me',
          scope: [], // the Atlassian strategy requires a scope, but Backstage passes the right set of scopes when calling OAuth2Strategy.prototype.authenticate
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
