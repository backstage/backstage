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
import YAML from 'js-yaml';
import { isEqual, cloneDeep } from 'lodash';
import { join } from 'path';
import chalk from 'chalk';
import { relative as relativePath, resolve as resolvePath } from 'path';
import Parser from '@apidevtools/swagger-parser';
import { runner } from './runner';
import { paths as cliPaths } from '../../lib/paths';

async function verify(directoryPath: string) {
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

  const schema = await import(
    resolvePath(join(directoryPath, 'schema/openapi'))
  );

  if (!schema.default) {
    throw new Error('`schemas/openapi.ts` needs to have a default export.');
  }
  if (!isEqual(schema.default, yaml)) {
    throw new Error(
      `\`openapi.yaml\` and \`schema/openapi.ts\` do not match. Please run \`yarn --cwd ${relativePath(
        cliPaths.targetRoot,
        directoryPath,
      )} schema:openapi:generate\` to regenerate \`schema/openapi.ts\`.`,
    );
  }
}

export async function bulkCommand(paths: string[] = []): Promise<void> {
  console.log(paths);
  const resultsList = await runner(paths, dir => verify(dir));

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
  } else {
    console.log(chalk.green('Verified all files.'));
  }
}
