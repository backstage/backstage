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

import { targetPaths } from '@backstage/cli-common';
import chalk from 'chalk';
import fs from 'fs-extra';
import { execFile } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { promisify } from 'node:util';
import { exec } from '../exec';

const execFileAsync = promisify(execFile);

/**
 * Applies lint fixes to generated files with the Backstage CLI. The CLI is
 * resolved with Node.js module resolution so that this works with any package
 * manager.
 */
async function lintGeneratedFiles(paths: string[], signal?: AbortSignal) {
  const pkgPath = createRequire(join(process.cwd(), 'package.json')).resolve(
    '@backstage/cli/package.json',
  );
  const { bin } = await fs.readJson(pkgPath);
  await execFileAsync(
    process.execPath,
    [
      join(dirname(pkgPath), bin['backstage-cli']),
      'package',
      'lint',
      '--fix',
      ...paths,
    ],
    { signal, maxBuffer: Number.MAX_VALUE },
  );
}

/**
 * Lints and formats generated files in place. Linting only applies fixes here,
 * since the lint checks of the repository are what report the remaining
 * problems, so a lint failure is a warning and the files are still formatted.
 */
export async function lintAndFormatGeneratedFiles(
  paths: string[],
  options?: { signal?: AbortSignal },
) {
  try {
    await lintGeneratedFiles(paths, options?.signal);
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }
    console.warn(
      chalk.yellow(
        `Failed to apply lint fixes to the generated files: ${error.message}`,
      ),
    );
  }

  const prettier = targetPaths.resolveRoot('node_modules/.bin/prettier');
  if (await fs.pathExists(prettier)) {
    // Run in the project root, since Prettier only reads the ignore file of
    // its working directory.
    await exec(`"${prettier}"`, ['--write', ...paths], {
      cwd: targetPaths.rootDir,
      signal: options?.signal,
      maxBuffer: Number.MAX_VALUE,
    });
  }
}
