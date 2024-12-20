/*
 * Copyright 2024 The Backstage Authors
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

import { AuthenticationError } from '@backstage/errors';
import {
  createRemoteJWKSet,
  decodeJwt,
  decodeProtectedHeader,
  FlattenedJWSInput,
  JWSHeaderParameters,
} from 'jose';
import { GetKeyFunction } from 'jose';

const CLOCK_MARGIN_S = 10;

export class JwksClient {
  #keyStore?: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;
  #keyStoreUpdated: number = 0;

  constructor(private readonly getEndpoint: () => Promise<URL>) {}

  get getKey() {
    if (!this.#keyStore) {
      throw new AuthenticationError(
        'refreshKeyStore must be called before jwksClient.getKey',
      );
    }
    return this.#keyStore;
  }

  /**
   * If the last keystore refresh is stale, update the keystore URL to the latest
   */
  async refreshKeyStore(rawJwtToken: string): Promise<void> {
    const payload = await decodeJwt(rawJwtToken);
    const header = await decodeProtectedHeader(rawJwtToken);

    // Refresh public keys if needed
    let keyStoreHasKey;
    try {
      if (this.#keyStore) {
        // Check if the key is present in the keystore
        const [_, rawPayload, rawSignature] = rawJwtToken.split('.');
        keyStoreHasKey = await this.#keyStore(header, {
          payload: rawPayload,
          signature: rawSignature,
        });
      }
    } catch (error) {
      keyStoreHasKey = false;
    }
    // Refresh public key URL if needed
    // Add a small margin in case clocks are out of sync
    const issuedAfterLastRefresh =
      payload?.iat && payload.iat > this.#keyStoreUpdated - CLOCK_MARGIN_S;
    if (!this.#keyStore || (!keyStoreHasKey && issuedAfterLastRefresh)) {
      const endpoint = await this.getEndpoint();
      this.#keyStore = createRemoteJWKSet(endpoint);
      this.#keyStoreUpdated = Date.now() / 1000;
    }
  }
}
