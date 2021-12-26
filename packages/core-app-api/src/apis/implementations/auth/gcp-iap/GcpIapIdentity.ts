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
import { GcpIapSession, gcpIapSessionSchema } from './types';

/**
 * An identity API based on a Google Identity-Aware Proxy auth response.
 *
 * @public
 */
export class GcpIapIdentity implements IdentityApi {
  /**
   * Creates an identity instance based on the auth-backend API response.
   *
   * @param data - The raw JSON response from the auth-backend.
   */
  static fromResponse(data: unknown): GcpIapIdentity {
    const parsed = gcpIapSessionSchema.parse(data);
    return new GcpIapIdentity(parsed);
  }

  constructor(private readonly session: GcpIapSession) {}

  /** {@inheritdoc @backstage/core-plugin-api#IdentityApi.getUserId} */
  getUserId(): string {
    return this.session.backstageIdentity.id;
  }

  /** {@inheritdoc @backstage/core-plugin-api#IdentityApi.getIdToken} */
  async getIdToken(): Promise<string | undefined> {
    return this.session.backstageIdentity.token;
  }

  /** {@inheritdoc @backstage/core-plugin-api#IdentityApi.getProfile} */
  getProfile(): ProfileInfo {
    return this.session.profile;
  }

  /** {@inheritdoc @backstage/core-plugin-api#IdentityApi.getProfileInfo} */
  async getProfileInfo(): Promise<ProfileInfo> {
    return this.session.profile;
  }

  /** {@inheritdoc @backstage/core-plugin-api#IdentityApi.getBackstageIdentity} */
  async getBackstageIdentity(): Promise<BackstageUserIdentity> {
    return this.session.backstageIdentity.identity;
  }

  /** {@inheritdoc @backstage/core-plugin-api#IdentityApi.getCredentials} */
  async getCredentials(): Promise<{ token?: string | undefined }> {
    return { token: this.session.backstageIdentity.token };
  }

  /** {@inheritdoc @backstage/core-plugin-api#IdentityApi.signOut} */
  async signOut(): Promise<void> {}
}
