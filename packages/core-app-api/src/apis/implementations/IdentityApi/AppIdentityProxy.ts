/*
 * Copyright 2020 The Backstage Authors
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

function mkError(thing: string) {
  return new Error(
    `Tried to access IdentityApi ${thing} before app was loaded`,
  );
}

/**
 * Implementation of the connection between the App-wide IdentityApi
 * and sign-in page.
 */
export class AppIdentityProxy implements IdentityApi {
  private target?: IdentityApi;

  // This is called by the app manager once the sign-in page provides us with an implementation
  setTarget(identityApi: IdentityApi) {
    this.target = identityApi;
  }

  getUserId(): string {
    if (!this.target) {
      throw mkError('getUserId');
    }
    return this.target.getUserId();
  }

  getProfile(): ProfileInfo {
    if (!this.target) {
      throw mkError('getProfile');
    }
    return this.target.getProfile();
  }

  async getProfileInfo(): Promise<ProfileInfo> {
    if (!this.target) {
      throw mkError('getProfileInfo');
    }
    return this.target.getProfileInfo();
  }

  async getBackstageIdentity(): Promise<BackstageUserIdentity> {
    if (!this.target) {
      throw mkError('getBackstageIdentity');
    }
    return this.target.getBackstageIdentity();
  }

  async getCredentials(): Promise<{ token?: string | undefined }> {
    if (!this.target) {
      throw mkError('getCredentials');
    }
    return this.target.getCredentials();
  }

  async getIdToken(): Promise<string | undefined> {
    if (!this.target) {
      throw mkError('getIdToken');
    }
    return this.target.getIdToken();
  }

  async signOut(): Promise<void> {
    if (!this.target) {
      throw mkError('signOut');
    }
    await this.target.signOut();
    location.reload();
  }
}
