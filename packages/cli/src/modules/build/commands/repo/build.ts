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
import { Command, OptionValues } from 'commander';
import { relative as relativePath } from 'path';
import { buildPackages, getOutputsForRole } from '../../lib/builder';
import { paths } from '../../../../lib/paths';
import {
  BackstagePackage,
  PackageGraph,
  PackageRoles,
} from '@backstage/cli-node';
import { runParallelWorkers } from '../../../../lib/parallel';
import { buildFrontend } from '../../lib/buildFrontend';
import { buildBackend } from '../../lib/buildBackend';
import { createScriptOptionsParser } from '../../../../commands/repo/optionsParser';

export async function command(opts: OptionValues, cmd: Command): Promise<void> {
  let packages = await PackageGraph.listTargetPackages();
  const shouldUseRspack = Boolean(process.env.EXPERIMENTAL_RSPACK);

  const rspack = shouldUseRspack
    ? (require('@rspack/core') as typeof import('@rspack/core').rspack)
    : undefined;

  if (opts.since) {
    const graph = PackageGraph.fromPackages(packages);
    const changedPackages = await graph.listChangedPackages({
      ref: opts.since,
      analyzeLockfile: true,
    });
    const withDevDependents = graph.collectPackageNames(
      changedPackages.map(pkg => pkg.name),
      pkg => pkg.localDevDependents.keys(),
    );
    packages = Array.from(withDevDependents).map(name => graph.get(name)!);
  }

  const apps = new Array<BackstagePackage>();
  const backends = new Array<BackstagePackage>();

  const parseBuildScript = createScriptOptionsParser(cmd, ['package', 'build']);

  const options = packages.flatMap(pkg => {
    const role =
      pkg.packageJson.backstage?.role ??
      PackageRoles.detectRoleFromPackage(pkg.packageJson);
    if (!role) {
      console.warn(`Ignored ${pkg.packageJson.name} because it has no role`);
      return [];
    }

    if (role === 'frontend') {
      apps.push(pkg);
      return [];
    } else if (role === 'backend') {
      backends.push(pkg);
      return [];
    }

    const outputs = getOutputsForRole(role);
    if (outputs.size === 0) {
      console.warn(`Ignored ${pkg.packageJson.name} because it has no output`);
      return [];
    }

    const buildOptions = parseBuildScript(pkg.packageJson.scripts?.build);
    if (!buildOptions) {
      console.warn(
        `Ignored ${pkg.packageJson.name} because it does not have a matching build script`,
      );
      return [];
    }

    return {
      targetDir: pkg.dir,
      packageJson: pkg.packageJson,
      outputs,
      logPrefix: `${chalk.cyan(relativePath(paths.targetRoot, pkg.dir))}: `,
      workspacePackages: packages,
      minify: opts.minify ?? buildOptions.minify,
    };
  });

  console.log('Building packages');
  await buildPackages(options);

  if (opts.all) {
    console.log('Building apps');
    await runParallelWorkers({
      items: apps,
      parallelismFactor: 1 / 2,
      worker: async pkg => {
        const buildOptions = parseBuildScript(pkg.packageJson.scripts?.build);
        if (!buildOptions) {
          console.warn(
            `Ignored ${pkg.packageJson.name} because it does not have a matching build script`,
          );
          return;
        }
        await buildFrontend({
          targetDir: pkg.dir,
          configPaths: (buildOptions.config as string[]) ?? [],
          writeStats: Boolean(buildOptions.stats),
          rspack,
        });
      },
    });

    console.log('Building backends');
    await runParallelWorkers({
      items: backends,
      parallelismFactor: 1 / 2,
      worker: async pkg => {
        const buildOptions = parseBuildScript(pkg.packageJson.scripts?.build);
        if (!buildOptions) {
          console.warn(
            `Ignored ${pkg.packageJson.name} because it does not have a matching build script`,
          );
          return;
        }
        await buildBackend({
          targetDir: pkg.dir,
          skipBuildDependencies: true,
          minify: opts.minify ?? buildOptions.minify,
        });
      },
    });
  }
}
