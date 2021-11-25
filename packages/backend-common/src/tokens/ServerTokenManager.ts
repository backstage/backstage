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

import { JWKS, JWK, JWT } from 'jose';
import { Config } from '@backstage/config';
import { AuthenticationError } from '@backstage/errors';
import { TokenManager } from './types';

/**
 * Creates and validates tokens for use during backend-to-backend
 * authentication.
 *
 * @public
 */
export class ServerTokenManager implements TokenManager {
  private readonly keyStore: JWKS.KeyStore;

  static noop() {
    return new ServerTokenManager();
  }

  static fromConfig(config: Config) {
    return new ServerTokenManager(
      config
        .getConfigArray('backend.auth.keys')
        .map(key => key.getString('secret')),
    );
  }

  private constructor(secrets?: string[]) {
    this.keyStore = new JWKS.KeyStore(
      secrets?.length
        ? secrets.map(secret => JWK.asKey({ kty: 'oct', k: secret }))
        : [],
    );
  }

  async getToken(): Promise<{ token: string }> {
    if (this.keyStore.size === 0) {
      return { token: '' };
    }

    const jwt = JWT.sign({ sub: 'backstage-server' }, this.keyStore.all()[0], {
      algorithm: 'HS256',
    });

    return { token: jwt };
  }

  validateToken(token: string): void {
    if (this.keyStore.size === 0) {
      return;
    }

    try {
      JWT.verify(token, this.keyStore);
      return;
    } catch (e) {
      throw new AuthenticationError('Invalid server token');
    }
  }
}
