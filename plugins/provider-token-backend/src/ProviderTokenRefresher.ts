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

/**
 * Result of a provider-specific token refresh operation.
 * @public
 */
export interface RefreshResult {
  accessToken: string;
  /** Provider may or may not rotate the refresh token. If absent, keep the existing token. */
  refreshToken?: string;
  expiresInSeconds?: number;
  /** Scope may not be returned by all providers on refresh. */
  scope?: string;
}

/**
 * Provider-specific OAuth token refresh logic.
 * One implementation per OAuth provider.
 *
 * SECURITY: Implementations MUST NOT log token values or include them in Error messages.
 *
 * @public
 */
export interface ProviderTokenRefresher {
  readonly providerId: string;
  refresh(refreshToken: string): Promise<RefreshResult>;
}
