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
import { Command } from 'commander';
import { relative as relativePath } from 'path';
import { buildPackages, getOutputsForRole } from '../../lib/builder';
import { PackageGraph } from '../../lib/monorepo';
import { ExtendedPackage } from '../../lib/monorepo/PackageGraph';
import { paths } from '../../lib/paths';
import { getRoleInfo } from '../../lib/role';
import { buildApp } from '../build/buildApp';
import { buildBackend } from '../build/buildBackend';

function parseScriptOptions(
  cmd: Command,
  scriptCommandName: string,
  args: string[],
) {
  let rootCommand = cmd;
  while (rootCommand.parent) {
    rootCommand = rootCommand.parent;
  }
  const scriptCommand = rootCommand.commands.find(c => c.name() === 'script')!;
  const targetCommand = scriptCommand.commands.find(
    c => c.name() === scriptCommandName,
  );
  if (!targetCommand) {
    throw new Error(`Could not find script command '${scriptCommandName}'`);
  }

  const currentOpts = targetCommand._optionValues;
  const currentStore = targetCommand._storeOptionsAsProperties;

  const result: Record<string, any> = {};
  targetCommand._storeOptionsAsProperties = false;
  targetCommand._optionValues = result;

  targetCommand.parseOptions(args);

  targetCommand._storeOptionsAsProperties = currentOpts;
  targetCommand._optionValues = currentStore;

  return result;
}

function parseBackstageScript(
  cmd: Command,
  expectedScript: string,
  scriptStr?: string,
) {
  const expectedPrefix = `backstage-cli script ${expectedScript}`;
  if (!scriptStr || !scriptStr.startsWith(expectedPrefix)) {
    return undefined;
  }

  const argsStr = scriptStr.slice(expectedPrefix.length).trim();
  return parseScriptOptions(cmd, expectedScript, argsStr.split(' '));
}

export async function command(cmd: Command): Promise<void> {
  const packages = await PackageGraph.listTargetPackages();
  const bundledPackages = new Array<ExtendedPackage>();

  const options = packages.flatMap(pkg => {
    const role = pkg.packageJson.backstage?.role;
    if (!role) {
      console.warn(`Ignored ${pkg.packageJson.name} because it has no role`);
      return [];
    }

    const outputs = getOutputsForRole(role);
    if (outputs.size === 0) {
      if (getRoleInfo(role).output.includes('bundle')) {
        bundledPackages.push(pkg);
      } else {
        console.warn(
          `Ignored ${pkg.packageJson.name} because it has no output`,
        );
      }
      return [];
    }

    const buildScript = pkg.packageJson.scripts?.build;
    if (!buildScript) {
      console.warn(
        `Ignored ${pkg.packageJson.name} because it has no build script`,
      );
      return [];
    }

    const buildOptions = parseBackstageScript(cmd, 'build', buildScript);
    if (!buildOptions) {
      console.warn(
        `Ignored ${pkg.packageJson.name} because it has a custom build script, '${buildScript}'`,
      );
      return [];
    }

    return {
      targetDir: pkg.dir,
      outputs,
      logPrefix: `${chalk.cyan(relativePath(paths.targetRoot, pkg.dir))}: `,
      minify: buildOptions.minify,
      useApiExtractor: buildOptions.experimentalTypeBuild,
    };
  });

  console.log('Building packages');
  await buildPackages(options);

  if (cmd.all) {
    const apps = bundledPackages.filter(
      pkg => pkg.packageJson.backstage?.role === 'app',
    );

    console.log('Building apps');
    await Promise.all(
      apps.map(async pkg => {
        const buildOptions = parseBackstageScript(
          cmd,
          'build',
          pkg.packageJson.scripts?.build,
        );
        await buildApp({
          targetDir: pkg.dir,
          configPaths: (buildOptions?.config as string[]) ?? [],
          writeStats: Boolean(buildOptions?.stats),
        });
      }),
    );

    console.log('Building backends');
    const backends = bundledPackages.filter(
      pkg => pkg.packageJson.backstage?.role === 'backend',
    );
    await Promise.all(
      backends.map(async pkg => {
        await buildBackend({
          targetDir: pkg.dir,
          skipBuildDependencies: true,
        });
      }),
    );
  }
}
