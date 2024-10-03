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

import { Command } from 'commander';
import { assertError } from '@backstage/errors';

export function registerCommands(program: Command) {
  program
    .command('generate <templateDirectory>')
    .description('Generate a project locally from a template')
    .option(
      '--template-path <templatePath>',
      'The relative path to the template.yaml file',
      'template.yaml',
    )
    .option('--url <url>', 'Backstage base URL', 'http://localhost:7007')
    .requiredOption(
      '-v, --values <values>',
      'Inline JSON or a relative file path to a YAML file containing values to be used in the generation',
    )
    .action(lazy(() => import('./generate/generate').then(m => m.default)));
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
      process.stderr.write(`${error}`);
      process.exit(1);
    }
  };
}
