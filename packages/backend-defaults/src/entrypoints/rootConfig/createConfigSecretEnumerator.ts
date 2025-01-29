/*
 * Copyright 2020 The Backstage Authors
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

import { LoggerService } from '@backstage/backend-plugin-api';
import type { Config } from '@backstage/config';
import { ConfigSchema, loadConfigSchema } from '@backstage/config-loader';
import { getPackages } from '@manypkg/get-packages';

import path from 'path';
import fs from 'fs';

export function findClosestPackageJson(searchDir: string): string | undefined {
  let currentPath = searchDir;

  // Some confidence check to avoid infinite loop
  for (let i = 0; i < 1000; i++) {
    const packagePath = path.resolve(currentPath, 'package.json');
    const exists = fs.existsSync(packagePath);
    if (exists) {
      return currentPath;
    }

    const newPath = path.dirname(currentPath);
    if (newPath === currentPath) {
      return undefined;
    }
    currentPath = newPath;
  }

  throw new Error(
    `Iteration limit reached when searching for package.json at ${searchDir}`,
  );
}

/** @public */
export async function createConfigSecretEnumerator(options: {
  logger: LoggerService;
  dir?: string;
  schema?: ConfigSchema;
}): Promise<(config: Config) => Iterable<string>> {
  const { logger, dir } = options;
  let closestPackagePath = process.cwd();
  if (dir) {
    closestPackagePath = dir;
  } else {
    const rootPath = findClosestPackageJson(path.resolve(process.argv[1]));
    if (rootPath) {
      closestPackagePath = rootPath;
    }
  }
  const { packages } = await getPackages(closestPackagePath!);

  const closestPackage = packages.find(p => p.dir === closestPackagePath);

  // loadConfigSchema expects a list of dependencies that it can discover through node_modules,
  //  the closest package is not guaranteed to show up in node_modules and may not be resolved
  //  so we pass guaranteed node_modules items.
  const dependencies = Object.keys({
    ...closestPackage?.packageJson.dependencies,
    ...closestPackage?.packageJson.devDependencies,
    ...closestPackage?.packageJson.peerDependencies,
    ...closestPackage?.packageJson.optionalDependencies,
  });
  const schema =
    options.schema ??
    (await loadConfigSchema({
      dependencies,
    }));

  return (config: Config) => {
    const [secretsData] = schema.process(
      [{ data: config.getOptional() ?? {}, context: 'schema-enumerator' }],
      {
        visibility: ['secret'],
        ignoreSchemaErrors: true,
      },
    );
    const secrets = new Set<string>();
    JSON.parse(
      JSON.stringify(secretsData.data),
      (_, v) => typeof v === 'string' && secrets.add(v),
    );
    logger.info(
      `Found ${secrets.size} new secrets in config that will be redacted`,
    );
    return secrets;
  };
}
