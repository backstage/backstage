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

export interface Config {
  /**
   * Configuration for the AI gateway backend plugin.
   */
  aiGateway?: {
    /**
     * The maximum number of characters allowed across the system prompt,
     * prompt, and messages of a single request. Defaults to 100000.
     */
    maxInputCharacters?: number;

    /**
     * The maximum number of characters allowed in the JSON Schema of a
     * structured output request. Defaults to 20000.
     */
    maxSchemaCharacters?: number;

    /**
     * The maximum number of tokens a single request may generate. Defaults to
     * 4096.
     */
    maxOutputTokens?: number;
  };
}
