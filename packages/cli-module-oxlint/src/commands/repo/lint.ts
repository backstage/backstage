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

import { cli } from 'cleye';
import { relative as relativePath } from 'node:path';
import { createScriptOptionsParser, PackageGraph } from '@backstage/cli-node';
import { targetPaths } from '@backstage/cli-common';
import type { CliCommandContext } from '@backstage/cli-node';
import { executeOxlint } from '../../lib/executeOxlint';

export default async ({ args, info }: CliCommandContext) => {
  const {
    flags: { fix, format, outputFile, maxWarnings, since },
  } = cli(
    {
      help: info,
      booleanFlagNegation: true,
      flags: {
        fix: {
          type: Boolean,
          description: 'Attempt to automatically fix violations',
        },
        format: {
          type: String,
          description:
            'Output format (default, checkstyle, github, gitlab, json, junit, sarif, stylish, unix)',
          default: 'default',
        },
        outputFile: {
          type: String,
          description: 'Write the lint report to a file instead of stdout',
        },
        maxWarnings: {
          type: Number,
          description:
            'Fail if more than this number of warnings. -1 allows warnings. (default: -1)',
        },
        since: {
          type: String,
          description:
            'Only lint packages that changed since the specified ref',
        },
        successCache: {
          type: Boolean,
          description:
            'Accepted for compatibility; Oxlint always checks selected packages.',
        },
        successCacheDir: {
          type: String,
          description:
            'Accepted for compatibility; no success cache is read or written.',
        },
      },
    },
    undefined,
    args,
  );

  if (!process.env.FORCE_COLOR) {
    process.env.FORCE_COLOR = '1';
  }

  let packages = await PackageGraph.listTargetPackages();

  if (since) {
    const graph = PackageGraph.fromPackages(packages);
    packages = await graph.listChangedPackages({
      ref: since,
      analyzeLockfile: true,
    });
  }

  // Per-package lint script options are honored, so that a package cannot
  // pass `repo lint` on CI while failing its own `yarn lint`.
  const parseLintScript = createScriptOptionsParser(
    'node bin/backstage-cli-module-oxlint package lint',
    {
      fix: { type: 'boolean' },
      'max-warnings': { type: 'string' },
    },
  );

  await executeOxlint({
    targets: packages
      .map(pkg => ({
        pkg,
        lintOptions: parseLintScript(pkg.packageJson.scripts?.lint),
      }))
      .filter(({ lintOptions }) => lintOptions !== undefined)
      .map(({ pkg, lintOptions }) => ({
        configDir: pkg.dir,
        directories: [relativePath(targetPaths.rootDir, pkg.dir)],
        maxWarnings:
          lintOptions?.['max-warnings'] === undefined
            ? undefined
            : Number(lintOptions['max-warnings']),
      })),
    cwd: targetPaths.rootDir,
    command: 'repo lint',
    fix,
    format,
    outputFile,
    maxWarnings,
  });
};
