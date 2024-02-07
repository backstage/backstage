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

import { ServerTokenManager, TokenManager } from '@backstage/backend-common';
import {
  AuthService,
  BackstageCredentials,
  BackstageServiceCredentials,
  BackstageUserCredentials,
  IdentityService,
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { AuthenticationError } from '@backstage/errors';
import {
  DefaultIdentityClient,
  IdentityApiGetIdentityRequest,
} from '@backstage/plugin-auth-node';
import { decodeJwt } from 'jose';

/** @internal */
export type InternalBackstageServiceCredentials =
  BackstageServiceCredentials & {
    version: string;
    token: string;
  };

function createServiceCredentials(
  sub: string,
  token: string,
): BackstageServiceCredentials {
  return {
    $$type: '@backstage/BackstageCredentials',
    version: 'v1',
    token,
    type: 'service',
    subject: sub,
  } as InternalBackstageServiceCredentials;
}

/** @internal */
export type InternalBackstageUserCredentials = BackstageUserCredentials & {
  version: string;
  token: string;
};

function createUserCredentials(
  sub: string,
  token: string,
): BackstageUserCredentials {
  return {
    $$type: '@backstage/BackstageCredentials',
    version: 'v1',
    token,
    type: 'user',
    userEntityRef: sub,
  } as InternalBackstageUserCredentials;
}

export function toInternalBackstageCredentials(
  credentials: BackstageCredentials,
): InternalBackstageServiceCredentials | InternalBackstageUserCredentials {
  if (credentials.$$type !== '@backstage/BackstageCredentials') {
    throw new Error('Invalid credential type');
  }
  const internalCredentials = credentials as
    | InternalBackstageServiceCredentials
    | InternalBackstageUserCredentials;
  if (internalCredentials.version !== 'v1') {
    throw new Error(
      `Invalid credential version ${internalCredentials.version}`,
    );
  }
  return internalCredentials;
}

/** @internal */
class DefaultAuthService implements AuthService {
  constructor(
    private readonly tokenManager: TokenManager,
    private readonly identity: IdentityService,
  ) {}

  async authenticate(token: string): Promise<BackstageCredentials> {
    const { sub, aud } = decodeJwt(token);

    // Legacy service-to-service token
    if (sub === 'backstage-server' && !aud) {
      await this.tokenManager.authenticate(token);
      return createServiceCredentials('external:backstage-plugin', token);
    }

    // User Backstage token
    const identity = await this.identity.getIdentity({
      request: {
        headers: { authorization: `Bearer ${token}` },
      },
    } as IdentityApiGetIdentityRequest);

    if (!identity) {
      throw new AuthenticationError('No identity found');
    }

    return createUserCredentials(identity.identity.userEntityRef, token);
  }

  async issueServiceToken(options?: {
    forward?: BackstageCredentials;
  }): Promise<{ token: string }> {
    const internalForward =
      options?.forward && toInternalBackstageCredentials(options.forward);

    if (internalForward) {
      const { type } = internalForward;
      if (type === 'user') {
        return { token: internalForward.token };
      } else if (type !== 'service') {
        throw new AuthenticationError(
          `Refused to issue service token for credential type '${type}'`,
        );
      }
    }

    const { token } = await this.tokenManager.getToken();
    return { token };
  }
}

/** @public */
export const authServiceFactory = createServiceFactory({
  service: coreServices.auth,
  deps: {
    config: coreServices.rootConfig,
    logger: coreServices.rootLogger,
    discovery: coreServices.discovery,
  },
  createRootContext({ config, logger }) {
    return ServerTokenManager.fromConfig(config, { logger });
  },
  async factory({ discovery }, tokenManager) {
    const identity = DefaultIdentityClient.create({ discovery });
    return new DefaultAuthService(tokenManager, identity);
  },
});
