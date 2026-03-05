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
  BackstageUserIdentity,
  IdentityApi,
  ProfileInfo,
} from '@backstage/core-plugin-api';

// Similar to the AppIdentityApi we provide backwards compatibility for a limited time
type CompatibilityIdentityApi = IdentityApi & {
  getUserId?(): string;
  getIdToken?(): Promise<string | undefined>;
  getProfile?(): ProfileInfo;
};

export class IdentityApiSignOutProxy implements IdentityApi {
  private constructor(
    private readonly config: {
      identityApi: CompatibilityIdentityApi;
      signOut: IdentityApi['signOut'];
    },
  ) {}

  static from(config: {
    identityApi: CompatibilityIdentityApi;
    signOut: IdentityApi['signOut'];
  }): IdentityApi {
    return new IdentityApiSignOutProxy(config);
  }

  getUserId(): string {
    if (!this.config.identityApi.getUserId) {
      throw new Error(`SignOutProxy IdentityApi.getUserId is not implemented`);
    }
    return this.config.identityApi.getUserId();
  }

  getIdToken(): Promise<string | undefined> {
    if (!this.config.identityApi.getIdToken) {
      throw new Error(`SignOutProxy IdentityApi.getIdToken is not implemented`);
    }
    return this.config.identityApi.getIdToken();
  }

  getProfile(): ProfileInfo {
    if (!this.config.identityApi.getProfile) {
      throw new Error(`SignOutProxy IdentityApi.getProfile is not implemented`);
    }
    return this.config.identityApi.getProfile();
  }

  getProfileInfo(): Promise<ProfileInfo> {
    return this.config.identityApi.getProfileInfo();
  }

  getBackstageIdentity(): Promise<BackstageUserIdentity> {
    return this.config.identityApi.getBackstageIdentity();
  }

  getCredentials(): Promise<{ token?: string | undefined }> {
    return this.config.identityApi.getCredentials();
  }

  signOut(): Promise<void> {
    return this.config.signOut();
  }
}
