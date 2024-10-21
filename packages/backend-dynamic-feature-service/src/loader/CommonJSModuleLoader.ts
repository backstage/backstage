/*
 * Copyright 2023 The Backstage Authors
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
import { ModuleLoader } from './types';
import { LoggerService } from '@backstage/backend-plugin-api';
import path from 'path';

export class CommonJSModuleLoader implements ModuleLoader {
  private module: any;

  constructor(public readonly logger: LoggerService) {
    this.module = require('node:module');
  }

  async bootstrap(
    backstageRoot: string,
    dynamicPluginsPaths: string[],
  ): Promise<void> {
    const backstageRootNodeModulesPath = `${backstageRoot}/node_modules`;
    const dynamicNodeModulesPaths = [
      ...dynamicPluginsPaths.map(p => path.resolve(p, 'node_modules')),
    ];
    const oldNodeModulePaths = this.module._nodeModulePaths;
    this.module._nodeModulePaths = (from: string): string[] => {
      const result: string[] = oldNodeModulePaths(from);
      if (!dynamicPluginsPaths.some(p => from.startsWith(p))) {
        return result;
      }
      const filtered = result.filter(nodeModulePath => {
        return (
          nodeModulePath === backstageRootNodeModulesPath ||
          dynamicNodeModulesPaths.some(p => nodeModulePath.startsWith(p))
        );
      });
      this.logger.debug(
        `Overriding node_modules search path for dynamic plugin ${from} to: ${filtered}`,
      );
      return filtered;
    };
  }

  async load(packagePath: string): Promise<any> {
    return await this.module.prototype.require(packagePath);
  }
}
