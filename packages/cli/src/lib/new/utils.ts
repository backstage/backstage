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
import fs from 'fs-extra';
import { paths } from '../paths';
import { Template } from './types';

interface Options extends Record<string, string | boolean> {
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
  const { baseName, scope: _scope, plugin } = options;
  if (_scope) {
    const scope = _scope.replace(/@/g, '');
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

async function calculateBaseVersion(baseVersion: string) {
  if (!baseVersion) {
    const lernaVersion = await fs
      .readJson(paths.resolveTargetRoot('lerna.json'))
      .then(pkg => pkg.version)
      .catch(() => undefined);
    if (lernaVersion) {
      return lernaVersion;
    }
    return '0.1.0';
  }
  return baseVersion;
}

export async function populateOptions(
  prompts: Record<string, string>,
  template: Template,
): Promise<Options> {
  return {
    id: prompts.id ?? '',
    private: !!prompts.private,
    baseVersion: await calculateBaseVersion(prompts.baseVersion),
    owner: prompts.owner ?? '',
    license: prompts.license ?? 'Apache-2.0',
    targetPath: prompts.targetPath ?? template.targetPath,
    scope: prompts.scope ?? '',
    moduleId: prompts.moduleId ?? '',
    ...prompts,
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
