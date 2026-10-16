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

import { extname } from 'node:path';
import { targetPaths } from '@backstage/cli-common';
import type { Config } from 'prettier';
import { detectFormatter, tryRunOxfmt } from '../../../lib/formatter';

const PLACEHOLDER = 'backstage-code-block-';

/**
 * Formats the content with oxfmt.
 *
 * @param bin - The JavaScript entry point of the oxfmt CLI
 * @returns The formatted content, or the original content if formatting fails
 */
function formatWithOxfmt(
  bin: string,
  content: string,
  extraConfig: Config,
): string {
  // API reports contain declarations without implementations, which oxfmt
  // only accepts in declaration files. The code blocks are therefore formatted
  // as separate declaration files, and replaced with placeholders that oxfmt
  // leaves as is while formatting the rest of the content.
  const codeBlocks = new Array<string>();
  const withPlaceholders = content.replace(
    /^```ts(\r?\n)([\s\S]*?)^```(?=\r?$)/gm,
    (_block, newline: string, code: string) => {
      codeBlocks.push(code);
      return `\`\`\`${PLACEHOLDER}${codeBlocks.length - 1}${newline}\`\`\``;
    },
  );

  // The parser can't be picked from the Prettier config, so the extension of
  // the file path is used instead, defaulting to markdown.
  const extension = extraConfig.filepath
    ? extname(extraConfig.filepath)
    : '.md';
  const [formatted, ...formattedCodeBlocks] = tryRunOxfmt(bin, [
    { content: withPlaceholders, extension },
    ...codeBlocks.map(code => ({ content: code, extension: '.d.ts' })),
  ]);

  return formatted.replace(
    // oxfmt may add an empty line to the empty placeholder blocks
    new RegExp(`^\`\`\`${PLACEHOLDER}(\\d+)(\\r?\\n)\\s*^\`\`\`$`, 'gm'),
    (_block, index: string, newline: string) =>
      `\`\`\`ts${newline}${formattedCodeBlocks[Number(index)]}\`\`\``,
  );
}

/**
 * Tries to run prettier asynchronously, with Prettier v2 or v3.
 * @param content - The content to format.
 * @param extraConfig - Additional prettier config options. Providing a filepath is recommended for proper config resolution.
 * @returns A promise that resolves to the formatted content or the original content if the formatting fails.
 */
async function tryRunPrettierAsync(
  content: string,
  extraConfig: Config,
): Promise<string> {
  try {
    const prettier = require('prettier') as typeof import('prettier');
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
  prettierSync:
    | typeof import('prettier')
    | typeof import('@prettier/sync').default,
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

/**
 * Loads the prettier instance, either v2 or v3 via @prettier/sync.
 * XXX: Remove once only v3 is supported
 * @returns The prettier instance, either v2 or v3 via @prettier/sync.
 */
function loadPrettierSync():
  | typeof import('prettier')
  | typeof import('@prettier/sync').default {
  const prettier = require('prettier') as typeof import('prettier');
  if (prettier.version.startsWith('2')) {
    return prettier;
  }
  return require('@prettier/sync').default;
}

/**
 * Tries to run prettier synchronously, with Prettier v2 or v3.
 * @param content - The content to format.
 * @param extraConfig - Additional prettier config options
 * @returns The formatted content.
 */
function tryRunPrettier(content: string, extraConfig: Config): string {
  const formatter = createPrettierSyncFormatter(
    loadPrettierSync(),
    extraConfig,
  );
  return formatter(content);
}

/**
 * Formats the content synchronously with the formatter of the target
 * repository. oxfmt is used if it's detected, otherwise Prettier, with
 * Prettier v2 or v3.
 * @param content - The content to format.
 * @param extraConfig - Additional prettier config options (defaults to markdown parser). The extension of the filepath also picks the oxfmt parser.
 * @returns The formatted content.
 * @internal
 */
export function formatContent(
  content: string,
  extraConfig: Config = { parser: 'markdown' },
): string {
  const formatter = detectFormatter();
  if (formatter?.name === 'oxfmt') {
    return formatWithOxfmt(formatter.bin, content, extraConfig);
  }
  return tryRunPrettier(content, extraConfig);
}

/**
 * Formats the content asynchronously with the formatter of the target
 * repository. oxfmt is used if it's detected, otherwise Prettier, with
 * Prettier v2 or v3.
 * @param content - The content to format.
 * @param extraConfig - Additional prettier config options (defaults to markdown parser). Providing a filepath is recommended for proper config resolution, and its extension also picks the oxfmt parser.
 * @returns A promise that resolves to the formatted content or the original content if the formatting fails.
 * @internal
 */
export async function formatContentAsync(
  content: string,
  extraConfig: Config = { parser: 'markdown' },
): Promise<string> {
  const formatter = detectFormatter();
  if (formatter?.name === 'oxfmt') {
    return formatWithOxfmt(formatter.bin, content, extraConfig);
  }
  return tryRunPrettierAsync(content, extraConfig);
}
