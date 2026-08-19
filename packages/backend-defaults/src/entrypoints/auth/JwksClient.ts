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

type RemoteJWKSet = ReturnType<typeof createRemoteJWKSet>;

class JwksKeyStore {
  readonly #resolver: RemoteJWKSet;
  readonly #getLatestKeyStore: () => Promise<JwksKeyStore>;
  readonly #tryUseForcedReload: () => boolean;

  constructor(
    endpoint: URL,
    getLatestKeyStore: () => Promise<JwksKeyStore>,
    tryUseForcedReload: () => boolean,
  ) {
    this.#resolver = createRemoteJWKSet(endpoint);
    this.#getLatestKeyStore = getLatestKeyStore;
    this.#tryUseForcedReload = tryUseForcedReload;
  }

  getKey: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput> = (
    protectedHeader,
    token,
  ) => this.#getKey(protectedHeader, token, true);

  async #getKey(
    protectedHeader: JWSHeaderParameters,
    token: FlattenedJWSInput,
    resolveLatestEndpoint: boolean,
  ): ReturnType<RemoteJWKSet> {
    const coolingDown = this.#resolver.coolingDown;

    try {
      return await this.#resolver(protectedHeader, token);
    } catch (error) {
      if (!(error instanceof errors.JWKSNoMatchingKey)) {
        throw error;
      }

      if (resolveLatestEndpoint) {
        const latestKeyStore = await this.#getLatestKeyStore();
        if (latestKeyStore !== this) {
          return latestKeyStore.#getKey(protectedHeader, token, false);
        }
      }

      if (!coolingDown || !(await this.#reload())) {
        throw error;
      }
      return this.#resolver(protectedHeader, token);
    }
  }

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
  #currentKeyStore?: JwksKeyStore;
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
    const keyStore = this.#currentKeyStore ?? (await this.#getLatestKeyStore());
    return keyStore.getKey(protectedHeader, token);
  };

  async #getLatestKeyStore(): Promise<JwksKeyStore> {
    const endpoint = await this.getEndpoint();
    let keyStore = this.#keyStores.get(endpoint.href);
    if (!keyStore) {
      keyStore = new JwksKeyStore(
        endpoint,
        () => this.#getLatestKeyStore(),
        () => this.#tryUseForcedReload(),
      );
      this.#keyStores.set(endpoint.href, keyStore);
    }
    this.#currentKeyStore = keyStore;
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
