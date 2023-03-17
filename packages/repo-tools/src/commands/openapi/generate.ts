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
import chalk from 'chalk';
import { resolve } from 'path';
import { runner } from './runner';

async function generate(
  directoryPath: string,
  config?: { skipMissingYamlFile: boolean },
) {
  const { skipMissingYamlFile } = config ?? {};
  const openapiPath = resolve(directoryPath, 'openapi.yaml');
  if (!(await fs.pathExists(openapiPath))) {
    if (skipMissingYamlFile) {
      return;
    }
    throw new Error('Could not find openapi.yaml in root of directory.');
  }
  const yaml = YAML.load(await fs.readFile(openapiPath, 'utf8'));

  // For now, we're not adding a header or linting after pasting.
  await fs.writeFile(
    resolve(directoryPath, 'schema/openapi.ts'),
    `export default ${JSON.stringify(yaml, null, 2)} as const`,
  );
}

export async function bulkCommand(paths: string[] = []): Promise<void> {
  const resultsList = await runner(paths, (dir: string) =>
    generate(dir, { skipMissingYamlFile: true }),
  );

  let failed = false;
  for (const { relativeDir, resultText } of resultsList) {
    if (resultText) {
      console.log();
      console.log(
        chalk.red(
          `OpenAPI yaml to Typescript generation failed in ${relativeDir}:`,
        ),
      );
      console.log(resultText.trimStart());

      failed = true;
    }
  }

  if (failed) {
    process.exit(1);
  } else {
    console.log(chalk.green('Generated all files.'));
  }
}
