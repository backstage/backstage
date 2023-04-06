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
import { AuthenticationError } from '@backstage/errors';
import { getBearerTokenFromAuthorizationHeader } from '@backstage/plugin-auth-node';
import {
  AuthHandler,
  SignInResolver,
  AuthProviderRouteHandlers,
  AuthResponse,
  AuthResolverContext,
  AuthHandlerResult,
} from '../types';
import { decodeJwt } from 'jose';
import { prepareBackstageIdentityResponse } from '../prepareBackstageIdentityResponse';
import { createAuthProviderIntegration } from '../createAuthProviderIntegration';
import { IncomingHttpHeaders } from 'http';

// NOTE: This may come in handy if you're doing work on this provider:
//
//   plugins/auth-backend/examples/docker-compose.oauth2-proxy.yaml
//

export const OAUTH2_PROXY_JWT_HEADER = 'X-OAUTH2-PROXY-ID-TOKEN';

/**
 * JWT header extraction result, containing the raw value and the parsed JWT
 * payload.
 *
 * @public
 */
export type OAuth2ProxyResult<JWTPayload = {}> = {
  /**
   * The parsed payload of the `accessToken`. The token is only parsed, not verified.
   *
   * @deprecated Access through the `headers` instead. This will be removed in a future release.
   */
  fullProfile: JWTPayload;

  /**
   * The token received via the X-OAUTH2-PROXY-ID-TOKEN header. Will be an empty string
   * if the header is not set. Note the this is typically an OpenID Connect token.
   *
   * @deprecated Access through the `headers` instead. This will be removed in a future release.
   */
  accessToken: string;

  /**
   * The headers of the incoming request from the OAuth2 proxy. This will include
   * both the headers set by the client as well as the ones added by the OAuth2 proxy.
   * You should only trust the headers that are injected by the OAuth2 proxy.
   *
   * Useful headers to use to complete the sign-in are for example `x-forwarded-user`
   * and `x-forwarded-email`. See the OAuth2 proxy documentation for more information
   * about the available headers and how to enable them. In particular it is possible
   * to forward access and identity tokens, which can be user for additional verification
   * and lookups.
   */
  headers: IncomingHttpHeaders;

  /**
   * Provides convenient access to the request headers.
   *
   * This call is simply forwarded to `req.get(name)`.
   */
  getHeader(name: string): string | undefined;
};

interface Options<JWTPayload> {
  resolverContext: AuthResolverContext;
  signInResolver: SignInResolver<OAuth2ProxyResult<JWTPayload>>;
  authHandler: AuthHandler<OAuth2ProxyResult<JWTPayload>>;
}

export class Oauth2ProxyAuthProvider<JWTPayload>
  implements AuthProviderRouteHandlers
{
  private readonly resolverContext: AuthResolverContext;
  private readonly signInResolver: SignInResolver<
    OAuth2ProxyResult<JWTPayload>
  >;
  private readonly authHandler: AuthHandler<OAuth2ProxyResult<JWTPayload>>;

  constructor(options: Options<JWTPayload>) {
    this.resolverContext = options.resolverContext;
    this.signInResolver = options.signInResolver;
    this.authHandler = options.authHandler;
  }

  frameHandler(): Promise<void> {
    return Promise.resolve(undefined);
  }

  async refresh(req: express.Request, res: express.Response): Promise<void> {
    try {
      // TODO(Rugvip): This parsing was deprecated in 1.2 and should be removed in a future release.
      const authHeader = req.header(OAUTH2_PROXY_JWT_HEADER);
      const jwt = getBearerTokenFromAuthorizationHeader(authHeader);
      const decodedJWT = jwt && (decodeJwt(jwt) as unknown as JWTPayload);

      const result = {
        fullProfile: decodedJWT || ({} as JWTPayload),
        accessToken: jwt || '',
        headers: req.headers,
        getHeader(name: string) {
          if (name.toLocaleLowerCase('en-US') === 'set-cookie') {
            throw new Error('Access Set-Cookie via the headers object instead');
          }
          return req.get(name);
        },
      };

      const response = await this.handleResult(result);
      res.json(response);
    } catch (e) {
      throw new AuthenticationError('Refresh failed', e);
    }
  }

  start(): Promise<void> {
    return Promise.resolve(undefined);
  }

  private async handleResult(
    result: OAuth2ProxyResult<JWTPayload>,
  ): Promise<AuthResponse<{ accessToken: string }>> {
    const { profile } = await this.authHandler(result, this.resolverContext);

    const backstageSignInResult = await this.signInResolver(
      {
        result,
        profile,
      },
      this.resolverContext,
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
}

async function defaultAuthHandler(
  result: OAuth2ProxyResult<unknown>,
): Promise<AuthHandlerResult> {
  return {
    profile: {
      email: result.getHeader('x-forwarded-email'),
      displayName:
        result.getHeader('x-forwarded-preferred-username') ||
        result.getHeader('x-forwarded-user'),
    },
  };
}

/**
 * Auth provider integration for oauth2-proxy auth
 *
 * @public
 */
export const oauth2Proxy = createAuthProviderIntegration({
  create<JWTPayload>(options: {
    /**
     * Configure an auth handler to generate a profile for the user.
     *
     * The default implementation uses the value of the `X-Forwarded-Preferred-Username`
     * header as the display name, falling back to `X-Forwarded-User`, and the value of
     * the `X-Forwarded-Email` header as the email address.
     */
    authHandler?: AuthHandler<OAuth2ProxyResult<JWTPayload>>;

    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn: {
      /**
       * Maps an auth result to a Backstage identity for the user.
       */
      resolver: SignInResolver<OAuth2ProxyResult<JWTPayload>>;
    };
  }) {
    return ({ resolverContext }) => {
      const signInResolver = options.signIn.resolver;
      const authHandler = options.authHandler;
      return new Oauth2ProxyAuthProvider<JWTPayload>({
        resolverContext,
        signInResolver,
        authHandler: authHandler ?? defaultAuthHandler,
      });
    };
  },
});
