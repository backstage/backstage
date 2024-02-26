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
  UserInfoService,
  BackstageUserInfo,
  coreServices,
  createServiceFactory,
  BackstageCredentials,
} from '@backstage/backend-plugin-api';
import { toInternalBackstageCredentials } from '../auth/authServiceFactory';
import { decodeJwt } from 'jose';

// TODO: The intention is for this to eventually be replaced by a call to the auth-backend
export class DefaultUserInfoService implements UserInfoService {
  async getUserInfo(
    credentials: BackstageCredentials,
  ): Promise<BackstageUserInfo> {
    const internalCredentials = toInternalBackstageCredentials(credentials);
    if (internalCredentials.principal.type !== 'user') {
      throw new Error('Only user credentials are supported');
    }
    if (!internalCredentials.token) {
      throw new Error('User credentials is unexpectedly missing token');
    }
    const { sub: userEntityRef, ent: ownershipEntityRefs = [] } = decodeJwt(
      internalCredentials.token,
    );

    if (typeof userEntityRef !== 'string') {
      throw new Error('User entity ref must be a string');
    }
    if (!Array.isArray(ownershipEntityRefs)) {
      throw new Error('Ownership entity refs must be an array');
    }

    return { userEntityRef, ownershipEntityRefs };
  }
}

/** @public */
export const userInfoServiceFactory = createServiceFactory({
  service: coreServices.userInfo,
  deps: {},
  async factory() {
    return new DefaultUserInfoService();
  },
});
