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

import {
  createRemoteJWKSet,
  errors,
  FlattenedJWSInput,
  GetKeyFunction,
  JWSHeaderParameters,
} from 'jose';

const FORCED_RELOAD_LIMIT = 10;
const FORCED_RELOAD_WINDOW_MS = 60_000;
const KEY_STORE_CACHE_LIMIT = 100;

type RemoteJWKSet = ReturnType<typeof createRemoteJWKSet>;

class JwksKeyStore {
  readonly #resolver: RemoteJWKSet;
  readonly #tryUseForcedReload: () => boolean;

  constructor(endpoint: URL, tryUseForcedReload: () => boolean) {
    this.#resolver = createRemoteJWKSet(endpoint);
    this.#tryUseForcedReload = tryUseForcedReload;
  }

  getKey: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput> = async (
    protectedHeader,
    token,
  ) => {
    const coolingDown = this.#resolver.coolingDown;

    try {
      return await this.#resolver(protectedHeader, token);
    } catch (error) {
      if (!(error instanceof errors.JWKSNoMatchingKey)) {
        throw error;
      }

      if (!coolingDown || !(await this.#reload())) {
        throw error;
      }
      return this.#resolver(protectedHeader, token);
    }
  };

  async #reload(): Promise<boolean> {
    if (!this.#resolver.reloading && !this.#tryUseForcedReload()) {
      return false;
    }
    await this.#resolver.reload();
    return true;
  }
}

export class JwksClient {
  #keyStores = new Map<string, JwksKeyStore>();
  #forcedReloads: number[] = [];

  private readonly getEndpoint: () => Promise<URL>;

  constructor(getEndpoint: () => Promise<URL>) {
    this.getEndpoint = getEndpoint;
  }

  get getKey() {
    return this.#getKey;
  }

  #getKey: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput> = async (
    protectedHeader,
    token,
  ) => {
    const keyStore = await this.#getKeyStore();
    return keyStore.getKey(protectedHeader, token);
  };

  async #getKeyStore(): Promise<JwksKeyStore> {
    const endpoint = await this.getEndpoint();
    let keyStore = this.#keyStores.get(endpoint.href);
    if (keyStore) {
      // Reinsert entries to keep the least recently used endpoint first.
      this.#keyStores.delete(endpoint.href);
    } else {
      keyStore = new JwksKeyStore(endpoint, () => this.#tryUseForcedReload());
    }
    this.#keyStores.set(endpoint.href, keyStore);
    if (this.#keyStores.size > KEY_STORE_CACHE_LIMIT) {
      this.#keyStores.delete(this.#keyStores.keys().next().value!);
    }
    return keyStore;
  }

  #tryUseForcedReload(): boolean {
    const windowStart = Date.now() - FORCED_RELOAD_WINDOW_MS;
    this.#forcedReloads = this.#forcedReloads.filter(
      timestamp => timestamp > windowStart,
    );
    if (this.#forcedReloads.length >= FORCED_RELOAD_LIMIT) {
      return false;
    }
    this.#forcedReloads.push(Date.now());
    return true;
  }
}
