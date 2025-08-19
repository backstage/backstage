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

import { CustomErrorBase, isError, stringifyError } from '@backstage/errors';
import chalk from 'chalk';

export class ExitCodeError extends CustomErrorBase {
  readonly code: number;

  constructor(code: number, command?: string) {
    super(
      command
        ? `Command '${command}' exited with code ${code}`
        : `Child exited with code ${code}`,
    );
    this.code = code;
  }
}

function exit(message: string, code: number = 1): never {
  process.stderr.write(`\n${chalk.red(message)}\n\n`);
  process.exit(code);
}

export function exitWithError(error: unknown): never {
  if (!isError(error)) {
    process.stderr.write(`\n${chalk.red(stringifyError(error))}\n\n`);
    process.exit(1);
  }

  switch (error.name) {
    case 'InputError':
      return exit(error.message, 74 /* input/output error */);
    case 'NotFoundError':
      return exit(error.message, 127 /* command not found */);
    case 'NotImplementedError':
      return exit(error.message, 64 /* command line usage error */);
    case 'AuthenticationError':
    case 'NotAllowedError':
      return exit(error.message, 77 /* permissino denied */);
    case 'ExitCodeError':
      return exit(
        error.message,
        'code' in error && typeof error.code === 'number' ? error.code : 1,
      );
    default:
      return exit(stringifyError(error), 1);
  }
}
