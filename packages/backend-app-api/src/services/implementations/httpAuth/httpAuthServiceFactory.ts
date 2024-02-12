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
  DiscoveryService,
  HttpAuthService,
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { AuthenticationError, NotAllowedError } from '@backstage/errors';
import { parse as parseCookie } from 'cookie';
import { Request, Response } from 'express';
import { decodeJwt } from 'jose';
import {
  createCredentialsWithNonePrincipal,
  toInternalBackstageCredentials,
} from '../auth/authServiceFactory';

const BACKSTAGE_AUTH_COOKIE = 'backstage-auth';

function getTokenFromRequest(req: Request) {
  // TODO: support multiple auth headers (iterate rawHeaders)
  const authHeader = req.headers.authorization;
  if (typeof authHeader === 'string') {
    const matches = authHeader.match(/^Bearer[ ]+(\S+)$/i);
    const token = matches?.[1];
    if (token) {
      return { token, isCookie: false };
    }
  }

  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const cookies = parseCookie(cookieHeader);
    const token = cookies[BACKSTAGE_AUTH_COOKIE];
    if (token) {
      return { token, isCookie: true };
    }
  }

  return { token: undefined, isCookie: false };
}

const credentialsSymbol = Symbol('backstage-credentials');

type RequestWithCredentials = Request & {
  [credentialsSymbol]?: Promise<BackstageCredentials>;
};

class DefaultHttpAuthService implements HttpAuthService {
  constructor(
    private readonly auth: AuthService,
    private readonly discovery: DiscoveryService,
    private readonly pluginId: string,
  ) {}

  async #extractCredentialsFromRequest(req: Request) {
    const { token, isCookie } = getTokenFromRequest(req);
    if (!token) {
      return createCredentialsWithNonePrincipal();
    }

    const credentials = toInternalBackstageCredentials(
      await this.auth.authenticate(token),
    );
    if (isCookie) {
      if (credentials.principal.type !== 'user') {
        throw new AuthenticationError(
          'Refusing to authenticate non-user principal with cookie auth',
        );
      }
      credentials.authMethod = 'cookie';
    }

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

  async issueUserCookie(res: Response): Promise<void> {
    const credentials = await this.credentials(res.req, { allow: ['user'] });

    // https://backstage.example.com/api/catalog
    const externalBaseUrlStr = await this.discovery.getExternalBaseUrl(
      this.pluginId,
    );
    const externalBaseUrl = new URL(externalBaseUrlStr);

    const { token } = toInternalBackstageCredentials(credentials);
    if (!token) {
      throw new Error('User credentials is unexpectedly missing token');
    }

    // TODO: Proper refresh and expiration handling
    const expires = decodeJwt(token).exp!;

    // TODO: refresh this thing
    res.cookie(BACKSTAGE_AUTH_COOKIE, token, {
      domain: externalBaseUrl.hostname,
      httpOnly: true,
      expires: new Date(expires * 1000),
      path: externalBaseUrl.pathname,
      priority: 'high',
      sameSite: 'lax', // TBD
    });

    throw new Error('Method not implemented.');
  }
}

/** @public */
export const httpAuthServiceFactory = createServiceFactory({
  service: coreServices.httpAuth,
  deps: {
    auth: coreServices.auth,
    discovery: coreServices.discovery,
    plugin: coreServices.pluginMetadata,
  },
  async factory({ auth, discovery, plugin }) {
    return new DefaultHttpAuthService(auth, discovery, plugin.getId());
  },
});
