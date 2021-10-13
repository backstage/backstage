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

import express from 'express';
import { Logger } from 'winston';
import { Profile as PassportProfile } from 'passport';
import { Strategy as GithubStrategy } from 'passport-github2';
import {
  executeFetchUserProfileStrategy,
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
  executeRefreshTokenStrategy,
  makeProfileInfo,
  PassportDoneCallback,
} from '../../lib/passport';
import {
  RedirectInfo,
  AuthProviderFactory,
  AuthHandler,
  SignInResolver,
  StateHandler,
} from '../types';
import {
  OAuthAdapter,
  OAuthProviderOptions,
  OAuthHandlers,
  OAuthEnvironmentHandler,
  OAuthStartRequest,
  encodeState,
  OAuthRefreshRequest,
  OAuthResponse,
} from '../../lib/oauth';
import { CatalogIdentityClient } from '../../lib/catalog';
import { TokenIssuer } from '../../identity';

type PrivateInfo = {
  refreshToken?: string;
};

export type GithubOAuthResult = {
  fullProfile: PassportProfile;
  params: {
    scope: string;
    expires_in?: string;
    refresh_token_expires_in?: string;
  };
  accessToken: string;
  refreshToken?: string;
};

export type GithubAuthProviderOptions = OAuthProviderOptions & {
  tokenUrl?: string;
  userProfileUrl?: string;
  authorizationUrl?: string;
  signInResolver?: SignInResolver<GithubOAuthResult>;
  authHandler: AuthHandler<GithubOAuthResult>;
  stateHandler: StateHandler;
  tokenIssuer: TokenIssuer;
  catalogIdentityClient: CatalogIdentityClient;
  logger: Logger;
};

export class GithubAuthProvider implements OAuthHandlers {
  private readonly _strategy: GithubStrategy;
  private readonly signInResolver?: SignInResolver<GithubOAuthResult>;
  private readonly authHandler: AuthHandler<GithubOAuthResult>;
  private readonly tokenIssuer: TokenIssuer;
  private readonly catalogIdentityClient: CatalogIdentityClient;
  private readonly logger: Logger;
  private readonly stateHandler: StateHandler;

  constructor(options: GithubAuthProviderOptions) {
    this.signInResolver = options.signInResolver;
    this.authHandler = options.authHandler;
    this.stateHandler = options.stateHandler;
    this.tokenIssuer = options.tokenIssuer;
    this.catalogIdentityClient = options.catalogIdentityClient;
    this.logger = options.logger;
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
        fullProfile: any,
        done: PassportDoneCallback<GithubOAuthResult, PrivateInfo>,
      ) => {
        done(undefined, { fullProfile, params, accessToken }, { refreshToken });
      },
    );
  }

  async start(req: OAuthStartRequest): Promise<RedirectInfo> {
    return await executeRedirectStrategy(req, this._strategy, {
      scope: req.scope,
      state: await this.stateHandler(req.state),
    });
  }

  async handler(req: express.Request) {
    const { result, privateInfo } = await executeFrameHandlerStrategy<
      GithubOAuthResult,
      PrivateInfo
    >(req, this._strategy);

    return {
      response: await this.handleResult(result),
      refreshToken: privateInfo.refreshToken,
    };
  }

  async refresh(req: OAuthRefreshRequest): Promise<OAuthResponse> {
    const {
      accessToken,
      refreshToken: newRefreshToken,
      params,
    } = await executeRefreshTokenStrategy(
      this._strategy,
      req.refreshToken,
      req.scope,
    );
    const fullProfile = await executeFetchUserProfileStrategy(
      this._strategy,
      accessToken,
    );
    return this.handleResult({
      fullProfile,
      params,
      accessToken,
      refreshToken: newRefreshToken,
    });
  }

  private async handleResult(result: GithubOAuthResult) {
    const { profile } = await this.authHandler(result);

    const expiresInStr = result.params.expires_in;
    const response: OAuthResponse = {
      providerInfo: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken, // GitHub expires the old refresh token when used
        scope: result.params.scope,
        expiresInSeconds:
          expiresInStr === undefined ? undefined : Number(expiresInStr),
      },
      profile,
    };

    if (this.signInResolver) {
      response.backstageIdentity = await this.signInResolver(
        {
          result,
          profile,
        },
        {
          tokenIssuer: this.tokenIssuer,
          catalogIdentityClient: this.catalogIdentityClient,
          logger: this.logger,
        },
      );
    }

    return response;
  }
}

