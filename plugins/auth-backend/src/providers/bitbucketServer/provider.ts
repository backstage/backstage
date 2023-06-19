/*
 * Copyright 2023 The Backstage Authors
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

import {
  encodeState,
  OAuthAdapter,
  OAuthEnvironmentHandler,
} from '../../lib/oauth';
import { Strategy as OAuth2Strategy, VerifyCallback } from 'passport-oauth2';
import {
  executeFetchUserProfileStrategy,
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
  executeRefreshTokenStrategy,
  makeProfileInfo,
} from '../../lib/passport';
import {
  AuthHandler,
  AuthResolverContext,
  OAuthStartResponse,
  SignInResolver,
  OAuthHandlers,
  OAuthProviderOptions,
  OAuthRefreshRequest,
  OAuthResponse,
  OAuthStartRequest,
} from '@backstage/plugin-auth-node';
import express from 'express';
import { createAuthProviderIntegration } from '../createAuthProviderIntegration';
import { Profile as PassportProfile } from 'passport';
import { commonByEmailResolver } from '../resolvers';
import fetch from 'node-fetch';

type PrivateInfo = {
  refreshToken: string;
};

/** @public */
export type BitbucketServerOAuthResult = {
  fullProfile: PassportProfile;
  params: {
    scope: string;
    access_token?: string;
    token_type?: string;
    expires_in?: number;
  };
  accessToken: string;
  refreshToken?: string;
};

export type BitbucketServerAuthProviderOptions = OAuthProviderOptions & {
  host: string;
  authorizationUrl: string;
  tokenUrl: string;
  authHandler: AuthHandler<BitbucketServerOAuthResult>;
  signInResolver?: SignInResolver<BitbucketServerOAuthResult>;
  resolverContext: AuthResolverContext;
};

export class BitbucketServerAuthProvider implements OAuthHandlers {
  private readonly signInResolver?: SignInResolver<BitbucketServerOAuthResult>;
  private readonly authHandler: AuthHandler<BitbucketServerOAuthResult>;
  private readonly resolverContext: AuthResolverContext;
  private readonly strategy: OAuth2Strategy;
  private readonly host: string;

  constructor(options: BitbucketServerAuthProviderOptions) {
    this.signInResolver = options.signInResolver;
    this.authHandler = options.authHandler;
    this.resolverContext = options.resolverContext;
    this.strategy = new OAuth2Strategy(
      {
        authorizationURL: options.authorizationUrl,
        tokenURL: options.tokenUrl,
        clientID: options.clientId,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackUrl,
      },
      (
        accessToken: string,
        refreshToken: string,
        params: any,
        fullProfile: PassportProfile,
        done: VerifyCallback,
      ) => {
        done(undefined, { fullProfile, params, accessToken }, { refreshToken });
      },
    );
    this.host = options.host;
  }

  async start(req: OAuthStartRequest): Promise<OAuthStartResponse> {
    return await executeRedirectStrategy(req, this.strategy, {
      accessType: 'offline',
      prompt: 'consent',
      scope: req.scope,
      state: encodeState(req.state),
    });
  }

  async handler(
    req: express.Request,
  ): Promise<{ response: OAuthResponse; refreshToken?: string }> {
    const { result, privateInfo } = await executeFrameHandlerStrategy<
      BitbucketServerOAuthResult,
      PrivateInfo
    >(req, this.strategy);

    return {
      response: await this.handleResult(result),
      refreshToken: privateInfo.refreshToken,
    };
  }

