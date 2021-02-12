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
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Logger } from 'winston';
import { CatalogIdentityClient } from '../../lib/catalog';
import {
  encodeState,
  OAuthAdapter,
  OAuthEnvironmentHandler,
  OAuthHandlers,
  OAuthProviderOptions,
  OAuthRefreshRequest,
  OAuthResponse,
  OAuthStartRequest,
} from '../../lib/oauth';
import {
  executeFetchUserProfileStrategy,
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
  executeRefreshTokenStrategy,
  makeProfileInfo,
  PassportDoneCallback,
} from '../../lib/passport';
import { AuthProviderFactory, RedirectInfo } from '../types';
import { TokenIssuer } from '../../identity';

type PrivateInfo = {
  refreshToken: string;
};

export type GoogleAuthProviderOptions = OAuthProviderOptions & {
  logger: Logger;
  identityClient: CatalogIdentityClient;
  tokenIssuer: TokenIssuer;
};

export class GoogleAuthProvider implements OAuthHandlers {
  private readonly _strategy: GoogleStrategy;
  private readonly logger: Logger;
  private readonly identityClient: CatalogIdentityClient;
  private readonly tokenIssuer: TokenIssuer;

  constructor(options: GoogleAuthProviderOptions) {
    this.logger = options.logger;
    this.identityClient = options.identityClient;
    this.tokenIssuer = options.tokenIssuer;
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

  async start(req: OAuthStartRequest): Promise<RedirectInfo> {
    return await executeRedirectStrategy(req, this._strategy, {
      accessType: 'offline',
      prompt: 'consent',
      scope: req.scope,
      state: encodeState(req.state),
    });
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

  async refresh(req: OAuthRefreshRequest): Promise<OAuthResponse> {
    const { accessToken, params } = await executeRefreshTokenStrategy(
      this._strategy,
      req.refreshToken,
      req.scope,
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

    try {
      const token = await this.tokenIssuer.issueToken({
        claims: { sub: 'backstage.io/auth-backend' },
      });
      const user = await this.identityClient.findUser(
        {
          annotations: {
            'google.com/email': profile.email,
          },
        },
        { token },
      );

      return {
        ...response,
        backstageIdentity: {
          id: user.metadata.name,
        },
      };
    } catch (error) {
      this.logger.warn(
        `Failed to look up user, ${error}, falling back to allowing login based on email pattern, this will probably break in the future`,
      );
      return {
        ...response,
        backstageIdentity: { id: profile.email.split('@')[0] },
      };
    }
  }
}

export const createGoogleProvider: AuthProviderFactory = ({
  providerId,
  globalConfig,
  config,
  logger,
  tokenIssuer,
  catalogApi,
}) =>
  OAuthEnvironmentHandler.mapConfig(config, envConfig => {
    const clientId = envConfig.getString('clientId');
    const clientSecret = envConfig.getString('clientSecret');
    const callbackUrl = `${globalConfig.baseUrl}/${providerId}/handler/frame`;

    const provider = new GoogleAuthProvider({
      clientId,
      clientSecret,
      callbackUrl,
      logger,
      tokenIssuer,
      identityClient: new CatalogIdentityClient({ catalogApi }),
    });

    return OAuthAdapter.fromConfig(globalConfig, provider, {
      disableRefresh: false,
      providerId,
      tokenIssuer,
    });
  });
