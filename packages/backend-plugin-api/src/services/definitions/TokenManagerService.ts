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
 * Interface for creating and validating tokens.
 *
 * @public
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