  async refresh(
    req: OAuthRefreshRequest,
  ): Promise<{ response: OAuthResponse; refreshToken?: string }> {
    const { accessToken, refreshToken, params } =
      await executeRefreshTokenStrategy(
        this.strategy,
        req.refreshToken,
        req.scope,
      );
    const fullProfile = await executeFetchUserProfileStrategy(
      this.strategy,
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

  private async handleResult(
    result: BitbucketServerOAuthResult,
  ): Promise<OAuthResponse> {
    // The OAuth2 strategy does not return a user profile -> let's fetch it before calling the auth handler
    result.fullProfile = await this.fetchProfile(result);
    const { profile } = await this.authHandler(result, this.resolverContext);

    let backstageIdentity = undefined;
    if (this.signInResolver) {
      backstageIdentity = await this.signInResolver(
        { result, profile },
        this.resolverContext,
      );
    }

    return {
      providerInfo: {
        accessToken: result.accessToken,
        scope: result.params.scope,
        expiresInSeconds: result.params.expires_in,
      },
      profile,
      backstageIdentity,
    };
  }

  private async fetchProfile(
    result: BitbucketServerOAuthResult,
  ): Promise<PassportProfile> {
    // Get current user name
    let whoAmIResponse;
    try {
      whoAmIResponse = await fetch(
        `https://${this.host}/plugins/servlet/applinks/whoami`,
        {
          headers: {
            Authorization: `Bearer ${result.accessToken}`,
          },
        },
      );
    } catch (e) {
      throw new Error(`Failed to retrieve the username of the logged in user`);
    }

    // A response.ok check here would be worthless as the Bitbucket API always returns 200 OK for this call
    const username = whoAmIResponse.headers.get('X-Ausername');
    if (!username) {
      throw new Error(`Failed to retrieve the username of the logged in user`);
    }

    let userResponse;
    try {
      userResponse = await fetch(
        `https://${this.host}/rest/api/latest/users/${username}?avatarSize=256`,
        {
          headers: {
            Authorization: `Bearer ${result.accessToken}`,
          },
        },
      );
    } catch (e) {
      throw new Error(`Failed to retrieve the user '${username}'`);
    }

    if (!userResponse.ok) {
      throw new Error(`Failed to retrieve the user '${username}'`);
    }

    const user = await userResponse.json();

    const passportProfile = {
      provider: 'bitbucketServer',
      id: user.id.toString(),
      displayName: user.displayName,
      username: user.name,
      emails: [
        {
          value: user.emailAddress,
        },
      ],
    } as PassportProfile;

    if (user.avatarUrl) {
      passportProfile.photos = [
        { value: `https://${this.host}${user.avatarUrl}` },
      ];
    }

    return passportProfile;
  }
}

export const bitbucketServer = createAuthProviderIntegration({
  create(options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<BitbucketServerOAuthResult>;

    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
      /**
       * Maps an auth result to a Backstage identity for the user.
       */
      resolver: SignInResolver<BitbucketServerOAuthResult>;
    };
  }) {
    return ({ providerId, globalConfig, config, resolverContext }) =>
      OAuthEnvironmentHandler.mapConfig(config, envConfig => {
        const clientId = envConfig.getString('clientId');
        const clientSecret = envConfig.getString('clientSecret');
        const host = envConfig.getString('host');
        const customCallbackUrl = envConfig.getOptionalString('callbackUrl');
        const callbackUrl =
          customCallbackUrl ||
          `${globalConfig.baseUrl}/${providerId}/handler/frame`;
        const authorizationUrl = `https://${host}/rest/oauth2/latest/authorize`;
        const tokenUrl = `https://${host}/rest/oauth2/latest/token`;

        const authHandler: AuthHandler<BitbucketServerOAuthResult> =
          options?.authHandler
            ? options.authHandler
            : async ({ fullProfile }) => ({
                profile: makeProfileInfo(fullProfile),
              });

        const provider = new BitbucketServerAuthProvider({
          callbackUrl,
          clientId,
          clientSecret,
          host,
          authorizationUrl,
          tokenUrl,
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
  resolvers: {
    /**
     * Looks up the user by matching their email to the entity email.
     */
    emailMatchingUserEntityProfileEmail:
      (): SignInResolver<BitbucketServerOAuthResult> => commonByEmailResolver,
  },
});
