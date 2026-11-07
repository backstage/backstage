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
import fs from 'fs-extra';
import { join } from 'node:path';

type Prettier = typeof import('prettier');

/**
 * Loads Prettier, which is an optional peer dependency.
 *
 * @returns Prettier, or undefined if it isn't installed
 */
function loadPrettier(): Prettier | undefined {
  try {
    return require('prettier');
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      return undefined;
    }
    throw error;
  }
}

/**
 * Loads the synchronous Prettier API, which v3 only has through `@prettier/sync`.
 * XXX: Remove once only v3 is supported
 */
function loadPrettierSync(
  prettier: Prettier,
): Prettier | typeof import('@prettier/sync').default {
  if (prettier.version.startsWith('2')) {
    return prettier;
  }
  return require('@prettier/sync').default;
}

async function listFiles(path: string): Promise<string[]> {
  if (!(await fs.stat(path)).isDirectory()) {
    return [path];
  }
  const entries = await fs.readdir(path);
  const files = await Promise.all(
    entries
      .filter(entry => entry !== 'node_modules')
      .map(entry => listFiles(join(path, entry))),
  );
  return files.flat();
}

/**
 * Formats content with the formatter of the target repository.
 *
 * This is synchronous because API reports are formatted within API Extractor,
 * which doesn't support asynchronous processing of its reports.
 *
 * @param content - The content to format
 * @param filepath - The path of the file that the content belongs to, used to
 * pick the parser and resolve the configuration. The file doesn't need to exist.
 * @returns The formatted content, or the original content if the repository
 * doesn't have a formatter or formatting fails
 */
export function formatContent(content: string, filepath: string): string {
  try {
    const prettier = loadPrettier();
    if (!prettier) {
      return content;
    }
    const prettierSync = loadPrettierSync(prettier);
    const resolveConfig =
      // @ts-expect-error: v2 requires .sync, @prettier/sync v3 does not
      prettierSync.resolveConfig?.sync ?? prettierSync.resolveConfig;
    const config = resolveConfig(filepath, { editorconfig: true }) ?? {};
    return prettierSync.format(content, { ...config, filepath }) as string;
  } catch (error) {
    console.warn(`Failed to format ${filepath}, ${error}`);
    return content;
  }
}

/**
 * Formats files in place with the formatter of the target repository, or does
 * nothing if the repository doesn't have a formatter. Files that the repository
 * ignores or that the formatter doesn't support are left as is.
 *
 * @param paths - The files to format, and directories to format all files in
 */
export async function formatFiles(
  paths: string[],
  options?: { signal?: AbortSignal },
): Promise<void> {
  const prettier = loadPrettier();
  if (!prettier) {
    return;
  }

  const ignorePaths = ['.gitignore', '.prettierignore'].map(file =>
    targetPaths.resolveRoot(file),
  );
  const files = (await Promise.all(paths.map(listFiles))).flat();

  await Promise.all(
    files.map(async filepath => {
      options?.signal?.throwIfAborted();

      for (const ignorePath of ignorePaths) {
        const { ignored, inferredParser } = await prettier.getFileInfo(
          filepath,
          { ignorePath },
        );
        if (ignored || !inferredParser) {
          return;
        }
      }

      const source = await fs.readFile(filepath, 'utf8');
      const config = await prettier.resolveConfig(filepath, {
        editorconfig: true,
      });
      const formatted = await prettier.format(source, { ...config, filepath });
      if (formatted !== source) {
        await fs.writeFile(filepath, formatted);
      }
    }),
  );
}
