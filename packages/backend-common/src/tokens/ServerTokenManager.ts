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
import { Logger } from 'winston';

class NoopTokenManager implements TokenManager {
  public readonly isInsecureServerTokenManager: boolean = true;

  async getToken() {
    return { token: '' };
  }

  async authenticate() {}
}

/**
 * Creates and validates tokens for use during backend-to-backend
 * authentication.
 *
 * @public
 */
export class ServerTokenManager implements TokenManager {
  private readonly verificationKeys: JWKS.KeyStore;
  private readonly signingKey: JWK.Key;

  static noop(): TokenManager {
    return new NoopTokenManager();
  }

  static fromConfig(config: Config, options: { logger: Logger }) {
    const { logger } = options;

    const keys = config.getOptionalConfigArray('backend.auth.keys');
    if (keys?.length) {
      return new ServerTokenManager(keys.map(key => key.getString('secret')));
    }
    if (process.env.NODE_ENV !== 'development') {
      throw new Error(
        'You must configure at least one key in backend.auth.keys for production.',
      );
    }

    // For development, if a secret has not been configured, we auto generate a secret instead of throwing.
    const generatedDevOnlyKey = JWK.generateSync('oct', 24 * 8);
    if (generatedDevOnlyKey.k === undefined) {
      throw new Error('Internal error, JWK key generation returned no data');
    }
    logger.warn(
      'Generated a secret for backend-to-backend authentication: DEVELOPMENT USE ONLY.',
    );
    return new ServerTokenManager([generatedDevOnlyKey.k]);
  }

  private constructor(secrets: string[]) {
    if (!secrets.length) {
      throw new Error(
        'No secrets provided when constructing ServerTokenManager',
      );
    }

    this.verificationKeys = new JWKS.KeyStore(
      secrets.map(k => JWK.asKey({ kty: 'oct', k })),
    );
    this.signingKey = this.verificationKeys.all()[0];
  }

  async getToken(): Promise<{ token: string }> {
    const jwt = JWT.sign({ sub: 'backstage-server' }, this.signingKey, {
      algorithm: 'HS256',
    });

    return { token: jwt };
  }

  async authenticate(token: string): Promise<void> {
    try {
      JWT.verify(token, this.verificationKeys);
    } catch (e) {
      throw new AuthenticationError('Invalid server token');
    }
  }
}
