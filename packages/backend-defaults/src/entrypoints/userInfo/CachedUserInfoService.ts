/*
 * Copyright 2026 The Backstage Authors
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
  BackstageCredentials,
  BackstageUserInfo,
  UserInfoService,
} from '@backstage/backend-plugin-api';
import { toInternalBackstageCredentials } from '../auth/helpers';

const DEFAULT_TTL_MS = 5_000;
const SWEEP_INTERVAL_MS = 30_000;

export type UserInfoCacheEntry = {
  promise: Promise<BackstageUserInfo>;
  expiresAt: number;
};

export class CachedUserInfoService implements UserInfoService {
  readonly #delegate: UserInfoService;
  readonly #entries: Map<string, UserInfoCacheEntry>;
  readonly #ttlMs: number;
  #lastSweep: number = Date.now();

  constructor(
    delegate: UserInfoService,
    options?: {
      entries?: Map<string, UserInfoCacheEntry>;
      ttlMs?: number;
    },
  ) {
    this.#delegate = delegate;
    this.#entries = options?.entries ?? new Map();
    this.#ttlMs = options?.ttlMs ?? DEFAULT_TTL_MS;
  }

  async getUserInfo(
    credentials: BackstageCredentials,
  ): Promise<BackstageUserInfo> {
    const internalCredentials = toInternalBackstageCredentials(credentials);
    const token = internalCredentials.token;
    if (!token) {
      return this.#delegate.getUserInfo(credentials);
    }

    const now = Date.now();

    if (now - this.#lastSweep > SWEEP_INTERVAL_MS) {
      this.#lastSweep = now;
      for (const [key, entry] of this.#entries) {
        if (entry.expiresAt <= now) {
          this.#entries.delete(key);
        }
      }
    }

    const cached = this.#entries.get(token);
    if (cached && cached.expiresAt > now) {
      return cached.promise;
    }

    const promise = this.#delegate.getUserInfo(credentials).catch(error => {
      if (this.#entries.get(token)?.promise === promise) {
        this.#entries.delete(token);
      }
      throw error;
    });

    this.#entries.set(token, {
      promise,
      expiresAt: now + this.#ttlMs,
    });

    return promise;
  }
}
