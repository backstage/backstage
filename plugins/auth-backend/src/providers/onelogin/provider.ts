/*
 * Copyright 2020 The Backstage Authors
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

import { Strategy as OneLoginStrategy } from 'passport-onelogin-oauth';
import express from 'express';
import {
  OAuthAdapter,
  OAuthProviderOptions,
  OAuthHandlers,
  OAuthResponse,
  OAuthEnvironmentHandler,
  OAuthStartRequest,
  encodeState,
  OAuthRefreshRequest,
  OAuthResult,
} from '../../lib/oauth';
import passport from 'passport';
import {
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
  executeRefreshTokenStrategy,
  makeProfileInfo,
  executeFetchUserProfileStrategy,
  PassportDoneCallback,
} from '../../lib/passport';
import {
  RedirectInfo,
  AuthProviderFactory,
  AuthHandler,
  SignInResolver,
} from '../types';
import { CatalogIdentityClient } from '../../lib/catalog';
import { Logger } from 'winston';
import { TokenIssuer } from '../../identity';

type PrivateInfo = {
  refreshToken: string;
};

export type Options = OAuthProviderOptions & {
  issuer: string;
  signInResolver?: SignInResolver<OAuthResult>;
  authHandler: AuthHandler<OAuthResult>;
  tokenIssuer: TokenIssuer;
  catalogIdentityClient: CatalogIdentityClient;
  logger: Logger;
};

export class OneLoginProvider implements OAuthHandlers {
  private readonly _strategy: any;
  private readonly signInResolver?: SignInResolver<OAuthResult>;
  private readonly authHandler: AuthHandler<OAuthResult>;
  private readonly tokenIssuer: TokenIssuer;
  private readonly catalogIdentityClient: CatalogIdentityClient;
  private readonly logger: Logger;

  constructor(options: Options) {
    this.signInResolver = options.signInResolver;
    this.authHandler = options.authHandler;
    this.tokenIssuer = options.tokenIssuer;
    this.catalogIdentityClient = options.catalogIdentityClient;
    this.logger = options.logger;
    this._strategy = new OneLoginStrategy(
      {
        issuer: options.issuer,
        clientID: options.clientId,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackUrl,
        passReqToCallback: false as true,
      },
      (
        accessToken: any,
        refreshToken: any,
        params: any,
        fullProfile: passport.Profile,
        done: PassportDoneCallback<OAuthResult, PrivateInfo>,
      ) => {
        done(
          undefined,
          {
            accessToken,
            refreshToken,
            params,
            fullProfile,
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
      scope: 'openid',
      state: encodeState(req.state),
    });
  }

  async handler(req: express.Request) {
    const { result, privateInfo } = await executeFrameHandlerStrategy<
      OAuthResult,
      PrivateInfo
    >(req, this._strategy);

    return {
      response: await this.handleResult(result),
      refreshToken: privateInfo.refreshToken,
    };
  }

  async refresh(req: OAuthRefreshRequest) {
    const { accessToken, refreshToken, params } =
      await executeRefreshTokenStrategy(
        this._strategy,
        req.refreshToken,
        req.scope,
      );

    const fullProfile = await executeFetchUserProfileStrategy(
      this._strategy,
      accessToken,
    );

    return {
      response: await this.handleResult({
        fullProfile,
        params,
        accessToken,
      }),
      refreshToken,
    };
  }

  private async handleResult(result: OAuthResult) {
    const context = {
      logger: this.logger,
      catalogIdentityClient: this.catalogIdentityClient,
      tokenIssuer: this.tokenIssuer,
    };
    const { profile } = await this.authHandler(result, context);

    const response: OAuthResponse = {
      providerInfo: {
        idToken: result.params.id_token,
        accessToken: result.accessToken,
        scope: result.params.scope,
        expiresInSeconds: result.params.expires_in,
      },
      profile,
    };

    if (this.signInResolver) {
      response.backstageIdentity = await this.signInResolver(
        {
          result,
          profile,
        },
        context,
      );
    }

    return response;
  }
}

const defaultSignInResolver: SignInResolver<OAuthResult> = async info => {
  const { profile } = info;

  if (!profile.email) {
    throw new Error('OIDC profile contained no email');
  }

  const id = profile.email.split('@')[0];

  return { id, token: '' };
};

/** @public */
export type OneLoginProviderOptions = {
  /**
   * The profile transformation function used to verify and convert the auth response
   * into the profile that will be presented to the user.
   */
  authHandler?: AuthHandler<OAuthResult>;

  /**
   * Configure sign-in for this provider, without it the provider can not be used to sign users in.
   */
  signIn?: {
    /**
     * Maps an auth result to a Backstage identity for the user.
     */
    resolver: SignInResolver<OAuthResult>;
  };
};

/** @public */
export const createOneLoginProvider = (
  options?: OneLoginProviderOptions,
): AuthProviderFactory => {
  return ({
    providerId,
    globalConfig,
    config,
    tokenIssuer,
    tokenManager,
    catalogApi,
    logger,
  }) =>
    OAuthEnvironmentHandler.mapConfig(config, envConfig => {
      const clientId = envConfig.getString('clientId');
      const clientSecret = envConfig.getString('clientSecret');
      const issuer = envConfig.getString('issuer');
      const customCallbackUrl = envConfig.getOptionalString('callbackUrl');
      const callbackUrl =
        customCallbackUrl ||
        `${globalConfig.baseUrl}/${providerId}/handler/frame`;

      const catalogIdentityClient = new CatalogIdentityClient({
        catalogApi,
        tokenManager,
      });

      const authHandler: AuthHandler<OAuthResult> = options?.authHandler
        ? options.authHandler
        : async ({ fullProfile, params }) => ({
            profile: makeProfileInfo(fullProfile, params.id_token),
          });

      const signInResolver = options?.signIn?.resolver ?? defaultSignInResolver;

      const provider = new OneLoginProvider({
        clientId,
        clientSecret,
        callbackUrl,
        issuer,
        authHandler,
        signInResolver,
        tokenIssuer,
        catalogIdentityClient,
        logger,
      });

      return OAuthAdapter.fromConfig(globalConfig, provider, {
        disableRefresh: false,
        providerId,
        tokenIssuer,
        callbackUrl,
      });
    });
};
