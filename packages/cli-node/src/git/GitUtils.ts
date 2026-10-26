/*
 * Copyright 2022 The Backstage Authors
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

import { ForwardedError, toError } from '@backstage/errors';
import { targetPaths } from '@backstage/cli-common';
import { run, runOutput } from '@backstage/cli-common';

/**
 * Run a git command, trimming the output splitting it into lines.
 */
export async function runGit(...args: string[]) {
  try {
    const stdout = await runOutput(['git', ...args], {
      cwd: targetPaths.workspaceRootDir,
    });
    return stdout.trim().split(/\r\n|\r|\n/);
  } catch (error) {
    const err = toError(error);
    if ('code' in err && typeof (err as { code?: number }).code === 'number') {
      const code = (err as { code?: number }).code;
      const stderr = (err as { stderr?: string }).stderr;
      const msg = stderr?.trim() ?? `with exit code ${code}`;
      throw new Error(`git ${args[0]} failed, ${msg}`);
    }
    throw new ForwardedError('Unknown execution error', error);
  }
}

/**
 * Returns the merge base of HEAD and `ref`, or `ref` itself if there is none.
 */
async function resolveMergeBase(ref: string) {
  try {
    const [base] = await runGit('merge-base', 'HEAD', ref);
    return base;
  } catch {
    // silently fall back to using the ref directly if merge base is not available
    return ref;
  }
}

/**
 * Returns the contents of several files at the merge base of HEAD and `ref`,
 * in the same order as the paths, with `undefined` for each file that doesn't
 * exist there. All files are read through a single git process.
 */
export async function readFilesAtRef(
  paths: string[],
  ref: string,
): Promise<Array<string | undefined>> {
  if (paths.length === 0) {
    return [];
  }
  const base = await resolveMergeBase(ref);

  const chunks = new Array<Buffer>();
  const child = run(['git', 'cat-file', '--batch'], {
    cwd: targetPaths.workspaceRootDir,
    stdio: ['pipe', 'pipe', 'inherit'],
    onStdout: data => chunks.push(data),
  });
  // The output can still arrive after the process has exited
  const outputEnd = new Promise(resolve =>
    child.stdout?.once('close', resolve),
  );
  // The ./ prefix makes git resolve the paths from the working directory,
  // which is the workspace root, rather than from the root of the repository
  child.stdin?.end(paths.map(path => `${base}:./${path}\n`).join(''));
  await Promise.all([child.waitForExit(), outputEnd]);
  const output = Buffer.concat(chunks);

  // Each object is a header line, followed by the contents and a newline for
  // objects that exist
  const contents = new Array<string | undefined>();
  let offset = 0;
  for (let i = 0; i < paths.length; i++) {
    const headerEnd = output.indexOf('\n', offset);
    if (headerEnd === -1) {
      throw new Error(
        `git cat-file returned ${i} of ${paths.length} files at ${base}`,
      );
    }
    const header = output.toString('utf8', offset, headerEnd);
    offset = headerEnd + 1;
    const match = header.match(/^[0-9a-f]+ (\w+) (\d+)$/);
    if (!match) {
      contents.push(undefined);
      continue;
    }
    const size = Number(match[2]);
    if (offset + size > output.length) {
      throw new Error(
        `git cat-file returned ${i} of ${paths.length} files at ${base}`,
      );
    }
    contents.push(
      match[1] === 'blob'
        ? output.toString('utf8', offset, offset + size)
        : undefined,
    );
    offset += size + 1;
  }
  return contents;
}

/**
 * Utilities for working with git.
 *
 * @public
 */
export class GitUtils {
  /**
   * Returns a sorted list of all files that have changed since the merge base
   * of the provided `ref` and HEAD, as well as all files that are not tracked by git.
   */
  static async listChangedFiles(ref: string) {
    if (!ref) {
      throw new Error('ref is required');
    }

    const diffRef = await resolveMergeBase(ref);

    const tracked = await runGit('diff', '--name-only', diffRef);
    const untracked = await runGit(
      'ls-files',
      '--others',
      '--exclude-standard',
    );

    return Array.from(new Set([...tracked, ...untracked]));
  }

  /**
   * Returns the contents of a file at a specific ref.
   */
  static async readFileAtRef(path: string, ref: string) {
    const showRef = await resolveMergeBase(ref);

    const stdout = await runOutput(['git', 'show', `${showRef}:${path}`], {
      cwd: targetPaths.workspaceRootDir,
    });
    return stdout;
  }
}
