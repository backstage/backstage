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

import { resolve as resolvePath } from 'node:path';
import { ExitCodeError, run, targetPaths } from '@backstage/cli-common';
import { resolveFormatterBin } from './resolveFormatterBin';

/**
 * Options for {@link runFormatter}.
 */
export interface RunFormatterOptions {
  /** The package name of the formatter, which is also its executable name */
  name: string;
  /** The files and directories to format, relative to the working directory */
  paths: string[];
  /** The formatter arguments that select between writing and checking */
  modeArgs: string[];
  /** Formatter arguments that are always passed, placed before the paths */
  extraArgs: string[];
}

/**
 * Runs a formatter CLI that the project root depends on.
 *
 * The formatter is run with the current Node.js binary instead of through a
 * shell, so that paths with spaces and Windows behave the same as elsewhere.
 * It runs in the project root, so that oxfmt picks up the configuration and
 * ignore files of the project.
 *
 * The output of the formatter, including any errors, is passed through as is.
 */
export async function runFormatter(options: RunFormatterOptions) {
  const { name, paths, modeArgs, extraArgs } = options;
  const bin = await resolveFormatterBin(name);

  // The formatter runs in the project root, so the paths are made absolute.
  // With no paths, the current package is formatted, matching `package lint`.
  const targets =
    paths.length > 0 ? paths.map(p => resolvePath(p)) : [targetPaths.dir];

  try {
    await run([process.execPath, bin, ...modeArgs, ...extraArgs, ...targets], {
      cwd: targetPaths.rootDir,
    }).waitForExit();
  } catch (error) {
    if (error instanceof ExitCodeError) {
      // The error from run() would include every path, so name only the mode
      throw new ExitCodeError(error.code, [name, ...modeArgs].join(' '));
    }
    throw error;
  }
}
