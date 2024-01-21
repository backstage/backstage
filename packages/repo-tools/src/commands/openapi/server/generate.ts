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

import chalk from 'chalk';
import { resolve } from 'path';
import { OPENAPI_IGNORE_FILES, OUTPUT_PATH } from '../constants';
import { paths as cliPaths } from '../../../lib/paths';
import { mkdirpSync } from 'fs-extra';
import fs from 'fs-extra';
import { exec } from '../../../lib/exec';
import { resolvePackagePath } from '@backstage/backend-common';

async function generate(spec: string, outputDirectory: string) {
  const resolvedOpenapiPath = resolve(spec);
  const resolvedOutputDirectory = resolve(outputDirectory, OUTPUT_PATH);
  mkdirpSync(resolvedOutputDirectory);

  await fs.mkdirp(resolvedOutputDirectory);

  await fs.writeFile(
    resolve(resolvedOutputDirectory, '.openapi-generator-ignore'),
    OPENAPI_IGNORE_FILES.join('\n'),
  );

  await exec(
    'node',
    [
      resolvePackagePath('@openapitools/openapi-generator-cli', 'main.js'),
      'generate',
      '-i',
      resolvedOpenapiPath,
      '-o',
      resolvedOutputDirectory,
      '-g',
      'typescript',
      '-c',
      resolvePackagePath(
        '@backstage/repo-tools',
        'templates/typescript-backstage.server.yaml',
      ),
      `--additional-properties=clientPackageName=@backstage/catalog-client`,
      '--generator-key',
      'v3.0',
    ],
    {
      maxBuffer: Number.MAX_VALUE,
      cwd: resolvePackagePath('@backstage/repo-tools'),
      env: {
        ...process.env,
      },
    },
  );

  await exec(
    `yarn backstage-cli package lint --fix ${resolvedOutputDirectory}`,
  );

  const prettier = cliPaths.resolveTargetRoot('node_modules/.bin/prettier');
  if (prettier) {
    await exec(`${prettier} --write ${resolvedOutputDirectory}`);
  }

  fs.removeSync(resolve(resolvedOutputDirectory, '.openapi-generator-ignore'));

  fs.rmSync(resolve(resolvedOutputDirectory, '.openapi-generator'), {
    recursive: true,
    force: true,
  });
}

export async function singleCommand({
  inputSpec,
  outputDirectory,
}: {
  inputSpec: string;
  outputDirectory: string;
}): Promise<void> {
  try {
    await generate(inputSpec, outputDirectory);
    console.log(chalk.green(`Generated client for ${inputSpec}`));
  } catch (err) {
    console.log();
    console.log(chalk.red(`Client generation failed in ${outputDirectory}:`));
    console.log(err);

    process.exit(1);
  }
}
