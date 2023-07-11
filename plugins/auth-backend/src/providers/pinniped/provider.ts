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
  Client,
  Issuer,
  Strategy as OidcStrategy,
  TokenSet,
  UserinfoResponse,
} from 'openid-client';
import {
  OAuthHandlers,
  OAuthProviderOptions,
  OAuthResponse,
  OAuthStartRequest,
  encodeState,
} from '../../lib/oauth';
import {
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
  PassportDoneCallback,
} from '../../lib/passport';
import { AuthResolverContext, OAuthStartResponse } from '../types';
import express from 'express';
import { OidcAuthResult } from '../oidc';
import { OAuthAdapter, OAuthEnvironmentHandler } from '../../lib/oauth';
import { createAuthProviderIntegration } from '../createAuthProviderIntegration';
import { AuthHandler, SignInResolver } from '../types';

type OidcImpl = {
  strategy: OidcStrategy<UserinfoResponse, Client>;
  client: Client;
};

type PrivateInfo = {
  refreshToken?: string;
};

export type PinnipedOptions = OAuthProviderOptions & {
  federationDomain: string;
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  scope?: string;
  prompt?: string;
  tokenSignedResponseAlg?: string;
  signInResolver?: SignInResolver<OidcAuthResult>;
  authHandler: AuthHandler<OidcAuthResult>;
  resolverContext: AuthResolverContext;
};

export class PinnipedAuthProvider implements OAuthHandlers {
  private readonly implementation: Promise<OidcImpl>;
  private readonly federationDomain: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly callbackUrl: string;
  private readonly scope?: string;
  private readonly prompt?: string;
  private readonly signInResolver?: SignInResolver<OidcAuthResult>;
  private readonly authHandler: AuthHandler<OidcAuthResult>;
  private readonly resolverContext: AuthResolverContext;

  constructor(options: PinnipedOptions) {
    this.implementation = this.setupStrategy(options);
    this.federationDomain = options.federationDomain;
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.callbackUrl = options.callbackUrl;
    this.scope = options.scope;
    this.prompt = options.prompt;
    this.signInResolver = options.signInResolver;
    this.authHandler = options.authHandler;
    this.resolverContext = options.resolverContext;
  }

  async start(req: OAuthStartRequest): Promise<OAuthStartResponse> {
    const { strategy } = await this.implementation;
    const options: Record<string, string> = {
      scope: req.scope || this.scope || 'openid profile email',
      state: encodeState(req.state),
    };
    return new Promise((resolve, reject) => {
      strategy.redirect = (url: string, status?: number) => {
        resolve({ url, status: status ?? undefined });
      };
      strategy.error = (error: Error) => {
        reject(error);
      };
      strategy.authenticate(req, { ...options });
    });
  }

  private async setupStrategy(options: PinnipedOptions): Promise<OidcImpl> {
    const issuer = await Issuer.discover(
      `${options.federationDomain}/.well-known/openid-configuration`,
    );
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
        userinfo:
          | UserinfoResponse
          | PassportDoneCallback<OidcAuthResult, PrivateInfo>,
        done?: PassportDoneCallback<OidcAuthResult, PrivateInfo>,
      ) => {
        if (typeof userinfo === 'function') {
          userinfo(
            undefined,
            { tokenset, userinfo: { sub: '' } },
            {
              refreshToken: tokenset.refresh_token,
            },
          );
        }
        done!(
          undefined,
          { tokenset, userinfo: userinfo as UserinfoResponse },
          {
            refreshToken: tokenset.refresh_token,
          },
        );
      },
    );
    return { strategy, client };
  }
}

/**
 * Auth provider integration for Pinniped auth
 *
 * @public
 */
export const pinniped = createAuthProviderIntegration({
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
        const federationDomain = envConfig.getString('federationDomain');
        const customCallbackUrl = envConfig.getOptionalString('callbackUrl');
        const callbackUrl =
          customCallbackUrl ||
          `${globalConfig.baseUrl}/${providerId}/handler/frame`;
        const tokenSignedResponseAlg = 'ES256';
        const prompt = 'auto';
        const authHandler: AuthHandler<OidcAuthResult> = async () => ({
          profile: {},
        });

        const provider = new PinnipedAuthProvider({
          federationDomain,
          clientId,
          clientSecret,
          callbackUrl,
          tokenSignedResponseAlg,
          prompt,
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
