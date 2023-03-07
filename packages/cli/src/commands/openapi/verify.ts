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
import { join } from 'path';
import chalk from 'chalk';
import { relative as relativePath } from 'path';
import { PackageGraph } from '../../lib/monorepo';
import { cloneDeep } from 'lodash';
import SwaggerParser from '@apidevtools/swagger-parser';

async function verify(directoryPath: string) {
  const openapiPath = join(directoryPath, 'openapi.yaml');
  if (!(await fs.pathExists(openapiPath))) {
    return;
  }
  const yaml = YAML.load(await fs.readFile(openapiPath, 'utf8'));
  await SwaggerParser.validate(cloneDeep(yaml));

  const schemaPath = join(directoryPath, 'schema/openapi.ts');
  if (!(await fs.pathExists(schemaPath))) {
    throw new Error('No `schema/openapi.ts` file found.');
  }
  const schema = await import(join(directoryPath, 'schema/openapi'));
  if (schema.default) {
    if (!isEqual(schema.default, yaml)) {
      throw new Error(
        '`openapi.yaml` and `schema/openapi.ts` do not match. Please run `yarn build:openapi` to generate the `schema/openapi.ts` file from the `openapi.yaml` file.',
      );
    }
  } else {
    throw new Error('`schemas/openapi.ts` needs to have a default export.');
  }
}

export async function command() {
  try {
    await verify(paths.resolveTarget('.'));
  } catch (err) {
    console.error(chalk.red(err.message));
    process.exit(1);
  }
}

export async function bulkCommand(): Promise<void> {
  const packages = await PackageGraph.listTargetPackages();

  const resultsList = await Promise.all(
    packages.map(async pkg => {
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
  );

  let failed = false;
  for (const { relativeDir, resultText } of resultsList) {
    if (resultText) {
      console.log();
      console.log(chalk.red(`Lint failed in ${relativeDir}:`));
      console.log(resultText.trimStart());

      failed = true;
    }
  }

  if (failed) {
    process.exit(1);
  }
}
