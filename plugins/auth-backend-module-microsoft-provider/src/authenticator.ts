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
import { ExtendedMicrosoftStrategy } from './strategy';

/** @public */
export const microsoftAuthenticator = createOAuthAuthenticator({
  defaultProfileTransform:
    PassportOAuthAuthenticatorHelper.defaultProfileTransform,
  scopes: {
    required: ['email', 'openid', 'offline_access', 'user.read'],
    transform({ requested, granted, required, additional }) {
      // Resources scopes are of the form `<resource>/<scope>`, and are handled
      // separately from the normal scopes in the client. When request a
      // resource scope we should only include forward the request scope along
      // with offline_access.
      const hasResourceScope = Array.from(requested).some(s => s.includes('/'));
      if (hasResourceScope) {
        return [...requested, 'offline_access'];
      }
      return [...requested, ...granted, ...required, ...additional];
    },
  },
  initialize({ callbackUrl, config }) {
    const clientId = config.getString('clientId');
    const clientSecret = config.getString('clientSecret');
    const tenantId = config.getString('tenantId');
    const domainHint = config.getOptionalString('domainHint');
    const skipUserProfile =
      config.getOptionalBoolean('skipUserProfile') ?? false;

    const strategy = new ExtendedMicrosoftStrategy(
      {
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: callbackUrl,
        tenant: tenantId,
      },
      (
        accessToken: string,
        refreshToken: string,
        params: any,
        fullProfile: PassportProfile,
        done: PassportOAuthDoneCallback,
      ) => {
        done(undefined, { fullProfile, params, accessToken }, { refreshToken });
      },
    );

    strategy.setSkipUserProfile(skipUserProfile);
    const helper = PassportOAuthAuthenticatorHelper.from(strategy);

    return {
      helper,
      domainHint,
    };
  },

  async start(input, ctx) {
    const options: Record<string, string> = {
      accessType: 'offline',
    };

    if (ctx.domainHint !== undefined) {
      options.domain_hint = ctx.domainHint;
    }

    return ctx.helper.start(input, options);
  },

  async authenticate(input, ctx) {
    return ctx.helper.authenticate(input);
  },

  async refresh(input, ctx) {
    return ctx.helper.refresh(input);
  },
});
