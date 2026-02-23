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

import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import yaml from 'yaml';
import z from 'zod';
import { paths } from '../../../lib/paths';
import { run } from '@backstage/cli-common';

const yarnRcSchema = z.object({
  plugins: z
    .array(
      z.object({
        path: z.string(),
      }),
    )
    .optional(),
});

export async function getHasYarnPlugin() {
  const yarnRcPath = paths.resolveTargetRoot('.yarnrc.yml');
  const yarnRcContent = await fs.readFile(yarnRcPath, 'utf-8').catch(e => {
    if (e.code === 'ENOENT') {
      // gracefully continue in case the file doesn't exist
      return '';
    }
    throw e;
  });

  if (!yarnRcContent) {
    return false;
  }

  const parseResult = yarnRcSchema.safeParse(yaml.parse(yarnRcContent));

  if (!parseResult.success) {
    throw new Error(
      `Unexpected content in .yarnrc.yml: ${parseResult.error.toString()}`,
    );
  }

  const yarnRc = parseResult.data;

  return yarnRc.plugins?.some(
    plugin => plugin.path === '.yarn/plugins/@yarnpkg/plugin-backstage.cjs',
  );
}

export async function runYarnInstall() {
  const spinner = ora({
    prefixText: `Running ${chalk.blue('yarn install')} to install new versions`,
    spinner: 'arc',
    color: 'green',
  }).start();

  const installOutput = new Array<Buffer>();
  try {
    await run(['yarn', 'install'], {
      env: {
        FORCE_COLOR: 'true',
        // We filter out all npm_* environment variables that are added when
        // executing through yarn. This works around an issue where these variables
        // incorrectly override local yarn or npm config in the project directory.
        ...Object.fromEntries(
          Object.entries(process.env).map(([name, value]) =>
            name.startsWith('npm_') ? [name, undefined] : [name, value],
          ),
        ),
      },
      onStdout: data => installOutput.push(data),
      onStderr: data => installOutput.push(data),
    }).waitForExit();
    spinner.succeed();
  } catch (error) {
    spinner.fail();
    process.stdout.write(Buffer.concat(installOutput));
    throw error;
  }
}
