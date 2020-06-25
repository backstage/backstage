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
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import {
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
  executeRefreshTokenStrategy,
  makeOAuth2ProfileInfo,
  executeFetchOAuth2UserProfileStrategy,
} from '../../lib/PassportStrategyHelper';
import {
  OAuthProviderHandlers,
  AuthProviderConfig,
  RedirectInfo,
  AuthInfoBase,
  AuthInfoPrivate,
  EnvironmentProviderConfig,
  AuthInfoWithProfile,
  OAuth2ProviderConfig,
  OAuth2ProviderOptions,
} from '../types';
import { OAuthProvider } from '../../lib/OAuthProvider';
import {
  EnvironmentHandlers,
  EnvironmentHandler,
} from '../../lib/EnvironmentHandler';
import { Logger } from 'winston';

export class OAuth2AuthProvider implements OAuthProviderHandlers {
  private readonly _strategy: OAuth2Strategy;

  constructor(options: OAuth2ProviderOptions) {
    this._strategy = new OAuth2Strategy(
      {
        ...options,
        passReqToCallback: false as true,
      },
      (
        accessToken: any,
        refreshToken: any,
        params: any,
        profile: any,
        done: any,
      ) => {
        const profileInfo = makeOAuth2ProfileInfo(profile, params);
        done(
          undefined,
          {
            profile: profileInfo,
            idToken: params.id_token,
            accessToken,
            scope: params.scope,
            expiresInSeconds: params.expires_in,
          },
          {
            refreshToken,
          },
        );
      },
    );
  }

  async start(req: express.Request, options: any): Promise<RedirectInfo> {
    return await executeRedirectStrategy(req, this._strategy, options);
  }

  async handler(
    req: express.Request,
  ): Promise<{ user: AuthInfoBase; info: AuthInfoPrivate }> {
    return await executeFrameHandlerStrategy(req, this._strategy);
  }

  async refresh(
    refreshToken: string,
    scope: string,
  ): Promise<AuthInfoWithProfile> {
    const { accessToken, params } = await executeRefreshTokenStrategy(
      this._strategy,
      refreshToken,
      scope,
    );

    const profile = await executeFetchOAuth2UserProfileStrategy(
      this._strategy,
      accessToken,
      params,
    );

    return {
      accessToken,
      idToken: params.id_token,
      expiresInSeconds: params.expires_in,
      scope: params.scope,
      profile,
    };
  }
}

export function createOAuth2Provider(
  { baseUrl }: AuthProviderConfig,
  providerConfig: EnvironmentProviderConfig,
  logger: Logger,
) {
  const envProviders: EnvironmentHandlers = {};

  for (const [env, envConfig] of Object.entries(providerConfig)) {
    const config = (envConfig as unknown) as OAuth2ProviderConfig;
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
      providerId: 'oauth2',
      secure,
      baseUrl,
      appOrigin,
    });
  }

  return new EnvironmentHandler(envProviders);
}
