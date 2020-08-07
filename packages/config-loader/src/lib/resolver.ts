/*
 * Copyright 2020 Spotify AB
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

import { resolve as resolvePath } from 'path';
import { pathExists } from 'fs-extra';

type ResolveOptions = {
  // Root paths to search for config files. Config from earlier paths has higher priority.
  rootPaths: string[];
};

/**
 * Resolves all configuration files that should be loaded in the given environment.
 *
 * For each root directory, search for the default app-config.yaml, along with suffixed
 * NODE_ENV and local variants, e.g. app-config.production.yaml or app-config.development.local.yaml
 *
 * The priority order of config loaded through suffixes is `env > local > none`, meaning that
 * for example app-config.development.yaml has higher priority than `app-config.local.yaml`.
 *
 */
export async function resolveStaticConfig(
  options: ResolveOptions,
): Promise<string[]> {
  const env = process.env.NODE_ENV ?? 'development';

  const filePaths = [
    `app-config.${env}.local.yaml`,
    `app-config.${env}.yaml`,
    `app-config.local.yaml`,
    `app-config.yaml`,
  ];

  const resolvedPaths = [];

  for (const rootPath of options.rootPaths) {
    for (const filePath of filePaths) {
      const path = resolvePath(rootPath, filePath);
      if (await pathExists(path)) {
        resolvedPaths.push(path);
      }
    }
  }

  return resolvedPaths;
}
