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

import { OptionValues } from 'commander';
import { buildPackage, Output } from '../../../lib/builder';
import { findRoleFromCommand } from '../../../../../lib/role';
import { PackageGraph, PackageRoles } from '@backstage/cli-node';
import { paths } from '../../../../../lib/paths';
import { buildFrontend } from '../../../lib/buildFrontend';
import { buildBackend } from '../../../lib/buildBackend';
import { isValidUrl } from '../../../../../lib/urls';
import chalk from 'chalk';

export async function command(opts: OptionValues): Promise<void> {
  const rspack = process.env.EXPERIMENTAL_RSPACK
    ? (require('@rspack/core') as typeof import('@rspack/core').rspack)
    : undefined;

  const role = await findRoleFromCommand(opts);

  if (role === 'frontend' || role === 'backend') {
    const configPaths = (opts.config as string[]).map(arg => {
      if (isValidUrl(arg)) {
        return arg;
      }
      return paths.resolveTarget(arg);
    });

    if (role === 'frontend') {
      return buildFrontend({
        targetDir: paths.targetDir,
        configPaths,
        writeStats: Boolean(opts.stats),
        rspack,
      });
    }
    return buildBackend({
      targetDir: paths.targetDir,
      configPaths,
      skipBuildDependencies: Boolean(opts.skipBuildDependencies),
      minify: Boolean(opts.minify),
    });
  }

  // experimental
  if ((role as string) === 'frontend-dynamic-container') {
    console.log(
      chalk.yellow(
        `⚠️  WARNING: The 'frontend-dynamic-container' package role is experimental and will receive immediate breaking changes in the future.`,
      ),
    );
    return buildFrontend({
      targetDir: paths.targetDir,
      configPaths: [],
      writeStats: Boolean(opts.stats),
      isModuleFederationRemote: true,
      rspack,
    });
  }

  const roleInfo = PackageRoles.getRoleInfo(role);

  const outputs = new Set<Output>();

  if (roleInfo.output.includes('cjs')) {
    outputs.add(Output.cjs);
  }
  if (roleInfo.output.includes('esm')) {
    outputs.add(Output.esm);
  }
  if (roleInfo.output.includes('types')) {
    outputs.add(Output.types);
  }

  return buildPackage({
    outputs,
    minify: Boolean(opts.minify),
    workspacePackages: await PackageGraph.listTargetPackages(),
  });
}
