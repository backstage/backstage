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
  BackstageNonePrincipal,
  BackstageServicePrincipal,
  BackstageUserInfo,
  BackstageUserPrincipal,
  UserInfoService,
} from '@backstage/backend-plugin-api';
import { InputError } from '@backstage/errors';

/** @internal */
export class MockUserInfoService implements UserInfoService {
  private readonly customInfo: Partial<BackstageUserInfo>;

  constructor(customInfo?: Partial<BackstageUserInfo>) {
    this.customInfo = customInfo ?? {};
  }

  async getUserInfo(
    credentials: BackstageCredentials,
  ): Promise<BackstageUserInfo> {
    const principal = credentials.principal as
      | BackstageUserPrincipal
      | BackstageServicePrincipal
      | BackstageNonePrincipal;

    if (principal.type !== 'user') {
      throw new InputError(
        `User info not available for principal type '${principal.type}'`,
      );
    }

    return {
      userEntityRef: principal.userEntityRef,
      ownershipEntityRefs: [principal.userEntityRef],
      ...this.customInfo,
    };
  }
}
