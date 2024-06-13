/*
 * Copyright 2022 The Backstage Authors
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
 * This is the legacy service for creating and validating tokens. Please migrate to the new `coreServices.auth`, `coreServices.httpAuth`, and `coreServices.userInfo` services as needed instead.
 *
 * See the {@link https://backstage.io/docs/backend-system/core-services/token-manager | service documentation} for more details.
 *
 * @public
 * @deprecated Please {@link https://backstage.io/docs/tutorials/auth-service-migration | migrate} to the new `coreServices.auth`, `coreServices.httpAuth`, and `coreServices.userInfo` services as needed instead.
 */
export interface TokenManagerService {
  /**
   * Fetches a valid token.
   *
   * @remarks
   *
   * Tokens are valid for roughly one hour; the actual deadline is set in the
   * payload `exp` claim. Never hold on to tokens for reuse; always ask for a
   * new one for each outgoing request. This ensures that you always get a
   * valid, fresh one.
   */
  getToken(): Promise<{ token: string }>;

  /**
   * Validates a given token.
   */
  authenticate(token: string): Promise<void>;
}
