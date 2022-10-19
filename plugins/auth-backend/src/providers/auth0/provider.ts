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
import Auth0Strategy from './strategy';
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
import {
  executeFetchUserProfileStrategy,
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
  executeRefreshTokenStrategy,
  makeProfileInfo,
  PassportDoneCallback,
} from '../../lib/passport';
import {
  OAuthStartResponse,
  AuthHandler,
  SignInResolver,
  AuthResolverContext,
} from '../types';
import { createAuthProviderIntegration } from '../createAuthProviderIntegration';
import { StateStore } from 'passport-oauth2';

type PrivateInfo = {
  refreshToken: string;
};

export type Auth0AuthProviderOptions = OAuthProviderOptions & {
  domain: string;
  signInResolver?: SignInResolver<OAuthResult>;
  authHandler: AuthHandler<OAuthResult>;
  resolverContext: AuthResolverContext;
  audience?: string;
  connection?: string;
  connectionScope?: string;
};

export class Auth0AuthProvider implements OAuthHandlers {
  private readonly _strategy: Auth0Strategy;
  private readonly signInResolver?: SignInResolver<OAuthResult>;
  private readonly authHandler: AuthHandler<OAuthResult>;
  private readonly resolverContext: AuthResolverContext;
  private readonly audience?: string;
  private readonly connection?: string;
  private readonly connectionScope?: string;

  /**
   * Due to passport-auth0 forcing options.state = true,
   * passport-oauth2 requires express-session to be installed
   * so that the 'state' parameter of the oauth2 flow can be stored.
   * This implementation of StateStore matches the NullStore found within
   * passport-oauth2, which is the StateStore implementation used when options.state = false,
   * allowing us to avoid using express-session in order to integrate with auth0.
   */
  private store: StateStore = {
    store(_req: express.Request, cb: any) {
      cb(null, null);
    },
    verify(_req: express.Request, _state: string, cb: any) {
      cb(null, true);
    },
  };

  constructor(options: Auth0AuthProviderOptions) {
    this.signInResolver = options.signInResolver;
    this.authHandler = options.authHandler;
    this.resolverContext = options.resolverContext;
    this.audience = options.audience;
    this.connection = options.connection;
    this.connectionScope = options.connectionScope;
    this._strategy = new Auth0Strategy(
      {
        clientID: options.clientId,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackUrl,
        domain: options.domain,
        // We need passReqToCallback set to false to get params, but there's
        // no matching type signature for that, so instead behold this beauty
        passReqToCallback: false as true,
        store: this.store,
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

  async start(req: OAuthStartRequest): Promise<OAuthStartResponse> {
    return await executeRedirectStrategy(req, this._strategy, {
      accessType: 'offline',
      prompt: 'consent',
      scope: req.scope,
      state: encodeState(req.state),
      ...(this.audience ? { audience: this.audience } : {}),
      ...(this.connection ? { connection: this.connection } : {}),
      ...(this.connectionScope
        ? { connection_scope: this.connectionScope }
        : {}),
    });
  }

  async handler(req: express.Request) {
    const { result, privateInfo } = await executeFrameHandlerStrategy<
      OAuthResult,
      PrivateInfo
    >(req, this._strategy, {
      ...(this.audience ? { audience: this.audience } : {}),
      ...(this.connection ? { connection: this.connection } : {}),
      ...(this.connectionScope
        ? { connection_scope: this.connectionScope }
        : {}),
    });

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
 * Auth provider integration for auth0 auth
 *
 * @public
 */
export const auth0 = createAuthProviderIntegration({
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
      /**
       * Maps an auth result to a Backstage identity for the user.
       */
      resolver: SignInResolver<OAuthResult>;
    };
  }) {
    return ({ providerId, globalConfig, config, resolverContext }) =>
      OAuthEnvironmentHandler.mapConfig(config, envConfig => {
        const clientId = envConfig.getString('clientId');
        const clientSecret = envConfig.getString('clientSecret');
        const domain = envConfig.getString('domain');
        const customCallbackUrl = envConfig.getOptionalString('callbackUrl');
        const audience = envConfig.getOptionalString('audience');
        const connection = envConfig.getOptionalString('connection');
        const connectionScope = envConfig.getOptionalString('connectionScope');
        const callbackUrl =
          customCallbackUrl ||
          `${globalConfig.baseUrl}/${providerId}/handler/frame`;

        const authHandler: AuthHandler<OAuthResult> = options?.authHandler
          ? options.authHandler
          : async ({ fullProfile, params }) => ({
              profile: makeProfileInfo(fullProfile, params.id_token),
            });

        const signInResolver = options?.signIn?.resolver;

        const provider = new Auth0AuthProvider({
          clientId,
          clientSecret,
          callbackUrl,
          domain,
          authHandler,
          signInResolver,
          resolverContext,
          audience,
          connection,
          connectionScope,
        });

        return OAuthAdapter.fromConfig(globalConfig, provider, {
          providerId,
          callbackUrl,
        });
      });
  },
});
