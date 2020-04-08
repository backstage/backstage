/*
 * Copyright 2020 Spotify AB
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

import { resolve as resolvePath } from 'path';
import { Command } from 'commander';
import { paths } from 'helpers/paths';

const DEFAULT_CACHE_DIR = '<repoRoot>/node_modules/.cache/backstage-builds';
const DEFAULT_MAX_ENTRIES = 10;

export type Options = {
  inputs: string[];
  output: string;
  cacheDir: string;
  maxCacheEntries: number;
};

function transformPath(path: string): string {
  return resolvePath(
    path.replace(/<repoRoot>/g, paths.targetRoot).replace(/'/g, ''),
  );
}

export async function parseOptions(cmd: Command): Promise<Options> {
  const inputs = cmd.input.map(transformPath) as string[];
  if (inputs.length === 0) {
    inputs.push(transformPath('.'));
  }
  const output = transformPath(cmd.output);
  const cacheDir = transformPath(
    process.env.BACKSTAGE_CACHE_DIR || cmd.cacheDir,
  );
  const maxCacheEntries =
    Number(process.env.BACKSTAGE_CACHE_MAX_ENTRIES) || DEFAULT_MAX_ENTRIES;
  return { inputs, output, cacheDir, maxCacheEntries };
}

export function getDefaultCacheOptions(): Options {
  return {
    inputs: [transformPath('.')],
    output: transformPath('dist'),
    cacheDir: transformPath(
      process.env.BACKSTAGE_CACHE_DIR || DEFAULT_CACHE_DIR,
    ),
    maxCacheEntries:
      Number(process.env.BACKSTAGE_CACHE_MAX_ENTRIES) || DEFAULT_MAX_ENTRIES,
  };
}
