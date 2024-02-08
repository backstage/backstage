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
import { runKnipReports } from './knip-extractor';
import { resolvePackagePaths } from '../../lib/paths';

type Options = {
  ci?: boolean;
} & OptionValues;

export const buildKnipReports = async (paths: string[] = [], opts: Options) => {
  const isCiBuild = opts.ci;

  const isAllPackages = !paths?.length;
  const selectedPackageDirs = await resolvePackagePaths({
    paths,
    include: opts.include,
    exclude: opts.exclude,
  });

  if (isAllPackages && !isCiBuild) {
    console.log('');
    console.log(
      'TIP: You can generate knip-reports for select packages by passing package paths:',
    );
    console.log('');
    console.log(
      '       yarn build:knip-reports packages/config packages/core-plugin-api plugins/*',
    );
    console.log('');
  }

  if (selectedPackageDirs.length > 0) {
    console.log('# Generating package knip reports');
    await runKnipReports({
      packageDirs: selectedPackageDirs,
      isLocalBuild: !isCiBuild,
    });
  }
};
