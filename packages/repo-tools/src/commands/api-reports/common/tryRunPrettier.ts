/*
 * Copyright 2024 The Backstage Authors
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
import type { Config } from 'prettier';
import { pathToFileURL } from 'node:url';
import { findProjectTool } from '../../../lib/projectTools';

type PrettierSync =
  | typeof import('prettier')
  | typeof import('@prettier/sync').default;

/**
 * Loads prettier from the project root, or returns `undefined` if the project
 * does not have prettier installed.
 */
function loadProjectPrettier(): typeof import('prettier') | undefined {
  return findProjectTool('prettier')?.require<typeof import('prettier')>(
    'prettier',
  );
}

/**
 * Tries to run prettier asynchronously, with Prettier v2 or v3.
 * @param content - The content to format.
 * @param extraConfig - Additional prettier config options (defaults to markdown parser). Providing a filepath is recommended for proper config resolution.
 * @returns A promise that resolves to the formatted content or the original content if the formatting fails.
 * @internal
 */
export async function tryRunPrettierAsync(
  content: string,
  extraConfig: Config = { parser: 'markdown' },
): Promise<string> {
  const prettier = loadProjectPrettier();
  if (!prettier) {
    return content;
  }
  try {
    // Filepath for proper config resolution
    const filepath =
      extraConfig.filepath ??
      `${targetPaths.rootDir}/should-not-be-ignored.any`;
    const config =
      (await prettier.resolveConfig(filepath, { editorconfig: true })) ?? {};
    const formattedContent = prettier.format(content, {
      ...config,
      ...extraConfig,
    });
    // XXX: Remove once only v3 is supported
    if (typeof formattedContent === 'string') {
      return Promise.resolve(formattedContent);
    }
    return formattedContent;
  } catch (e) {
    return Promise.resolve(content);
  }
}

/**
 * Creates a synchronous prettier formatter function for v2 or v3 via `@prettier/sync`.
 *
 * @param prettierSync - The prettier instance, either v2 or v3 via `@prettier/sync`.
 * @param extraConfig - Additional prettier config options (defaults to markdown parser)
 * @returns A function that formats content using the prettier instance and config
 */
export function createPrettierSyncFormatter(
  prettierSync: PrettierSync,
  extraConfig: Config = {},
): (content: string) => string {
  return function tryRunPrettierInner(content: string): string {
    try {
      // We need a filepath for proper config resolution, not just a directory
      const filepath =
        extraConfig.filepath ??
        `${targetPaths.rootDir}/should-not-be-ignored.any`;
      const resolveConfig =
        // @ts-expect-error: v2 requires .sync, @prettier/sync v3 does not
        prettierSync.resolveConfig?.sync ?? prettierSync.resolveConfig;
      const config =
        resolveConfig(filepath, {
          editorconfig: true,
        }) ?? {};
      return prettierSync.format(content, {
        ...config,
        ...extraConfig,
      });
    } catch (e) {
      return content;
    }
  };
}

const prettierSyncCache = new Map<string, PrettierSync | undefined>();

/**
 * Loads the prettier instance from the project root, either v2 or v3 via
 * `@prettier/sync`, or returns `undefined` if prettier is not installed.
 * XXX: Remove once only v3 is supported
 * @returns The prettier instance, either v2 or v3 via @prettier/sync.
 */
function loadPrettierSync(): PrettierSync | undefined {
  const rootDir = targetPaths.rootDir;
  if (prettierSyncCache.has(rootDir)) {
    return prettierSyncCache.get(rootDir);
  }

  let prettierSync: PrettierSync | undefined;
  const tool = findProjectTool('prettier', rootDir);
  if (tool) {
    const prettier = tool.require<typeof import('prettier')>('prettier');
    if (prettier.version.startsWith('2')) {
      prettierSync = prettier;
    } else {
      // Each synchronized instance runs in its own worker, which is why the
      // result is cached. The entry is the CommonJS build of prettier, whose
      // API is only exposed through the default export of the module.
      const { createSynchronizedPrettier } =
        require('@prettier/sync') as typeof import('@prettier/sync');
      prettierSync = (
        createSynchronizedPrettier({
          prettierEntry: pathToFileURL(tool.resolve('prettier')),
        }) as unknown as { default: typeof import('@prettier/sync').default }
      ).default;
    }
  }
  prettierSyncCache.set(rootDir, prettierSync);
  return prettierSync;
}

/**
 * Tries to run prettier synchronously, with Prettier v2 or v3.
 * @param content - The content to format.
 * @param extraConfig - Additional prettier config options (defaults to markdown parser)
 * @returns The formatted content.
 * @internal
 */
export function tryRunPrettier(
  content: string,
  extraConfig: Config = { parser: 'markdown' },
): string {
  const prettierSync = loadPrettierSync();
  if (!prettierSync) {
    return content;
  }
  const formatter = createPrettierSyncFormatter(prettierSync, extraConfig);
  return formatter(content);
}
