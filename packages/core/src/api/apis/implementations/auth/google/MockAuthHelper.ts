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

import GoogleScopes from './GoogleScopes';
import { GoogleSession } from './types';
import { AuthHelper } from './GoogleAuthHelper';

export const mockIdToken = 'mock-id-token';
export const mockAccessToken = 'mock-access-token';

const defaultMockSession: GoogleSession = {
  idToken: mockIdToken,
  accessToken: mockAccessToken,
  expiresAt: new Date(),
  scopes: GoogleScopes.default(),
};

export default class MockAuthHelper implements AuthHelper {
  constructor(
    private readonly mockSession: GoogleSession = defaultMockSession,
  ) {}

  async refreshSession() {
    return this.mockSession;
  }

  async removeSession() {}

  async createSession() {
    return this.mockSession;
  }

  async showPopup(scope: string) {
    return {
      scopes: GoogleScopes.from(scope),
      idToken: 'i',
      accessToken: 'a',
      expiresAt: new Date(),
    };
  }
}
