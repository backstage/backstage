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
import {
  getPathToCurrentOpenApiSpec,
  loadAndValidateOpenApiYaml,
} from '../../../../../lib/openapi/helpers';
import { debounce } from 'lodash';
import { block } from '../../../../../lib/runner';

export async function command(opts: OptionValues) {
  if (!opts.clientPackage && !opts.server) {
    console.log(
      chalk.red('Either --client-package or --server must be defined.'),
    );
    process.exit(1);
  }

  const sharedCommand = async (abortSignal?: AbortController) => {
    const resolvedOpenapiPath = await getPathToCurrentOpenApiSpec();
    await loadAndValidateOpenApiYaml(resolvedOpenapiPath);
    const promises = [];
    const options = {
      isWatch: opts.watch,
      abortSignal,
    };
    if (opts.clientPackage) {
      promises.push(
        generateClient(
          opts.clientPackage,
          opts.clientAdditionalProperties,
          options,
        ),
      );
    }
    if (opts.server) {
      promises.push(generateServer(options));
    }
    await Promise.all(promises);
  };

  if (opts.watch) {
    try {
      const resolvedOpenapiPath = await getPathToCurrentOpenApiSpec();
      let abortController = new AbortController();
      const watcher = chokidar.watch(resolvedOpenapiPath);

      // The generate command currently takes ~8 seconds to run, so let's debounce calling it so we don't have to cancel it so much.
      const debouncedCommand = debounce(() => {
        console.log('Detected changes! Regenerating...');
        abortController.abort();
        abortController = new AbortController();
        sharedCommand(abortController).catch(err => {
          console.error(chalk.red('Error: ', err));
        });
      }, 500);

      watcher.on('change', () => {
        debouncedCommand();
      });
      watcher.on('error', error => {
        console.error('Error happened', error);
      });

      watcher.on('ready', async () => {
        console.log(
          'Watching for changes in OpenAPI spec. Press Ctrl+C to stop.',
        );
      });

      debouncedCommand();
      await block();
    } catch (err) {
      console.error(chalk.red('Error: ', err));
      process.exit(1);
    }
  } else {
    try {
      await sharedCommand();
    } catch (err) {
      process.exit(1);
    }
  }
}
