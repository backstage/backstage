/*
 * Copyright 2024 The Backstage Authors
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
import { OptionValues } from 'commander';
import { command as generateClient } from './client';
import { command as generateServer } from './server';
import chokidar from 'chokidar';
import { getPathToCurrentOpenApiSpec } from '../../../../../lib/openapi/helpers';

export async function command(opts: OptionValues) {
  if (!opts.clientPackage && !opts.server) {
    console.log(
      chalk.red('Either --client-package or --server must be defined.'),
    );
    process.exit(1);
  }

  const sharedCommand = async (abortSignal?: AbortController) => {
    if (opts.clientPackage) {
      await generateClient(
        opts.clientPackage,
        opts.clientAdditionalProperties,
        abortSignal,
      );
    }
    if (opts.server) {
      await generateServer(abortSignal);
    }
  };

  if (opts.watch) {
    try {
      const resolvedOpenapiPath = await getPathToCurrentOpenApiSpec();
      let abortController = new AbortController();
      chokidar.watch(resolvedOpenapiPath).on('change', async () => {
        console.log('detected changes');
        abortController.abort();
        await sharedCommand(abortController);
        abortController = new AbortController();
      });
      await sharedCommand();
      await new Promise(() => {});
    } catch (err) {
      console.error(chalk.red('Error: ', err));
      process.exit(1);
    }
  } else {
    await sharedCommand();
  }
}
