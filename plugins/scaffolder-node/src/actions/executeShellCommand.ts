/*
 * Copyright 2021 The Backstage Authors
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

import { LoggerService } from '@backstage/backend-plugin-api';
import { spawn, SpawnOptionsWithoutStdio } from 'child_process';
import { PassThrough, Writable } from 'stream';

/**
 * Options for {@link executeShellCommand}.
 *
 * @public
 */
export type ExecuteShellCommandOptions = {
  /** command to run */
  command: string;
  /** arguments to pass the command */
  args: string[];
  /** options to pass to spawn */
  options?: SpawnOptionsWithoutStdio;
  /** logger to capture stdout and stderr output */
  logger?: LoggerService;
  /**
   * stream to capture stdout and stderr output
   * @deprecated  please provide a logger instead.
   */
  logStream?: Writable;
};

/**
 * Run a command in a sub-process, normally a shell command.
 *
 * @public
 */
export async function executeShellCommand(
  options: ExecuteShellCommandOptions,
): Promise<void> {
  const {
    command,
    args,
    options: spawnOptions,
    logger,
    logStream = new PassThrough(),
  } = options;

  await new Promise<void>((resolve, reject) => {
    const process = spawn(command, args, spawnOptions);

    process.stdout.on('data', chunk => {
      logStream?.write(chunk);
      logger?.info(
        Buffer.isBuffer(chunk) ? chunk.toString('utf8').trim() : chunk.trim(),
      );
    });
    process.stderr.on('data', chunk => {
      logStream?.write(chunk);
      logger?.error(
        Buffer.isBuffer(chunk) ? chunk.toString('utf8').trim() : chunk.trim(),
      );
    });
    process.on('error', error => {
      return reject(error);
    });

    process.on('close', code => {
      if (code !== 0) {
        return reject(
          new Error(`Command ${command} failed, exit code: ${code}`),
        );
      }
      return resolve();
    });
  });
}
