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
import { PassportDoneCallback } from '@backstage/plugin-auth-node';
import {
  createOAuthAuthenticator,
  decodeOAuthState,
  encodeOAuthState,
} from '@backstage/plugin-auth-node';
import {
  Client,
  Issuer,
  TokenSet,
  Strategy as OidcStrategy,
} from 'openid-client';

const rfc8693TokenExchange = async ({
  subject_token,
  target_audience,
  ctx,
}: {
  subject_token: string;
  target_audience: string;
  ctx: Promise<{
    providerStrategy: OidcStrategy<{}>;
    client: Client;
  }>;
}): Promise<string | undefined> => {
  const { client } = await ctx;
  return client
    .grant({
      grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
      subject_token,
      audience: target_audience,
      subject_token_type: 'urn:ietf:params:oauth:token-type:access_token',
      requested_token_type: 'urn:ietf:params:oauth:token-type:jwt',
    })
    .then(tokenset => tokenset.access_token)
    .catch(err => {
      throw new Error(`RFC8693 token exchange failed with error: ${err}`);
    });
};

/** @public */
export const pinnipedAuthenticator = createOAuthAuthenticator({
  defaultProfileTransform: async (_r, _c) => ({ profile: {} }),
  async initialize({ callbackUrl, config }) {
    const issuer = await Issuer.discover(
      `${config.getString(
        'federationDomain',
      )}/.well-known/openid-configuration`,
    );
    const client = new issuer.Client({
      access_type: 'offline', // this option must be passed to provider to receive a refresh token
      client_id: config.getString('clientId'),
      client_secret: config.getString('clientSecret'),
      redirect_uris: [callbackUrl],
      response_types: ['code'],
      scope: config.getOptionalString('scope') || '',
      id_token_signed_response_alg: 'ES256',
    });
    const providerStrategy = new OidcStrategy(
      {
        client,
        passReqToCallback: false,
      },
      (
        tokenset: TokenSet,
        done: PassportDoneCallback<
          { tokenset: TokenSet },
          {
            refreshToken?: string;
          }
        >,
      ) => {
        done(undefined, { tokenset }, {});
      },
    );

    return { providerStrategy, client };
  },

  async start(input, ctx) {
    const { providerStrategy } = await ctx;
    const stringifiedAudience = input.req.query?.audience as string;
    const decodedState = decodeOAuthState(input.state);
    const state = { ...decodedState, audience: stringifiedAudience };
    const options: Record<string, string> = {
      scope:
        input.scope ||
        'openid pinniped:request-audience username offline_access',
      state: encodeOAuthState(state),
    };

    return new Promise((resolve, reject) => {
      const strategy = Object.create(providerStrategy);
      strategy.redirect = (url: string) => {
        resolve({ url });
      };
      strategy.error = (error: Error) => {
        reject(error);
      };
      strategy.authenticate(input.req, { ...options });
    });
  },

  async authenticate(input, ctx) {
    const { providerStrategy } = await ctx;
    const { req } = input;
    const { searchParams } = new URL(req.url, 'https://pinniped.com');
    const stateParam = searchParams.get('state');
    const audience = stateParam
      ? decodeOAuthState(stateParam).audience
      : undefined;

    return new Promise((resolve, reject) => {
      const strategy = Object.create(providerStrategy);
      strategy.success = (user: any) => {
        (audience
          ? rfc8693TokenExchange({
              subject_token: user.tokenset.access_token,
              target_audience: audience,
              ctx,
            }).catch(err =>
              reject(
                new Error(
                  `Failed to get cluster specific ID token for "${audience}": ${err}`,
                ),
              ),
            )
          : Promise.resolve(user.tokenset.id_token)
        ).then(idToken => {
          resolve({
            fullProfile: { provider: '', id: '', displayName: '' },
            session: {
              accessToken: user.tokenset.access_token!,
              tokenType: user.tokenset.token_type ?? 'bearer',
              scope: user.tokenset.scope!,
              idToken,
              refreshToken: user.tokenset.refresh_token,
            },
          });
        });
      };

      strategy.fail = (info: any) => {
        reject(new Error(`Authentication rejected, ${info.message || ''}`));
      };

      strategy.error = (error: Error) => {
        reject(error);
      };

      strategy.redirect = () => {
        reject(new Error('Unexpected redirect'));
      };

      strategy.authenticate(req);
    });
  },

  async refresh(input, ctx) {
    const { client } = await ctx;
    const tokenset = await client.refresh(input.refreshToken);

    return new Promise((resolve, reject) => {
      if (!tokenset.access_token) {
        reject(new Error('Refresh Failed'));
      }

      resolve({
        fullProfile: { provider: '', id: '', displayName: '' },
        session: {
          accessToken: tokenset.access_token!,
          tokenType: tokenset.token_type ?? 'bearer',
          scope: tokenset.scope!,
          idToken: tokenset.id_token,
          refreshToken: tokenset.refresh_token,
        },
      });
    });
  },
});
