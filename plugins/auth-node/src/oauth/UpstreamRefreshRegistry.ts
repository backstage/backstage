/*
 * Copyright 2025 The Backstage Authors
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

import { Request } from 'express';

/**
 * Result of refreshing a token against an upstream auth provider.
 * @public
 */
export interface UpstreamRefreshResult {
  refreshToken?: string;
}

/**
 * Result of authenticating with an upstream auth provider.
 * @public
 */
export interface UpstreamAuthenticateResult {
  refreshToken?: string;
  accessToken: string;
}

/**
 * A function that refreshes a token against an upstream auth provider.
 * @public
 */
export type UpstreamRefreshFn = (
  refreshToken: string,
) => Promise<UpstreamRefreshResult>;

/**
 * Functions for interacting with an upstream auth provider.
 * @public
 */
export interface UpstreamProviderEntry {
  refresh: UpstreamRefreshFn;
  start: (options: {
    scope: string;
    state: string;
    callbackUrl: string;
  }) => Promise<{ url: string }>;
  authenticate: (req: Request) => Promise<UpstreamAuthenticateResult>;
}

/**
 * Callback invoked after a user signs in via an OAuth provider.
 * Used to record which provider a user authenticated with.
 * @public
 */
export type OnSignInCallback = (
  userEntityRef: string,
  providerId: string,
) => Promise<void>;

/**
 * Registry that maps auth provider IDs to their upstream capabilities.
 * Populated during provider router setup, consumed by the OIDC/offline session
 * refresh flow and CIMD approval flow.
 *
 * @public
 */
export class UpstreamRefreshRegistry {
  readonly #providers = new Map<string, UpstreamProviderEntry>();
  readonly #userProviders = new Map<string, string>();
  #onSignIn?: OnSignInCallback;
  #lookupProvider?: (userEntityRef: string) => Promise<string | undefined>;

  register(providerId: string, entry: UpstreamProviderEntry): void {
    this.#providers.set(providerId, entry);
  }

  get(providerId: string): UpstreamProviderEntry | undefined {
    return this.#providers.get(providerId);
  }

  has(providerId: string): boolean {
    return this.#providers.has(providerId);
  }

  setOnSignIn(callback: OnSignInCallback): void {
    this.#onSignIn = callback;
  }

  setProviderLookup(
    lookup: (userEntityRef: string) => Promise<string | undefined>,
  ): void {
    this.#lookupProvider = lookup;
  }

  async recordSignIn(userEntityRef: string, providerId: string): Promise<void> {
    this.#userProviders.set(userEntityRef, providerId);
    await this.#onSignIn?.(userEntityRef, providerId);
  }

  async getProviderForUser(userEntityRef: string): Promise<string | undefined> {
    const cached = this.#userProviders.get(userEntityRef);
    if (cached) {
      return cached;
    }
    const looked = await this.#lookupProvider?.(userEntityRef);
    if (looked) {
      this.#userProviders.set(userEntityRef, looked);
    }
    return looked;
  }
}