export const githubDefaultSignInResolver: SignInResolver<GithubOAuthResult> =
  async (info, ctx) => {
    const { fullProfile } = info.result;

    const userId = fullProfile.username || fullProfile.id;

    const token = await ctx.tokenIssuer.issueToken({
      claims: { sub: userId, ent: [`user:default/${userId}`] },
    });

    return { id: userId, token };
  };

export type GithubProviderOptions = {
  /**
   * The profile transformation function used to verify and convert the auth response
   * into the profile that will be presented to the user.
   */
  authHandler?: AuthHandler<GithubOAuthResult>;

  /**
   * Configure sign-in for this provider, without it the provider can not be used to sign users in.
   */
  signIn?: {
    /**
     * Maps an auth result to a Backstage identity for the user.
     */
    resolver?: SignInResolver<GithubOAuthResult>;
  };

  /**
   * The state handler that sets the uri query param 'state'
   */
  stateHandler?: StateHandler;
};

export const createGithubProvider = (
  options?: GithubProviderOptions,
): AuthProviderFactory => {
  return ({
    providerId,
    globalConfig,
    config,
    tokenIssuer,
    catalogApi,
    logger,
  }) =>
    OAuthEnvironmentHandler.mapConfig(config, envConfig => {
      const clientId = envConfig.getString('clientId');
      const clientSecret = envConfig.getString('clientSecret');
      const enterpriseInstanceUrl = envConfig.getOptionalString(
        'enterpriseInstanceUrl',
      );
      const customCallbackUrl = envConfig.getOptionalString('callbackUrl');
      const authorizationUrl = enterpriseInstanceUrl
        ? `${enterpriseInstanceUrl}/login/oauth/authorize`
        : undefined;
      const tokenUrl = enterpriseInstanceUrl
        ? `${enterpriseInstanceUrl}/login/oauth/access_token`
        : undefined;
      const userProfileUrl = enterpriseInstanceUrl
        ? `${enterpriseInstanceUrl}/api/v3/user`
        : undefined;
      const callbackUrl =
        customCallbackUrl ||
        `${globalConfig.baseUrl}/${providerId}/handler/frame`;

      const catalogIdentityClient = new CatalogIdentityClient({
        catalogApi,
        tokenIssuer,
      });

      const authHandler: AuthHandler<GithubOAuthResult> = options?.authHandler
        ? options.authHandler
        : async ({ fullProfile }) => ({
            profile: makeProfileInfo(fullProfile),
          });

      const signInResolverFn =
        options?.signIn?.resolver ?? githubDefaultSignInResolver;

      const signInResolver: SignInResolver<GithubOAuthResult> = info =>
        signInResolverFn(info, {
          catalogIdentityClient,
          tokenIssuer,
          logger,
        });

      const stateHandler: StateHandler = options?.stateHandler
        ? options.stateHandler
        : async (req: OAuthStartRequest) => {
            return encodeState(req.state);
          };

      const provider = new GithubAuthProvider({
        clientId,
        clientSecret,
        callbackUrl,
        tokenUrl,
        userProfileUrl,
        authorizationUrl,
        signInResolver,
        authHandler,
        tokenIssuer,
        catalogIdentityClient,
        stateHandler,
        logger,
      });

      return OAuthAdapter.fromConfig(globalConfig, provider, {
        persistScopes: true,
        providerId,
        tokenIssuer,
      });
    });
};
