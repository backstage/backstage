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
import { PackageGraph } from '../../lib/monorepo';
import { ExtendedPackage } from '../../lib/monorepo/PackageGraph';
import { runParallelWorkers } from '../../lib/parallel';
import { paths } from '../../lib/paths';
import { detectRoleFromPackage } from '../../lib/role';
import { buildFrontend } from '../build/buildFrontend';
import { buildBackend } from '../build/buildBackend';

function createScriptOptionsParser(anyCmd: Command, commandPath: string[]) {
  // Regardless of what command instance is passed in we want to find
  // the root command and resolve the path from there
  let rootCmd = anyCmd;
  while (rootCmd.parent) {
    rootCmd = rootCmd.parent;
  }

  // Now find the command that was requested
  let targetCmd = rootCmd as Command | undefined;
  for (const name of commandPath) {
    targetCmd = targetCmd?.commands.find(c => c.name() === name) as
      | Command
      | undefined;
  }

  if (!targetCmd) {
    throw new Error(
      `Could not find package command '${commandPath.join(' ')}'`,
    );
  }
  const cmd = targetCmd;

  const expectedScript = `backstage-cli ${commandPath.join(' ')}`;

  return (scriptStr?: string) => {
    if (!scriptStr || !scriptStr.startsWith(expectedScript)) {
      return undefined;
    }

    const argsStr = scriptStr.slice(expectedScript.length).trim();

    // Can't clone or copy or even use commands as prototype, so we mutate
    // the necessary members instead, and then reset them once we're done
    const currentOpts = (cmd as any)._optionValues;
    const currentStore = (cmd as any)._storeOptionsAsProperties;

    const result: Record<string, any> = {};
    (cmd as any)._storeOptionsAsProperties = false;
    (cmd as any)._optionValues = result;

    // Triggers the writing of options to the result object
    cmd.parseOptions(argsStr.split(' '));

    (cmd as any)._storeOptionsAsProperties = currentOpts;
    (cmd as any)._optionValues = currentStore;

    return result;
  };
}

export async function command(opts: OptionValues, cmd: Command): Promise<void> {
  let packages = await PackageGraph.listTargetPackages();

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

  const apps = new Array<ExtendedPackage>();
  const backends = new Array<ExtendedPackage>();

  const parseBuildScript = createScriptOptionsParser(cmd, ['package', 'build']);

  const options = packages.flatMap(pkg => {
    const role =
      pkg.packageJson.backstage?.role ?? detectRoleFromPackage(pkg.packageJson);
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
      minify: buildOptions.minify,
      useApiExtractor: buildOptions.experimentalTypeBuild,
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
        });
      },
    });
  }
}
