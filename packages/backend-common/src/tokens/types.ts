/*
 * Copyright 2021 The Backstage Authors
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
 * A (pluginId, token) pair.
 *
 * @public
 */
export type ServerIdentity = {
  /**
   * The ID of the plugin backend to which this
   * identity corresponds.
   */
  pluginId: string;

  /**
   * The token used to authenticate the plugin backend.
   */
  token: string;
};

/**
 * Interface for creating and validating tokens.
 *
 * @public
 */
export interface TokenManager {
  getToken: (pluginId: string) => Promise<{ token: string }>;
  authenticate: (token: string) => Promise<ServerIdentity | undefined>;
}
