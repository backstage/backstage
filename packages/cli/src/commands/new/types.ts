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
export type ConfigurablePrompt =
  | {
      id: string;
      prompt: string;
      validate?: string;
      default?: string | boolean;
    }
  | string;

export interface Template {
  id: string;
  description?: string;
  template: string;
  templatePath: string;
  targetPath: string;
  prompts?: ConfigurablePrompt[];
  additionalActions?: string[];
}

export interface TemplateLocation {
  id: string;
  target: string;
}
