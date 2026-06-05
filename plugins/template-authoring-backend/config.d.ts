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
  templateAuthoring?: {
    /**
     * Anthropic model id to use for template generation.
     * Defaults to "claude-sonnet-4-6".
     */
    model?: string;
    /**
     * Anthropic API key.
     * @visibility secret
     */
    anthropicApiKey?: string;
    /**
     * Maximum reference templates the caller may pass.
     * Defaults to 3.
     */
    maxReferenceTemplates?: number;
    /**
     * Default owner string injected into the generated template when the
     * model does not produce one. Defaults to "group:default/unowned".
     */
    defaultOwner?: string;
  };
}
