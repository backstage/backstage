/*
 * Copyright 2025 The Backstage Authors
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

import fs from 'fs-extra';
import os from 'node:os';
import { resolve as resolvePath } from 'node:path';
import { run, targetPaths } from '@backstage/cli-common';
import chalk from 'chalk';
import ora from 'ora';

const BACKSTAGE_REPO_URL = 'https://github.com/backstage/backstage.git';

/**
 * Download Backstage docs for a specific version using git sparse-checkout.
 * Returns the absolute path to the downloaded docs directory.
 */
export async function downloadDocs(options: {
  version: string;
  docsDir: string;
}): Promise<string> {
  const { version, docsDir } = options;
  const normalizedVersion = version.replace(/^v/, '');
  const tag = `v${normalizedVersion}`;
  const targetDir = targetPaths.resolveRoot(docsDir);
  const docsPath = resolvePath(targetDir, 'docs');

  const spinner = ora(
    `Downloading Backstage ${chalk.cyan(tag)} documentation...`,
  ).start();

  const tempDir = fs.mkdtempSync(resolvePath(os.tmpdir(), 'backstage-docs-'));

  try {
    // Shallow clone with sparse-checkout filter
    await run(
      [
        'git',
        'clone',
        '--filter=blob:none',
        '--no-checkout',
        '--depth',
        '1',
        '--branch',
        tag,
        '--sparse',
        BACKSTAGE_REPO_URL,
        tempDir,
      ],
      { stdio: ['pipe', 'pipe', 'pipe'] },
    ).waitForExit();

    // Configure sparse-checkout to only include docs/
    await run(['git', 'sparse-checkout', 'set', 'docs'], {
      cwd: tempDir,
      stdio: ['pipe', 'pipe', 'pipe'],
    }).waitForExit();

    // Checkout the files
    await run(['git', 'checkout'], {
      cwd: tempDir,
      stdio: ['pipe', 'pipe', 'pipe'],
    }).waitForExit();

    const sourceDocs = resolvePath(tempDir, 'docs');
    if (!(await fs.pathExists(sourceDocs))) {
      throw new Error('docs folder not found in cloned repository');
    }

    // Copy docs to target directory
    await fs.remove(docsPath);
    await fs.ensureDir(targetDir);
    await fs.copy(sourceDocs, docsPath);

    spinner.succeed(
      `Downloaded Backstage ${chalk.cyan(tag)} documentation to ${chalk.cyan(
        docsDir,
      )}`,
    );

    return docsPath;
  } catch (error) {
    spinner.fail(`Failed to download docs for Backstage ${tag}`);
    throw new Error(
      `Failed to download docs for Backstage ${tag}. ` +
        `Ensure the version exists at ${BACKSTAGE_REPO_URL}. ` +
        `Error: ${error instanceof Error ? error.message : String(error)}`,
    );
  } finally {
    await fs.remove(tempDir).catch(() => {});
  }
}
