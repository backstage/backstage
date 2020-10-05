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
import { Logger } from 'winston';
import { Strategy as GithubStrategy } from 'passport-github2';
import {
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
  makeProfileInfo,
  PassportDoneCallback,
  executeRefreshTokenStrategy,
  executeFetchUserProfileStrategy,
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
import passport from 'passport';
import { CatalogIdentityClient } from '../../lib/catalog';

type PrivateInfo = {
  refreshToken: string;
};

export type GithubAuthProviderOptions = OAuthProviderOptions & {
  logger: Logger;
  identityClient: CatalogIdentityClient;
  tokenUrl?: string;
  userProfileUrl?: string;
  authorizationUrl?: string;
};

export class GithubAuthProvider implements OAuthHandlers {
  private readonly _strategy: GithubStrategy;
  private readonly logger: Logger;
  private readonly identityClient: CatalogIdentityClient;

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

    // GitHub provides an id numeric value (123)
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
    this.logger = options.logger;
    this.identityClient = options.identityClient;
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
        refreshToken: any,
        params: any,
        rawProfile: passport.Profile,
        done: PassportDoneCallback<OAuthResponse, PrivateInfo>,
      ) => {
        const oauthResponse = GithubAuthProvider.transformOAuthResponse(
          accessToken,
          rawProfile,
          params,
        );
        done(undefined, oauthResponse, { refreshToken });
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
      throw new Error('Github profile contained no email');
    }

    try {
      const user = await this.identityClient.findUser({
        annotations: {
          'github.com/email': profile.email,
        },
      });

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

export const createGithubProvider: AuthProviderFactory = ({
  globalConfig,
  config,
  logger,
  tokenIssuer,
  discovery,
}) =>
  OAuthEnvironmentHandler.mapConfig(config, envConfig => {
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
    const callbackUrl = `${globalConfig.baseUrl}/${providerId}/handler/frame`;

    const provider = new GithubAuthProvider({
      logger,
      clientId,
      clientSecret,
      callbackUrl,
      identityClient: new CatalogIdentityClient({ discovery }),
      tokenUrl,
      userProfileUrl,
      authorizationUrl,
    });

    return OAuthAdapter.fromConfig(globalConfig, provider, {
      disableRefresh: false,
      persistScopes: true,
      providerId,
      tokenIssuer,
    });
  });
