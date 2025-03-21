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

import express from 'express';
import {
  createOAuthAuthenticator,
  PassportOAuthAuthenticatorHelper,
  PassportOAuthDoneCallback,
  PassportProfile,
} from '@backstage/plugin-auth-node';
import { Auth0Strategy } from './strategy';

/** @public */
export const auth0Authenticator = createOAuthAuthenticator({
  defaultProfileTransform:
    PassportOAuthAuthenticatorHelper.defaultProfileTransform,
  initialize({ callbackUrl, config }) {
    const clientID = config.getString('clientId');
    const clientSecret = config.getString('clientSecret');
    const domain = config.getString('domain');
    const audience = config.getOptionalString('audience');
    const connection = config.getOptionalString('connection');
    const connectionScope = config.getOptionalString('connectionScope');
    const callbackURL = config.getOptionalString('callbackUrl') ?? callbackUrl;
    // Due to passport-auth0 forcing options.state = true,
    // passport-oauth2 requires express-session to be installed
    // so that the 'state' parameter of the oauth2 flow can be stored.
    // This implementation of StateStore matches the NullStore found within
    // passport-oauth2, which is the StateStore implementation used when options.state = false,
    // allowing us to avoid using express-session in order to integrate with auth0.
    const store = {
      store(_req: express.Request, cb: any) {
        cb(null, null);
      },
      verify(_req: express.Request, _state: string, cb: any) {
        cb(null, true);
      },
    };

    const helper = PassportOAuthAuthenticatorHelper.from(
      new Auth0Strategy(
        {
          clientID,
          clientSecret,
          callbackURL,
          domain,
          store,
          // We need passReqToCallback set to false to get params, but there's
          // no matching type signature for that, so instead behold this beauty
          passReqToCallback: false as true,
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
              accessToken,
              params,
            },
            {
              refreshToken,
            },
          );
        },
      ),
    );
    return { helper, audience, connection, connectionScope };
  },

  async start(
    input,
    { helper, audience, connection, connectionScope: connection_scope },
  ) {
    return helper.start(input, {
      accessType: 'offline',
      prompt: 'consent',
      ...(audience ? { audience } : {}),
      ...(connection ? { connection } : {}),
      ...(connection_scope ? { connection_scope } : {}),
    });
  },

  async authenticate(
    input,
    { helper, audience, connection, connectionScope: connection_scope },
  ) {
    return helper.authenticate(input, {
      ...(audience ? { audience } : {}),
      ...(connection ? { connection } : {}),
      ...(connection_scope ? { connection_scope } : {}),
    });
  },

  async refresh(input, { helper }) {
    return helper.refresh(input);
  },
});
