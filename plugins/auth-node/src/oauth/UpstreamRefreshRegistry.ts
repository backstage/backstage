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

/**
 * Result of refreshing a token against an upstream auth provider.
 * @public
 */
export interface UpstreamRefreshResult {
  refreshToken?: string;
}

/**
 * A function that refreshes a token against an upstream auth provider.
 * @public
 */
export type UpstreamRefreshFn = (
  refreshToken: string,
) => Promise<UpstreamRefreshResult>;

/**
 * Callback invoked when an upstream auth flow completes during CIMD/DCR
 * approval. Returns the redirect URL for the CLI client.
 * @public
 */
export type OnUpstreamAuthCompleteCallback = (options: {
  sessionId: string;
  refreshToken: string;
}) => Promise<string>;

/**
 * Functions for interacting with an upstream auth provider.
 * @public
 */
export interface UpstreamProviderEntry {
  refresh: UpstreamRefreshFn;
  start: (options: {
    scope: string;
    sessionId: string;
  }) => Promise<{ url: string }>;
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
  #onSignIn?: OnSignInCallback;
  #onUpstreamAuthComplete?: OnUpstreamAuthCompleteCallback;

  register(providerId: string, entry: UpstreamProviderEntry): void {
    this.#providers.set(providerId, entry);
  }

  get(providerId: string): UpstreamProviderEntry | undefined {
    return this.#providers.get(providerId);
  }

  setOnSignIn(callback: OnSignInCallback): void {
    this.#onSignIn = callback;
  }

  async recordSignIn(userEntityRef: string, providerId: string): Promise<void> {
    await this.#onSignIn?.(userEntityRef, providerId);
  }

  setOnUpstreamAuthComplete(callback: OnUpstreamAuthCompleteCallback): void {
    this.#onUpstreamAuthComplete = callback;
  }

  async completeUpstreamAuth(options: {
    sessionId: string;
    refreshToken: string;
  }): Promise<string> {
    if (!this.#onUpstreamAuthComplete) {
      throw new Error('No upstream auth completion handler registered');
    }
    return this.#onUpstreamAuthComplete(options);
  }
}
