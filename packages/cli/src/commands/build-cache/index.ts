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

import fs from 'fs-extra';
import { resolve as resolvePath, relative as relativePath } from 'path';
import { promisify } from 'util';
import { exec as execCb } from 'child_process';
import { Command } from 'commander';
import { ExitCodeError } from '../../helpers/errors';
const exec = promisify(execCb);

const INFO_FILE = '.backstage-build-cache';

type Options = {
  inputs: string[];
  output: string;
  cacheDir: string;
  repoRoot: string;
};

async function parseOptions(cmd: Command): Promise<Options> {
  const repoRoot = await run('git rev-parse --show-toplevel');
  const argTransformer = (arg: string) =>
    resolvePath(arg.replace(/<repoRoot>/g, repoRoot).replace(/'/g, ''));

  const inputs = cmd.input.map(argTransformer) as string[];
  if (inputs.length === 0) {
    inputs.push(argTransformer('.'));
  }
  const output = argTransformer(cmd.output);
  const cacheDir = argTransformer(cmd.cacheDir);
  return { inputs, output, cacheDir, repoRoot };
}

/*
 * The build-cache command is used to make builds a no-op if there are no changes to the package.
 * It supports both local development where the output directory remains intact, as well as CI
 * where the output directory is stored in a separate cache dir.
 */
export default async (cmd: Command, args: string[]) => {
  const options = await parseOptions(cmd);
  console.log('DEBUG: options =', options);
  console.log('DEBUG: args =', args);

  const cache = await readCache(options);
  console.log('DEBUG: cache =', cache);

  const trees = await getInputHashes(options);
  console.log('DEBUG: trees =', trees);

  const cacheHit = cache.readable && cache.trees?.join(',') === trees.join(',');
  if (!cacheHit) {
    await build(options);

    await fs.writeFile(
      resolvePath(options.output, INFO_FILE),
      JSON.stringify({ trees }, null, 2),
      'utf-8',
    );
    if (cache.writable) {
      console.log(`DEBUG: write cache`);
      console.log('DEBUG: cache.location =', cache.location);
      await fs.remove(cache.location);
      console.log('DEBUG: options.output =', options.output);
      await fs.copy(options.output, cache.location);
    }
  } else if (cache.needsCopy) {
    console.log(`DEBUG: would copy cache`);
    await fs.remove(options.output);
    await fs.copy(cache.location, options.output);
  }

  const ls = await run('ls derp');
  console.log('DEBUG: ls =', ls);
};

async function build(options: Options): Promise<void> {
  console.log(`Imma build ${options.output}`);
}

async function run(cmd: string) {
  try {
    const { stdout } = await exec(cmd);
    return stdout.trim();
  } catch (error) {
    if (error.stderr) {
      process.stderr.write(error.stderr);
    }
    throw new ExitCodeError(error.code, cmd);
  }
}

type Cache = {
  // External location of the cache outside the output folder
  location: string;
  readable?: boolean;
  writable?: boolean;
  needsCopy?: boolean;
  trees?: string[];
};

async function readCache(options: Options): Promise<Cache> {
  const repoPath = relativePath(options.repoRoot, process.cwd());
  const location = resolvePath(options.cacheDir, repoPath);

  // Make sure we don't have any uncommitted changes to the input, in that case we consider the cache to be missing
  try {
    await exec(`git diff --quiet HEAD -- ${options.inputs.join(' ')}`);
  } catch (error) {
    return { location };
  }

  try {
    const outputCacheExists = await fs.pathExists(
      resolvePath(options.output, INFO_FILE),
    );
    if (outputCacheExists) {
      const trees = await readInfoFile(options.output);
      if (trees) {
        return {
          location,
          trees,
          readable: true,
          writable: true,
        };
      }
    }

    const externalCacheExists = await fs.pathExists(location);
    if (externalCacheExists) {
      const trees = await readInfoFile(location);
      if (trees) {
        return {
          location,
          trees,
          readable: true,
          writable: true,
          needsCopy: true,
        };
      }
    }
  } catch (error) {
    console.log(`Cache not found, ${error}`);
  }
  return { location, writable: true };
}

async function readInfoFile(dir: string): Promise<string[] | undefined> {
  const infoContents = await fs.readFile(resolvePath(dir, INFO_FILE), 'utf-8');
  const { trees } = JSON.parse(infoContents);
  return trees;
}

async function getInputHashes(options: Options): Promise<string[]> {
  const trees = [];
  for (const input of options.inputs) {
    const output = await run(`git ls-tree HEAD '${input}'`);
    const [, , sha] = output.split(/\s+/, 3);
    trees.push(sha);
  }
  return trees;
}
