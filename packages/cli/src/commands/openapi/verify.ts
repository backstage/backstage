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

import fs from 'fs-extra';
import { paths } from '../../lib/paths';
import YAML from 'js-yaml';
import { isEqual } from 'lodash';
import { join, resolve } from 'path';
import chalk from 'chalk';
import { relative as relativePath } from 'path';
import { PackageGraph } from '../../lib/monorepo';
import { cloneDeep } from 'lodash';
import Parser from '@apidevtools/swagger-parser';
import { detectRoleFromPackage } from '../../lib/role';
import pLimit from 'p-limit';

const SUPPORTED_ROLES = [
  'backend',
  'backend-plugin',
  'backend-plugin-module',
  'node-library',
];

async function verify(
  directoryPath: string,
  config: { checkRole: boolean } = { checkRole: false },
) {
  const { checkRole } = config ?? {};
  if (checkRole) {
    const role = detectRoleFromPackage(
      await fs.readJson(resolve(directoryPath, 'package.json')),
    );

    if (!role || !SUPPORTED_ROLES.includes(role)) {
      console.log(chalk.red(`Unsupported role ${role}`));
      process.exit(1);
    }
  }

  const openapiPath = join(directoryPath, 'openapi.yaml');
  if (!(await fs.pathExists(openapiPath))) {
    return;
  }

  const yaml = YAML.load(await fs.readFile(openapiPath, 'utf8'));
  await Parser.validate(cloneDeep(yaml) as any);

  const schemaPath = join(directoryPath, 'schema/openapi.ts');
  if (!(await fs.pathExists(schemaPath))) {
    throw new Error('No `schema/openapi.ts` file found.');
  }
  const schema = await import(join(directoryPath, 'schema/openapi'));
  if (!schema.default) {
    throw new Error('`schemas/openapi.ts` needs to have a default export.');
  }
  if (!isEqual(schema.default, yaml)) {
    throw new Error(
      `\`openapi.yaml\` and \`schema/openapi.ts\` do not match. Please run \`yarn --cwd ${relativePath(
        paths.targetRoot,
        directoryPath,
      )} schema:openapi:generate\` to regenerate \`schema/openapi.ts\`.`,
    );
  }
}

export async function command() {
  try {
    await verify(paths.resolveTarget('.'), { checkRole: true });
    console.log(chalk.green('OpenAPI files are valid.'));
  } catch (err) {
    console.error(chalk.red(err.message));
    process.exit(1);
  }
}

export async function bulkCommand(): Promise<void> {
  const packages = await PackageGraph.listTargetPackages();
  const limit = pLimit(5);

  const resultsList = await Promise.all(
    packages.map(pkg =>
      limit(async () => {
        let resultText = '';
        try {
          await verify(pkg.dir);
        } catch (err) {
          resultText = err.message;
        }

        return {
          relativeDir: relativePath(paths.targetRoot, pkg.dir),
          resultText,
        };
      }),
    ),
  );

  let failed = false;
  for (const { relativeDir, resultText } of resultsList) {
    if (resultText) {
      console.log();
      console.log(chalk.red(`OpenAPI validation failed in ${relativeDir}:`));
      console.log(resultText.trimStart());

      failed = true;
    }
  }

  if (failed) {
    process.exit(1);
  }
}
