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

/** @internal */
export class MockAuthService implements AuthService {
  constructor(private readonly pluginId: string) {}

  async authenticate(token: string): Promise<BackstageCredentials> {
    if (token === 'mock-user-token') {
      return {
        $$type: '@backstage/BackstageCredentials',
        principal: { type: 'user', userEntityRef: 'user:default/mock' },
      };
    } else if (token === 'mock-service-token') {
      return {
        $$type: '@backstage/BackstageCredentials',
        principal: { type: 'service', subject: 'external:test-service' },
      };
    }

    throw new AuthenticationError('Invalid token');
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
        return { token: 'mock-user-token' };
      case 'service':
        return { token: `mock-service-token-for-${options.targetPluginId}` };
      default:
        throw new AuthenticationError(
          `Refused to issue service token for credential type '${principal.type}'`,
        );
    }
  }
}
