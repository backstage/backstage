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
import { resolve as resolvePath } from 'path';
import fs from 'fs-extra';
import { spawnSync } from 'child_process';
import {
  findSpecificPackageDirs,
  createTemporaryTsConfig,
  findPackageDirs,
  categorizePackageDirs,
  runApiExtraction,
  runCliExtraction,
  buildDocs,
} from './api-extractor';
import { paths as cliPaths } from '../../lib/paths';

export default async (paths: string[], opts: OptionValues) => {
  console.log(opts);
  console.log({
    ownDir: cliPaths.ownDir,
    ownRoot: cliPaths.ownRoot,
    targetDir: cliPaths.targetDir,
    targetRoot: cliPaths.targetRoot,
    'process.cwd()': process.cwd(),
  });
  const tmpDir = resolvePath(
    cliPaths.targetRoot,
    './node_modules/.cache/api-extractor',
  );

  const projectRoot = resolvePath(cliPaths.targetRoot);
  const isCiBuild = opts.ci;
  const isDocsBuild = opts.docs;
  const runTsc = opts.tsc;
  const packageRoots = opts.folders;
  const allowWarnings: boolean | string[] = opts.allowWarnings;
  const omitMessages = opts.omitMessages;

  const selectedPackageDirs = await findSpecificPackageDirs(paths);

  if (selectedPackageDirs && isCiBuild) {
    throw new Error(
      'Package path arguments are not supported together with the --ci flag',
    );
  }
  if (!selectedPackageDirs && !isCiBuild && !isDocsBuild) {
    console.log('');
    console.log(
      'TIP: You can generate api-reports for select packages by passing package paths:',
    );
    console.log('');
    console.log(
      '       yarn build:api-reports packages/config packages/core-plugin-api',
    );
    console.log('');
  }

  let temporaryTsConfigPath: string | undefined;
  if (selectedPackageDirs) {
    temporaryTsConfigPath = await createTemporaryTsConfig(selectedPackageDirs);
  }
  const tsconfigFilePath =
    temporaryTsConfigPath ?? resolvePath(projectRoot, 'tsconfig.json');

  if (runTsc) {
    await fs.remove(resolvePath(projectRoot, 'dist-types'));
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
        cwd: projectRoot,
      },
    );
    if (status !== 0) {
      process.exit(status || undefined);
    }
  }

  const packageDirs =
    selectedPackageDirs ?? (await findPackageDirs(packageRoots));

  const { tsPackageDirs, cliPackageDirs } = await categorizePackageDirs(
    projectRoot,
    packageDirs,
  );

  if (tsPackageDirs.length > 0) {
    console.log('# Generating package API reports');
    await runApiExtraction({
      packageDirs: tsPackageDirs,
      outputDir: tmpDir,
      isLocalBuild: !isCiBuild,
      tsconfigFilePath,
      allowWarnings,
      omitMessages,
    });
  }
  if (cliPackageDirs.length > 0) {
    console.log('# Generating package CLI reports');
    await runCliExtraction({
      projectRoot,
      packageDirs: cliPackageDirs,
      isLocalBuild: !isCiBuild,
    });
  }

  if (isDocsBuild) {
    console.log('# Generating package documentation');
    await buildDocs({
      inputDir: tmpDir,
      outputDir: resolvePath(projectRoot, 'docs/reference'),
    });
  }
};
