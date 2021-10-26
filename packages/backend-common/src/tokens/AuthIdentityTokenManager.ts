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

import { TokenManager } from './types';

export class AuthIdentityTokenManager implements TokenManager {
  private readonly SERVER_TOKEN = 'server-token';

  async getServerToken(): Promise<{ token: string }> {
    return { token: this.SERVER_TOKEN };
  }

  async validateToken(token: string): Promise<void> {
    if (token !== this.SERVER_TOKEN) {
      throw new Error('Invalid server token');
    }
  }
}
