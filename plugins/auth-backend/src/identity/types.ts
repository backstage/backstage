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

export interface AnyJWK extends Record<string, string> {
  use: 'sig';
  alg: string;
  kid: string;
  kty: string;
}

export type KeyStore = {
  storeKey(params: { key: AnyJWK }): Promise<void>;

  listKeys(): Promise<{ keys: AnyJWK[] }>;
};

export type TokenParams = {
  claims: {
    sub: string;
  };
};

export type TokenIssuer = {
  issueToken(params: TokenParams): Promise<string>;
};
