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

import chalk from 'chalk';
import { ExitCodeError } from '@backstage/cli-common';

export class CustomError extends Error {
  get name(): string {
    return this.constructor.name;
  }
}

export function exitWithError(error: Error): never {
  if (error instanceof ExitCodeError) {
    process.stderr.write(`\n${chalk.red(error.message)}\n\n`);
    process.exit(error.code);
  } else {
    process.stderr.write(`\n${chalk.red(`${error}`)}\n\n`);
    process.exit(1);
  }
}
