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
import express, { Request } from 'express';
import { OAuthProvider } from '../../lib/OAuthProvider';
import { Strategy as OktaStrategy } from 'passport-okta-oauth';
import passport from 'passport';
import {
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
  executeRefreshTokenStrategy,
  makeProfileInfo,
  executeFetchUserProfileStrategy,
} from '../../lib/PassportStrategyHelper';
import {
  OAuthProviderHandlers,
  RedirectInfo,
  AuthProviderConfig,
  EnvironmentProviderConfig,
  OAuthProviderOptions,
  OAuthProviderConfig,
  OAuthResponse,
  PassportDoneCallback,
} from '../types';
import {
  EnvironmentHandler,
  EnvironmentHandlers,
} from '../../lib/EnvironmentHandler';
import { Logger } from 'winston';
import { StateStore } from 'passport-oauth2';
import { TokenIssuer } from '../../identity';

type PrivateInfo = {
  refreshToken: string;
};

export class OktaAuthProvider implements OAuthProviderHandlers {

  private readonly _strategy: any;

  /** 
   * Due to passport-okta-oauth forcing options.state = true,
   * passport-oauth2 requires express-session to be installed
   * so that the 'state' parameter of the oauth2 flow can be stored.
   * This implementation of StateStore matches the NullStore found within
   * passport-oauth2, which is the StateStore implementation used when options.state = false,
   * allowing us to avoid using express-session in order to integrate with Okta.
  */
  private _store: StateStore = {
    store(req: Request, cb: any) {
      cb(null, null);
    },
    verify(req: Request, state: string, cb: any) {
      cb(null, true);
    },
  }

  constructor(options: OAuthProviderOptions) {
    this._strategy =  new OktaStrategy({
      passReqToCallback: false as true,
      ...options,
      store: this._store,
      response_type: 'code',
    }, (
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
      )
    });
  }

  async start(
    req: express.Request,
    options: Record<string, string>
  ): Promise<RedirectInfo> {
    return await executeRedirectStrategy(req, this._strategy, options);
  }

  async handler(
    req: express.Request
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

  private async populateIdentity(
    response: OAuthResponse,
  ): Promise<OAuthResponse> {
    const { profile } = response;

    if (!profile.email) {
      throw new Error('Okta profile contained no email');
    }

    // TODO(Rugvip): Hardcoded to the local part of the email for now
    const id = profile.email.split('@')[0];

    return { ...response, backstageIdentity: { id } };
  }
}

export function createOktaProvider(
  { baseUrl }: AuthProviderConfig,
  providerConfig: EnvironmentProviderConfig,
  logger: Logger,
  tokenIssuer: TokenIssuer,
) {
  const envProviders: EnvironmentHandlers = {};

  for (const [env, envConfig] of Object.entries(providerConfig)) {
    const config = (envConfig as unknown) as OAuthProviderConfig;
    const { secure, appOrigin } = config;
    const callbackURLParam = `?env=${env}`;
    const opts = {
      audience: config.audience,
      clientID: config.clientId,
      clientSecret: config.clientSecret,
      callbackURL: `${baseUrl}/okta/handler/frame${callbackURLParam}`,
    };

    if (!opts.clientID || !opts.clientSecret || !opts.audience) {
      if (process.env.NODE_ENV !== 'development') {
        throw new Error(
          'Failed to initialize Okta auth provider, set AUTH_OKTA_CLIENT_ID, AUTH_OKTA_CLIENT_SECRET, and AUTH_OKTA_AUDIENCE env vars',
        );
      }

      logger.warn(
        'Okta auth provider disabled, set AUTH_OKTA_CLIENT_ID, AUTH_OKTA_CLIENT_SECRET, and AUTH_OKTA_AUDIENCE env vars to enable',
      );
      continue;
    }

    envProviders[env] = new OAuthProvider(new OktaAuthProvider(opts), {
      disableRefresh: false,
      providerId: 'okta',
      secure,
      baseUrl,
      appOrigin,
      tokenIssuer,
    });
  }

  return new EnvironmentHandler(envProviders);
}
