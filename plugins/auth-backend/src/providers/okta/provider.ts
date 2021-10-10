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
import { Strategy as OktaStrategy } from 'passport-okta-oauth';
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
  AuthProviderFactory,
  AuthHandler,
  RedirectInfo,
  SignInResolver,
} from '../types';
import { StateStore } from 'passport-oauth2';
import { CatalogIdentityClient, getEntityClaims } from '../../lib/catalog';
import { TokenIssuer } from '../../identity';
import { Logger } from 'winston';

type PrivateInfo = {
  refreshToken: string;
};

export type OktaAuthProviderOptions = OAuthProviderOptions & {
  audience: string;
  signInResolver?: SignInResolver<OAuthResult>;
  authHandler: AuthHandler<OAuthResult>;
  tokenIssuer: TokenIssuer;
  catalogIdentityClient: CatalogIdentityClient;
  logger: Logger;
};

export class OktaAuthProvider implements OAuthHandlers {
  private readonly _strategy: any;
  private readonly _signInResolver?: SignInResolver<OAuthResult>;
  private readonly _authHandler: AuthHandler<OAuthResult>;
  private readonly _tokenIssuer: TokenIssuer;
  private readonly _catalogIdentityClient: CatalogIdentityClient;
  private readonly _logger: Logger;

  /**
   * Due to passport-okta-oauth forcing options.state = true,
   * passport-oauth2 requires express-session to be installed
   * so that the 'state' parameter of the oauth2 flow can be stored.
   * This implementation of StateStore matches the NullStore found within
   * passport-oauth2, which is the StateStore implementation used when options.state = false,
   * allowing us to avoid using express-session in order to integrate with Okta.
   */
  private _store: StateStore = {
    store(_req: express.Request, cb: any) {
      cb(null, null);
    },
    verify(_req: express.Request, _state: string, cb: any) {
      cb(null, true);
    },
  };

  constructor(options: OktaAuthProviderOptions) {
    this._signInResolver = options.signInResolver;
    this._authHandler = options.authHandler;
    this._tokenIssuer = options.tokenIssuer;
    this._catalogIdentityClient = options.catalogIdentityClient;
    this._logger = options.logger;

    this._strategy = new OktaStrategy(
      {
        clientID: options.clientId,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackUrl,
        audience: options.audience,
        passReqToCallback: false as true,
        store: this._store,
        response_type: 'code',
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
      scope: req.scope,
      state: encodeState(req.state),
    });
  }

  async handler(
    req: express.Request,
  ): Promise<{ response: OAuthResponse; refreshToken: string }> {
    const { result, privateInfo } = await executeFrameHandlerStrategy<
      OAuthResult,
      PrivateInfo
    >(req, this._strategy);

    return {
      response: await this.handleResult(result),
      refreshToken: privateInfo.refreshToken,
    };
  }

  async refresh(req: OAuthRefreshRequest): Promise<OAuthResponse> {
    const { accessToken, params } = await executeRefreshTokenStrategy(
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
      refreshToken: req.refreshToken,
    });
  }

  private async handleResult(result: OAuthResult) {
    const { profile } = await this._authHandler(result);

    const response: OAuthResponse = {
      providerInfo: {
        idToken: result.params.id_token,
        accessToken: result.accessToken,
        scope: result.params.scope,
        expiresInSeconds: result.params.expires_in,
      },
      profile,
    };

    if (this._signInResolver) {
      response.backstageIdentity = await this._signInResolver(
        {
          result,
          profile,
        },
        {
          tokenIssuer: this._tokenIssuer,
          catalogIdentityClient: this._catalogIdentityClient,
          logger: this._logger,
        },
      );
    }

    return response;
  }
}

export const oktaEmailSignInResolver: SignInResolver<OAuthResult> = async (
  info,
  ctx,
) => {
  const { profile } = info;

  if (!profile.email) {
    throw new Error('Okta profile contained no email');
  }

  const entity = await ctx.catalogIdentityClient.findUser({
    annotations: {
      'okta.com/email': profile.email,
    },
  });

  const claims = getEntityClaims(entity);
  const token = await ctx.tokenIssuer.issueToken({ claims });

  return { id: entity.metadata.name, entity, token };
};

export const oktaDefaultSignInResolver: SignInResolver<OAuthResult> = async (
  info,
  ctx,
) => {
  const { profile } = info;

  if (!profile.email) {
    throw new Error('Okta profile contained no email');
  }

  // TODO(Rugvip): Hardcoded to the local part of the email for now
  const userId = profile.email.split('@')[0];

  const token = await ctx.tokenIssuer.issueToken({
    claims: { sub: userId, ent: [`user:default/${userId}`] },
  });

  return { id: userId, token };
};

export type OktaProviderOptions = {
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
    resolver?: SignInResolver<OAuthResult>;
  };
};

export const createOktaProvider = (
  _options?: OktaProviderOptions,
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
      const audience = envConfig.getString('audience');
      const callbackUrl = `${globalConfig.baseUrl}/${providerId}/handler/frame`;

      if (!audience.startsWith('https')) {
        throw new Error("URL for 'audience' must start with 'https'.");
      }

      const catalogIdentityClient = new CatalogIdentityClient({
        catalogApi,
        tokenIssuer,
      });

      const authHandler: AuthHandler<OAuthResult> = _options?.authHandler
        ? _options.authHandler
        : async ({ fullProfile, params }) => ({
            profile: makeProfileInfo(fullProfile, params.id_token),
          });

      const signInResolverFn =
        _options?.signIn?.resolver ?? oktaDefaultSignInResolver;

      const signInResolver: SignInResolver<OAuthResult> = info =>
        signInResolverFn(info, {
          catalogIdentityClient,
          tokenIssuer,
          logger,
        });

      const provider = new OktaAuthProvider({
        audience,
        clientId,
        clientSecret,
        callbackUrl,
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
      });
    });
};
