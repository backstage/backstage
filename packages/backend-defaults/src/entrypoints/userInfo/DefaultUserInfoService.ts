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
  DiscoveryService,
  BackstageCredentials,
} from '@backstage/backend-plugin-api';
import { ResponseError } from '@backstage/errors';
import { decodeJwt } from 'jose';
import { toInternalBackstageCredentials } from '../auth/helpers';

export type Options = {
  discovery: DiscoveryService;
};

export class DefaultUserInfoService implements UserInfoService {
  private readonly discovery: DiscoveryService;

  constructor(options: Options) {
    this.discovery = options.discovery;
  }

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
    const { sub: userEntityRef, ent: tokenEnt } = decodeJwt(
      internalCredentials.token,
    );

    if (typeof userEntityRef !== 'string') {
      throw new Error('User entity ref must be a string');
    }

    let ownershipEntityRefs = tokenEnt;

    if (!ownershipEntityRefs) {
      const userInfoResp = await fetch(
        `${await this.discovery.getBaseUrl('auth')}/v1/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${internalCredentials.token}`,
          },
        },
      );

      if (!userInfoResp.ok) {
        throw await ResponseError.fromResponse(userInfoResp);
      }

      const {
        claims: { ent },
      } = await userInfoResp.json();
      ownershipEntityRefs = ent;
    }

    if (!ownershipEntityRefs) {
      throw new Error('Ownership entity refs can not be determined');
    } else if (
      !Array.isArray(ownershipEntityRefs) ||
      ownershipEntityRefs.some(ref => typeof ref !== 'string')
    ) {
      throw new Error('Ownership entity refs must be an array of strings');
    }

    return { userEntityRef, ownershipEntityRefs };
  }
}
