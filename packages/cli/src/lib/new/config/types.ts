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

export type NewConfig = {
  /**
   * The pointers to templates that can be used.
   */
  templatePointers: NewTemplatePointer[];

  /**
   * Whether the default set of templates are being used or not.
   */
  isUsingDefaultTemplates: boolean;

  /**
   * Templating globals that should apply to all templates.
   */
  globals: {
    [KName in string]?: number | string | boolean;
  };
};

export type NewTemplatePointer = {
  id: string;
  target: string;
};
