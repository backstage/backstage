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
import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import { Logger } from 'winston';
import { TokenIssuer } from '../../identity';
import {
  EnvironmentHandler,
  EnvironmentHandlers,
} from '../../lib/EnvironmentHandler';
import { OAuthProvider } from '../../lib/OAuthProvider';
import {
  executeFetchUserProfileStrategy,
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
  executeRefreshTokenStrategy,
  makeProfileInfo,
} from '../../lib/PassportStrategyHelper';
import {
  AuthProviderConfig,
  EnvironmentProviderConfig,
  GenericOAuth2ProviderConfig,
  GenericOAuth2ProviderOptions,
  OAuthProviderHandlers,
  OAuthResponse,
  PassportDoneCallback,
  RedirectInfo,
} from '../types';

type PrivateInfo = {
  refreshToken: string;
};

export class OAuth2AuthProvider implements OAuthProviderHandlers {
  private readonly _strategy: OAuth2Strategy;

  constructor(options: GenericOAuth2ProviderOptions) {
    this._strategy = new OAuth2Strategy(
      { ...options, passReqToCallback: false as true },
      (
        accessToken: any,
        refreshToken: any,
        params: any,
        rawProfile: passport.Profile,
        done: PassportDoneCallback<OAuthResponse, PrivateInfo>,
      ) => {
        const profile = makeProfileInfo(rawProfile, params.id_token);
        done(
          undefined,
          {
            providerInfo: {
              idToken: params.id_token,
              accessToken,
              scope: params.scope,
              expiresInSeconds: params.expires_in,
            },
            profile,
          },
          {
            refreshToken,
          },
        );
      },
    );
  }

  async start(
    req: express.Request,
    options: Record<string, string>,
  ): Promise<RedirectInfo> {
    const providerOptions = {
      ...options,
      accessType: 'offline',
      prompt: 'consent',
    };
    return await executeRedirectStrategy(req, this._strategy, providerOptions);
  }

  async handler(
    req: express.Request,
  ): Promise<{ response: OAuthResponse; refreshToken: string }> {
    const { response, privateInfo } = await executeFrameHandlerStrategy<
      OAuthResponse,
      PrivateInfo
    >(req, this._strategy);

    return {
      response: await this.populateIdentity(response),
      refreshToken: privateInfo.refreshToken,
    };
  }

  async refresh(refreshToken: string, scope: string): Promise<OAuthResponse> {
    const { accessToken, params } = await executeRefreshTokenStrategy(
      this._strategy,
      refreshToken,
      scope,
    );

    const profile = await executeFetchUserProfileStrategy(
      this._strategy,
      accessToken,
      params.id_token,
    );

    return this.populateIdentity({
      providerInfo: {
        accessToken,
        idToken: params.id_token,
        expiresInSeconds: params.expires_in,
        scope: params.scope,
      },
      profile,
    });
  }

  // Use this function to grab the user profile info from the token
  // Then populate the profile with it
  private async populateIdentity(
    response: OAuthResponse,
  ): Promise<OAuthResponse> {
    const { profile } = response;

    if (!profile.email) {
      throw new Error('Profile does not contain a profile');
    }

    const id = profile.email.split('@')[0];

    return { ...response, backstageIdentity: { id } };
  }
}

export function createOAuth2Provider(
  { baseUrl }: AuthProviderConfig,
  providerConfig: EnvironmentProviderConfig,
  logger: Logger,
  tokenIssuer: TokenIssuer,
) {
  const envProviders: EnvironmentHandlers = {};

  for (const [env, envConfig] of Object.entries(providerConfig)) {
    const config = (envConfig as unknown) as GenericOAuth2ProviderConfig;
    const { secure, appOrigin } = config;
    const callbackURLParam = `?env=${env}`;
    const opts = {
      clientID: config.clientId,
      clientSecret: config.clientSecret,
      callbackURL: `${baseUrl}/oauth2/handler/frame${callbackURLParam}`,
      authorizationURL: config.authorizationURL,
      tokenURL: config.tokenURL,
    };

    if (
      !opts.clientID ||
      !opts.clientSecret ||
      !opts.authorizationURL ||
      !opts.tokenURL
    ) {
      if (process.env.NODE_ENV !== 'development') {
        throw new Error(
          'Failed to initialize OAuth2 auth provider, set AUTH_OAUTH2_CLIENT_ID, AUTH_OAUTH2_CLIENT_SECRET, AUTH_OAUTH2_AUTH_URL, and AUTH_OAUTH2_TOKEN_URL env vars',
        );
      }

      logger.warn(
        'OAuth2 auth provider disabled, set AUTH_OAUTH2_CLIENT_ID, AUTH_OAUTH2_CLIENT_SECRET, AUTH_OAUTH2_AUTH_URL, and AUTH_OAUTH2_TOKEN_URL env vars to enable',
      );
      continue;
    }

    envProviders[env] = new OAuthProvider(new OAuth2AuthProvider(opts), {
      disableRefresh: false,
      providerId: 'oauth2',
      secure,
      baseUrl,
      appOrigin,
      tokenIssuer,
    });
  }

  return new EnvironmentHandler(envProviders);
}
