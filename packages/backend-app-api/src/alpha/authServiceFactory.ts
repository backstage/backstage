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
  IdentityService,
  TokenManagerService,
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import {
  AuthService,
  BackstageCredentials,
  authServiceRef,
} from '@backstage/backend-plugin-api/alpha';
import { AuthenticationError } from '@backstage/errors';
import { IdentityApiGetIdentityRequest } from '@backstage/plugin-auth-node';

class DefaultAuthService implements AuthService {
  #identity: IdentityService;
  #tokenManager: TokenManagerService;

  constructor(options: {
    identity: IdentityService;
    tokenManager: TokenManagerService;
  }) {
    this.#identity = options.identity;
    this.#tokenManager = options.tokenManager;
  }

  async authenticate(token: string): Promise<BackstageCredentials> {
    const type = this.#getTokenType(token);

    if (type === 'user') {
      const userIdentity = await this.#identity.getIdentity({
        request: {
          headers: { authorization: `Bearer ${token}` },
        },
      } as IdentityApiGetIdentityRequest);
      if (!userIdentity) {
        throw new AuthenticationError('Invalid user token');
      }
      return {
        token,
        user: userIdentity.identity,
      };
    } else if (type === 'service') {
      await this.#tokenManager.authenticate(token);
      return {
        token,
        plugin: {
          id: 'derp', // TODO(Rugvip): maybe rework this
        },
      };
    }

    throw new AuthenticationError(`Token type is ${type}`);
  }

  async issueToken(
    credentials: BackstageCredentials,
  ): Promise<{ token: string }> {
    if (credentials.plugin) {
      return this.#tokenManager.getToken();
    }
    throw new Error(
      'Unable to issue token for non-service credentials (for now)',
    );
  }

  #getTokenType(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.ent) {
        return 'user';
      } else if (payload.sub === 'backstage-server') {
        return 'service';
      }
      return 'unknown';
    } catch {
      return 'invalid';
    }
  }
}

/** @alpha */
export const authServiceFactory = createServiceFactory({
  service: authServiceRef,
  deps: {
    identity: coreServices.identity,
    tokenManager: coreServices.tokenManager,
  },
  factory({ identity, tokenManager }) {
    return new DefaultAuthService({ identity, tokenManager });
  },
});
