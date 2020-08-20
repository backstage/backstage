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

export type GithubAuthProviderOptions = OAuthProviderOptions & {
  tokenUrl?: string;
  userProfileUrl?: string;
  authorizationUrl?: string;
};

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

  constructor(options: GithubAuthProviderOptions) {
    this._strategy = new GithubStrategy(
      {
        clientID: options.clientId,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackUrl,
        tokenURL: options.tokenUrl,
        userProfileURL: options.userProfileUrl,
        authorizationURL: options.authorizationUrl,
      },
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
  config: AuthProviderConfig,
  _: string,
  envConfig: Config,
  _logger: Logger,
  tokenIssuer: TokenIssuer,
) {
  const providerId = 'github';
  const clientId = envConfig.getString('clientId');
  const clientSecret = envConfig.getString('clientSecret');
  const enterpriseInstanceUrl = envConfig.getOptionalString(
    'enterpriseInstanceUrl',
  );
  const authorizationUrl = enterpriseInstanceUrl
    ? `${enterpriseInstanceUrl}/login/oauth/authorize`
    : undefined;
  const tokenUrl = enterpriseInstanceUrl
    ? `${enterpriseInstanceUrl}/login/oauth/access_token`
    : undefined;
  const userProfileUrl = enterpriseInstanceUrl
    ? `${enterpriseInstanceUrl}/api/v3/user`
    : undefined;
  const callbackUrl = `${config.baseUrl}/${providerId}/handler/frame`;

  const provider = new GithubAuthProvider({
    clientId,
    clientSecret,
    callbackUrl,
    tokenUrl,
    userProfileUrl,
    authorizationUrl,
  });

  return OAuthProvider.fromConfig(config, provider, {
    disableRefresh: true,
    persistScopes: true,
    providerId,
    tokenIssuer,
  });
}
