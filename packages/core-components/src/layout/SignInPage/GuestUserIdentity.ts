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
    if (config?.getOptionalBoolean(`auth.allowGuestMode`)) {
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
        { sub: userEntityRef, ent: [userEntityRef], aud: 'backstage' },
        '-----BEGIN PRIVATE KEY-----\n' +
          'MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgeK+2+vxWmdH3l5vS\n' +
          'fWPXCPojy2dQ44hr3XoUN3pQ1KihRANCAATtkYfMKdb1cLkasRc87l7+Fu0BfNY3\n' +
          'OMxEttX87GkP3+2Q6IzR1LSa9+h5APS781hKNPFlUQDnutzAuChCaP7Z\n' +
          '-----END PRIVATE KEY-----\n',
        'ES256',
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
