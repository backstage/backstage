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

function logDeprecation(thing: string) {
  // eslint-disable-next-line no-console
  console.warn(
    `WARNING: Call to ${thing} is deprecated and will break in the future`,
  );
}

// We use this for a period of backwards compatibility. It is a hidden
// compatibility that will allow old plugins to continue working for a limited time.
type CompatibilityIdentityApi = IdentityApi & {
  getUserId?(): string;
  getIdToken?(): Promise<string | undefined>;
  getProfile?(): ProfileInfo;
};

/**
 * Implementation of the connection between the App-wide IdentityApi
 * and sign-in page.
 */
export class AppIdentityProxy implements IdentityApi {
  private target?: CompatibilityIdentityApi;

  // This is called by the app manager once the sign-in page provides us with an implementation
  setTarget(identityApi: CompatibilityIdentityApi) {
    this.target = identityApi;
  }

  getUserId(): string {
    if (!this.target) {
      throw mkError('getUserId');
    }
    if (!this.target.getUserId) {
      throw new Error('IdentityApi does not implement getUserId');
    }
    logDeprecation('getUserId');
    return this.target.getUserId();
  }

  getProfile(): ProfileInfo {
    if (!this.target) {
      throw mkError('getProfile');
    }
    if (!this.target.getProfile) {
      throw new Error('IdentityApi does not implement getProfile');
    }
    logDeprecation('getProfile');
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
    const identity = await this.target.getBackstageIdentity();
    if (!identity.userEntityRef.match(/^.*:.*\/.*$/)) {
      // eslint-disable-next-line no-console
      console.warn(
        `WARNING: The App IdentityApi provided an invalid userEntityRef, '${identity.userEntityRef}'. ` +
          `It must be a full Entity Reference of the form '<kind>:<namespace>/<name>'.`,
      );
    }

    return identity;
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
    if (!this.target.getIdToken) {
      throw new Error('IdentityApi does not implement getIdToken');
    }
    logDeprecation('getIdToken');
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
