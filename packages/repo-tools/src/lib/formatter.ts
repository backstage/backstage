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

import { execFile, execFileSync } from 'node:child_process';
import os from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import fs from 'fs-extra';
import { targetPaths } from '@backstage/cli-common';

const execFileAsync = promisify(execFile);

// The configuration files that oxfmt discovers on its own
const OXFMT_CONFIG_FILES = [
  '.oxfmtrc.json',
  '.oxfmtrc.jsonc',
  'oxfmt.config.ts',
  'oxfmt.config.mts',
];

/**
 * The formatter used for generated code and reports.
 */
export type Formatter = {
  name: 'oxfmt' | 'prettier';
  /** The JavaScript entry point of the formatter CLI, run with Node.js */
  bin: string;
};

function resolvePrettierBin(): string | undefined {
  const pkgPath = targetPaths.resolveRoot('node_modules/prettier/package.json');
  if (!fs.pathExistsSync(pkgPath)) {
    return undefined;
  }
  const { bin } = fs.readJsonSync(pkgPath);
  const binPath = typeof bin === 'string' ? bin : bin?.prettier;
  return binPath
    ? targetPaths.resolveRoot('node_modules/prettier', binPath)
    : undefined;
}

/**
 * Detects the formatter of the target repository.
 *
 * oxfmt is used if it's installed in the repository and either configured in
 * the repository root, or the only formatter installed. Otherwise Prettier is
 * used if it's installed.
 *
 * @returns The formatter, or undefined if no formatter is installed
 */
export function detectFormatter(): Formatter | undefined {
  const oxfmtBin = targetPaths.resolveRoot('node_modules/oxfmt/bin/oxfmt');
  const hasOxfmt = fs.pathExistsSync(oxfmtBin);
  const prettierBin = resolvePrettierBin();

  if (
    hasOxfmt &&
    (!prettierBin ||
      OXFMT_CONFIG_FILES.some(file =>
        fs.pathExistsSync(targetPaths.resolveRoot(file)),
      ))
  ) {
    return { name: 'oxfmt', bin: oxfmtBin };
  }
  if (prettierBin) {
    return { name: 'prettier', bin: prettierBin };
  }
  return undefined;
}

/**
 * Formats files in place with the formatter of the target repository, or does
 * nothing if the repository doesn't have a formatter installed.
 */
export async function formatFiles(
  paths: string[],
  options?: { cwd?: string; signal?: AbortSignal },
) {
  // Both formatters format the working directory when no paths are given
  if (paths.length === 0) {
    return;
  }

  const formatter = detectFormatter();
  if (!formatter) {
    return;
  }

  const args = ['--write', ...paths];
  if (formatter.name === 'oxfmt') {
    // The paths may be excluded by the ignore patterns of the repository
    args.push('--no-error-on-unmatched-pattern');
  }

  // Run the formatter with the current Node.js binary rather than through a
  // shell, so that paths with spaces and Windows work the same way.
  await execFileAsync(process.execPath, [formatter.bin, ...args], {
    cwd: options?.cwd,
    signal: options?.signal,
    maxBuffer: Number.MAX_VALUE,
  });
}

/**
 * Formats pieces of content with oxfmt in a single run, using the
 * configuration of the target repository.
 *
 * @param inputs - The content to format, along with the file extension used to
 * pick the parser, for example `.md`
 * @returns The formatted content, or the original content if formatting fails
 */
export function tryRunOxfmt(
  bin: string,
  inputs: Array<{ content: string; extension: string }>,
): string[] {
  // The content is formatted as files outside of the repository, since oxfmt
  // leaves ignored files as is and reports are often ignored. oxfmt still
  // picks up the configuration from its working directory.
  const tmpDir = fs.mkdtempSync(join(os.tmpdir(), 'backstage-oxfmt-'));
  try {
    const files = inputs.map(({ content, extension }, index) => {
      const file = join(tmpDir, `content-${index}${extension}`);
      fs.writeFileSync(file, content);
      return file;
    });
    execFileSync(process.execPath, [bin, '--write', ...files], {
      cwd: targetPaths.rootDir,
      stdio: 'ignore',
    });
    return files.map(file => fs.readFileSync(file, 'utf8'));
  } catch (error) {
    console.warn(`Failed to format content with oxfmt, ${error}`);
    return inputs.map(({ content }) => content);
  } finally {
    fs.removeSync(tmpDir);
  }
}
