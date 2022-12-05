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

import { OptionValues } from 'commander';
import fs from 'fs-extra';
import { spawnSync } from 'child_process';
import {
  createTemporaryTsConfig,
  categorizePackageDirs,
  runApiExtraction,
  runCliExtraction,
  buildDocs,
} from './api-extractor';
import { findPackageDirs, paths as cliPaths } from '../../lib/paths';

export default async (opts: OptionValues) => {
  const tmpDir = cliPaths.resolveTargetRoot(
    './node_modules/.cache/api-extractor',
  );

  const isCiBuild = opts.ci;
  const isDocsBuild = opts.docs;
  const runTsc = opts.tsc;

  const parsedPaths = parseArrayOption(opts.paths);
  const isAllPackages = !Array.isArray(parsedPaths) || !parsedPaths?.length;
  const selectedPaths = isAllPackages ? await getWorkspacePkgs() : parsedPaths;
  const selectedPackageDirs = await findPackageDirs(selectedPaths);

  const allowWarnings = parseArrayOption(opts.allowWarnings);
  const omitMessages = parseArrayOption(opts.omitMessages);

  if (isAllPackages && !isCiBuild && !isDocsBuild) {
    console.log('');
    console.log(
      'TIP: You can generate api-reports for select packages by passing package paths:',
    );
    console.log('');
    console.log(
      '       yarn build:api-reports -p packages/config -p packages/core-plugin-api,plugins/*',
    );
    console.log('');
  }

  let temporaryTsConfigPath: string | undefined;
  if (selectedPackageDirs) {
    temporaryTsConfigPath = await createTemporaryTsConfig(selectedPackageDirs);
  }
  const tsconfigFilePath =
    temporaryTsConfigPath ?? cliPaths.resolveTargetRoot('tsconfig.json');

  if (runTsc) {
    console.log('# Compiling TypeScript');
    await generateTSC(tsconfigFilePath);
  }

  const { tsPackageDirs, cliPackageDirs } = await categorizePackageDirs(
    selectedPackageDirs,
  );

  if (tsPackageDirs.length > 0) {
    console.log('# Generating package API reports');
    await runApiExtraction({
      packageDirs: tsPackageDirs,
      outputDir: tmpDir,
      isLocalBuild: !isCiBuild,
      tsconfigFilePath,
      allowWarnings,
      omitMessages: Array.isArray(omitMessages) ? omitMessages : [],
    });
  }
  if (cliPackageDirs.length > 0) {
    console.log('# Generating package CLI reports');
    await runCliExtraction({
      packageDirs: cliPackageDirs,
      isLocalBuild: !isCiBuild,
    });
  }

  if (isDocsBuild) {
    console.log('# Generating package documentation');
    await buildDocs({
      inputDir: tmpDir,
      outputDir: cliPaths.resolveTargetRoot('docs/reference'),
    });
  }
};

/**
 * Generates the TypeScript declaration files for the specified project, using the provided `tsconfig.json` file.
 *
 * Any existing declaration files in the `dist-types` directory will be deleted before generating the new ones.
 *
 * If the `tsc` command exits with a non-zero exit code, the process will be terminated with the same exit code.
 *
 * @param tsconfigFilePath {string} The path to the `tsconfig.json` file to use for generating the declaration files.
 * @returns {Promise<void>} A promise that resolves when the declaration files have been generated.
 */
export async function generateTSC(tsconfigFilePath: string) {
  await fs.remove(cliPaths.resolveTargetRoot('dist-types'));
  const { status } = spawnSync(
    'yarn',
    [
      'tsc',
      ['--project', tsconfigFilePath],
      ['--skipLibCheck', 'false'],
      ['--incremental', 'false'],
    ].flat(),
    {
      stdio: 'inherit',
      shell: true,
      cwd: cliPaths.targetRoot,
    },
  );
  if (status !== 0) {
    process.exit(status || undefined);
  }
}

/**
 * Retrieves the list of package names in the "workspaces" field of the `package.json` file in the current workspace root.
 *
 * If the file does not exist, or the "workspaces" field is not present, returns `undefined`.
 *
 * @returns {Promise<string[] | undefined>} The list of package names, or `undefined` if not found.
 */
async function getWorkspacePkgs() {
  const pkgJson = await fs
    .readJson(cliPaths.resolveTargetRoot('package.json'))
    .catch(error => {
      if (error.code === 'ENOENT') {
        return undefined;
      }
      throw error;
    });
  const workspaces = pkgJson?.workspaces?.packages;
  return workspaces;
}

/**
 * Splits each string in the input array on comma, and returns an array of the resulting substrings.
 * If the input array is `undefined`, returns `undefined`. If the input value is `true` or `false`,
 * returns the value as-is.
 *
 * @param value An array of strings to be split on comma, or a boolean value (inherithed from commanderjs array args).
 * @returns An array of the resulting substrings, the original boolean value, or `undefined` if the input value is `undefined`.
 *
 * @example
 * parseOption(['foo,bar,baz'])
 * // returns ['foo', 'bar', 'baz']
 *
 * parseOption(true)
 * // returns true
 *
 * parseOption()
 * // returns undefined
 */
function parseArrayOption(value: string[] | boolean | undefined) {
  if (typeof value === 'boolean') {
    return value;
  }
  return value?.flatMap((str: string) =>
    str.includes(',') ? str.split(',') : str,
  );
}
