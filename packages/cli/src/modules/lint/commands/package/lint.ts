/*
 * Copyright 2020 The Backstage Authors
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
import { OptionValues } from 'commander';
import { paths } from '../../../../lib/paths';
import { ESLint } from 'eslint';
import { lintConfigSchema } from '../../lintConfigSchema';

export default async (directories: string[], opts: OptionValues) => {
  const eslint = new ESLint({
    cwd: paths.targetDir,
    fix: opts.fix,
    extensions: ['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs'],
  });

  const results = await eslint.lintFiles(
    directories.length ? directories : ['.'],
  );

  const maxWarnings = opts.maxWarnings ?? -1;
  const ignoreWarnings = +maxWarnings === -1;

  const schemaErrors = await lintConfigSchema(paths.targetDir);
  if (schemaErrors.length > 0) {
    results.push({
      filePath: paths.resolveTarget('package.json'),
      messages: schemaErrors.map(msg => ({
        ruleId: 'config-schema',
        severity: 2,
        message: msg,
        line: 1,
        column: 1,
        nodeType: 'Program',
      })),
      errorCount: schemaErrors.length,
      warningCount: 0,
      fatalErrorCount: schemaErrors.length,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      usedDeprecatedRules: [],
      suppressedMessages: [],
    });
  }

  const failed =
    results.some(r => r.errorCount > 0) ||
    (!ignoreWarnings &&
      results.reduce((current, next) => current + next.warningCount, 0) >
      maxWarnings);

  if (opts.fix) {
    await ESLint.outputFixes(results);
  }

  const formatter = await eslint.loadFormatter(opts.format);

  // This formatter uses the cwd to format file paths, so let's have that happen from the root instead
  if (opts.format === 'eslint-formatter-friendly') {
    process.chdir(paths.targetRoot);
  }

  const resultText = await formatter.format(results);

  if (resultText) {
    if (opts.outputFile) {
      await fs.writeFile(paths.resolveTarget(opts.outputFile), resultText);
    } else {
      console.log(resultText);
    }
  }

  if (failed) {
    process.exit(1);
  }
};
