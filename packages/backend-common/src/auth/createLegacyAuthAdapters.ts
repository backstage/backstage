/*
 * Copyright 2024 The Backstage Authors
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
  AuthService,
  BackstageCredentials,
  BackstagePrincipalTypes,
  BackstageServicePrincipal,
  BackstageUserPrincipal,
  HttpAuthService,
  IdentityService,
  TokenManagerService,
} from '@backstage/backend-plugin-api';
import { ServerTokenManager, TokenManager } from '../tokens';
import { AuthenticationError, NotAllowedError } from '@backstage/errors';
import type { Request, Response } from 'express';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  createCredentialsWithServicePrincipal,
  createCredentialsWithUserPrincipal,
  createCredentialsWithNonePrincipal,
  toInternalBackstageCredentials,
} from '../../../backend-app-api/src/services/implementations/auth/authServiceFactory';
// TODO is this circular thingy a problem? Test in e2e
import {
  type IdentityApiGetIdentityRequest,
  DefaultIdentityClient,
} from '@backstage/plugin-auth-node';
import { decodeJwt } from 'jose';
import { PluginEndpointDiscovery } from '../discovery';

class AuthCompat implements AuthService {
  constructor(
    private readonly identity: IdentityService,
    private readonly tokenManager: TokenManagerService,
  ) {}

  isPrincipal<TType extends keyof BackstagePrincipalTypes>(
    credentials: BackstageCredentials,
    type: TType,
  ): credentials is BackstageCredentials<BackstagePrincipalTypes[TType]> {
    const principal = credentials.principal as
      | BackstageUserPrincipal
      | BackstageServicePrincipal;

    if (principal.type !== type) {
      return false;
    }

    return true;
  }

  async getOwnCredentials(): Promise<
    BackstageCredentials<BackstageServicePrincipal>
  > {
    return createCredentialsWithServicePrincipal('external:backstage-plugin');
  }

  async authenticate(token: string): Promise<BackstageCredentials> {
    const { sub, aud } = decodeJwt(token);

    // Legacy service-to-service token
    if (sub === 'backstage-server' && !aud) {
      await this.tokenManager.authenticate(token);
      return createCredentialsWithServicePrincipal('external:backstage-plugin');
    }

    // User Backstage token
    const identity = await this.identity.getIdentity({
      request: {
        headers: { authorization: `Bearer ${token}` },
      },
    } as IdentityApiGetIdentityRequest);

    if (!identity) {
      throw new AuthenticationError('Invalid user token');
    }

    return createCredentialsWithUserPrincipal(
      identity.identity.userEntityRef,
      token,
    );
  }

  async issueServiceToken(options: {
    forward: BackstageCredentials;
  }): Promise<{ token: string }> {
    const internalForward = toInternalBackstageCredentials(options.forward);
    const { type } = internalForward.principal;

    switch (type) {
      // TODO: Check whether the principal is ourselves
      case 'service':
        return this.tokenManager.getToken();
      case 'user':
        if (!internalForward.token) {
          throw new Error('User credentials is unexpectedly missing token');
        }
        return { token: internalForward.token };
      // NOTE: this is not the behavior of this service in the new backend system, it only applies
      //       here since we'll need to accept and forward requests without authentication.
      case 'none':
        return { token: '' };
      default:
        throw new AuthenticationError(
          `Refused to issue service token for credential type '${type}'`,
        );
    }
  }
}

function getTokenFromRequest(req: Request) {
  // TODO: support multiple auth headers (iterate rawHeaders)
  const authHeader = req.headers.authorization;
  if (typeof authHeader === 'string') {
    const matches = authHeader.match(/^Bearer[ ]+(\S+)$/i);
    const token = matches?.[1];
    if (token) {
      return token;
    }
  }

  return undefined;
}

const credentialsSymbol = Symbol('backstage-credentials');

type RequestWithCredentials = Request & {
  [credentialsSymbol]?: Promise<BackstageCredentials>;
};

class HttpAuthCompat implements HttpAuthService {
  constructor(private readonly auth: AuthService) {}

  async #extractCredentialsFromRequest(req: Request) {
    const token = getTokenFromRequest(req);
    if (!token) {
      return createCredentialsWithNonePrincipal();
    }

    const credentials = toInternalBackstageCredentials(
      await this.auth.authenticate(token),
    );

    return credentials;
  }

  async #getCredentials(req: /*  */ RequestWithCredentials) {
    return (req[credentialsSymbol] ??=
      this.#extractCredentialsFromRequest(req));
  }

  async credentials<TAllowed extends keyof BackstagePrincipalTypes = 'unknown'>(
    req: Request,
    options?: {
      allow?: Array<TAllowed>;
      allowedAuthMethods?: Array<'token' | 'cookie'>;
    },
  ): Promise<BackstageCredentials<BackstagePrincipalTypes[TAllowed]>> {
    const credentials = toInternalBackstageCredentials(
      await this.#getCredentials(req),
    );

    const allowedPrincipalTypes = options?.allow;
    const allowedAuthMethods: Array<'token' | 'cookie' | 'none'> =
      options?.allowedAuthMethods ?? ['token'];

    if (
      credentials.authMethod !== 'none' &&
      !allowedAuthMethods.includes(credentials.authMethod)
    ) {
      throw new NotAllowedError(
        `This endpoint does not allow the '${credentials.authMethod}' auth method`,
      );
    }

    if (
      allowedPrincipalTypes &&
      !allowedPrincipalTypes.includes(credentials.principal.type as TAllowed)
    ) {
      throw new NotAllowedError(
        `This endpoint does not allow '${credentials.principal.type}' credentials`,
      );
    }

    return credentials as any;
  }

  async requestHeaders(options: {
    forward: BackstageCredentials;
  }): Promise<Record<string, string>> {
    return {
      Authorization: `Bearer ${await this.auth.issueServiceToken(options)}`,
    };
  }

  async issueUserCookie(_res: Response): Promise<void> {}
}

/** @public */
export function createLegacyAuthAdapters(options: {
  auth?: AuthService;
  httpAuth?: HttpAuthService;
  identity?: IdentityService;
  tokenManager?: TokenManager;
  discovery: PluginEndpointDiscovery;
}): {
  auth: AuthService;
  httpAuth: HttpAuthService;
} {
  const { auth, httpAuth, discovery } = options;

  if (auth || httpAuth) {
    // TODO: Is this sensible? Could be that a lot of plugins only want one of them and in
    // that case overloads might be better, so that it's possible to only provide one of them.
    if (!(auth && httpAuth)) {
      throw new Error('Both auth and httpAuth must be provided');
    }
    return {
      auth,
      httpAuth,
    };
  }

  const identity =
    options.identity ?? DefaultIdentityClient.create({ discovery });
  const tokenManager = options.tokenManager ?? ServerTokenManager.noop();

  const authImpl = new AuthCompat(identity, tokenManager);
  const httpAuthImpl = new HttpAuthCompat(authImpl);

  return {
    auth: authImpl,
    httpAuth: httpAuthImpl,
  };
}
