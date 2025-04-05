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

import {
  BackstagePackage,
  PackageGraph,
  PackageRole,
} from '@backstage/cli-node';
import { relative as relativePath } from 'path';
import { paths } from '../../../../lib/paths';
import { resolveLinkedWorkspace } from '../package/start/resolveLinkedWorkspace';
import { startPackage } from '../package/start/startPackage';

const ACCEPTED_PACKAGE_ROLES: Array<PackageRole | undefined> = [
  'frontend',
  'backend',
  'frontend-plugin',
  'backend-plugin',
];

export async function command(
  packageNames: string[],
  options: { plugin: string[]; config: string[]; link?: string },
) {
  const targetPackages = await findTargetPackages(packageNames, options.plugin);
  console.log(
    `Starting ${targetPackages.map(p => p.packageJson.name).join(', ')}`,
  );

  // Blocking
  await Promise.all(
    targetPackages.map(async pkg => {
      const opts = { config: [], require: undefined };
      return startPackage({
        role: pkg.packageJson.backstage?.role!,
        targetDir: pkg.dir,
        configPaths: opts.config as string[],
        checksEnabled: false,
        linkedWorkspace: await resolveLinkedWorkspace(options.link),
        inspectEnabled: false,
        inspectBrkEnabled: false,
        require: opts.require,
      });
    }),
  );
}

async function findTargetPackages(packageNames: string[], pluginIds: string[]) {
  const targetPackages = new Array<BackstagePackage>();

  const packages = await PackageGraph.listTargetPackages();

  // Priorotize plugin options, so that the `start` script can contain a list of packages,
  // but make them easy to override by running for example `yarn start --plugin catalog`
  for (const pluginId of pluginIds) {
    const matchingPackages = packages.filter(pkg => {
      return (
        pluginId === pkg.packageJson.backstage?.pluginId &&
        ACCEPTED_PACKAGE_ROLES.includes(pkg.packageJson.backstage.role)
      );
    });
    if (!matchingPackages) {
      throw new Error(
        `Unable to find any plugin packages with plugin ID '${pluginId}'. Make sure backstage.pluginId is set in your package.json files by running 'yarn fix --publish'.`,
      );
    }
    targetPackages.push(...matchingPackages);
  }
  if (targetPackages.length > 0) {
    return targetPackages;
  }

  // Next check if explicit package names are provided, use them in that case.
  for (const packageName of packageNames) {
    const matchingPackage = packages.find(pkg => {
      return packageName === pkg.packageJson.name;
    });
    if (!matchingPackage) {
      throw new Error(`Unable to find package by name '${packageName}'`);
    }
    targetPackages.push(matchingPackage);
  }

  if (targetPackages.length > 0) {
    return targetPackages;
  }

  // If on package names are provided, default to expect a single frontend and/or backend package
  for (const role of ['frontend', 'backend']) {
    const matchingPackages = packages.filter(
      pkg => pkg.packageJson.backstage?.role === role,
    );
    if (matchingPackages.length > 1) {
      // Final fallback is to check for the package path within the monorepo, packages/app or packages/backend
      const expectedPath = paths.resolveTargetRoot(
        role === 'frontend' ? 'packages/app' : 'packages/backend',
      );
      const matchByPath = matchingPackages.find(
        pkg => relativePath(expectedPath, pkg.dir) === '',
      );
      if (matchByPath) {
        targetPackages.push(matchByPath);
        continue;
      }

      throw new Error(
        `Found multiple packages with role '${role}' but none of the use the default path '${expectedPath}',` +
          `choose which packages you want to run by passing the package names explicitly ` +
          `as arguments, for example 'yarn backstage-cli repo start my-app my-backend'.`,
      );
    }

    targetPackages.push(...matchingPackages);
  }
  if (targetPackages.length === 0) {
    throw new Error(
      `Unable to find any packages with role 'frontend' or 'backend'`,
    );
  }
  return targetPackages;
}
