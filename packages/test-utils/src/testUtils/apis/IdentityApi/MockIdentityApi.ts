/*
 * Copyright 2023 The Backstage Authors
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
  BackstageUserIdentity,
  IdentityApi,
  ProfileInfo,
} from '@backstage/core-plugin-api';

/**
 * Mock implementation of {@link core-plugin-api#IdentityApi} with helpers to ensure that info is sent correctly.
 * Use createBackstageIdentity and createBackstageIdentity in tests for setup.
 *
 * @public
 */
export class MockIdentityApi implements IdentityApi {
  private profileInfo: ProfileInfo = {};

  private identity: BackstageUserIdentity = {
    type: 'user',
    userEntityRef: '',
    ownershipEntityRefs: ['', ''],
  };

  private token: object = { token: '' };

  getProfileInfo(): Promise<ProfileInfo> {
    return Promise.resolve(this.profileInfo);
  }

  getBackstageIdentity(): Promise<BackstageUserIdentity> {
    return Promise.resolve(this.identity);
  }

  getCredentials(): Promise<{ token?: string }> {
    return Promise.resolve(this.token);
  }

  signOut(): Promise<void> {
    return Promise.resolve(undefined);
  }

  createProfileInfo(info: ProfileInfo): void {
    this.profileInfo = info;
  }

  createBackstageIdentity(identity: BackstageUserIdentity): void {
    this.identity = identity;
  }
}
