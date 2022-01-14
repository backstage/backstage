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
  private waitForTarget: Promise<IdentityApi>;
  private resolveTarget: (api: IdentityApi) => void = () => {};

  constructor() {
    this.waitForTarget = new Promise<IdentityApi>(resolve => {
      this.resolveTarget = resolve;
    });
  }

  // This is called by the app manager once the sign-in page provides us with an implementation
  setTarget(identityApi: IdentityApi) {
    this.target = identityApi;
    this.resolveTarget(identityApi);
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
    return this.waitForTarget.then(target => target.getProfileInfo());
  }

  async getBackstageIdentity(): Promise<BackstageUserIdentity> {
    return this.waitForTarget.then(target => target.getBackstageIdentity());
  }

  async getCredentials(): Promise<{ token?: string | undefined }> {
    return this.waitForTarget.then(target => target.getCredentials());
  }

  async getIdToken(): Promise<string | undefined> {
    return this.waitForTarget.then(target => target.getIdToken());
  }

  async signOut(): Promise<void> {
    await this.waitForTarget.then(target => target.signOut());
    location.reload();
  }
}
