/*
 * Copyright 2021 The Backstage Authors
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
import { Logger } from 'winston';
import { AuthenticationError } from '@backstage/errors';
import {
  AuthResponse,
  IdentityClient,
  TokenIssuer,
} from '@backstage/plugin-auth-node';
import {
  AuthHandler,
  SignInResolver,
  AuthProviderFactory,
  AuthProviderRouteHandlers,
} from '../types';
import { CatalogIdentityClient } from '../../lib/catalog';
import { JWT } from 'jose';
import { prepareBackstageIdentityResponse } from '../prepareBackstageIdentityResponse';

export const OAUTH2_PROXY_JWT_HEADER = 'X-OAUTH2-PROXY-ID-TOKEN';

/**
 * JWT header extraction result, containing the raw value and the parsed JWT
 * payload.
 *
 * @public
 */
export type OAuth2ProxyResult<JWTPayload> = {
  /**
   * Parsed and decoded JWT payload.
   */
  fullProfile: JWTPayload;

  /**
   * Raw JWT token
   */
  accessToken: string;
};

/**
 * Options for the oauth2-proxy provider factory
 *
 * @public
 */
export type Oauth2ProxyProviderOptions<JWTPayload> = {
  /**
   * Configure an auth handler to generate a profile for the user.
   */
  authHandler: AuthHandler<OAuth2ProxyResult<JWTPayload>>;

  /**
   * Configure sign-in for this provider, without it the provider can not be used to sign users in.
   */
  signIn: {
    /**
     * Maps an auth result to a Backstage identity for the user.
     */
    resolver: SignInResolver<OAuth2ProxyResult<JWTPayload>>;
  };
};

interface Options<JWTPayload> {
  logger: Logger;
  signInResolver: SignInResolver<OAuth2ProxyResult<JWTPayload>>;
  authHandler: AuthHandler<OAuth2ProxyResult<JWTPayload>>;
  tokenIssuer: TokenIssuer;
  catalogIdentityClient: CatalogIdentityClient;
}

export class Oauth2ProxyAuthProvider<JWTPayload>
  implements AuthProviderRouteHandlers
{
  private readonly logger: Logger;
  private readonly catalogIdentityClient: CatalogIdentityClient;
  private readonly signInResolver: SignInResolver<
    OAuth2ProxyResult<JWTPayload>
  >;
  private readonly authHandler: AuthHandler<OAuth2ProxyResult<JWTPayload>>;
  private readonly tokenIssuer: TokenIssuer;

  constructor(options: Options<JWTPayload>) {
    this.catalogIdentityClient = options.catalogIdentityClient;
    this.logger = options.logger;
    this.tokenIssuer = options.tokenIssuer;
    this.signInResolver = options.signInResolver;
    this.authHandler = options.authHandler;
  }

  frameHandler(): Promise<void> {
    return Promise.resolve(undefined);
  }

  async refresh(req: express.Request, res: express.Response): Promise<void> {
    try {
      const result = this.getResult(req);

      const response = await this.handleResult(result);

      res.json(response);
    } catch (e) {
      this.logger.error(
        `Exception occurred during ${OAUTH2_PROXY_JWT_HEADER} refresh`,
        e,
      );
      res.status(401);
      res.end();
    }
  }

  start(): Promise<void> {
    return Promise.resolve(undefined);
  }

  private async handleResult(
    result: OAuth2ProxyResult<JWTPayload>,
  ): Promise<AuthResponse<{ accessToken: string }>> {
    const ctx = {
      logger: this.logger,
      tokenIssuer: this.tokenIssuer,
      catalogIdentityClient: this.catalogIdentityClient,
    };

    const { profile } = await this.authHandler(result, ctx);

    const backstageSignInResult = await this.signInResolver(
      {
        result,
        profile,
      },
      ctx,
    );

    return {
      providerInfo: {
        accessToken: result.accessToken,
      },
      backstageIdentity: prepareBackstageIdentityResponse(
        backstageSignInResult,
      ),
      profile,
    };
  }

  private getResult(req: express.Request): OAuth2ProxyResult<JWTPayload> {
    const authHeader = req.header(OAUTH2_PROXY_JWT_HEADER);
    const jwt = IdentityClient.getBearerToken(authHeader);

    if (!jwt) {
      throw new AuthenticationError(
        `Missing or in incorrect format - Oauth2Proxy OIDC header: ${OAUTH2_PROXY_JWT_HEADER}`,
      );
    }

    const decodedJWT = JWT.decode(jwt) as unknown as JWTPayload;

    return {
      fullProfile: decodedJWT,
      accessToken: jwt,
    };
  }
}

/**
 * Factory function for oauth2-proxy auth provider
 *
 * @public
 */
export const createOauth2ProxyProvider =
  <JWTPayload>(
    options: Oauth2ProxyProviderOptions<JWTPayload>,
  ): AuthProviderFactory =>
  ({ catalogApi, logger, tokenIssuer, tokenManager }) => {
    const signInResolver = options.signIn.resolver;
    const authHandler = options.authHandler;
    const catalogIdentityClient = new CatalogIdentityClient({
      catalogApi,
      tokenManager,
    });
    return new Oauth2ProxyAuthProvider<JWTPayload>({
      logger,
      signInResolver,
      authHandler,
      tokenIssuer,
      catalogIdentityClient,
    });
  };
