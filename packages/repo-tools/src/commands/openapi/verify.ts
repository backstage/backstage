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
import { TS_MODULE, TS_SCHEMA_PATH, YAML_SCHEMA_PATH } from './constants';

async function verify(directoryPath: string) {
  const openapiPath = join(directoryPath, YAML_SCHEMA_PATH);
  if (!(await fs.pathExists(openapiPath))) {
    return;
  }

  const yaml = YAML.load(await fs.readFile(openapiPath, 'utf8'));
  await Parser.validate(cloneDeep(yaml) as any);

  const schemaPath = join(directoryPath, TS_SCHEMA_PATH);
  if (!(await fs.pathExists(schemaPath))) {
    throw new Error(`No \`${TS_SCHEMA_PATH}\` file found.`);
  }

  const schema = await import(resolvePath(join(directoryPath, TS_MODULE)));

  if (!schema.default) {
    throw new Error(`\`${TS_SCHEMA_PATH}\` needs to have a default export.`);
  }
  if (!isEqual(schema.default, yaml)) {
    throw new Error(
      `\`${YAML_SCHEMA_PATH}\` and \`${TS_SCHEMA_PATH}\` do not match. Please run \`yarn --cwd ${relativePath(
        cliPaths.targetRoot,
        directoryPath,
      )} schema:openapi:generate\` to regenerate \`${TS_SCHEMA_PATH}\`.`,
    );
  }
}

export async function bulkCommand(paths: string[] = []): Promise<void> {
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
