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
  Issuer,
  ClientAuthMethod,
  TokenSet,
  UserinfoResponse,
  Strategy as OidcStrategy,
} from 'openid-client';
import {
  createOAuthAuthenticator,
  decodeOAuthState,
  encodeOAuthState,
  PassportDoneCallback,
  PassportOAuthAuthenticatorHelper,
  PassportOAuthDoneCallback,
  PassportOAuthPrivateInfo,
  PassportProfile,
} from '@backstage/plugin-auth-node';
import { OidcAuthResult } from '@backstage/plugin-auth-backend';

/** @public */
export const oidcAuthenticator = createOAuthAuthenticator({
  defaultProfileTransform:
    PassportOAuthAuthenticatorHelper.defaultProfileTransform,
  async initialize({ callbackUrl, config }) {
    const clientId = config.getString('clientId');
    const clientSecret = config.getString('clientSecret');
    const customCallbackUrl = config.getOptionalString('callbackUrl');
    const callbackUrl2 = customCallbackUrl || callbackUrl;
    const metadataUrl = config.getString('metadataUrl');
    const tokenEndpointAuthMethod = config.getOptionalString(
      'tokenEndpointAuthMethod',
    ) as ClientAuthMethod;
    const tokenSignedResponseAlg = config.getOptionalString(
      'tokenSignedResponseAlg',
    );
    const initializedScope = config.getOptionalString('scope');
    const initializedPrompt = config.getOptionalString('prompt');
    const issuer = await Issuer.discover(
      `${metadataUrl}/.well-known/openid-configuration`,
    );
    const client = new issuer.Client({
      access_type: 'offline', // this option must be passed to provider to receive a refresh token
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: [callbackUrl2],
      response_types: ['code'],
      token_endpoint_auth_method:
        tokenEndpointAuthMethod || 'client_secret_basic',
      id_token_signed_response_alg: tokenSignedResponseAlg || 'RS256',
      scope: initializedScope || '',
    });

    const helper = PassportOAuthAuthenticatorHelper.from(
      new OidcStrategy(
        {
          client,
          passReqToCallback: false,
        },
        (
          tokenset: TokenSet,
          userinfo: UserinfoResponse,
          done: PassportDoneCallback<OidcAuthResult, PassportOAuthPrivateInfo>,
        ) => {
          if (typeof done !== 'function') {
            throw new Error(
              'OIDC IdP must provide a userinfo_endpoint in the metadata response',
            );
          }
          done(
            undefined,
            { tokenset, userinfo },
            {
              refreshToken: tokenset.refresh_token,
            },
          );
        },
      ),
    );

    return { helper, client, initializedScope, initializedPrompt };
  },

  async start(input, implementation) {
    const { initializedScope, initializedPrompt, helper } =
      await implementation;
    const options: Record<string, string> = {
      scope: input.scope || initializedScope || 'openid profile email',
      state: input.state,
    };
    const prompt = initializedPrompt || 'none';
    if (prompt !== 'auto') {
      options.prompt = prompt;
    }

    return helper.start(input, {
      ...options,
    });
  },

  async authenticate(input, implementation) {
    return (await implementation).helper.authenticate(input);
  },

  async refresh(input, implementation) {
    return (await implementation).helper.refresh(input);
  },
});
