/*
 * Copyright 2023 The Backstage Authors
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

import { AnyJWK, TokenIssuer } from './types';
import { JWK } from 'jose';
import { LoggerService } from '@backstage/backend-plugin-api';
import { StaticKeyStore } from './StaticKeyStore';
import {
  BackstageSignInResult,
  TokenParams,
} from '@backstage/plugin-auth-node';
import { issueUserToken } from './issueUserToken';

export type Config = {
  publicKeyFile: string;
  privateKeyFile: string;
  keyId: string;
  algorithm?: string;
};

export type Options = {
  logger: LoggerService;
  /** Value of the issuer claim in issued tokens */
  issuer: string;
  /** Expiration time of the JWT in seconds */
  sessionExpirationSeconds: number;
  /**
   * A list of claims to omit from issued tokens and only store in the user info database
   */
  omitClaimsFromToken?: string[];
};

/**
 * A token issuer that issues tokens from predefined
 * public/private key pair stored in the static key store.
 */
export class StaticTokenIssuer implements TokenIssuer {
  private readonly issuer: string;
  private readonly logger: LoggerService;
  private readonly keyStore: StaticKeyStore;
  private readonly sessionExpirationSeconds: number;
  private readonly omitClaimsFromToken?: string[];

  public constructor(options: Options, keyStore: StaticKeyStore) {
    this.issuer = options.issuer;
    this.logger = options.logger;
    this.sessionExpirationSeconds = options.sessionExpirationSeconds;
    this.keyStore = keyStore;
    this.omitClaimsFromToken = options.omitClaimsFromToken;
  }

  public async issueToken(
    params: TokenParams & { claims: { ent: string[] } },
  ): Promise<BackstageSignInResult> {
    const key = await this.getSigningKey();

    return issueUserToken({
      issuer: this.issuer,
      key,
      keyDurationSeconds: this.sessionExpirationSeconds,
      logger: this.logger,
      omitClaimsFromToken: this.omitClaimsFromToken,
      params,
    });
  }

  private async getSigningKey(): Promise<JWK> {
    const { items: keys } = await this.keyStore.listKeys();
    if (keys.length >= 1) {
      return this.keyStore.getPrivateKey(keys[0].key.kid);
    }
    throw new Error('Keystore should hold at least 1 key');
  }

  public async listPublicKeys(): Promise<{ keys: AnyJWK[] }> {
    const { items: keys } = await this.keyStore.listKeys();
    return { keys: keys.map(({ key }) => key) };
  }
}
