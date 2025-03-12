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

import chalk from 'chalk';
import { ESLint } from 'eslint';
import { OptionValues } from 'commander';
import { relative as relativePath } from 'path';
import { PackageGraph } from '@backstage/cli-node';
import { paths } from '../../../../lib/paths';

export async function command(opts: OptionValues) {
  const packages = await PackageGraph.listTargetPackages();

  const eslint = new ESLint({
    cwd: paths.targetDir,
    overrideConfig: {
      plugins: ['deprecation'],
      rules: {
        'deprecation/deprecation': 'error',
      },
      parserOptions: {
        project: [paths.resolveTargetRoot('tsconfig.json')],
      },
    },
    extensions: ['jsx', 'ts', 'tsx', 'mjs', 'cjs'],
  });

  const { stderr } = process;
  if (stderr.isTTY) {
    stderr.write('Initializing TypeScript...');
  }

  const deprecations = [];
  for (const [index, pkg] of packages.entries()) {
    const results = await eslint.lintFiles(pkg.dir);
    for (const result of results) {
      for (const message of result.messages) {
        if (message.ruleId !== 'deprecation/deprecation') {
          continue;
        }

        const path = relativePath(paths.targetRoot, result.filePath);
        deprecations.push({
          path,
          message: message.message,
          line: message.line,
          column: message.column,
        });
      }
    }

    if (stderr.isTTY) {
      stderr.clearLine(0);
      stderr.cursorTo(0);
      stderr.write(`Scanning packages ${index + 1}/${packages.length}`);
    }
  }

  if (stderr.isTTY) {
    stderr.clearLine(0);
    stderr.cursorTo(0);
  }

  if (opts.json) {
    console.log(JSON.stringify(deprecations, null, 2));
  } else {
    for (const d of deprecations) {
      const location = `${d.path}:${d.line}:${d.column}`;
      const wrappedMessage = d.message.replace(/\r?\n\s*/g, ' ');
      console.log(`${location} - ${chalk.yellow(wrappedMessage)}`);
    }
  }

  if (deprecations.length > 0) {
    process.exit(1);
  }
}
