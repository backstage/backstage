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
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
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
  OAuthProviderOptions,
  OAuthResponse,
  PassportDoneCallback,
} from '../types';
import { OAuthProvider } from '../../lib/OAuthProvider';
import passport from 'passport';
import { Logger } from 'winston';
import { TokenIssuer } from '../../identity';
import { Config } from '@backstage/config';

type PrivateInfo = {
  refreshToken: string;
};

export class GoogleAuthProvider implements OAuthProviderHandlers {
  private readonly _strategy: GoogleStrategy;

  constructor(options: OAuthProviderOptions) {
    // TODO: throw error if env variables not set?
    this._strategy = new GoogleStrategy(
      {
        clientID: options.clientId,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackUrl,
        // We need passReqToCallback set to false to get params, but there's
        // no matching type signature for that, so instead behold this beauty
        passReqToCallback: false as true,
      },
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

  private async populateIdentity(
    response: OAuthResponse,
  ): Promise<OAuthResponse> {
    const { profile } = response;

    if (!profile.email) {
      throw new Error('Google profile contained no email');
    }

    // TODO(Rugvip): Hardcoded to the local part of the email for now
    const id = profile.email.split('@')[0];

    return { ...response, backstageIdentity: { id } };
  }
}

export function createGoogleProvider(
  config: AuthProviderConfig,
  _: string,
  envConfig: Config,
  _logger: Logger,
  tokenIssuer: TokenIssuer,
) {
  const providerId = 'google';
  const clientId = envConfig.getString('clientId');
  const clientSecret = envConfig.getString('clientSecret');
  const callbackUrl = `${config.baseUrl}/${providerId}/handler/frame`;

  const provider = new GoogleAuthProvider({
    clientId,
    clientSecret,
    callbackUrl,
  });

  return OAuthProvider.fromConfig(config, provider, {
    disableRefresh: false,
    providerId,
    tokenIssuer,
  });
}
