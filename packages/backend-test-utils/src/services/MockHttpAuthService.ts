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
  BackstageUserPrincipal,
  HttpAuthService,
} from '@backstage/backend-plugin-api';
import { Request, Response } from 'express';
import { parse as parseCookie } from 'cookie';
import { MockAuthService } from './MockAuthService';
import { AuthenticationError, NotAllowedError } from '@backstage/errors';
import {
  MOCK_NONE_TOKEN,
  MOCK_AUTH_COOKIE,
  mockCredentials,
} from './mockCredentials';

// TODO: support mock cookie auth?
export class MockHttpAuthService implements HttpAuthService {
  #auth: AuthService;
  #defaultCredentials: BackstageCredentials;

  constructor(pluginId: string, defaultCredentials: BackstageCredentials) {
    this.#auth = new MockAuthService({
      pluginId,
      disableDefaultAuthPolicy: false,
    });
    this.#defaultCredentials = defaultCredentials;
  }

  async #getCredentials(req: Request, allowLimitedAccess: boolean) {
    const header = req.headers.authorization;
    const token =
      typeof header === 'string'
        ? header.match(/^Bearer[ ]+(\S+)$/i)?.[1]
        : undefined;

    if (token) {
      if (token === MOCK_NONE_TOKEN) {
        return this.#auth.getNoneCredentials();
      }

      return await this.#auth.authenticate(token, {
        allowLimitedAccess,
      });
    }

    if (allowLimitedAccess) {
      const cookieHeader = req.headers.cookie;

      if (cookieHeader) {
        const cookies = parseCookie(cookieHeader);
        const cookie = cookies[MOCK_AUTH_COOKIE];

        if (cookie) {
          return await this.#auth.authenticate(cookie, {
            allowLimitedAccess: true,
          });
        }
      }
    }

    return this.#defaultCredentials;
  }

  async credentials<TAllowed extends keyof BackstagePrincipalTypes = 'unknown'>(
    req: Request,
    options?: {
      allow?: Array<TAllowed>;
      allowLimitedAccess?: boolean;
    },
  ): Promise<BackstageCredentials<BackstagePrincipalTypes[TAllowed]>> {
    const credentials = await this.#getCredentials(
      req,
      options?.allowLimitedAccess ?? false,
    );

    const allowedPrincipalTypes = options?.allow;
    if (!allowedPrincipalTypes) {
      return credentials as any;
    }

    if (this.#auth.isPrincipal(credentials, 'none')) {
      if (allowedPrincipalTypes.includes('none' as TAllowed)) {
        return credentials as any;
      }

      throw new AuthenticationError('Missing credentials');
    } else if (this.#auth.isPrincipal(credentials, 'user')) {
      if (allowedPrincipalTypes.includes('user' as TAllowed)) {
        return credentials as any;
      }

      throw new NotAllowedError(
        `This endpoint does not allow 'user' credentials`,
      );
    } else if (this.#auth.isPrincipal(credentials, 'service')) {
      if (allowedPrincipalTypes.includes('service' as TAllowed)) {
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

  async issueUserCookie(
    res: Response,
    options?: { credentials?: BackstageCredentials<BackstageUserPrincipal> },
  ): Promise<{ expiresAt: Date }> {
    const credentials =
      options?.credentials ??
      (await this.credentials(res.req, { allow: ['user'] }));

    res.setHeader(
      'Set-Cookie',
      mockCredentials.limitedUser.cookie(credentials.principal.userEntityRef),
    );

    return { expiresAt: new Date(Date.now() + 3600_000) };
  }
}
