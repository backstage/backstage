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
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';

import {
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
  executeRefreshTokenStrategy,
  makeProfileInfo,
  executeFetchUserProfileStrategy,
  PassportDoneCallback,
} from '../../lib/passport';

import { RedirectInfo, AuthProviderFactory } from '../types';

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

import got from 'got';

type PrivateInfo = {
  refreshToken: string;
};

export type MicrosoftAuthProviderOptions = OAuthProviderOptions & {
  authorizationUrl?: string;
  tokenUrl?: string;
};

export class MicrosoftAuthProvider implements OAuthHandlers {
  private readonly _strategy: MicrosoftStrategy;

  static transformAuthResponse(
    accessToken: string,
    params: any,
    rawProfile: any,
    photoURL: any,
  ): OAuthResponse {
    let passportProfile: passport.Profile = rawProfile;
    passportProfile = {
      ...passportProfile,
      photos: [{ value: photoURL }],
    };

    const profile = makeProfileInfo(passportProfile, params.id_token);
    const providerInfo = {
      idToken: params.id_token,
      accessToken,
      scope: params.scope,
      expiresInSeconds: params.expires_in,
    };

    return {
      providerInfo,
      profile,
    };
  }

  constructor(options: MicrosoftAuthProviderOptions) {
    this._strategy = new MicrosoftStrategy(
      {
        clientID: options.clientId,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackUrl,
        authorizationURL: options.authorizationUrl,
        tokenURL: options.tokenUrl,
        passReqToCallback: false as true,
      },
      (
        accessToken: any,
        refreshToken: any,
        params: any,
        rawProfile: passport.Profile,
        done: PassportDoneCallback<OAuthResponse, PrivateInfo>,
      ) => {
        this.getUserPhoto(accessToken)
          .then(photoURL => {
            const authResponse = MicrosoftAuthProvider.transformAuthResponse(
              accessToken,
              params,
              rawProfile,
              photoURL,
            );
            done(undefined, authResponse, { refreshToken });
          })
          .catch(error => {
            throw new Error(`Error processing auth response: ${error}`);
          });
      },
    );
  }

  async start(req: OAuthStartRequest): Promise<RedirectInfo> {
    return await executeRedirectStrategy(req, this._strategy, {
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
    const photo = await this.getUserPhoto(accessToken);
    if (photo) {
      profile.picture = photo;
    }

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

  private getUserPhoto(accessToken: string): Promise<string | undefined> {
    return new Promise(resolve => {
      got
        .get('https://graph.microsoft.com/v1.0/me/photos/48x48/$value', {
          encoding: 'binary',
          responseType: 'buffer',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(photoData => {
          const photoURL = `data:image/jpeg;base64,${Buffer.from(
            photoData.body,
          ).toString('base64')}`;
          resolve(photoURL);
        })
        .catch(error => {
          console.log(
            `Could not retrieve user profile photo from Microsoft Graph API: ${error}`,
          );
          // User profile photo is optional, ignore errors and resolve undefined
          resolve(undefined);
        });
    });
  }

  private async populateIdentity(
    response: OAuthResponse,
  ): Promise<OAuthResponse> {
    const { profile } = response;

    if (!profile.email) {
      throw new Error('Microsoft profile contained no email');
    }

    // Like Google implementation, setting this to local part of email for now
    const id = profile.email.split('@')[0];

    return { ...response, backstageIdentity: { id } };
  }
}

export const createMicrosoftProvider: AuthProviderFactory = ({
  providerId,
  globalConfig,
  config,
  tokenIssuer,
}) =>
  OAuthEnvironmentHandler.mapConfig(config, envConfig => {
    const clientId = envConfig.getString('clientId');
    const clientSecret = envConfig.getString('clientSecret');
    const tenantID = envConfig.getString('tenantId');

    const callbackUrl = `${globalConfig.baseUrl}/${providerId}/handler/frame`;
    const authorizationUrl = `https://login.microsoftonline.com/${tenantID}/oauth2/v2.0/authorize`;
    const tokenUrl = `https://login.microsoftonline.com/${tenantID}/oauth2/v2.0/token`;

    const provider = new MicrosoftAuthProvider({
      clientId,
      clientSecret,
      callbackUrl,
      authorizationUrl,
      tokenUrl,
    });

    return OAuthAdapter.fromConfig(globalConfig, provider, {
      disableRefresh: false,
      providerId,
      tokenIssuer,
    });
  });
