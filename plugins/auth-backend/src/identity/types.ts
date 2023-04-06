/*
 * Copyright 2020 The Backstage Authors
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

import { JsonValue } from '@backstage/types';

/** Represents any form of serializable JWK */
export interface AnyJWK extends Record<string, string> {
  use: 'sig';
  alg: string;
  kid: string;
  kty: string;
}

/**
 * Parameters used to issue new ID Tokens
 *
 * @public
 */
export type TokenParams = {
  /**
   * The claims that will be embedded within the token. At a minimum, this should include
   * the subject claim, `sub`. It is common to also list entity ownership relations in the
   * `ent` list. Additional claims may also be added at the developer's discretion except
   * for the following list, which will be overwritten by the TokenIssuer: `iss`, `aud`,
   * `iat`, and `exp`. The Backstage team also maintains the right add new claims in the future
   * without listing the change as a "breaking change".
   */
  claims: {
    /** The token subject, i.e. User ID */
    sub: string;
    /** A list of entity references that the user claims ownership through */
    ent?: string[];
  } & Record<string, JsonValue>;
};

/**
 * A TokenIssuer is able to issue verifiable ID Tokens on demand.
 */
export type TokenIssuer = {
  /**
   * Issues a new ID Token
   */
  issueToken(params: TokenParams): Promise<string>;

  /**
   * List all public keys that are currently being used to sign tokens, or have been used
   * in the past within the token expiration time, including a grace period.
   */
  listPublicKeys(): Promise<{ keys: AnyJWK[] }>;
};

/**
 * A JWK stored by a KeyStore
 */
export type StoredKey = {
  key: AnyJWK;
  createdAt: Date;
};

/**
 * A KeyStore stores JWKs for later and shared use.
 */
export type KeyStore = {
  /**
   * Store a new key to be used for signing.
   */
  addKey(key: AnyJWK): Promise<void>;

  /**
   * Remove all keys with the provided kids.
   */
  removeKeys(kids: string[]): Promise<void>;

  /**
   * List all stored keys.
   */
  listKeys(): Promise<{ items: StoredKey[] }>;
};
