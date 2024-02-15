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
  MOCK_SERVICE_TOKEN,
  MOCK_SERVICE_TOKEN_PREFIX,
  DEFAULT_MOCK_USER_ENTITY_REF,
  DEFAULT_MOCK_SERVICE_SUBJECT,
} from './mockCredentials';

/** @internal */
export class MockAuthService implements AuthService {
  constructor(private readonly pluginId: string) {}

  async authenticate(token: string): Promise<BackstageCredentials> {
    if (token === MOCK_USER_TOKEN) {
      return mockCredentials.user();
    }
    if (token === MOCK_SERVICE_TOKEN) {
      return mockCredentials.service();
    }

    if (token.startsWith(MOCK_USER_TOKEN_PREFIX)) {
      const { userEntityRef }: mockCredentials.user.TokenPayload = JSON.parse(
        token.slice(MOCK_USER_TOKEN_PREFIX.length),
      );

      return mockCredentials.user(userEntityRef);
    }

    if (token.startsWith(MOCK_SERVICE_TOKEN_PREFIX)) {
      const { targetPluginId, subject }: mockCredentials.service.TokenPayload =
        JSON.parse(token.slice(MOCK_SERVICE_TOKEN_PREFIX.length));

      if (targetPluginId && targetPluginId !== this.pluginId) {
        throw new AuthenticationError(
          `Invalid mock token target, got ${targetPluginId} but expected ${this.pluginId}`,
        );
      }

      return mockCredentials.service(subject);
    }

    throw new AuthenticationError('Invalid mock token');
  }

  async getOwnServiceCredentials(): Promise<
    BackstageCredentials<BackstageServicePrincipal>
  > {
    return {
      $$type: '@backstage/BackstageCredentials',
      principal: { type: 'service', subject: `plugin:${this.pluginId}` },
    };
  }

  isPrincipal<TType extends keyof BackstagePrincipalTypes>(
    credentials: BackstageCredentials,
    type: TType,
  ): credentials is BackstageCredentials<BackstagePrincipalTypes[TType]> {
    const principal = credentials.principal as
      | BackstageUserPrincipal
      | BackstageServicePrincipal
      | BackstageNonePrincipal;
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

    switch (principal.type) {
      case 'user':
        if (principal.userEntityRef === DEFAULT_MOCK_USER_ENTITY_REF) {
          return { token: mockCredentials.user.token() };
        }
        return {
          token: mockCredentials.user.token({
            userEntityRef: principal.userEntityRef,
          }),
        };
      case 'service':
        return {
          token: mockCredentials.service.token({
            targetPluginId: options.targetPluginId,
            subject:
              principal.subject === DEFAULT_MOCK_SERVICE_SUBJECT
                ? undefined
                : principal.subject,
          }),
        };
      default:
        throw new AuthenticationError(
          `Refused to issue service token for credential type '${principal.type}'`,
        );
    }
  }
}
