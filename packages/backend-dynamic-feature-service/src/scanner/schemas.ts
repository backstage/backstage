/*
 * Copyright 2022 The Backstage Authors
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

import { ScannedPluginPackage } from '@backstage/backend-dynamic-feature-service';
import { ConfigSchemaPackageEntry } from '@backstage/config-loader';
import fs from 'fs-extra';
import * as path from 'path';
import * as url from 'url';
import { isEmpty } from 'lodash';
import { LoggerService } from '@backstage/backend-plugin-api';

export async function gatherDynamicPluginsSchemas(
  packages: ScannedPluginPackage[],
  logger: LoggerService,
  schemaLocator: (pluginPackage: ScannedPluginPackage) => string = () =>
    path.join('dist', 'configSchema.json'),
): Promise<ConfigSchemaPackageEntry[]> {
  const allSchemas: { value: any; path: string }[] = [];

  for (const pluginPackage of packages) {
    let schemaLocation = schemaLocator(pluginPackage);

    if (!path.isAbsolute(schemaLocation)) {
      let pluginLocation = url.fileURLToPath(pluginPackage.location);
      if (path.basename(pluginLocation) === 'alpha') {
        pluginLocation = path.dirname(pluginLocation);
      }
      schemaLocation = path.resolve(pluginLocation, schemaLocation);
    }

    if (!(await fs.pathExists(schemaLocation))) {
      continue;
    }

    const serialized = await fs.readJson(schemaLocation);
    if (!serialized) {
      continue;
    }

    if (isEmpty(serialized)) {
      continue;
    }

    if (!serialized?.$schema || serialized?.type !== 'object') {
      logger.error(
        `Serialized configuration schema is invalid for plugin ${pluginPackage.manifest.name}`,
      );
      continue;
    }

    allSchemas.push({
      path: schemaLocation,
      value: serialized,
    });
  }

  return allSchemas;
}
