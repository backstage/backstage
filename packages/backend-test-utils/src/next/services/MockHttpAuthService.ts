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
  HttpAuthService,
} from '@backstage/backend-plugin-api';
import { Request, Response } from 'express';
import { mockCredentials } from './mockCredentials';
import { MockAuthService } from './MockAuthService';
import { NotAllowedError, NotImplementedError } from '@backstage/errors';

// TODO: support mock cookie auth?
export class MockHttpAuthService implements HttpAuthService {
  #auth: AuthService;

  constructor(pluginId: string) {
    this.#auth = new MockAuthService(pluginId);
  }

  async #getCredentials(req: Request) {
    const header = req.headers.authorization;
    const token =
      typeof header === 'string'
        ? header.match(/^Bearer[ ]+(\S+)$/i)?.[1]
        : undefined;
    if (!token) {
      return mockCredentials.none();
    }

    return await this.#auth.authenticate(token);
  }

  async credentials<TAllowed extends keyof BackstagePrincipalTypes = 'unknown'>(
    req: Request,
    options?: {
      allow?: Array<TAllowed>;
      allowedAuthMethods?: Array<'token' | 'cookie'>;
    },
  ): Promise<BackstageCredentials<BackstagePrincipalTypes[TAllowed]>> {
    const credentials = await this.#getCredentials(req);

    const allowedPrincipalTypes = options?.allow;
    if (!allowedPrincipalTypes) {
      return credentials as any;
    }

    if (this.#auth.isPrincipal(credentials, 'none')) {
      if (allowedPrincipalTypes.includes('none' as TAllowed)) {
        return credentials as any;
      }

      throw new NotAllowedError(
        `This endpoint does not allow 'none' credentials`,
      );
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

  async issueUserCookie(_res: Response): Promise<void> {
    throw new NotImplementedError('Not implemented');
  }
}
