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
import { runner } from '../../../../lib/runner';
import { YAML_SCHEMA_PATH } from '../../../../lib/openapi/constants';
import { paths as cliPaths } from '../../../../lib/paths';
import { exec } from '../../../../lib/exec';
import { getPathToOpenApiSpec } from '../../../../lib/openapi/helpers';

async function test(
  directoryPath: string,
  { port }: { port: number },
  options?: { update?: boolean },
) {
  let openapiPath = join(directoryPath, YAML_SCHEMA_PATH);
  try {
    openapiPath = await getPathToOpenApiSpec(directoryPath);
  } catch {
    // OpenAPI schema doesn't exist.
    return;
  }
  const opticConfigFilePath = join(directoryPath, 'optic.yml');
  if (!(await fs.pathExists(opticConfigFilePath))) {
    return;
  }
  let opticLocation = '';
  try {
    opticLocation = (
      await exec(`yarn bin optic`, [], { cwd: cliPaths.ownRoot })
    ).stdout as string;
  } catch (err) {
    throw new Error(
      `Failed to find an Optic CLI installation, ensure that you have @useoptic/optic installed in the root of your repo. If not, run yarn add @useoptic/optic from the root of your repo.`,
    );
  }
  try {
    await exec(
      `${opticLocation.trim()} capture`,
      [
        YAML_SCHEMA_PATH,
        '--server-override',
        `http://localhost:${port}`,
        options?.update ? '--update' : '',
      ],
      {
        cwd: directoryPath,
        env: {
          ...process.env,
          PORT: `${port}`,
        },
      },
    );
  } catch (err) {
    // Optic outputs the actual results to stdout, but that will not be added to the message by default.
    err.message = err.stderr + err.stdout;
    err.message = (err.message as string)
      .split('\n')
      .map(e => e.replace(/.{1} Sending requests to server/, ''))
      // Remove any lines that are emitted during processing and only show output.
      .filter(e => !e.includes('PASS'))
      .filter(e => e.trim())
      .join('\n');
    throw err;
  }
  if (
    (await cliPaths.resolveTargetRoot('node_modules/.bin/prettier')) &&
    options?.update
  ) {
    await exec(`yarn prettier`, ['--write', openapiPath]);
  }
}

export async function bulkCommand(
  paths: string[] = [],
  options: { update?: boolean },
): Promise<void> {
  const resultsList = await runner(
    paths,
    (dir, runnerOptions) => test(dir, runnerOptions!, options),
    {
      concurrencyLimit: 1,
      startingPort: 9_000,
    },
  );

  let failed = false;
  for (const { relativeDir, resultText } of resultsList) {
    if (resultText) {
      console.log();
      console.log(
        chalk.red(
          `OpenAPI runtime validation against tests failed in ${relativeDir}:`,
        ),
      );
      console.log(resultText.trimStart());

      failed = true;
    }
  }

  if (failed) {
    process.exit(1);
  } else {
    console.log(chalk.green('Verified all specifications against test data.'));
  }
}
