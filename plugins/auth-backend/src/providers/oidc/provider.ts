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

import {
  DEFAULT_NAMESPACE,
  stringifyEntityRef,
} from '@backstage/catalog-model';
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
  AuthProviderFactory,
  RedirectInfo,
  SignInResolver,
} from '../types';
import { CatalogIdentityClient } from '../../lib/catalog';
import { TokenIssuer } from '../../identity';
import { Logger } from 'winston';

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
  tokenIssuer: TokenIssuer;
  catalogIdentityClient: CatalogIdentityClient;
  logger: Logger;
};

export class OidcAuthProvider implements OAuthHandlers {
  private readonly implementation: Promise<OidcImpl>;
  private readonly scope?: string;
  private readonly prompt?: string;

  private readonly signInResolver?: SignInResolver<OidcAuthResult>;
  private readonly authHandler: AuthHandler<OidcAuthResult>;
  private readonly tokenIssuer: TokenIssuer;
  private readonly catalogIdentityClient: CatalogIdentityClient;
  private readonly logger: Logger;

  constructor(options: Options) {
    this.implementation = this.setupStrategy(options);
    this.scope = options.scope;
    this.prompt = options.prompt;
    this.signInResolver = options.signInResolver;
    this.authHandler = options.authHandler;
    this.tokenIssuer = options.tokenIssuer;
    this.catalogIdentityClient = options.catalogIdentityClient;
    this.logger = options.logger;
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
        passReqToCallback: false as true,
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
    const context = {
      logger: this.logger,
      catalogIdentityClient: this.catalogIdentityClient,
      tokenIssuer: this.tokenIssuer,
    };
    const { profile } = await this.authHandler(result, context);
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
        context,
      );
    }

    return response;
  }
}

export const oidcDefaultSignInResolver: SignInResolver<OidcAuthResult> = async (
  info,
  ctx,
) => {
  const { profile } = info;

  if (!profile.email) {
    throw new Error('Profile contained no email');
  }

  const userId = profile.email.split('@')[0];

  const entityRef = stringifyEntityRef({
    kind: 'User',
    namespace: DEFAULT_NAMESPACE,
    name: userId,
  });

  const token = await ctx.tokenIssuer.issueToken({
    claims: {
      sub: entityRef,
      ent: [entityRef],
    },
  });

  return { id: userId, token };
};

/**
 * OIDC provider callback options. An auth handler and a sign in resolver
 * can be passed while creating a OIDC provider.
 *
 * authHandler : called after sign in was successful, a new object must be returned which includes a profile
 * signInResolver: called after sign in was successful, expects to return a new {@link @backstage/plugin-auth-node#BackstageSignInResult}
 *
 * Both options are optional. There is fallback for authHandler where the default handler expect an e-mail explicitly
 * otherwise it throws an error
 *
 * @public
 */
export type OidcProviderOptions = {
  authHandler?: AuthHandler<OidcAuthResult>;

  signIn?: {
    resolver?: SignInResolver<OidcAuthResult>;
  };
};

export const createOidcProvider = (
  options?: OidcProviderOptions,
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
      const metadataUrl = envConfig.getString('metadataUrl');
      const tokenSignedResponseAlg = envConfig.getOptionalString(
        'tokenSignedResponseAlg',
      );
      const scope = envConfig.getOptionalString('scope');
      const prompt = envConfig.getOptionalString('prompt');
      const catalogIdentityClient = new CatalogIdentityClient({
        catalogApi,
        tokenManager,
      });

      const authHandler: AuthHandler<OidcAuthResult> = options?.authHandler
        ? options.authHandler
        : async ({ userinfo }) => ({
            profile: {
              displayName: userinfo.name,
              email: userinfo.email,
              picture: userinfo.picture,
            },
          });
      const signInResolverFn =
        options?.signIn?.resolver ?? oidcDefaultSignInResolver;
      const signInResolver: SignInResolver<OidcAuthResult> = info =>
        signInResolverFn(info, {
          catalogIdentityClient,
          tokenIssuer,
          logger,
        });

      const provider = new OidcAuthProvider({
        clientId,
        clientSecret,
        callbackUrl,
        tokenSignedResponseAlg,
        metadataUrl,
        scope,
        prompt,
        signInResolver,
        authHandler,
        logger,
        tokenIssuer,
        catalogIdentityClient,
      });

      return OAuthAdapter.fromConfig(globalConfig, provider, {
        disableRefresh: false,
        providerId,
        tokenIssuer,
        callbackUrl,
      });
    });
};
