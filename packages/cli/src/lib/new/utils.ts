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
import { OptionValues } from 'commander';
import { Template } from './types';

export interface Options extends Record<string, string | boolean> {
  id: string;
  private: boolean;
  baseVersion: string;
  license: string;
  targetPath: string;
  owner: string;
  scope: string;
  moduleId: string;
}

export const resolvePackageName = (options: {
  baseName: string;
  scope?: string;
  plugin: boolean;
}) => {
  const { baseName, scope, plugin } = options;
  if (scope) {
    if (plugin) {
      const pluginName = scope.startsWith('backstage')
        ? 'plugin'
        : 'backstage-plugin';
      return scope.includes('/')
        ? `@${scope}${pluginName}-${baseName}`
        : `@${scope}/${pluginName}-${baseName}`;
    }
    return scope.includes('/')
      ? `@${scope}${baseName}`
      : `@${scope}/${baseName}`;
  }

  return plugin ? `backstage-plugin-${baseName}` : baseName;
};

export function populateOptions(
  options: Record<string, string>,
  template: Template,
  argOpts?: OptionValues,
): Options {
  return {
    id: '',
    owner: '',
    license: 'Apache-2.0',
    scope: '',
    moduleId: '',
    baseVersion: '0.1.0',
    private: true,
    ...options,
    ...argOpts,
    targetPath: template.targetPath,
  };
}

export function createDirName(template: Template, options: Options) {
  if (!options.id) {
    throw new Error(`id prompt is mandatory for all cli templates`);
  }
  if (template.backendModulePrefix) {
    if (!options.moduleId) {
      throw new Error(`backendModulePrefix requires moduleId prompt`);
    }
    return `${options.id}-backend-module-${options.moduleId}`;
  } else if (template.suffix) {
    return `${options.id}-${template.suffix}`;
  }
  return options.id;
}
