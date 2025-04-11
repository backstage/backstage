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

import { join as joinPath } from 'path';
import { PortableTemplateInputRoleParams } from '../types';

export type ResolvePackageParamsOptions = {
  roleParams: PortableTemplateInputRoleParams;
  pluginInfix: string;
  packagePrefix: string;
};

export type PortableTemplatePackageInfo = {
  packageName: string;
  packagePath: string;
};

export function resolvePackageParams(
  options: ResolvePackageParamsOptions,
): PortableTemplatePackageInfo {
  const baseName = getBaseNameForRole(options.roleParams);
  const isPlugin = options.roleParams.role.includes('plugin');
  const pluginInfix = isPlugin ? options.pluginInfix : '';
  return {
    packageName: `${options.packagePrefix}${pluginInfix}${baseName}`,
    packagePath: joinPath(isPlugin ? 'plugins' : 'packages', baseName),
  };
}

function getBaseNameForRole(
  roleParams: PortableTemplateInputRoleParams,
): string {
  switch (roleParams.role) {
    case 'web-library':
    case 'node-library':
    case 'common-library':
      return roleParams.name;
    case 'plugin-web-library':
      return `${roleParams.pluginId}-react`;
    case 'plugin-node-library':
      return `${roleParams.pluginId}-node`;
    case 'plugin-common-library':
      return `${roleParams.pluginId}-common`;
    case 'frontend-plugin':
      return `${roleParams.pluginId}`;
    case 'frontend-plugin-module':
      return `${roleParams.pluginId}-module-${roleParams.moduleId}`;
    case 'backend-plugin':
      return `${roleParams.pluginId}-backend`;
    case 'backend-plugin-module':
      return `${roleParams.pluginId}-backend-module-${roleParams.moduleId}`;
    default:
      throw new Error(`Unknown role ${(roleParams as { role: string }).role}`);
  }
}
