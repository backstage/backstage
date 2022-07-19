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
import { Strategy as GitlabStrategy } from 'passport-gitlab2';
import {
  executeRedirectStrategy,
  executeFrameHandlerStrategy,
  executeRefreshTokenStrategy,
  executeFetchUserProfileStrategy,
  makeProfileInfo,
  PassportDoneCallback,
} from '../../lib/passport';
import {
  RedirectInfo,
  SignInResolver,
  AuthHandler,
  AuthResolverContext,
} from '../types';
import {
  OAuthAdapter,
  OAuthProviderOptions,
  OAuthHandlers,
  OAuthResponse,
  OAuthEnvironmentHandler,
  OAuthStartRequest,
  OAuthRefreshRequest,
  encodeState,
  OAuthResult,
} from '../../lib/oauth';
import { createAuthProviderIntegration } from '../createAuthProviderIntegration';

type PrivateInfo = {
  refreshToken: string;
};

export type GitlabAuthProviderOptions = OAuthProviderOptions & {
  baseUrl: string;
  signInResolver?: SignInResolver<OAuthResult>;
  authHandler: AuthHandler<OAuthResult>;
  resolverContext: AuthResolverContext;
};

export const gitlabUsernameEntityNameSignInResolver: SignInResolver<
  OAuthResult
> = async (info, ctx) => {
  const { result } = info;

  const id = result.fullProfile.username;
  if (!id) {
    throw new Error(`GitLab user profile does not contain a username`);
  }

  return ctx.signInWithCatalogUser({ entityRef: { name: id } });
};

export const gitlabDefaultAuthHandler: AuthHandler<OAuthResult> = async ({
  fullProfile,
  params,
}) => ({
  profile: makeProfileInfo(fullProfile, params.id_token),
});

export class GitlabAuthProvider implements OAuthHandlers {
  private readonly _strategy: GitlabStrategy;
  private readonly signInResolver?: SignInResolver<OAuthResult>;
  private readonly authHandler: AuthHandler<OAuthResult>;
  private readonly resolverContext: AuthResolverContext;

  constructor(options: GitlabAuthProviderOptions) {
    this.resolverContext = options.resolverContext;
    this.authHandler = options.authHandler;
    this.signInResolver = options.signInResolver;

    this._strategy = new GitlabStrategy(
      {
        clientID: options.clientId,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackUrl,
        baseURL: options.baseUrl,
      },
      (
        accessToken: any,
        refreshToken: any,
        params: any,
        fullProfile: any,
        done: PassportDoneCallback<OAuthResult, PrivateInfo>,
      ) => {
        done(
          undefined,
          { fullProfile, params, accessToken },
          {
            refreshToken,
          },
        );
      },
    );
  }

  async start(req: OAuthStartRequest): Promise<RedirectInfo> {
    return await executeRedirectStrategy(req, this._strategy, {
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
}

/**
 * Auth provider integration for GitLab auth
 *
 * @public
 */
export const gitlab = createAuthProviderIntegration({
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
        const audience = envConfig.getOptionalString('audience');
        const baseUrl = audience || 'https://gitlab.com';
        const customCallbackUrl = envConfig.getOptionalString('callbackUrl');
        const callbackUrl =
          customCallbackUrl ||
          `${globalConfig.baseUrl}/${providerId}/handler/frame`;

        const authHandler: AuthHandler<OAuthResult> =
          options?.authHandler ?? gitlabDefaultAuthHandler;

        const provider = new GitlabAuthProvider({
          clientId,
          clientSecret,
          callbackUrl,
          baseUrl,
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
