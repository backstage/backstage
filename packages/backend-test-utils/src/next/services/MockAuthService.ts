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
  BackstageCredentials,
  BackstageServicePrincipal,
  BackstagePrincipalTypes,
  BackstageUserPrincipal,
  BackstageNonePrincipal,
  AuthService,
} from '@backstage/backend-plugin-api';
import { AuthenticationError } from '@backstage/errors';
import {
  mockCredentials,
  MOCK_USER_TOKEN,
  MOCK_USER_TOKEN_PREFIX,
  MOCK_INVALID_USER_TOKEN,
  MOCK_USER_LIMITED_TOKEN_PREFIX,
  MOCK_INVALID_USER_LIMITED_TOKEN,
  MOCK_SERVICE_TOKEN,
  MOCK_SERVICE_TOKEN_PREFIX,
  MOCK_INVALID_SERVICE_TOKEN,
  UserTokenPayload,
  ServiceTokenPayload,
} from './mockCredentials';
import { JsonObject } from '@backstage/types';

/** @internal */
export class MockAuthService implements AuthService {
  readonly pluginId: string;
  readonly disableDefaultAuthPolicy: boolean;

  constructor(options: {
    pluginId: string;
    disableDefaultAuthPolicy: boolean;
  }) {
    this.pluginId = options.pluginId;
    this.disableDefaultAuthPolicy = options.disableDefaultAuthPolicy;
  }

  async authenticate(
    token: string,
    options?: { allowLimitedAccess?: boolean },
  ): Promise<BackstageCredentials> {
    switch (token) {
      case MOCK_USER_TOKEN:
        return mockCredentials.user();
      case MOCK_SERVICE_TOKEN:
        return mockCredentials.service();
      case MOCK_INVALID_USER_TOKEN:
        throw new AuthenticationError('User token is invalid');
      case MOCK_INVALID_USER_LIMITED_TOKEN:
        throw new AuthenticationError('Limited user token is invalid');
      case MOCK_INVALID_SERVICE_TOKEN:
        throw new AuthenticationError('Service token is invalid');
      case '':
        throw new AuthenticationError('Token is empty');
      default:
        break;
    }

    if (token.startsWith(MOCK_USER_TOKEN_PREFIX)) {
      const { sub: userEntityRef }: UserTokenPayload = JSON.parse(
        token.slice(MOCK_USER_TOKEN_PREFIX.length),
      );

      return mockCredentials.user(userEntityRef);
    }

    if (token.startsWith(MOCK_USER_LIMITED_TOKEN_PREFIX)) {
      if (!options?.allowLimitedAccess) {
        throw new AuthenticationError('Limited user token is not allowed');
      }

      const { sub: userEntityRef }: UserTokenPayload = JSON.parse(
        token.slice(MOCK_USER_LIMITED_TOKEN_PREFIX.length),
      );

      return mockCredentials.user(userEntityRef);
    }

    if (token.startsWith(MOCK_SERVICE_TOKEN_PREFIX)) {
      const { sub, target, obo }: ServiceTokenPayload = JSON.parse(
        token.slice(MOCK_SERVICE_TOKEN_PREFIX.length),
      );

      if (target && target !== this.pluginId) {
        throw new AuthenticationError(
          `Invalid mock token target plugin ID, got '${target}' but expected '${this.pluginId}'`,
        );
      }
      if (obo) {
        return mockCredentials.user(obo);
      }

      return mockCredentials.service(sub);
    }

    throw new AuthenticationError(`Unknown mock token '${token}'`);
  }

  async getNoneCredentials() {
    return mockCredentials.none();
  }

  async getOwnServiceCredentials(): Promise<
    BackstageCredentials<BackstageServicePrincipal>
  > {
    return mockCredentials.service(`plugin:${this.pluginId}`);
  }

  isPrincipal<TType extends keyof BackstagePrincipalTypes>(
    credentials: BackstageCredentials,
    type: TType,
  ): credentials is BackstageCredentials<BackstagePrincipalTypes[TType]> {
    const principal = credentials.principal as
      | BackstageUserPrincipal
      | BackstageServicePrincipal
      | BackstageNonePrincipal;

    if (type === 'unknown') {
      return true;
    }

    if (principal.type !== type) {
      return false;
    }

    return true;
  }

  async getPluginRequestToken(options: {
    onBehalfOf: BackstageCredentials;
    targetPluginId: string;
  }): Promise<{ token: string }> {
    const principal = options.onBehalfOf.principal as
      | BackstageUserPrincipal
      | BackstageServicePrincipal
      | BackstageNonePrincipal;

    if (principal.type === 'none' && this.disableDefaultAuthPolicy) {
      return { token: '' };
    }

    if (principal.type !== 'user' && principal.type !== 'service') {
      throw new AuthenticationError(
        `Refused to issue service token for credential type '${principal.type}'`,
      );
    }

    return {
      token: mockCredentials.service.token({
        onBehalfOf: options.onBehalfOf,
        targetPluginId: options.targetPluginId,
      }),
    };
  }

  async getLimitedUserToken(
    credentials: BackstageCredentials<BackstageUserPrincipal>,
  ): Promise<{ token: string; expiresAt: Date }> {
    if (credentials.principal.type !== 'user') {
      throw new AuthenticationError(
        `Refused to issue limited user token for credential type '${credentials.principal.type}'`,
      );
    }

    return {
      token: mockCredentials.limitedUser.token(
        credentials.principal.userEntityRef,
      ),
      expiresAt: new Date(Date.now() + 3600_000),
    };
  }

  listPublicServiceKeys(): Promise<{ keys: JsonObject[] }> {
    throw new Error('Not implemented');
  }
}
