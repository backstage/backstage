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

import { cli } from 'cleye';
import fs from 'fs-extra';
import { buildPackage, Output } from '../../../lib/builder';
import { findRoleFromCommand } from '../../../lib/role';
import {
  BackstagePackageJson,
  PackageGraph,
  PackageRoles,
} from '@backstage/cli-node';
import { targetPaths } from '@backstage/cli-common';

import { buildFrontend } from '../../../lib/buildFrontend';
import { buildBackend } from '../../../lib/buildBackend';
import { isValidUrl } from '../../../lib/urls';
import chalk from 'chalk';
import type { CliCommandContext } from '@backstage/cli-node';

export default async ({ args, info }: CliCommandContext) => {
  const {
    flags: {
      role,
      minify,
      skipBuildDependencies,
      stats,
      config,
      moduleFederation,
    },
  } = cli(
    {
      help: info,
      booleanFlagNegation: true,
      flags: {
        role: {
          type: String,
          description: 'Run the command with an explicit package role',
        },
        minify: {
          type: Boolean,
          description:
            'Minify the generated code. Does not apply to app package (app is minified by default).',
        },
        skipBuildDependencies: {
          type: Boolean,
          description:
            'Skip the automatic building of local dependencies. Applies to backend packages only.',
        },
        stats: {
          type: Boolean,
          description:
            'If bundle stats are available, write them to the output directory. Applies to app packages only.',
        },
        config: {
          type: [String],
          description:
            'Config files to load instead of app-config.yaml. Applies to app packages only.',
          default: [],
        },
        moduleFederation: {
          type: Boolean,
          description:
            'Build a package as a module federation remote. Applies to frontend plugin packages only.',
        },
      },
    },
    undefined,
    args,
  );

  const webpack = process.env.LEGACY_WEBPACK_BUILD
    ? (require('webpack') as typeof import('webpack'))
    : undefined;

  const resolvedRole = await findRoleFromCommand({ role });

  if (resolvedRole === 'frontend' || resolvedRole === 'backend') {
    const configPaths = config.map(arg => {
      if (isValidUrl(arg)) {
        return arg;
      }
      return targetPaths.resolve(arg);
    });

    if (resolvedRole === 'frontend') {
      return buildFrontend({
        targetDir: targetPaths.dir,
        configPaths,
        writeStats: Boolean(stats),
        webpack,
      });
    }
    return buildBackend({
      targetDir: targetPaths.dir,
      configPaths,
      skipBuildDependencies: Boolean(skipBuildDependencies),
      minify: Boolean(minify),
    });
  }

  let isModuleFederationRemote: boolean | undefined = undefined;
  if ((resolvedRole as string) === 'frontend-dynamic-container') {
    console.log(
      chalk.yellow(
        `⚠️  WARNING: The 'frontend-dynamic-container' package role is experimental and will receive immediate breaking changes in the future.`,
      ),
    );
    isModuleFederationRemote = true;
  }
  if (moduleFederation) {
    isModuleFederationRemote = true;
  }

  if (isModuleFederationRemote) {
    console.log('Building package as a module federation remote');
    return buildFrontend({
      targetDir: targetPaths.dir,
      configPaths: [],
      writeStats: Boolean(stats),
      isModuleFederationRemote,
      webpack,
    });
  }

  const roleInfo = PackageRoles.getRoleInfo(resolvedRole);

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

  const packageJson = (await fs.readJson(
    targetPaths.resolve('package.json'),
  )) as BackstagePackageJson;

  return buildPackage({
    outputs,
    packageJson,
    minify: Boolean(minify),
    workspacePackages: await PackageGraph.listTargetPackages(),
  });
};
