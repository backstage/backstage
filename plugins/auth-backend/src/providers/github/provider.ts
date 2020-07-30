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
import { Strategy as GithubStrategy } from 'passport-github2';
import {
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
  makeProfileInfo,
} from '../../lib/PassportStrategyHelper';
import {
  OAuthProviderHandlers,
  AuthProviderConfig,
  RedirectInfo,
  OAuthProviderOptions,
  OAuthResponse,
  PassportDoneCallback,
} from '../types';
import { OAuthProvider } from '../../lib/OAuthProvider';
import { Logger } from 'winston';
import { TokenIssuer } from '../../identity';
import passport from 'passport';
import { Config } from '@backstage/config';

export class GithubAuthProvider implements OAuthProviderHandlers {
  private readonly _strategy: GithubStrategy;

  static transformPassportProfile(rawProfile: any): passport.Profile {
    const profile: passport.Profile = {
      id: rawProfile.username,
      username: rawProfile.username,
      provider: rawProfile.provider,
      displayName: rawProfile.displayName || rawProfile.username,
      photos: rawProfile.photos,
      emails: rawProfile.emails,
    };

    return profile;
  }

  static transformOAuthResponse(
    accessToken: string,
    rawProfile: any,
    params: any = {},
  ): OAuthResponse {
    const passportProfile = GithubAuthProvider.transformPassportProfile(
      rawProfile,
    );

    const profile = makeProfileInfo(passportProfile, params.id_token);
    const providerInfo = {
      accessToken,
      scope: params.scope,
      expiresInSeconds: params.expires_in,
      idToken: params.id_token,
    };

    // Github provides an id numeric value (123)
    // as a fallback
    const id = passportProfile!.id;

    if (params.expires_in) {
      providerInfo.expiresInSeconds = params.expires_in;
    }
    if (params.id_token) {
      providerInfo.idToken = params.id_token;
    }
    return {
      providerInfo,
      profile,
      backstageIdentity: {
        id,
      },
    };
  }

  constructor(options: OAuthProviderOptions) {
    this._strategy = new GithubStrategy(
      { ...options },
      (
        accessToken: any,
        _: any,
        params: any,
        rawProfile: any,
        done: PassportDoneCallback<OAuthResponse>,
      ) => {
        const oauthResponse = GithubAuthProvider.transformOAuthResponse(
          accessToken,
          rawProfile,
          params,
        );
        done(undefined, oauthResponse);
      },
    );
  }

  async start(
    req: express.Request,
    options: Record<string, string>,
  ): Promise<RedirectInfo> {
    return await executeRedirectStrategy(req, this._strategy, options);
  }

  async handler(req: express.Request) {
    const { response } = await executeFrameHandlerStrategy<OAuthResponse>(
      req,
      this._strategy,
    );

    return { response };
  }
}

export function createGithubProvider(
  { baseUrl }: AuthProviderConfig,
  env: string,
  envConfig: Config,
  logger: Logger,
  tokenIssuer: TokenIssuer,
) {
  const providerId = 'github';
  const secure = envConfig.getBoolean('secure');
  const appOrigin = envConfig.getString('appOrigin');
  const clientID = envConfig.getString('clientId');
  const clientSecret = envConfig.getString('clientSecret');
  const authorizationURL = envConfig.getOptionalString('authorizationURL');
  const tokenURL = envConfig.getOptionalString('tokenURL');
  const userProfileURL = envConfig.getOptionalString('userProfileURL');
  const callbackURL = `${baseUrl}/${providerId}/handler/frame?env=${env}`;

  const opts = {
    clientID,
    clientSecret,
    authorizationURL,
    tokenURL,
    userProfileURL,
    callbackURL,
  };

  if (!opts.clientID || !opts.clientSecret) {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error(
        'Failed to initialize Github auth provider, set AUTH_GITHUB_CLIENT_ID and AUTH_GITHUB_CLIENT_SECRET env vars',
      );
    }

    logger.warn(
      'Github auth provider disabled, set AUTH_GITHUB_CLIENT_ID and AUTH_GITHUB_CLIENT_SECRET env vars to enable',
    );
    return undefined;
  }
  return new OAuthProvider(new GithubAuthProvider(opts), {
    disableRefresh: true,
    persistScopes: true,
    providerId,
    secure,
    baseUrl,
    appOrigin,
    tokenIssuer,
  });
}
