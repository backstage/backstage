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
import {
  createTemporaryTsConfig,
  categorizePackageDirs,
  runApiExtraction,
  runCliExtraction,
  buildDocs,
} from './api-extractor';
import { findPackageDirs, paths as cliPaths } from '../../lib/paths';
import { generateTypeDeclarations } from './generateTypeDeclarations';

type Options = {
  ci?: boolean;
  docs?: boolean;
  tsc?: boolean;
  allowWarnings?: string;
  allowAllWarnings?: boolean;
  omitMessages?: string;
  validateReleaseTags?: boolean;
} & OptionValues;

export const buildApiReports = async (paths: string[] = [], opts: Options) => {
  const tmpDir = cliPaths.resolveTargetRoot(
    './node_modules/.cache/api-extractor',
  );

  const isCiBuild = opts.ci;
  const isDocsBuild = opts.docs;
  const runTsc = opts.tsc;
  const allowWarnings = parseArrayOption(opts.allowWarnings);
  const allowAllWarnings = opts.allowAllWarnings;
  const omitMessages = parseArrayOption(opts.omitMessages);

  const isAllPackages = !paths?.length;
  const selectedPaths = isAllPackages
    ? await getWorkspacePackagePathPatterns()
    : paths;
  const selectedPackageDirs = await findPackageDirs(selectedPaths);

  if (isAllPackages && !isCiBuild && !isDocsBuild) {
    console.log('');
    console.log(
      'TIP: You can generate api-reports for select packages by passing package paths:',
    );
    console.log('');
    console.log(
      '       yarn build:api-reports packages/config packages/core-plugin-api plugins/*',
    );
    console.log('');
  }

  let temporaryTsConfigPath: string | undefined;
  if (!isAllPackages) {
    temporaryTsConfigPath = await createTemporaryTsConfig(selectedPackageDirs);
  }
  const tsconfigFilePath =
    temporaryTsConfigPath ?? cliPaths.resolveTargetRoot('tsconfig.json');

  if (runTsc) {
    console.log('# Compiling TypeScript');
    await generateTypeDeclarations(tsconfigFilePath);
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
      allowWarnings: allowAllWarnings || allowWarnings,
      omitMessages: Array.isArray(omitMessages) ? omitMessages : [],
      validateReleaseTags: opts.validateReleaseTags,
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
 * Retrieves the list of package names in the "workspaces" field of the `package.json` file in the current workspace root.
 *
 * If the file does not exist, or the "workspaces" field is not present, returns `undefined`.
 *
 * @returns {Promise<string[] | undefined>} The list of package names, or `undefined` if not found.
 */
async function getWorkspacePackagePathPatterns() {
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
 * Splits the input string on comma, and returns an array of the resulting substrings.
 * for `undefined` or an empty string, returns an empty array.
 *
 * @param value A string to be split on comma.
 * @returns An array of the resulting substrings, or an empty array if the input value is `undefined` or an empty string.
 *
 * @example
 * parseOption('foo,bar,baz')
 * // returns ['foo', 'bar', 'baz']
 *
 * parseOption('')
 * // returns []
 *
 * parseOption()
 * // returns []
 */
function parseArrayOption(value: string | undefined) {
  return value ? value.split(',').map(s => s.trim()) : [];
}
