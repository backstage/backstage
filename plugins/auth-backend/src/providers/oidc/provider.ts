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
  Client,
  Issuer,
  Strategy as OidcStrategy,
  TokenSet,
  UserinfoResponse,
} from 'openid-client';
import {
  encodeState,
  OAuthAdapter,
  OAuthEnvironmentHandler,
  OAuthHandlers,
  OAuthProviderOptions,
  OAuthRefreshRequest,
  OAuthResponse,
  OAuthStartRequest,
} from '../../lib/oauth';
import {
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
  PassportDoneCallback,
} from '../../lib/passport';
import {
  AuthHandler,
  AuthResolverContext,
  RedirectInfo,
  SignInResolver,
} from '../types';
import { createAuthProviderIntegration } from '../createAuthProviderIntegration';

type PrivateInfo = {
  refreshToken?: string;
};

type OidcImpl = {
  strategy: OidcStrategy<UserinfoResponse, Client>;
  client: Client;
};

/**
 * authentication result for the OIDC which includes the token set and user information (a profile response sent by OIDC server)
 * @public
 */
export type OidcAuthResult = {
  tokenset: TokenSet;
  userinfo: UserinfoResponse;
};

export type Options = OAuthProviderOptions & {
  metadataUrl: string;
  scope?: string;
  prompt?: string;
  tokenSignedResponseAlg?: string;
  signInResolver?: SignInResolver<OidcAuthResult>;
  authHandler: AuthHandler<OidcAuthResult>;
  resolverContext: AuthResolverContext;
};

export class OidcAuthProvider implements OAuthHandlers {
  private readonly implementation: Promise<OidcImpl>;
  private readonly scope?: string;
  private readonly prompt?: string;

  private readonly signInResolver?: SignInResolver<OidcAuthResult>;
  private readonly authHandler: AuthHandler<OidcAuthResult>;
  private readonly resolverContext: AuthResolverContext;

  constructor(options: Options) {
    this.implementation = this.setupStrategy(options);
    this.scope = options.scope;
    this.prompt = options.prompt;
    this.signInResolver = options.signInResolver;
    this.authHandler = options.authHandler;
    this.resolverContext = options.resolverContext;
  }

  async start(req: OAuthStartRequest): Promise<RedirectInfo> {
    const { strategy } = await this.implementation;
    const options: Record<string, string> = {
      scope: req.scope || this.scope || 'openid profile email',
      state: encodeState(req.state),
    };
    const prompt = this.prompt || 'none';
    if (prompt !== 'auto') {
      options.prompt = prompt;
    }
    return await executeRedirectStrategy(req, strategy, options);
  }

  async handler(req: express.Request) {
    const { strategy } = await this.implementation;
    const { result, privateInfo } = await executeFrameHandlerStrategy<
      OidcAuthResult,
      PrivateInfo
    >(req, strategy);

    return {
      response: await this.handleResult(result),
      refreshToken: privateInfo.refreshToken,
    };
  }

  async refresh(req: OAuthRefreshRequest) {
    const { client } = await this.implementation;
    const tokenset = await client.refresh(req.refreshToken);
    if (!tokenset.access_token) {
      throw new Error('Refresh failed');
    }
    const userinfo = await client.userinfo(tokenset.access_token);

    return {
      response: await this.handleResult({ tokenset, userinfo }),
      refreshToken: tokenset.refresh_token,
    };
  }

  private async setupStrategy(options: Options): Promise<OidcImpl> {
    const issuer = await Issuer.discover(options.metadataUrl);
    const client = new issuer.Client({
      access_type: 'offline', // this option must be passed to provider to receive a refresh token
      client_id: options.clientId,
      client_secret: options.clientSecret,
      redirect_uris: [options.callbackUrl],
      response_types: ['code'],
      id_token_signed_response_alg: options.tokenSignedResponseAlg || 'RS256',
      scope: options.scope || '',
    });

    const strategy = new OidcStrategy(
      {
        client,
        passReqToCallback: false,
      },
      (
        tokenset: TokenSet,
        userinfo: UserinfoResponse,
        done: PassportDoneCallback<OidcAuthResult, PrivateInfo>,
      ) => {
        if (typeof done !== 'function') {
          throw new Error(
            'OIDC IdP must provide a userinfo_endpoint in the metadata response',
          );
        }
        done(
          undefined,
          { tokenset, userinfo },
          {
            refreshToken: tokenset.refresh_token,
          },
        );
      },
    );
    strategy.error = console.error;
    return { strategy, client };
  }

  // Use this function to grab the user profile info from the token
  // Then populate the profile with it
  private async handleResult(result: OidcAuthResult): Promise<OAuthResponse> {
    const { profile } = await this.authHandler(result, this.resolverContext);
    const response: OAuthResponse = {
      providerInfo: {
        idToken: result.tokenset.id_token,
        accessToken: result.tokenset.access_token!,
        scope: result.tokenset.scope!,
        expiresInSeconds: result.tokenset.expires_in,
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
 * Auth provider integration for generic OpenID Connect auth
 *
 * @public
 */
export const oidc = createAuthProviderIntegration({
  create(options?: {
    authHandler?: AuthHandler<OidcAuthResult>;

    signIn?: {
      resolver: SignInResolver<OidcAuthResult>;
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
        const metadataUrl = envConfig.getString('metadataUrl');
        const tokenSignedResponseAlg = envConfig.getOptionalString(
          'tokenSignedResponseAlg',
        );
        const scope = envConfig.getOptionalString('scope');
        const prompt = envConfig.getOptionalString('prompt');

        const authHandler: AuthHandler<OidcAuthResult> = options?.authHandler
          ? options.authHandler
          : async ({ userinfo }) => ({
              profile: {
                displayName: userinfo.name,
                email: userinfo.email,
                picture: userinfo.picture,
              },
            });

        const provider = new OidcAuthProvider({
          clientId,
          clientSecret,
          callbackUrl,
          tokenSignedResponseAlg,
          metadataUrl,
          scope,
          prompt,
          signInResolver: options?.signIn?.resolver,
          authHandler,
          resolverContext,
        });

        return OAuthAdapter.fromConfig(globalConfig, provider, {
          providerId,
          callbackUrl,
        });
      });
  },
});
