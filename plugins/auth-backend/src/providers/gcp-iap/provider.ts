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
import { createAuthProviderIntegration } from '../createAuthProviderIntegration';
import { prepareBackstageIdentityResponse } from '../prepareBackstageIdentityResponse';
import {
  AuthHandler,
  AuthProviderRouteHandlers,
  AuthResolverContext,
  SignInResolver,
} from '../types';
import {
  createTokenValidator,
  defaultAuthHandler,
  parseRequestToken,
} from './helpers';
import { GcpIapResponse, GcpIapResult, IAP_JWT_HEADER } from './types';

export class GcpIapProvider implements AuthProviderRouteHandlers {
  private readonly authHandler: AuthHandler<GcpIapResult>;
  private readonly signInResolver: SignInResolver<GcpIapResult>;
  private readonly tokenValidator: (token: string) => Promise<TokenPayload>;
  private readonly resolverContext: AuthResolverContext;

  constructor(options: {
    authHandler: AuthHandler<GcpIapResult>;
    signInResolver: SignInResolver<GcpIapResult>;
    tokenValidator: (token: string) => Promise<TokenPayload>;
    resolverContext: AuthResolverContext;
  }) {
    this.authHandler = options.authHandler;
    this.signInResolver = options.signInResolver;
    this.tokenValidator = options.tokenValidator;
    this.resolverContext = options.resolverContext;
  }

  async start() {}

  async frameHandler() {}

  async refresh(req: express.Request, res: express.Response): Promise<void> {
    const result = await parseRequestToken(
      req.header(IAP_JWT_HEADER),
      this.tokenValidator,
    );

    const { profile } = await this.authHandler(result, this.resolverContext);

    const backstageIdentity = await this.signInResolver(
      { profile, result },
      this.resolverContext,
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
 * Auth provider integration for Google Identity-Aware Proxy auth
 *
 * @public
 */
export const gcpIap = createAuthProviderIntegration({
  create(options: {
    /**
     * The profile transformation function used to verify and convert the auth
     * response into the profile that will be presented to the user. The default
     * implementation just provides the authenticated email that the IAP
     * presented.
     */
    authHandler?: AuthHandler<GcpIapResult>;

    /**
     * Configures sign-in for this provider.
     */
    signIn: {
      /**
       * Maps an auth result to a Backstage identity for the user.
       */
      resolver: SignInResolver<GcpIapResult>;
    };
  }) {
    return ({ config, resolverContext }) => {
      const audience = config.getString('audience');

      const authHandler = options.authHandler ?? defaultAuthHandler;
      const signInResolver = options.signIn.resolver;
      const tokenValidator = createTokenValidator(audience);

      return new GcpIapProvider({
        authHandler,
        signInResolver,
        tokenValidator,
        resolverContext,
      });
    };
  },
});
