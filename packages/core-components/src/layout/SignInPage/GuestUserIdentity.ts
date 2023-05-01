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
import { Config } from '@backstage/config';
import nJwt from 'njwt';

export class GuestUserIdentity implements IdentityApi {
  private idToken?: string;

  static fromConfig(config?: Config): GuestUserIdentity {
    const newIdentity = new GuestUserIdentity();
    if (
      config &&
      config.getOptionalConfig(`auth`)?.getOptionalBoolean(`allowGuestMode`)
    ) {
      newIdentity.setIdToken(newIdentity.issueToken());
    }
    return newIdentity;
  }

  private setIdToken(token: string) {
    this.idToken = token;
  }

  private issueToken(): string {
    const userEntityRef = `user:default/guest`;
    const idToken: string = nJwt
      .create(
        { sub: userEntityRef, ent: [userEntityRef] },
        Buffer.from('signing key'),
      )
      .compact();

    return idToken;
  }

  getUserId(): string {
    return 'guest';
  }

  async getIdToken(): Promise<string | undefined> {
    return this.idToken;
  }

  getProfile(): ProfileInfo {
    return {
      email: 'guest@example.com',
      displayName: 'Guest',
    };
  }

  async getProfileInfo(): Promise<ProfileInfo> {
    return {
      email: 'guest@example.com',
      displayName: 'Guest',
    };
  }

  async getBackstageIdentity(): Promise<BackstageUserIdentity> {
    const userEntityRef = `user:default/guest`;
    return {
      type: 'user',
      userEntityRef,
      ownershipEntityRefs: [userEntityRef],
    };
  }
  // guest-tokens are assigned if the auth.allowGuestMode flag is set to true in our config
  async getCredentials(): Promise<{ token?: string | undefined }> {
    if (this.idToken) {
      return { token: this.idToken };
    }
    return {};
  }

  async signOut(): Promise<void> {}
}
