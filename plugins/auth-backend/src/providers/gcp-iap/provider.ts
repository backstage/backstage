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
import { TokenPayload } from 'google-auth-library';
import { Logger } from 'winston';
import { TokenIssuer } from '@backstage/plugin-auth-node';
import { CatalogIdentityClient } from '../../lib/catalog';
import { prepareBackstageIdentityResponse } from '../prepareBackstageIdentityResponse';
import {
  AuthHandler,
  AuthProviderFactory,
  AuthProviderRouteHandlers,
  SignInResolver,
} from '../types';
import {
  createTokenValidator,
  defaultAuthHandler,
  parseRequestToken,
} from './helpers';
import {
  GcpIapProviderOptions,
  GcpIapResponse,
  GcpIapResult,
  IAP_JWT_HEADER,
} from './types';

export class GcpIapProvider implements AuthProviderRouteHandlers {
  private readonly authHandler: AuthHandler<GcpIapResult>;
  private readonly signInResolver: SignInResolver<GcpIapResult>;
  private readonly tokenValidator: (token: string) => Promise<TokenPayload>;
  private readonly tokenIssuer: TokenIssuer;
  private readonly catalogIdentityClient: CatalogIdentityClient;
  private readonly logger: Logger;

  constructor(options: {
    authHandler: AuthHandler<GcpIapResult>;
    signInResolver: SignInResolver<GcpIapResult>;
    tokenValidator: (token: string) => Promise<TokenPayload>;
    tokenIssuer: TokenIssuer;
    catalogIdentityClient: CatalogIdentityClient;
    logger: Logger;
  }) {
    this.authHandler = options.authHandler;
    this.signInResolver = options.signInResolver;
    this.tokenValidator = options.tokenValidator;
    this.tokenIssuer = options.tokenIssuer;
    this.catalogIdentityClient = options.catalogIdentityClient;
    this.logger = options.logger;
  }

  async start() {}

  async frameHandler() {}

  async refresh(req: express.Request, res: express.Response): Promise<void> {
    const result = await parseRequestToken(
      req.header(IAP_JWT_HEADER),
      this.tokenValidator,
    );
    const context = {
      logger: this.logger,
      catalogIdentityClient: this.catalogIdentityClient,
      tokenIssuer: this.tokenIssuer,
    };

    const { profile } = await this.authHandler(result, context);

    const backstageIdentity = await this.signInResolver(
      { profile, result },
      context,
    );

    const response: GcpIapResponse = {
      providerInfo: { iapToken: result.iapToken },
      profile,
      backstageIdentity: prepareBackstageIdentityResponse(backstageIdentity),
    };

    res.json(response);
  }
}

/**
 * Creates an auth provider for Google Identity-Aware Proxy.
 *
 * @public
 */
export function createGcpIapProvider(
  options: GcpIapProviderOptions,
): AuthProviderFactory {
  return ({ config, tokenIssuer, catalogApi, logger, tokenManager }) => {
    const audience = config.getString('audience');

    const authHandler = options.authHandler ?? defaultAuthHandler;
    const signInResolver = options.signIn.resolver;
    const tokenValidator = createTokenValidator(audience);

    const catalogIdentityClient = new CatalogIdentityClient({
      catalogApi,
      tokenManager,
    });

    return new GcpIapProvider({
      authHandler,
      signInResolver,
      tokenValidator,
      tokenIssuer,
      catalogIdentityClient,
      logger,
    });
  };
}
