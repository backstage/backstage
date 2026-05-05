/*
 * Copyright 2025 The Backstage Authors
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

import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { cli } from 'cleye';
import { relative as relativePath } from 'node:path';
import { PackageGraph } from '@backstage/cli-node';
import { targetPaths } from '@backstage/cli-common';
import type { CliCommandContext } from '@backstage/cli-node';
import { resolveOxlintBin, resolveOxlintConfig } from '../../lib/oxlint';

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
            'Specify a warning threshold, which can be used to force exit with an error status if there are too many warning-level rule violations',
        },
        since: {
          type: String,
          description:
            'Only lint packages that changed since the specified ref',
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

  // Group packages by their nearest oxlint config so we can run one
  // invocation per config. Most packages share the root config, but
  // packages with a local oxlint.config.mts get their own invocation.
  const configGroups = new Map<string | undefined, string[]>();
  for (const pkg of packages) {
    const configPath = resolveOxlintConfig(pkg.dir);
    const group = configGroups.get(configPath);
    if (group) {
      group.push(relativePath(targetPaths.rootDir, pkg.dir));
    } else {
      configGroups.set(configPath, [
        relativePath(targetPaths.rootDir, pkg.dir),
      ]);
    }
  }

  const oxlintBin = resolveOxlintBin();
  let failed = false;
  let output = '';

  for (const [configPath, dirs] of configGroups) {
    const oxlintArgs: string[] = [];

    if (configPath) {
      oxlintArgs.push('-c', configPath);
    }

    oxlintArgs.push('--type-aware', '--type-check');

    if (fix) {
      oxlintArgs.push('--fix');
    }

    if (format && format !== 'default') {
      oxlintArgs.push('--format', format);
    }

    if (maxWarnings !== undefined) {
      oxlintArgs.push('--max-warnings', String(maxWarnings));
    }

    oxlintArgs.push(...dirs);

    const result = spawnSync(oxlintBin, oxlintArgs, {
      cwd: targetPaths.rootDir,
      stdio: outputFile ? ['inherit', 'pipe', 'inherit'] : 'inherit',
    });

    if (outputFile && result.stdout) {
      output += result.stdout;
    }

    if (result.status !== 0 && result.status !== null) {
      failed = true;
    }
  }

  if (outputFile && output) {
    writeFileSync(outputFile, output);
  }

  if (failed) {
    process.exit(1);
  }
};
