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
import { runPlain } from '../../helpers/run';

export type Options = {
  inputs: string[];
  output: string;
  cacheDir: string;
  repoRoot: string;
};

export async function parseOptions(cmd: Command): Promise<Options> {
  const repoRoot = await runPlain('git rev-parse --show-toplevel');
  const argTransformer = (arg: string) =>
    resolvePath(arg.replace(/<repoRoot>/g, repoRoot).replace(/'/g, ''));

  const inputs = cmd.input.map(argTransformer) as string[];
  if (inputs.length === 0) {
    inputs.push(argTransformer('.'));
  }
  const output = argTransformer(cmd.output);
  const cacheDir = argTransformer(
    process.env.BACKSTAGE_CACHE_DIR || cmd.cacheDir,
  );
  return { inputs, output, cacheDir, repoRoot };
}
