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

import fs from 'fs-extra';
import { targetPaths } from '@backstage/cli-common';
import { ESLint } from 'eslint';
import type { PackageLintOptions } from './lint';

export default async (opts: PackageLintOptions) => {
  const { fix, outputFile, maxWarnings, directories } = opts;
  const format = opts.format ?? 'eslint-formatter-friendly';

  const eslint = new ESLint({
    cwd: targetPaths.dir,
    fix,
    extensions: ['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs'],
  });

  const results = await eslint.lintFiles(
    directories.length ? directories : ['.'],
  );

  const maxWarningsNum = maxWarnings ? +maxWarnings : -1;
  const ignoreWarnings = maxWarningsNum === -1;

  const failed =
    results.some(r => r.errorCount > 0) ||
    (!ignoreWarnings &&
      results.reduce((current, next) => current + next.warningCount, 0) >
        maxWarningsNum);

  if (fix) {
    await ESLint.outputFixes(results);
  }

  const formatter = await eslint.loadFormatter(format);

  // This formatter uses the cwd to format file paths, so let's have that happen from the root instead
  if (format === 'eslint-formatter-friendly') {
    process.chdir(targetPaths.rootDir);
  }

  const resultText = await formatter.format(results);

  if (resultText) {
    if (outputFile) {
      await fs.writeFile(targetPaths.resolve(outputFile), resultText);
    } else {
      console.log(resultText);
    }
  }

  if (failed) {
    process.exit(1);
  }
};
