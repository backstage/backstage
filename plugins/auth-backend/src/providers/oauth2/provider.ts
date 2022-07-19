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
import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import {
  encodeState,
  OAuthAdapter,
  OAuthEnvironmentHandler,
  OAuthHandlers,
  OAuthProviderOptions,
  OAuthRefreshRequest,
  OAuthResponse,
  OAuthResult,
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
import {
  AuthHandler,
  AuthResolverContext,
  RedirectInfo,
  SignInResolver,
} from '../types';
import { createAuthProviderIntegration } from '../createAuthProviderIntegration';
import { InputError } from '@backstage/errors';

type PrivateInfo = {
  refreshToken: string;
};

export type OAuth2AuthProviderOptions = OAuthProviderOptions & {
  signInResolver?: SignInResolver<OAuthResult>;
  authHandler: AuthHandler<OAuthResult>;
  authorizationUrl: string;
  tokenUrl: string;
  scope?: string;
  resolverContext: AuthResolverContext;
  includeBasicAuth?: boolean;
  disableRefresh?: boolean;
};

export class OAuth2AuthProvider implements OAuthHandlers {
  private readonly _strategy: OAuth2Strategy;
  private readonly signInResolver?: SignInResolver<OAuthResult>;
  private readonly authHandler: AuthHandler<OAuthResult>;
  private readonly resolverContext: AuthResolverContext;
  private readonly disableRefresh: boolean;

  constructor(options: OAuth2AuthProviderOptions) {
    this.signInResolver = options.signInResolver;
    this.authHandler = options.authHandler;
    this.resolverContext = options.resolverContext;
    this.disableRefresh = options.disableRefresh ?? false;

    this._strategy = new OAuth2Strategy(
      {
        clientID: options.clientId,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackUrl,
        authorizationURL: options.authorizationUrl,
        tokenURL: options.tokenUrl,
        passReqToCallback: false,
        scope: options.scope,
        customHeaders: options.includeBasicAuth
          ? {
              Authorization: `Basic ${this.encodeClientCredentials(
                options.clientId,
                options.clientSecret,
              )}`,
            }
          : undefined,
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
            fullProfile,
            accessToken,
            refreshToken,
            params,
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
    if (this.disableRefresh) {
      throw new InputError('Session refreshes have been disabled');
    }
    const refreshTokenResponse = await executeRefreshTokenStrategy(
      this._strategy,
      req.refreshToken,
      req.scope,
    );
    const { accessToken, params, refreshToken } = refreshTokenResponse;

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
    const { profile } = await this.authHandler(result, this.resolverContext);

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
        this.resolverContext,
      );
    }

    return response;
  }

  encodeClientCredentials(clientID: string, clientSecret: string): string {
    return Buffer.from(`${clientID}:${clientSecret}`).toString('base64');
  }
}

/**
 * Auth provider integration for generic OAuth2 auth
 *
 * @public
 */
export const oauth2 = createAuthProviderIntegration({
  create(options?: {
    authHandler?: AuthHandler<OAuthResult>;

    signIn?: {
      resolver: SignInResolver<OAuthResult>;
    };
  }) {
    return ({ providerId, globalConfig, config, resolverContext }) =>
      OAuthEnvironmentHandler.mapConfig(config, envConfig => {
        const clientId = envConfig.getString('clientId');
        const clientSecret = envConfig.getString('clientSecret');
        const customCallbackUrl = envConfig.getOptionalString('callbackUrl');
        const callbackUrl =
          customCallbackUrl ||
          `${globalConfig.baseUrl}/${providerId}/handler/frame`;
        const authorizationUrl = envConfig.getString('authorizationUrl');
        const tokenUrl = envConfig.getString('tokenUrl');
        const scope = envConfig.getOptionalString('scope');
        const includeBasicAuth =
          envConfig.getOptionalBoolean('includeBasicAuth');
        const disableRefresh =
          envConfig.getOptionalBoolean('disableRefresh') ?? false;

        const authHandler: AuthHandler<OAuthResult> = options?.authHandler
          ? options.authHandler
          : async ({ fullProfile, params }) => ({
              profile: makeProfileInfo(fullProfile, params.id_token),
            });

        const provider = new OAuth2AuthProvider({
          clientId,
          clientSecret,
          callbackUrl,
          signInResolver: options?.signIn?.resolver,
          authHandler,
          authorizationUrl,
          tokenUrl,
          scope,
          includeBasicAuth,
          resolverContext,
          disableRefresh,
        });

        return OAuthAdapter.fromConfig(globalConfig, provider, {
          providerId,
          callbackUrl,
        });
      });
  },
});
