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
  BackstageNonePrincipal,
  BackstagePrincipalTypes,
  BackstageServicePrincipal,
  BackstageUserInfo,
  BackstageUserPrincipal,
  HttpAuthService,
  IdentityService,
  TokenManagerService,
  UserInfoService,
} from '@backstage/backend-plugin-api';
import { TokenManager } from '../tokens';
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
import { JsonObject } from '@backstage/types';

class AuthCompat implements AuthService {
  constructor(
    private readonly identity: IdentityService,
    private readonly tokenManager?: TokenManagerService,
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

  async getNoneCredentials(): Promise<
    BackstageCredentials<BackstageNonePrincipal>
  > {
    return createCredentialsWithNonePrincipal();
  }

  async getOwnServiceCredentials(): Promise<
    BackstageCredentials<BackstageServicePrincipal>
  > {
    return createCredentialsWithServicePrincipal('external:backstage-plugin');
  }

  async authenticate(token: string): Promise<BackstageCredentials> {
    // Defensively check whether it seems token-like first, just to support
    // custom TokenManager implementations that don't emit JWTs specifically.
    const payload =
      token.split('.').length === 3 ? decodeJwt(token) : undefined;

    if (payload?.aud === 'backstage') {
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
        this.#getJwtExpiration(token),
      );
    }

    await this.tokenManager?.authenticate(token);

    return createCredentialsWithServicePrincipal(
      'external:backstage-plugin',
      token,
    );
  }

  async getPluginRequestToken(options: {
    onBehalfOf: BackstageCredentials;
    targetPluginId: string;
  }): Promise<{ token: string }> {
    const internalForward = toInternalBackstageCredentials(options.onBehalfOf);
    const { type } = internalForward.principal;

    switch (type) {
      // TODO: Check whether the principal is ourselves
      case 'service': {
        if (this.tokenManager) {
          return this.tokenManager.getToken();
        }
        return { token: internalForward.token ?? '' };
      }
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

  async getLimitedUserToken(
    credentials: BackstageCredentials<BackstageUserPrincipal>,
  ): Promise<{ token: string; expiresAt: Date }> {
    const internalCredentials = toInternalBackstageCredentials(credentials);

    const { token } = internalCredentials;

    if (!token) {
      throw new AuthenticationError(
        'User credentials is unexpectedly missing token',
      );
    }

    return { token, expiresAt: this.#getJwtExpiration(token) };
  }

  #getJwtExpiration(token: string) {
    const { exp } = decodeJwt(token);
    if (!exp) {
      throw new AuthenticationError('User token is missing expiration');
    }
    return new Date(exp * 1000);
  }

  listPublicServiceKeys(): Promise<{ keys: JsonObject[] }> {
    throw new Error('Not implemented');
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
  #auth: AuthService;

  constructor(auth: AuthService) {
    this.#auth = auth;
  }

  async #extractCredentialsFromRequest(req: Request) {
    const token = getTokenFromRequest(req);
    if (!token) {
      return this.#auth.getNoneCredentials();
    }

    return this.#auth.authenticate(token);
  }

  async #getCredentials(req: RequestWithCredentials) {
    return (req[credentialsSymbol] ??=
      this.#extractCredentialsFromRequest(req));
  }

  async credentials<TAllowed extends keyof BackstagePrincipalTypes = 'unknown'>(
    req: Request,
    options?: {
      allow?: Array<TAllowed>;
      allowLimitedAccess?: boolean;
    },
  ): Promise<BackstageCredentials<BackstagePrincipalTypes[TAllowed]>> {
    const credentials = await this.#getCredentials(req);

    const allowed = options?.allow;
    if (!allowed) {
      return credentials as any;
    }

    if (this.#auth.isPrincipal(credentials, 'none')) {
      if (allowed.includes('none' as TAllowed)) {
        return credentials as any;
      }

      throw new AuthenticationError('Missing credentials');
    } else if (this.#auth.isPrincipal(credentials, 'user')) {
      if (allowed.includes('user' as TAllowed)) {
        return credentials as any;
      }

      throw new NotAllowedError(
        `This endpoint does not allow 'user' credentials`,
      );
    } else if (this.#auth.isPrincipal(credentials, 'service')) {
      if (allowed.includes('service' as TAllowed)) {
        return credentials as any;
      }

      throw new NotAllowedError(
        `This endpoint does not allow 'service' credentials`,
      );
    }

    throw new NotAllowedError(
      'Unknown principal type, this should never happen',
    );
  }

  async issueUserCookie(_res: Response): Promise<{ expiresAt: Date }> {
    return { expiresAt: new Date(Date.now() + 3600_000) };
  }

  removeUserCookie(res: Response): void {
    res.clearCookie('backstage-auth');
  }
}

export class UserInfoCompat implements UserInfoService {
  async getUserInfo(
    credentials: BackstageCredentials,
  ): Promise<BackstageUserInfo> {
    const internalCredentials = toInternalBackstageCredentials(credentials);
    if (internalCredentials.principal.type !== 'user') {
      throw new Error('Only user credentials are supported');
    }
    if (!internalCredentials.token) {
      throw new Error('User credentials is unexpectedly missing token');
    }
    const { sub: userEntityRef, ent: ownershipEntityRefs = [] } = decodeJwt(
      internalCredentials.token,
    );

    if (typeof userEntityRef !== 'string') {
      throw new Error('User entity ref must be a string');
    }
    if (
      !Array.isArray(ownershipEntityRefs) ||
      ownershipEntityRefs.some(ref => typeof ref !== 'string')
    ) {
      throw new Error('Ownership entity refs must be an array of strings');
    }

    return { userEntityRef, ownershipEntityRefs };
  }
}

/**
 * An adapter that ensures presence of the auth and/or httpAuth services.
 * @public
 */
export function createLegacyAuthAdapters<
  TOptions extends {
    auth?: AuthService;
    httpAuth?: HttpAuthService;
    userInfo?: UserInfoService;
    identity?: IdentityService;
    tokenManager?: TokenManager;
    discovery: PluginEndpointDiscovery;
  },
  TAdapters = (TOptions extends { auth?: AuthService }
    ? { auth: AuthService }
    : {}) &
    (TOptions extends { httpAuth?: HttpAuthService }
      ? { httpAuth: HttpAuthService }
      : {}) &
    (TOptions extends { userInfo?: UserInfoService }
      ? { userInfo: UserInfoService }
      : {}),
>(options: TOptions): TAdapters {
  const {
    auth,
    httpAuth,
    userInfo = new UserInfoCompat(),
    discovery,
  } = options;

  if (auth && httpAuth) {
    return {
      auth,
      httpAuth,
      userInfo,
    } as TAdapters;
  }

  if (auth) {
    return {
      auth,
      userInfo,
    } as TAdapters;
  }

  if (httpAuth) {
    return {
      httpAuth,
      userInfo,
    } as TAdapters;
  }

  const identity =
    options.identity ?? DefaultIdentityClient.create({ discovery });

  const authImpl = new AuthCompat(identity, options.tokenManager);

  const httpAuthImpl = new HttpAuthCompat(authImpl);

  return {
    auth: authImpl,
    httpAuth: httpAuthImpl,
    userInfo,
  } as TAdapters;
}
