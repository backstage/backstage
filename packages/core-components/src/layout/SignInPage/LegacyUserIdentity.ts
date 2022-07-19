/*
 * Copyright 2021 The Backstage Authors
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
  IdentityApi,
  ProfileInfo,
  BackstageUserIdentity,
} from '@backstage/core-plugin-api';

function parseJwtPayload(token: string) {
  const [_header, payload, _signature] = token.split('.');
  return JSON.parse(atob(payload));
}

type LegacySignInResult = {
  userId: string;
  profile: ProfileInfo;
  getIdToken?: () => Promise<string>;
  signOut?: () => Promise<void>;
};

/** @internal */
export class LegacyUserIdentity implements IdentityApi {
  private constructor(private readonly result: LegacySignInResult) {}

  getUserId(): string {
    return this.result.userId;
  }

  static fromResult(result: LegacySignInResult): LegacyUserIdentity {
    return new LegacyUserIdentity(result);
  }

  async getIdToken(): Promise<string | undefined> {
    return this.result.getIdToken?.();
  }

  getProfile(): ProfileInfo {
    return this.result.profile;
  }

  async getProfileInfo(): Promise<ProfileInfo> {
    return this.result.profile;
  }

  async getBackstageIdentity(): Promise<BackstageUserIdentity> {
    const token = await this.getIdToken();

    if (!token) {
      const userEntityRef = `user:default/${this.getUserId()}`;
      return {
        type: 'user',
        userEntityRef,
        ownershipEntityRefs: [userEntityRef],
      };
    }

    const { sub, ent } = parseJwtPayload(token);
    return {
      type: 'user',
      userEntityRef: sub,
      ownershipEntityRefs: ent ?? [],
    };
  }

  async getCredentials(): Promise<{ token?: string | undefined }> {
    const token = await this.result.getIdToken?.();
    return { token };
  }

  async signOut(): Promise<void> {
    return this.result.signOut?.();
  }
}
