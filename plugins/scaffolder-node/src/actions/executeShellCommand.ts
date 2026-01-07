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
 * Log levels available for stderr output.
 *
 * @public
 */
export type StderrLogLevel = 'error' | 'warn' | 'info' | 'debug';

/**
 * Function to determine the log level for a stderr message.
 * This allows inspection of stderr content to route messages appropriately.
 *
 * @public
 */
export type StderrLogLevelSelector = (message: string) => StderrLogLevel | null;

/**
 * Options for configuring stderr logging behavior.
 *
 * @public
 */
export type StderrLoggingOptions =
  | {
      /** Use a fixed log level for all stderr output */
      level: StderrLogLevel;
    }
  | {
      /** Use a function to determine log level per message. Return null to skip logging. */
      selector: StderrLogLevelSelector;
    };

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
  /**
   * Configuration for how stderr output is logged.
   * If not provided, defaults to logging all stderr as 'error' (backward compatible behavior).
   *
   * @example
   * // Log all stderr as info
   * \{ stderrLogging: \{ level: 'info' \} \}
   *
   * @example
   * // Use a selector function to route messages
   * \{
   *   stderrLogging: \{
   *     selector: (msg) =\> \{
   *       if (msg.includes('ERROR') || msg.includes('FATAL')) return 'error';
   *       if (msg.includes('WARN')) return 'warn';
   *       return 'info';
   *     \}
   *   \}
   * \}
   */
  stderrLogging?: StderrLoggingOptions;
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
    stderrLogging,
  } = options;

  // Determine how to log stderr messages
  const getStderrLogLevel = (message: string): StderrLogLevel | null => {
    if (!stderrLogging) {
      // Default backward-compatible behavior: log all stderr as error
      return 'error';
    }
    if ('level' in stderrLogging) {
      return stderrLogging.level;
    }
    // Use selector function
    return stderrLogging.selector(message);
  };

  // Get the appropriate logger method for a log level
  const logStderr = (message: string) => {
    const level = getStderrLogLevel(message);
    if (level === null || !logger) {
      return; // Skip logging if selector returns null or no logger
    }

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return; // Skip empty messages
    }

    switch (level) {
      case 'error':
        logger.error(trimmedMessage);
        break;
      case 'warn':
        logger.warn(trimmedMessage);
        break;
      case 'info':
        logger.info(trimmedMessage);
        break;
      case 'debug':
        logger.debug(trimmedMessage);
        break;
      default:
        // This should never happen due to TypeScript typing, but satisfies linter
        logger.error(trimmedMessage);
        break;
    }
  };

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
      const message = Buffer.isBuffer(chunk) ? chunk.toString('utf8') : chunk;
      logStderr(message);
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
