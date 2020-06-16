/*
 * Copyright 2020 Spotify AB
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

import { IdentityApi } from '../apis';
import { SignInResult } from './types';

/**
 * Implementation of the connection between the App-wide IdentityApi
 * and sign-in page.
 */
export class AppIdentity implements IdentityApi {
  private userId?: string;
  private idToken?: string;
  private logoutFunc?: () => Promise<void>;

  getUserId(): string {
    if (!this.userId) {
      throw new Error(
        'Tried to access IdentityApi userId before app was loaded',
      );
    }
    return this.userId;
  }

  getIdToken(): string {
    if (!this.idToken) {
      throw new Error(
        'Tried to access IdentityApi idToken before app was loaded',
      );
    }
    return this.idToken;
  }

  async logout(): Promise<void> {
    if (!this.logoutFunc) {
      throw new Error(
        'Tried to access IdentityApi logoutFunc before app was loaded',
      );
    }
    await this.logoutFunc;
  }

  setSignInResult(result: SignInResult) {
    this.userId = result.userId;
    this.idToken = result.idToken;
    this.logoutFunc = result.logout;
  }
}
