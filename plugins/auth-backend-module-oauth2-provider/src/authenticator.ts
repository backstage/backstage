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

import { Strategy as Oauth2Strategy } from 'passport-oauth2';
import {
  createOAuthAuthenticator,
  PassportOAuthAuthenticatorHelper,
  PassportOAuthDoneCallback,
  PassportProfile,
} from '@backstage/plugin-auth-node';

/** @public */
export const oauth2Authenticator = createOAuthAuthenticator({
  defaultProfileTransform:
    PassportOAuthAuthenticatorHelper.defaultProfileTransform,
  initialize({ callbackUrl, config }) {
    const clientId = config.getString('clientId');
    const clientSecret = config.getString('clientSecret');
    const authorizationUrl = config.getString('authorizationUrl');
    const tokenUrl = config.getString('tokenUrl');
    const includeBasicAuth = config.getOptionalBoolean('includeBasicAuth');

    if (config.has('scope')) {
      throw new Error(
        'The oauth2 provider no longer supports the "scope" configuration option. Please use the "additionalScopes" option instead.',
      );
    }

    return PassportOAuthAuthenticatorHelper.from(
      new Oauth2Strategy(
        {
          clientID: clientId,
          clientSecret: clientSecret,
          callbackURL: callbackUrl,
          authorizationURL: authorizationUrl,
          tokenURL: tokenUrl,
          passReqToCallback: false,
          customHeaders: includeBasicAuth
            ? {
                Authorization: `Basic ${encodeClientCredentials(
                  clientId,
                  clientSecret,
                )}`,
              }
            : undefined,
        },
        (
          accessToken: any,
          refreshToken: any,
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

/** @private */
function encodeClientCredentials(
  clientID: string,
  clientSecret: string,
): string {
  return Buffer.from(`${clientID}:${clientSecret}`).toString('base64');
}
