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
import { union } from 'lodash';

/** @public */
export const microsoftAuthenticator = createOAuthAuthenticator({
  defaultProfileTransform:
    PassportOAuthAuthenticatorHelper.defaultProfileTransform,
  initialize({ callbackUrl, config }) {
    const clientId = config.getString('clientId');
    const clientSecret = config.getString('clientSecret');
    const tenantId = config.getString('tenantId');
    const domainHint = config.getOptionalString('domainHint');
    const scope = union(
      ['user.read'],
      config.getOptionalStringArray('additionalScopes'),
    );

    const helper = PassportOAuthAuthenticatorHelper.from(
      new ExtendedMicrosoftStrategy(
        {
          clientID: clientId,
          clientSecret: clientSecret,
          callbackURL: callbackUrl,
          tenant: tenantId,
          scope: scope,
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
