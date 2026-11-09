/*
 * Copyright 2026 The Backstage Authors
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

import { ExitCodeError, runOutput, targetPaths } from '@backstage/cli-common';
import {
  isAbsolute,
  relative as relativePath,
  resolve as resolvePath,
} from 'node:path';

const FORMAT_COMMAND = ['yarn', 'backstage-cli', 'package', 'format'];

/**
 * The most characters of paths passed to a single format command. Windows
 * limits a command line run through cmd.exe to 8191 characters, so longer
 * path lists are split across several runs.
 */
const MAX_PATHS_LENGTH = 6000;

/**
 * The exit code of the Backstage CLI when no installed CLI module provides
 * the command.
 */
const UNKNOWN_COMMAND_EXIT_CODE = 69;

let warnedMissingCommand = false;

/**
 * Formats files with `backstage-cli package format`, which uses whichever
 * formatter module the project has installed.
 *
 * @remarks
 *
 * The output of the formatter is only shown if it fails. If the project has no
 * formatter module installed, a message is logged once and the files are left
 * as they are.
 *
 * @param paths - Files or directories to format, absolute or relative to the
 * project root.
 * @param options.includeIgnored - Format the paths even if the ignore files of
 * the project list them.
 */
export async function formatFiles(
  paths: string[],
  options: { signal?: AbortSignal; includeIgnored?: boolean } = {},
): Promise<void> {
  const command = options.includeIgnored
    ? [...FORMAT_COMMAND, '--include-ignored']
    : FORMAT_COMMAND;

  const rootDir = targetPaths.rootDir;

  // Paths are passed relative to the project root where possible, which keeps
  // the command line short
  const args = paths.map(path => {
    const relative = relativePath(rootDir, resolvePath(rootDir, path));
    if (relative.startsWith('..') || isAbsolute(relative)) {
      return path;
    }
    return relative || '.';
  });

  for (const chunk of chunkPaths(args)) {
    try {
      await runOutput([...command, ...chunk], {
        cwd: rootDir,
        signal: options.signal,
      });
    } catch (error) {
      if (!(error instanceof ExitCodeError)) {
        throw error;
      }
      const { stdout = '', stderr = '' } = error as {
        stdout?: string;
        stderr?: string;
      };
      if (error.code === UNKNOWN_COMMAND_EXIT_CODE) {
        if (!warnedMissingCommand) {
          warnedMissingCommand = true;
          console.warn(
            'Skipped formatting, because no installed CLI module provides the `backstage-cli package format` command',
          );
        }
        return;
      }
      // The original message lists every path, so only the command is named
      const failure = new ExitCodeError(error.code, FORMAT_COMMAND.join(' '));
      const output = [stdout.trim(), stderr.trim()].filter(Boolean).join('\n');
      if (output) {
        failure.message = `${failure.message}\n${output}`;
      }
      throw failure;
    }
  }
}

function chunkPaths(paths: string[]): string[][] {
  const chunks = new Array<string[]>();
  let current = new Array<string>();
  let currentLength = 0;

  for (const path of paths) {
    if (current.length > 0 && currentLength + path.length > MAX_PATHS_LENGTH) {
      chunks.push(current);
      current = [];
      currentLength = 0;
    }
    current.push(path);
    // Account for the space that separates the arguments
    currentLength += path.length + 1;
  }
  if (current.length > 0) {
    chunks.push(current);
  }

  return chunks;
}
