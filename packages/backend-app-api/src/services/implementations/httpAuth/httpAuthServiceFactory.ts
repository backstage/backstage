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
  BackstageCredentialTypes,
  BackstageCredentials,
  BackstageUnauthorizedCredentials,
  DiscoveryService,
  HttpAuthService,
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { NotAllowedError } from '@backstage/errors';
import { parse as parseCookie } from 'cookie';
import { Request, Response } from 'express';
import { decodeJwt } from 'jose';
import { toInternalBackstageCredentials } from '../auth/authServiceFactory';

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
  [credentialsSymbol]?: Promise<{
    credentials: BackstageCredentials | BackstageUnauthorizedCredentials;
    // TODO: This is temporary and should be removed once we have proper cookie handling in place
    isCookie: boolean;
  }>;
};

function createUnauthorizedCredentials(): BackstageUnauthorizedCredentials {
  return {
    $$type: '@backstage/BackstageCredentials',
    type: 'unauthorized',
  };
}

class DefaultHttpAuthService implements HttpAuthService {
  constructor(
    private readonly auth: AuthService,
    private readonly discovery: DiscoveryService,
    private readonly pluginId: string,
  ) {}

  async #getCredentials(req: Request) {
    const { token, isCookie } = getTokenFromRequest(req);
    // TODO: Is this where we match against configured rules?
    if (!token) {
      return { credentials: createUnauthorizedCredentials(), isCookie };
    }
    return { credentials: await this.auth.authenticate(token), isCookie };
  }

  async #getCredentialsCached(req: /*  */ RequestWithCredentials) {
    return (req[credentialsSymbol] ??= this.#getCredentials(req));
  }

  async credentials<TAllowed extends keyof BackstageCredentialTypes>(
    req: RequestWithCredentials,
    options: {
      allow: TAllowed[];
    },
  ): Promise<BackstageCredentialTypes[TAllowed]> {
    const { credentials, isCookie } = await this.#getCredentialsCached(req);

    if (credentials.type === 'user' && isCookie) {
      if (options.allow.includes('user-cookie' as TAllowed)) {
        return credentials as BackstageCredentialTypes[TAllowed];
      }
      throw new NotAllowedError(
        `This endpoint does not allow 'user-cookie' credentials`,
      );
    }

    if (!options.allow.includes(credentials.type as TAllowed)) {
      throw new NotAllowedError(
        `This endpoint does not allow '${credentials.type}' credentials`,
      );
    }

    return credentials as BackstageCredentialTypes[TAllowed];
  }

  async requestHeaders(options?: {
    forward?: BackstageCredentials;
  }): Promise<Record<string, string>> {
    return {
      Authorization: `Bearer ${await this.auth.issueServiceToken(options)}`,
    };
  }

  async issueUserCookie(res: Response): Promise<void> {
    const credentials = await this.credentials(res.req, { allow: ['user'] });

    // https://backstage.spotify.net/api/catalog
    const externalBaseUrlStr = await this.discovery.getExternalBaseUrl(
      this.pluginId,
    );
    const externalBaseUrl = new URL(externalBaseUrlStr);

    const { token } = toInternalBackstageCredentials(credentials);

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
    config: coreServices.rootConfig,
    logger: coreServices.rootLogger,
    discovery: coreServices.discovery,
    auth: coreServices.auth,
    plugin: coreServices.pluginMetadata,
  },
  async factory({ auth, discovery, plugin }) {
    return new DefaultHttpAuthService(auth, discovery, plugin.getId());
  },
});
