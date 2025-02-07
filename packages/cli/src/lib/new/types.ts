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

export type PortableTemplateConfig = {
  /**
   * The pointers to templates that can be used.
   */
  templatePointers: PortableTemplatePointer[];

  /**
   * Whether the default set of templates are being used or not.
   */
  isUsingDefaultTemplates: boolean;

  /**
   * Templating globals that should apply to all templates.
   */
  globals: PortableTemplateGlobals;
};

export type PortableTemplatePointer = {
  id: string;
  target: string;
};

export type PortableTemplatePrompt = {
  id: string;
  prompt: string;
  validate?: string;
  default?: string | boolean | number;
};

export const TEMPLATE_ROLES = [
  'web-library',
  'node-library',
  'common-library',
  'plugin-web-library',
  'plugin-node-library',
  'plugin-common-library',
  'frontend-plugin',
  'frontend-plugin-module',
  'backend-plugin',
  'backend-plugin-module',
] as const;

export type PortableTemplateRole = (typeof TEMPLATE_ROLES)[number];

export type PortableTemplate = {
  id: string;
  description?: string;
  templatePath: string;
  targetPath: string;
  role: PortableTemplateRole;
  prompts?: PortableTemplatePrompt[];
  additionalActions?: string[];
};

export type PortableTemplateParams = {
  [KName in string]?: string | number | boolean;
};

export type PortableTemplateGlobals = {
  license?: string;
  baseVersion?: string;
  private?: boolean;
  scope?: string;
};

export type PortableTemplateInputRoleParams =
  | {
      role: 'web-library' | 'node-library' | 'common-library';
      name: string;
    }
  | {
      role:
        | 'plugin-web-library'
        | 'plugin-node-library'
        | 'plugin-common-library'
        | 'frontend-plugin'
        | 'backend-plugin';
      pluginId: string;
    }
  | {
      role: 'frontend-plugin-module' | 'backend-plugin-module';
      pluginId: string;
      moduleId: string;
    };

export type PortableTemplateInputBuiltInParams = {
  owner?: string;
};

export type PortableTemplateInput = {
  roleParams: PortableTemplateInputRoleParams;
  builtInParams: PortableTemplateInputBuiltInParams;
  params: PortableTemplateParams;
  globals: PortableTemplateParams;
};
