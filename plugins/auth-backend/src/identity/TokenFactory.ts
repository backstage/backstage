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

import { TokenIssuer, TokenParams, KeyStore, PublicKey } from './types';
import { JSONWebKey, JWK, JWS } from 'jose';
import { Logger } from 'winston';

const KEY_DURATION_MS = 3600 * 1000;

type Options = {
  issuer: string;
  logger: Logger;
  keyStore: KeyStore;
};

export class TokenFactory implements TokenIssuer {
  private readonly issuer: string;
  private readonly logger: Logger;
  private readonly keyStore: KeyStore;

  private keyExpiry?: number;
  private privateKeyPromise?: Promise<JSONWebKey>;

  constructor(options: Options) {
    const { issuer, logger, keyStore } = options;
    this.issuer = issuer;
    this.keyStore = keyStore;
    this.logger = logger.child({ service: 'issuer' });
  }

  async issueToken(claims: TokenParams): Promise<string> {
    const key = await this.getKey();

    const iss = this.issuer;
    const sub = claims.sub;
    const aud = 'backstage';
    const iat = (Date.now() / 1000) | 0;
    const exp = iat + 3600;

    this.logger.info(`Issuing token for ${sub}`);

    return JWS.sign({ iss, sub, aud, iat, exp }, key, {
      alg: key.alg,
      kid: key.kid,
    });
  }

  private async getKey(): Promise<JSONWebKey> {
    if (this.privateKeyPromise) {
      if (this.keyExpiry && Date.now() < this.keyExpiry) {
        return this.privateKeyPromise;
      }
      this.logger.info(`Signing key has expired, generating new key`);
      delete this.privateKeyPromise;
    }

    this.keyExpiry = Date.now() + KEY_DURATION_MS;
    const promise = (async () => {
      const dateStr = new Date().toISOString();
      const randStr = Math.random().toString(36).slice(2, 6);
      const kid = `key-${dateStr}-${randStr}`;

      const key = await JWK.generate('EC', 'P-384', { use: 'sig', kid });

      await this.keyStore.addPublicKey(
        (key.toJWK(false) as unknown) as PublicKey,
      );

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
