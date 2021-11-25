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
import { ServerIdentity, TokenManager } from './types';

/**
 * Creates and validates tokens for use during backend-to-backend
 * authentication.
 *
 * @public
 */
export class ServerTokenManager implements TokenManager {
  private readonly verificationKeys: JWKS.KeyStore | JWK.NoneKey;
  private readonly signingKey: JWK.Key | JWK.NoneKey;
  private readonly signingAlgorithm: string | undefined;

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
    if (secrets?.length) {
      this.verificationKeys = new JWKS.KeyStore(
        secrets.map(k => JWK.asKey({ kty: 'oct', k })),
      );
      this.signingKey = this.verificationKeys.all()[0];
      this.signingAlgorithm = 'HS256';
    } else {
      this.verificationKeys = this.signingKey = JWK.None;
    }
  }

  async getToken(pluginId: string): Promise<{ token: string }> {
    // TODO(mtlewis): should we wrap pluginId in a urn?
    const jwt = JWT.sign({ sub: pluginId }, this.signingKey, {
      algorithm: this.signingAlgorithm,
    });

    return { token: jwt };
  }

  async authenticate(token: string): Promise<ServerIdentity> {
    let decodedJwt = {};
    try {
      JWT.verify(token, this.verificationKeys);
      decodedJwt = JWT.decode(token);
    } catch (e) {
      throw new AuthenticationError('Invalid server token');
    }

    return { pluginId: decodedJwt.sub, token };
  }
}
