/*
 * Copyright 2020 Spotify AB
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
  Issuer,
  Client,
  Strategy as OidcStrategy,
  TokenSet,
  UserinfoResponse,
} from 'openid-client';
import {
  OAuthAdapter,
  OAuthProviderOptions,
  OAuthHandlers,
  OAuthResponse,
  OAuthEnvironmentHandler,
  OAuthStartRequest,
  encodeState,
  OAuthRefreshRequest,
} from '../../lib/oauth';
import {
  executeFetchUserProfileStrategy,
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
  executeRefreshTokenStrategy,
  PassportDoneCallback,
} from '../../lib/passport';
import { RedirectInfo, AuthProviderFactory, ProfileInfo } from '../types';

type PrivateInfo = {
  refreshToken: string;
};

export type OidcAuthProviderOptions = OAuthProviderOptions & {
  authorizationUrl: string;
  tokenUrl: string;
  adUrl: string;
  tokenSignedResponseAlg?: string;
};

export class OidcAuthProvider implements OAuthHandlers {
  private readonly _strategy: Promise<OidcStrategy<UserinfoResponse, Client>>;

  constructor(options: OidcAuthProviderOptions) {
    this._strategy = this.setupStrategy(options);
  }

  async start(req: OAuthStartRequest): Promise<RedirectInfo> {
    const strategy = await this._strategy;
    return await executeRedirectStrategy(req, strategy, {
      accessType: 'offline',
      prompt: 'consent',
      scope: `${req.scope} default`,
      state: encodeState(req.state),
    });
  }

  async handler(
    req: express.Request,
  ): Promise<{ response: OAuthResponse; refreshToken: string }> {
    const strategy = await this._strategy;
    const { response, privateInfo } = await executeFrameHandlerStrategy<
      OAuthResponse,
      PrivateInfo
    >(req, strategy);

    return {
      response: await this.populateIdentity(response),
      refreshToken: privateInfo.refreshToken,
    };
  }

  async refresh(req: OAuthRefreshRequest): Promise<OAuthResponse> {
    const strategy = await this._strategy;
    const refreshTokenResponse = await executeRefreshTokenStrategy(
      strategy,
      req.refreshToken,
      req.scope,
    );
    const {
      accessToken,
      params,
      refreshToken: updatedRefreshToken,
    } = refreshTokenResponse;

    const profile = await executeFetchUserProfileStrategy(
      strategy,
      accessToken,
      params.id_token,
    );

    return this.populateIdentity({
      providerInfo: {
        accessToken,
        refreshToken: updatedRefreshToken,
        idToken: params.id_token,
        expiresInSeconds: params.expires_in,
        scope: params.scope,
      },
      profile,
    });
  }

  private async setupStrategy(
    options: OidcAuthProviderOptions,
  ): Promise<OidcStrategy<UserinfoResponse, Client>> {
    const issuer = await Issuer.discover(options.adUrl);
    // console.log('Discovered issuer %s %O', issuer.issuer, issuer.metadata);
    const client = new issuer.Client({
      client_id: options.clientId,
      client_secret: options.clientSecret,
      redirect_uris: [options.callbackUrl],
      response_types: ['code'],
      id_token_signed_response_alg: options.tokenSignedResponseAlg || 'RS256',
    });

    const strategy = new OidcStrategy(
      {
        client,
        passReqToCallback: false as true,
      },
      (
        tokenset: TokenSet,
        userinfo: UserinfoResponse,
        done: PassportDoneCallback<OAuthResponse, PrivateInfo>,
      ) => {
        const profile: ProfileInfo = {
          displayName: userinfo.name,
          email: userinfo.email,
          picture: userinfo.picture,
        };

        done(
          undefined,
          {
            providerInfo: {
              idToken: tokenset.id_token || '',
              accessToken: tokenset.access_token || '',
              scope: tokenset.scope || '',
              expiresInSeconds: tokenset.expires_in,
            },
            profile,
          },
          {
            refreshToken: tokenset.refresh_token || '',
          },
        );
      },
    );
    strategy.error = console.error;
    return strategy;
  }

  // Use this function to grab the user profile info from the token
  // Then populate the profile with it
  private async populateIdentity(
    response: OAuthResponse,
  ): Promise<OAuthResponse> {
    const { profile } = response;

    if (!profile.email) {
      throw new Error('Profile does not contain an email');
    }
    const id = profile.email.split('@')[0];

    return { ...response, backstageIdentity: { id } };
  }
}

export const createOidcProvider: AuthProviderFactory = ({
  globalConfig,
  config,
  tokenIssuer,
}) =>
  OAuthEnvironmentHandler.mapConfig(config, envConfig => {
    const providerId = 'oidc';
    const clientId = envConfig.getString('clientId');
    const clientSecret = envConfig.getString('clientSecret');
    const callbackUrl = `${globalConfig.baseUrl}/${providerId}/handler/frame`;
    const authorizationUrl = envConfig.getString('authorizationUrl');
    const adUrl = envConfig.getString('adUrl');
    const tokenUrl = envConfig.getString('tokenUrl');
    const tokenSignedResponseAlg = envConfig.getString(
      'tokenSignedResponseAlg',
    );

    const provider = new OidcAuthProvider({
      clientId,
      clientSecret,
      callbackUrl,
      authorizationUrl,
      tokenUrl,
      tokenSignedResponseAlg,
      adUrl,
    });

    return OAuthAdapter.fromConfig(globalConfig, provider, {
      disableRefresh: false,
      providerId,
      tokenIssuer,
    });
  });
