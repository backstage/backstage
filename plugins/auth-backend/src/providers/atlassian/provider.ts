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

import AtlassianStrategy from './strategy';
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
import passport from 'passport';
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
import express from 'express';
import { createAuthProviderIntegration } from '../createAuthProviderIntegration';

export type AtlassianAuthProviderOptions = OAuthProviderOptions & {
  scopes: string;
  signInResolver?: SignInResolver<OAuthResult>;
  authHandler: AuthHandler<OAuthResult>;
  resolverContext: AuthResolverContext;
};

export const atlassianDefaultAuthHandler: AuthHandler<OAuthResult> = async ({
  fullProfile,
  params,
}) => ({
  profile: makeProfileInfo(fullProfile, params.id_token),
});

/**
 * @public
 * @deprecated This export is deprecated and will be removed in the future.
 */
export class AtlassianAuthProvider implements OAuthHandlers {
  private readonly _strategy: AtlassianStrategy;
  private readonly signInResolver?: SignInResolver<OAuthResult>;
  private readonly authHandler: AuthHandler<OAuthResult>;
  private readonly resolverContext: AuthResolverContext;

  constructor(options: AtlassianAuthProviderOptions) {
    this.resolverContext = options.resolverContext;
    this.authHandler = options.authHandler;
    this.signInResolver = options.signInResolver;

    this._strategy = new AtlassianStrategy(
      {
        clientID: options.clientId,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackUrl,
        scope: options.scopes,
      },
      (
        accessToken: any,
        refreshToken: any,
        params: any,
        fullProfile: passport.Profile,
        done: PassportDoneCallback<OAuthResult>,
      ) => {
        done(undefined, {
          fullProfile,
          accessToken,
          refreshToken,
          params,
        });
      },
    );
  }

  async start(req: OAuthStartRequest): Promise<RedirectInfo> {
    return await executeRedirectStrategy(req, this._strategy, {
      state: encodeState(req.state),
    });
  }

  async handler(req: express.Request) {
    const { result } = await executeFrameHandlerStrategy<OAuthResult>(
      req,
      this._strategy,
    );

    return {
      response: await this.handleResult(result),
      refreshToken: result.refreshToken,
    };
  }

  private async handleResult(result: OAuthResult): Promise<OAuthResponse> {
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

  async refresh(req: OAuthRefreshRequest) {
    const { accessToken, params, refreshToken } =
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
}

/**
 * Auth provider integration for atlassian auth
 *
 * @public
 */
export const atlassian = createAuthProviderIntegration({
  create(options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<OAuthResult>;

    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
      resolver: SignInResolver<OAuthResult>;
    };
  }) {
    return ({ providerId, globalConfig, config, resolverContext }) =>
      OAuthEnvironmentHandler.mapConfig(config, envConfig => {
        const clientId = envConfig.getString('clientId');
        const clientSecret = envConfig.getString('clientSecret');
        const scopes = envConfig.getString('scopes');
        const customCallbackUrl = envConfig.getOptionalString('callbackUrl');
        const callbackUrl =
          customCallbackUrl ||
          `${globalConfig.baseUrl}/${providerId}/handler/frame`;

        const authHandler: AuthHandler<OAuthResult> =
          options?.authHandler ?? atlassianDefaultAuthHandler;

        const provider = new AtlassianAuthProvider({
          clientId,
          clientSecret,
          scopes,
          callbackUrl,
          authHandler,
          signInResolver: options?.signIn?.resolver,
          resolverContext,
        });

        return OAuthAdapter.fromConfig(globalConfig, provider, {
          providerId,
          callbackUrl,
        });
      });
  },
});
