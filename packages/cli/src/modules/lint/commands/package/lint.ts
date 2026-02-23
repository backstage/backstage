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

  let schemaFailed = false;
  if (directories.length === 0 || directories.includes('.')) {
    const pkgJsonPath = paths.resolveTarget('package.json');
    if (await fs.pathExists(pkgJsonPath)) {
      const pkgJson = await fs.readJson(pkgJsonPath);
      const hasConfigDts = await fs.pathExists(
        paths.resolveTarget('config.d.ts'),
      );
      const configSchemaPath =
        typeof pkgJson.configSchema === 'string'
          ? pkgJson.configSchema
          : undefined;
      const configSchemaDefined = pkgJson.configSchema !== undefined;
      const filesArray = Array.isArray(pkgJson.files) ? pkgJson.files : [];

      if (hasConfigDts) {
        if (!configSchemaDefined) {
          console.error(
            'Error: config.d.ts exists but is not referenced in package.json "configSchema".',
          );
          schemaFailed = true;
        }
        if (!filesArray.includes('config.d.ts')) {
          console.error(
            'Error: config.d.ts exists but is not included in package.json "files" array.',
          );
          schemaFailed = true;
        }
      }

      if (configSchemaPath) {
        const schemaFileExists = await fs.pathExists(
          paths.resolveTarget(configSchemaPath),
        );
        if (!schemaFileExists) {
          console.error(
            `Error: "configSchema" references "${configSchemaPath}" but the file does not exist.`,
          );
          schemaFailed = true;
        } else if (!filesArray.includes(configSchemaPath)) {
          console.error(
            `Error: "configSchema" file "${configSchemaPath}" is not included in package.json "files" array.`,
          );
          schemaFailed = true;
        }
      }
    }
  }

  const failed =
    schemaFailed ||
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
