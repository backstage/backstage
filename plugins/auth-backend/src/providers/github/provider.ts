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
  AuthHandler,
  SignInResolver,
  StateEncoder,
  AuthResolverContext,
} from '../types';
import {
  OAuthAdapter,
  OAuthProviderOptions,
  OAuthHandlers,
  OAuthEnvironmentHandler,
  OAuthStartRequest,
  encodeState,
  OAuthRefreshRequest,
} from '../../lib/oauth';
import { createAuthProviderIntegration } from '../createAuthProviderIntegration';

const ACCESS_TOKEN_PREFIX = 'access-token.';

// TODO(Rugvip): Auth providers need a way to access this in a less hardcoded way
const BACKSTAGE_SESSION_EXPIRATION = 3600;

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
  stateEncoder: StateEncoder;
  resolverContext: AuthResolverContext;
};

export class GithubAuthProvider implements OAuthHandlers {
  private readonly _strategy: GithubStrategy;
  private readonly signInResolver?: SignInResolver<GithubOAuthResult>;
  private readonly authHandler: AuthHandler<GithubOAuthResult>;
  private readonly resolverContext: AuthResolverContext;
  private readonly stateEncoder: StateEncoder;

  constructor(options: GithubAuthProviderOptions) {
    this.signInResolver = options.signInResolver;
    this.authHandler = options.authHandler;
    this.stateEncoder = options.stateEncoder;
    this.resolverContext = options.resolverContext;
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
      state: (await this.stateEncoder(req)).encodedState,
    });
  }

  async handler(req: express.Request) {
    const { result, privateInfo } = await executeFrameHandlerStrategy<
      GithubOAuthResult,
      PrivateInfo
    >(req, this._strategy);

    let refreshToken = privateInfo.refreshToken;

    // If we do not have a real refresh token and we have a non-expiring
    // access token, then we use that as our refresh token.
    if (!refreshToken && !result.params.expires_in) {
      refreshToken = ACCESS_TOKEN_PREFIX + result.accessToken;
    }

    return {
      response: await this.handleResult(result),
      refreshToken,
    };
  }

  async refresh(req: OAuthRefreshRequest) {
    // We've enable persisting scope in the OAuth provider, so scope here will
    // be whatever was stored in the cookie
    const { scope, refreshToken } = req;

    // This is the OAuth App flow. A non-expiring access token is stored in the
    // refresh token cookie. We use that token to fetch the user profile and
    // refresh the Backstage session when needed.
    if (refreshToken?.startsWith(ACCESS_TOKEN_PREFIX)) {
      const accessToken = refreshToken.slice(ACCESS_TOKEN_PREFIX.length);

      const fullProfile = await executeFetchUserProfileStrategy(
        this._strategy,
        accessToken,
      ).catch(error => {
        if (error.oauthError?.statusCode === 401) {
          throw new Error('Invalid access token');
        }
        throw error;
      });

      return {
        response: await this.handleResult({
          fullProfile,
          params: { scope },
          accessToken,
        }),
        refreshToken,
      };
    }

    // This is the App flow, which is close to a standard OAuth refresh flow. It has a
    // pretty long session expiration, and it also ignores the requested scope, instead
    // just allowing access to whatever is configured as part of the app installation.
    const result = await executeRefreshTokenStrategy(
      this._strategy,
      refreshToken,
      scope,
    );
    return {
      response: await this.handleResult({
        fullProfile: await executeFetchUserProfileStrategy(
          this._strategy,
          result.accessToken,
        ),
        params: { ...result.params, scope },
        accessToken: result.accessToken,
      }),
      refreshToken: result.refreshToken,
    };
  }

  private async handleResult(result: GithubOAuthResult) {
    const { profile } = await this.authHandler(result, this.resolverContext);

    const expiresInStr = result.params.expires_in;
    let expiresInSeconds =
      expiresInStr === undefined ? undefined : Number(expiresInStr);

    let backstageIdentity = undefined;

    if (this.signInResolver) {
      backstageIdentity = await this.signInResolver(
        {
          result,
          profile,
        },
        this.resolverContext,
      );

      // GitHub sessions last longer than Backstage sessions, so if we're using
      // GitHub for sign-in, then we need to expire the sessions earlier
      if (expiresInSeconds) {
        expiresInSeconds = Math.min(
          expiresInSeconds,
          BACKSTAGE_SESSION_EXPIRATION,
        );
      } else {
        expiresInSeconds = BACKSTAGE_SESSION_EXPIRATION;
      }
    }

    return {
      backstageIdentity,
      providerInfo: {
        accessToken: result.accessToken,
        scope: result.params.scope,
        expiresInSeconds,
      },
      profile,
    };
  }
}

/**
 * Auth provider integration for GitHub auth
 *
 * @public
 */
export const github = createAuthProviderIntegration({
  create(options?: {
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
      resolver: SignInResolver<GithubOAuthResult>;
    };

    /**
     * The state encoder used to encode the 'state' parameter on the OAuth request.
     *
     * It should return a string that takes the state params (from the request), url encodes the params
     * and finally base64 encodes them.
     *
     * Providing your own stateEncoder will allow you to add addition parameters to the state field.
     *
     * It is typed as follows:
     *   `export type StateEncoder = (input: OAuthState) => Promise<{encodedState: string}>;`
     *
     * Note: the stateEncoder must encode a 'nonce' value and an 'env' value. Without this, the OAuth flow will fail
     * (These two values will be set by the req.state by default)
     *
     * For more information, please see the helper module in ../../oauth/helpers #readState
     */
    stateEncoder?: StateEncoder;
  }) {
    return ({ providerId, globalConfig, config, resolverContext }) =>
      OAuthEnvironmentHandler.mapConfig(config, envConfig => {
        const clientId = envConfig.getString('clientId');
        const clientSecret = envConfig.getString('clientSecret');
        const enterpriseInstanceUrl = envConfig
          .getOptionalString('enterpriseInstanceUrl')
          ?.replace(/\/$/, '');
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

        const authHandler: AuthHandler<GithubOAuthResult> = options?.authHandler
          ? options.authHandler
          : async ({ fullProfile }) => ({
              profile: makeProfileInfo(fullProfile),
            });

        const stateEncoder: StateEncoder =
          options?.stateEncoder ??
          (async (
            req: OAuthStartRequest,
          ): Promise<{ encodedState: string }> => {
            return { encodedState: encodeState(req.state) };
          });

        const provider = new GithubAuthProvider({
          clientId,
          clientSecret,
          callbackUrl,
          tokenUrl,
          userProfileUrl,
          authorizationUrl,
          signInResolver: options?.signIn?.resolver,
          authHandler,
          stateEncoder,
          resolverContext,
        });

        return OAuthAdapter.fromConfig(globalConfig, provider, {
          persistScopes: true,
          providerId,
          callbackUrl,
        });
      });
  },
  resolvers: {
    /**
     * Looks up the user by matching their GitHub username to the entity name.
     */
    usernameMatchingUserEntityName: (): SignInResolver<GithubOAuthResult> => {
      return async (info, ctx) => {
        const { fullProfile } = info.result;

        const userId = fullProfile.username;
        if (!userId) {
          throw new Error(`GitHub user profile does not contain a username`);
        }

        return ctx.signInWithCatalogUser({ entityRef: { name: userId } });
      };
    },
  },
});
