/*
 * Copyright 2022 The Backstage Authors
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
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import {
  encodeState,
  OAuthAdapter,
  OAuthEnvironmentHandler,
  OAuthHandlers,
  OAuthProviderOptions,
  OAuthResponse,
  OAuthResult,
  OAuthStartRequest,
} from '../../lib/oauth';
import passport from 'passport';
import {
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
  makeProfileInfo,
  PassportDoneCallback,
} from '../../lib/passport';
import {
  AuthHandler,
  AuthProviderFactory,
  RedirectInfo,
  SignInResolver,
} from '../types';
import express from 'express';
import { Logger } from 'winston';
import { CatalogIdentityClient } from '../../lib/catalog';
import { TokenIssuer } from '../../identity';
import { api } from '@pagerduty/pdjs';

export type PagerdutyProviderOptions = OAuthProviderOptions & {
  logger: Logger;
  catalogIdentityClient: CatalogIdentityClient;
  tokenIssuer: TokenIssuer;
  signInResolver?: SignInResolver<OAuthResult>;
  authHandler: AuthHandler<OAuthResult>;
};

const verifyFunction = (
  accessToken: any,
  refreshToken: any,
  params: any,
  fullProfile: passport.Profile,
  done: PassportDoneCallback<OAuthResult, any>,
) => {
  done(
    undefined,
    {
      fullProfile,
      accessToken,
      refreshToken,
      params,
    },
    {
      refreshToken,
    },
  );
};
export class PagerdutyAuthProvider implements OAuthHandlers {
  private readonly _strategy: OAuth2Strategy;
  private readonly logger: Logger;
  private readonly catalogIdentityClient: CatalogIdentityClient;
  private readonly tokenIssuer: TokenIssuer;
  private readonly signInResolver?: SignInResolver<OAuthResult>;
  private readonly authHandler: AuthHandler<OAuthResult>;

  constructor(options: PagerdutyProviderOptions) {
    this.logger = options.logger;
    this.catalogIdentityClient = options.catalogIdentityClient;
    this.tokenIssuer = options.tokenIssuer;
    this.signInResolver = options.signInResolver;
    this.authHandler = options.authHandler;
    this._strategy = new OAuth2Strategy(
      {
        clientID: options.clientId,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackUrl,
        passReqToCallback: false,
        authorizationURL: 'https://app.pagerduty.com/oauth/authorize',
        tokenURL: 'https://app.pagerduty.com/oauth/token',
      },
      verifyFunction, // See the "Verify Callback" section
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

  async handler(req: express.Request) {
    const { result, privateInfo } = await executeFrameHandlerStrategy<
      OAuthResult,
      any
    >(req, this._strategy);

    return {
      response: await this.handleResult(result),
      refreshToken: privateInfo.refreshToken,
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

export type PagerdutyAuthProviderOptions = {
  authHandler?: AuthHandler<OAuthResult>;

  signIn?: {
    resolver?: SignInResolver<OAuthResult>;
  };
};

export const pagerdutyDefaultSignInResolver: SignInResolver<
  OAuthResult
> = async (info, ctx) => {
  const pagerduty = api({
    token: info.result.accessToken,
    tokenType: 'bearer',
  });
  const me = await pagerduty.get('/users/me');

  const userId = me.data.user.id;

  const token = await ctx.tokenIssuer.issueToken({
    claims: { sub: `user:default/${userId}`, ent: [`user:default/${userId}`] },
  });

  return { id: userId, token };
};

export const createPagerdutyProvider = (
  options?: PagerdutyAuthProviderOptions,
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
      const customCallbackUrl = envConfig.getOptionalString('callbackUrl');
      const callbackUrl =
        customCallbackUrl ||
        `${globalConfig.baseUrl}/${providerId}/handler/frame`;
      const disableRefresh =
        envConfig.getOptionalBoolean('disableRefresh') ?? false;

      const catalogIdentityClient = new CatalogIdentityClient({
        catalogApi,
        tokenManager,
      });

      const authHandler: AuthHandler<OAuthResult> = options?.authHandler
        ? options.authHandler
        : async ({ fullProfile, params }) => ({
            profile: makeProfileInfo(fullProfile, params.id_token),
          });

      const signInResolverFn =
        options?.signIn?.resolver ?? pagerdutyDefaultSignInResolver;

      const signInResolver: SignInResolver<OAuthResult> = info =>
        signInResolverFn(info, {
          catalogIdentityClient,
          tokenIssuer,
          logger,
        });

      const provider = new PagerdutyAuthProvider({
        clientId,
        clientSecret,
        tokenIssuer,
        catalogIdentityClient,
        callbackUrl,
        signInResolver,
        authHandler,
        logger,
      });

      return OAuthAdapter.fromConfig(globalConfig, provider, {
        disableRefresh,
        providerId,
        tokenIssuer,
        callbackUrl,
      });
    });
};
