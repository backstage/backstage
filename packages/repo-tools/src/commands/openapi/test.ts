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
import { join } from 'path';
import chalk from 'chalk';
import { runner } from './runner';
import { YAML_SCHEMA_PATH } from './constants';
import { promisify } from 'util';
import { exec as execCb } from 'child_process';
import YAML from 'js-yaml';
import { relative as relativePath } from 'path';
import { paths as cliPaths } from '../../lib/paths';

const exec = promisify(execCb);

async function test(directoryPath: string) {
  const openapiPath = join(directoryPath, YAML_SCHEMA_PATH);
  if (!(await fs.pathExists(openapiPath))) {
    return;
  }
  const opticConfig = YAML.load(
    await fs.readFile(join(cliPaths.targetRoot, 'optic.yml'), 'utf8'),
  );
  const relativeSpecPath = relativePath(cliPaths.targetRoot, openapiPath);
  // Skip any specs that aren't set up for Optic testing.
  if (!(opticConfig as any).capture[relativeSpecPath]) {
    return;
  }
  try {
    await exec(`yarn optic capture ${openapiPath}`, {
      env: process.env,
    });
  } catch (err) {
    // Optic outputs the actual results to stdout, but that will not be added to the message by default.
    err.message = err.stderr + err.stdout;
    err.message = (err.message as string)
      .split('\n')
      // Remove any lines that are emitted during processing and only show output.
      .filter(e => !e.includes('Sending requests to serverPASS'))
      .filter(e => e.trim())
      .join('\n');
    throw err;
  }
}

export async function bulkCommand(paths: string[] = []): Promise<void> {
  const resultsList = await runner(paths, dir => test(dir), {
    // Because we're using 3000 as the default port, we can only have one test running at once.
    concurrencyLimit: 1,
  });

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
