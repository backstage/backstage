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

import { Config } from '@backstage/config';
import { AuthenticationError } from '@backstage/errors';
import { base64url, exportJWK, generateSecret, jwtVerify, SignJWT } from 'jose';
import { DateTime, Duration } from 'luxon';
import { Logger } from 'winston';
import { TokenManager } from './types';

const TOKEN_ALG = 'HS256';
const TOKEN_SUB = 'backstage-server';
const TOKEN_EXPIRY_AFTER = Duration.fromObject({ hours: 1 });
const TOKEN_REISSUE_AFTER = Duration.fromObject({ minutes: 10 });

/**
 * A token manager that issues static dummy tokens and never fails
 * authentication. This can be useful for testing.
 */
class NoopTokenManager implements TokenManager {
  public readonly isInsecureServerTokenManager: boolean = true;

  async getToken() {
    return { token: '' };
  }

  async authenticate() {}
}

/**
 * Options for {@link ServerTokenManager}.
 *
 * @public
 */
export interface ServerTokenManagerOptions {
  /**
   * The logger to use.
   */
  logger: Logger;
}

/**
 * Creates and validates tokens for use during backend-to-backend
 * authentication.
 *
 * @public
 */
export class ServerTokenManager implements TokenManager {
  private readonly options: ServerTokenManagerOptions;
  private readonly verificationKeys: Uint8Array[];
  private signingKey: Uint8Array;
  private privateKeyPromise: Promise<void> | undefined;
  private currentTokenPromise: Promise<{ token: string }> | undefined;

  /**
   * Creates a token manager that issues static dummy tokens and never fails
   * authentication. This can be useful for testing.
   */
  static noop(): TokenManager {
    return new NoopTokenManager();
  }

  static fromConfig(config: Config, options: ServerTokenManagerOptions) {
    const keys = config.getOptionalConfigArray('backend.auth.keys');
    if (keys?.length) {
      return new ServerTokenManager(
        keys.map(key => key.getString('secret')),
        options,
      );
    }

    if (process.env.NODE_ENV !== 'development') {
      throw new Error(
        'You must configure at least one key in backend.auth.keys for production.',
      );
    }

    // For development, if a secret has not been configured, we auto generate a secret instead of throwing.
    options.logger.warn(
      'Generated a secret for backend-to-backend authentication: DEVELOPMENT USE ONLY.',
    );
    return new ServerTokenManager([], options);
  }

  private constructor(secrets: string[], options: ServerTokenManagerOptions) {
    if (!secrets.length && process.env.NODE_ENV !== 'development') {
      throw new Error(
        'No secrets provided when constructing ServerTokenManager',
      );
    }
    this.options = options;
    this.verificationKeys = secrets.map(s => base64url.decode(s));
    this.signingKey = this.verificationKeys[0];
  }

  // Called when no keys have been generated yet in the dev environment
  private async generateKeys(): Promise<void> {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error(
        'Key generation is not supported outside of the dev environment',
      );
    }

    if (this.privateKeyPromise) {
      return this.privateKeyPromise;
    }

    const promise = (async () => {
      const secret = await generateSecret(TOKEN_ALG);
      const jwk = await exportJWK(secret);
      this.verificationKeys.push(base64url.decode(jwk.k ?? ''));
      this.signingKey = this.verificationKeys[0];
      return;
    })();

    try {
      this.privateKeyPromise = promise;
      await promise;
    } catch (error) {
      // If we fail to generate a new key, we need to clear the state so that
      // the next caller will try to generate another key.
      this.options.logger.error(`Failed to generate new key, ${error}`);
      delete this.privateKeyPromise;
    }

    return promise;
  }

  async getToken(): Promise<{ token: string }> {
    if (!this.verificationKeys.length) {
      await this.generateKeys();
    }

    if (this.currentTokenPromise) {
      return this.currentTokenPromise;
    }

    const result = Promise.resolve().then(async () => {
      const jwt = await new SignJWT({})
        .setProtectedHeader({ alg: TOKEN_ALG })
        .setSubject(TOKEN_SUB)
        .setExpirationTime(
          DateTime.now().plus(TOKEN_EXPIRY_AFTER).toUnixInteger(),
        )
        .sign(this.signingKey);
      return { token: jwt };
    });

    this.currentTokenPromise = result;

    result
      .then(() => {
        setTimeout(() => {
          this.currentTokenPromise = undefined;
        }, TOKEN_REISSUE_AFTER.toMillis());
      })
      .catch(() => {
        this.currentTokenPromise = undefined;
      });

    return result;
  }

  async authenticate(token: string): Promise<void> {
    let verifyError = undefined;

    for (const key of this.verificationKeys) {
      try {
        const {
          protectedHeader: { alg },
          payload: { sub, exp },
        } = await jwtVerify(token, key);

        if (alg !== TOKEN_ALG) {
          throw new AuthenticationError(`Illegal alg "${alg}"`);
        }

        if (sub !== TOKEN_SUB) {
          throw new AuthenticationError(`Illegal sub "${sub}"`);
        }

        if (typeof exp !== 'number') {
          throw new AuthenticationError(
            'Server-to-server token had no exp claim',
          );
        }
        return;
      } catch (e) {
        // Catch the verify exception and continue
        verifyError = e;
      }
    }

    throw new AuthenticationError('Invalid server token', verifyError);
  }
}
