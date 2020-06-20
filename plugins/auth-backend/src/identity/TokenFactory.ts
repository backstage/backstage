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

import { TokenIssuer, TokenParams, KeyStore, AnyJWK } from './types';
import { JSONWebKey, JWK, JWS } from 'jose';
import { Logger } from 'winston';
import { v4 as uuid } from 'uuid';

const MS_IN_S = 1000;

type Options = {
  logger: Logger;
  /** Value of the issuer claim in issued tokens */
  issuer: string;
  /** Key store used for storing signing keys */
  keyStore: KeyStore;
  /** Expiration time of signing keys in seconds */
  keyDuration: number;
};

export class TokenFactory implements TokenIssuer {
  private readonly issuer: string;
  private readonly logger: Logger;
  private readonly keyStore: KeyStore;
  private readonly keyDuration: number;

  private keyExpiry?: number;
  private privateKeyPromise?: Promise<JSONWebKey>;

  constructor(options: Options) {
    this.issuer = options.issuer;
    this.logger = options.logger;
    this.keyStore = options.keyStore;
    this.keyDuration = options.keyDuration;
  }

  async issueToken(params: TokenParams): Promise<string> {
    const key = await this.getKey();

    const iss = this.issuer;
    const sub = params.claims.sub;
    const aud = 'backstage';
    const iat = (Date.now() / MS_IN_S) | 0;
    const exp = iat + this.keyDuration * MS_IN_S;

    this.logger.info(`Issuing token for ${sub}`);

    return JWS.sign({ iss, sub, aud, iat, exp }, key, {
      alg: key.alg,
      kid: key.kid,
    });
  }

  async listPublicKeys(): Promise<{ keys: AnyJWK[] }> {
    const { items: keys } = await this.keyStore.listKeys();

    const validKeys = [];
    const expiredKeys = [];

    for (const key of keys) {
      // Allow for a grace period of another full key duration before we remove the keys from the database
      const expireAt = key.createdAt.add(3 * this.keyDuration, 'seconds');
      if (expireAt.isBefore()) {
        expiredKeys.push(key);
      } else {
        validKeys.push(key);
      }
    }

    if (expiredKeys.length > 0) {
      const kids = expiredKeys.map(({ key }) => key.kid);

      this.logger.info(`Removing expired signing keys, '${kids.join("', '")}'`);

      // We don't await this, just let it run in the background
      this.keyStore.removeKeys(kids).catch(error => {
        this.logger.error(`Failed to remove expired keys, ${error}`);
      });
    }

    // NOTE: we're currently only storing public keys, but if we start storing private keys we'd have to convert here
    return { keys: validKeys.map(({ key }) => key) };
  }

  private async getKey(): Promise<JSONWebKey> {
    if (this.privateKeyPromise) {
      if (this.keyExpiry && Date.now() < this.keyExpiry) {
        return this.privateKeyPromise;
      }
      this.logger.info(`Signing key has expired, generating new key`);
      delete this.privateKeyPromise;
    }

    this.keyExpiry = Date.now() + this.keyDuration * MS_IN_S;
    const promise = (async () => {
      const key = await JWK.generate('EC', 'P-256', {
        use: 'sig',
        kid: uuid(),
        alg: 'ES256',
      });

      this.logger.info(`Created new signing key ${key.kid}`);
      await this.keyStore.addKey((key.toJWK(false) as unknown) as AnyJWK);

      return key as JSONWebKey;
    })();

    this.privateKeyPromise = promise;

    try {
      // If we fail to generate a new key, we need to clear the state so that
      // the next caller will try to generate another key.
      await promise;
    } catch (error) {
      this.logger.error(`Failed to generate new signing key, ${error}`);
      delete this.keyExpiry;
      delete this.privateKeyPromise;
    }

    return promise;
  }
}
