/*
 * Copyright 2022 The Backstage Authors
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

import { assertError } from '@backstage/errors';
import { Command } from 'commander';
import { exitWithError } from '../lib/errors';

export function registerCommands(program: Command) {
  program
    .command('api-reports [path...]')
    .option('--ci', 'CI run checks that there is no changes on API reports')
    .option('--tsc', 'executes the tsc compilation before extracting the APIs')
    .option('--docs', 'generates the api documentation')
    .description('Generate an API report for selected packages')
    .action(
      lazy(() => import('./api-reports/api-reports').then(m => m.default)),
    );
}

// Wraps an action function so that it always exits and handles errors
function lazy(
  getActionFunc: () => Promise<(...args: any[]) => Promise<void>>,
): (...args: any[]) => Promise<never> {
  return async (...args: any[]) => {
    try {
      const actionFunc = await getActionFunc();
      await actionFunc(...args);

      process.exit(0);
    } catch (error) {
      assertError(error);
      exitWithError(error);
    }
  };
}
