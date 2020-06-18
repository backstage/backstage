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

export interface PublicKey extends Record<string, string> {
  use: 'sig' | 'enc';
  alg: string;
  kid: string;
  kty: string;
}

export type KeyStore = {
  addPublicKey(key: PublicKey): Promise<void>;

  listPublicKeys(): Promise<PublicKey[]>;
};

export type TokenParams = {
  sub: string;
};

export type TokenIssuer = {
  issueToken(claims: TokenParams): Promise<string>;
};
