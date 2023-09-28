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
  PassportOAuthAuthenticatorHelper,
  PassportOAuthDoneCallback,
} from '@backstage/plugin-auth-node';

/** @public */
export const oidcAuthenticator = createOAuthAuthenticator({
  defaultProfileTransform:
    PassportOAuthAuthenticatorHelper.defaultProfileTransform,
  async initialize({ callbackUrl, config }) {
    const clientId = config.getString('clientId');
    const clientSecret = config.getString('clientSecret');
    const metadataUrl = config.getString('metadataUrl');
    const customCallbackUrl = config.getOptionalString('callbackUrl');
    const callbackUrl2 = customCallbackUrl || callbackUrl;
    const tokenEndpointAuthMethod = config.getOptionalString(
      'tokenEndpointAuthMethod',
    ) as ClientAuthMethod;
    const tokenSignedResponseAlg = config.getOptionalString(
      'tokenSignedResponseAlg',
    );
    const initializedScope = config.getOptionalString('scope');
    const initializedPrompt = config.getOptionalString('prompt');

    const issuer = await Issuer.discover(metadataUrl);
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

    const strategy = new OidcStrategy(
      {
        client,
        passReqToCallback: false,
      },
      (
        tokenset: TokenSet,
        userinfo: UserinfoResponse,
        done: PassportOAuthDoneCallback,
      ) => {
        if (typeof done !== 'function') {
          throw new Error(
            'OIDC IdP must provide a userinfo_endpoint in the metadata response',
          );
        }

        const emails = userinfo.email ? [{ value: userinfo.email }] : undefined;
        const photos = userinfo.picture
          ? [{ value: userinfo.picture }]
          : undefined;
        const name =
          userinfo.family_name && userinfo.given_name
            ? {
                familyName: userinfo.family_name,
                givenName: userinfo.given_name,
                middleName: userinfo.middle_name,
              }
            : undefined;

        done(
          undefined,
          {
            fullProfile: {
              provider: 'oidc',
              id: userinfo.sub,
              displayName: userinfo.name!,
              username: userinfo.preferred_username,
              name,
              emails,
              photos,
            },
            accessToken: tokenset.access_token!,
            params: {
              id_token: tokenset.id_token,
              scope: tokenset.scope!,
              expires_in: tokenset.expires_in!,
              token_type: tokenset.token_type,
            },
          },
          {
            refreshToken: tokenset.refresh_token,
          },
        );
      },
    );

    const helper = PassportOAuthAuthenticatorHelper.from(strategy);

    return { helper, client, initializedScope, initializedPrompt, strategy };
  },

  async start(input, ctx) {
    const { initializedScope, initializedPrompt, helper, strategy } = await ctx;
    const options: Record<string, string> = {
      scope: input.scope || initializedScope || 'openid profile email',
      state: input.state,
    };
    const prompt = initializedPrompt || 'none';
    if (prompt !== 'auto') {
      options.prompt = prompt;
    }

    return new Promise((resolve, reject) => {
      strategy.error = reject;

      return helper
        .start(input, {
          ...options,
        })
        .then(resolve);
    });
  },

  async authenticate(input, ctx) {
    return (await ctx).helper.authenticate(input);
  },

  async refresh(input, ctx) {
    const { client } = await ctx;
    const tokenset = await client.refresh(input.refreshToken);
    if (!tokenset.access_token) {
      throw new Error('Refresh failed');
    }
    if (!tokenset.scope) {
      tokenset.scope = input.scope;
    }
    const userinfo = await client.userinfo(tokenset.access_token);

    return new Promise((resolve, reject) => {
      if (!tokenset.access_token) {
        reject(new Error('Refresh Failed'));
      }
      resolve({
        fullProfile: {
          provider: 'oidc',
          id: userinfo.sub,
          displayName: userinfo.name!,
        },
        session: {
          accessToken: tokenset.access_token!,
          tokenType: tokenset.token_type ?? 'bearer',
          scope: tokenset.scope!,
          expiresInSeconds: tokenset.expires_in,
          idToken: tokenset.id_token,
          refreshToken: tokenset.refresh_token,
        },
      });
    });
  },
});
