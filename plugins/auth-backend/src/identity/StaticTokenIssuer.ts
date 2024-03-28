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
import { SignJWT, importJWK, JWK } from 'jose';
import { parseEntityRef } from '@backstage/catalog-model';
import { AuthenticationError } from '@backstage/errors';
import { LoggerService } from '@backstage/backend-plugin-api';
import { StaticKeyStore } from './StaticKeyStore';
import { TokenParams } from '@backstage/plugin-auth-node';

const MS_IN_S = 1000;

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

  public constructor(options: Options, keyStore: StaticKeyStore) {
    this.issuer = options.issuer;
    this.logger = options.logger;
    this.sessionExpirationSeconds = options.sessionExpirationSeconds;
    this.keyStore = keyStore;
  }

  public async issueToken(params: TokenParams): Promise<string> {
    const key = await this.getSigningKey();

    // TODO: code shared with TokenFactory.ts
    const iss = this.issuer;
    const { sub, ent, ...additionalClaims } = params.claims;
    const aud = 'backstage';
    const iat = Math.floor(Date.now() / MS_IN_S);
    const exp = iat + this.sessionExpirationSeconds;

    // Validate that the subject claim is a valid EntityRef
    try {
      parseEntityRef(sub);
    } catch (error) {
      throw new Error(
        '"sub" claim provided by the auth resolver is not a valid EntityRef.',
      );
    }

    this.logger.info(`Issuing token for ${sub}, with entities ${ent ?? []}`);

    if (!key.alg) {
      throw new AuthenticationError('No algorithm was provided in the key');
    }

    return new SignJWT({ ...additionalClaims, iss, sub, ent, aud, iat, exp })
      .setProtectedHeader({ alg: key.alg, kid: key.kid })
      .setIssuer(iss)
      .setAudience(aud)
      .setSubject(sub)
      .setIssuedAt(iat)
      .setExpirationTime(exp)
      .sign(await importJWK(key));
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
