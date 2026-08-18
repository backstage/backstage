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
  errors,
  FlattenedJWSInput,
  GetKeyFunction,
  JWSHeaderParameters,
} from 'jose';

const FORCED_RELOAD_LIMIT = 10;
const FORCED_RELOAD_WINDOW_MS = 60_000;

type RemoteJWKSet = ReturnType<typeof createRemoteJWKSet>;

export class JwksClient {
  #keyStore?: RemoteJWKSet;
  #keyStoreUrl?: string;
  #forcedReloads: number[] = [];
  #forcedReload?: Promise<void>;

  private readonly getEndpoint: () => Promise<URL>;

  constructor(getEndpoint: () => Promise<URL>) {
    this.getEndpoint = getEndpoint;
  }

  get getKey() {
    if (!this.#keyStore) {
      throw new AuthenticationError(
        'refreshKeyStore must be called before jwksClient.getKey',
      );
    }
    return this.#getKey;
  }

  /**
   * Initializes the remote key store using the latest endpoint.
   */
  async refreshKeyStore(): Promise<void> {
    if (!this.#keyStore) {
      const endpoint = await this.getEndpoint();
      if (!this.#keyStore) {
        this.#keyStore = createRemoteJWKSet(endpoint);
        this.#keyStoreUrl = endpoint.href;
      }
    }
  }

  #getKey: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput> = async (
    protectedHeader,
    token,
  ) => {
    const keyStore = this.#keyStore!;
    const coolingDown = keyStore.coolingDown;

    try {
      return await keyStore(protectedHeader, token);
    } catch (error) {
      if (!(error instanceof errors.JWKSNoMatchingKey)) {
        throw error;
      }
      if (this.#keyStore !== keyStore) {
        return this.#keyStore!(protectedHeader, token);
      }

      let endpoint: URL | undefined;
      if (!coolingDown) {
        endpoint = await this.getEndpoint();
        if (this.#keyStore !== keyStore) {
          return this.#keyStore!(protectedHeader, token);
        }
        if (endpoint.href === this.#keyStoreUrl) {
          throw error;
        }
      }
      if (!(await this.#forceReload(endpoint))) {
        throw error;
      }

      return this.#keyStore!(protectedHeader, token);
    }
  };

  async #forceReload(endpoint?: URL): Promise<boolean> {
    if (this.#forcedReload) {
      await this.#forcedReload;
      return true;
    }

    const windowStart = Date.now() - FORCED_RELOAD_WINDOW_MS;
    this.#forcedReloads = this.#forcedReloads.filter(
      timestamp => timestamp > windowStart,
    );
    if (this.#forcedReloads.length >= FORCED_RELOAD_LIMIT) {
      return false;
    }

    const forcedReload = (async () => {
      const latestEndpoint = endpoint ?? (await this.getEndpoint());
      if (latestEndpoint.href !== this.#keyStoreUrl) {
        this.#keyStore = createRemoteJWKSet(latestEndpoint);
        this.#keyStoreUrl = latestEndpoint.href;
      }

      const keyStore = this.#keyStore!;
      if (!keyStore.reloading) {
        this.#forcedReloads.push(Date.now());
      }
      await keyStore.reload();
    })();
    this.#forcedReload = forcedReload;

    try {
      await forcedReload;
      return true;
    } finally {
      this.#forcedReload = undefined;
    }
  }
}
