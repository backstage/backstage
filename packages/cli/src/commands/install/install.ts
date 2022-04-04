/*
 * Copyright 2021 The Backstage Authors
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
  Step,
  PackageWithInstallRecipe,
  PeerPluginDependencies,
} from './types';
import { fetchPackageInfo } from '../../lib/versioning';
import { NotFoundError } from '../../lib/errors';
import * as stepDefinitionMap from './steps';
import { OptionValues } from 'commander';
import fs from 'fs-extra';

const stepDefinitions = Object.values(stepDefinitionMap);

async function fetchPluginPackage(
  id: string,
): Promise<PackageWithInstallRecipe> {
  const searchNames = [`@backstage/plugin-${id}`, `backstage-plugin-${id}`, id];

  for (const name of searchNames) {
    try {
      const packageInfo = (await fetchPackageInfo(
        name,
      )) as PackageWithInstallRecipe;
      return packageInfo;
    } catch (error) {
      if (error.name !== 'NotFoundError') {
        throw error;
      }
    }
  }

  throw new NotFoundError(
    `No matching package found for '${id}', tried ${searchNames.join(', ')}`,
  );
}

type Steps = Array<{
  type: string;
  step: Step;
}>;

class PluginInstaller {
  static async resolveSteps(
    pkg: PackageWithInstallRecipe,
    versionToInstall?: string,
  ) {
    const steps: Steps = [];

    // collectDependencies
    // TODO: Deps mean the plugin package itself, and any other backstage plugins/packages it depends on, in its installation recipe.
    const dependencies = [];
    dependencies.push({
      target: 'packages/app',
      type: 'dependencies' as const,
      name: pkg.name,
      query: versionToInstall || `^${pkg.version}`,
    });
    steps.push({
      type: 'dependencies',
      step: stepDefinitionMap.dependencies.create({ dependencies }),
    });

    for (const step of pkg.experimentalInstallationRecipe?.steps ?? []) {
      const { type } = step;

      const definition = stepDefinitions.find(d => d.type === type);
      if (definition) {
        steps.push({
          type,
          step: definition.deserialize(step, pkg),
        });
      } else {
        throw new Error(`Unsupported step type: ${type}`);
      }
    }

    return steps;
  }

  constructor(private readonly steps: Steps) {}

  async run() {
    for (const { type, step } of this.steps) {
      // TODO(Rugvip): Add spinners, nicer message about the step.
      console.log(`Running step ${type}`);
      await step.run();
    }
  }
}

async function installPluginAndPeerPlugins(pkg: PackageWithInstallRecipe) {
  const pluginDeps: PeerPluginDependencies = new Map();
  pluginDeps.set(pkg.name, { pkg });
  await loadPeerPluginDeps(pkg, pluginDeps);

  console.log(`Installing ${pkg.name} AND any peer plugin dependencies.`);
  for (const [_pluginDepName, pluginDep] of pluginDeps.entries()) {
    const { pkg: pluginDepPkg, versionToInstall } = pluginDep;
    console.log(
      `Installing plugin: ${pluginDepPkg.name}: ${
        versionToInstall || pluginDepPkg.version
      }`,
    );
    const steps = await PluginInstaller.resolveSteps(
      pluginDepPkg,
      versionToInstall,
    );
    const installer = new PluginInstaller(steps);
    await installer.run();
  }
}

async function loadPackageJson(
  plugin: string,
): Promise<PackageWithInstallRecipe> {
  if (plugin.endsWith('package.json')) {
    // Install from local package if pluginId is a package.json file - needs to be absolute path
    return await fs.readJson(plugin);
  }
  return await fetchPluginPackage(plugin);
}

async function loadPeerPluginDeps(
  pkg: PackageWithInstallRecipe,
  pluginMap: PeerPluginDependencies,
) {
  for (const [pluginId, pluginVersion] of Object.entries(
    pkg.experimentalInstallationRecipe?.peerPluginDependencies ?? {},
  )) {
    const depPkg = await loadPackageJson(pluginId);
    if (!pluginMap.get(depPkg.name)) {
      pluginMap.set(depPkg.name, {
        pkg: depPkg,
        versionToInstall: pluginVersion,
      });
      await loadPeerPluginDeps(depPkg, pluginMap);
    }
  }
}

export default async (pluginId?: string, cmd?: OptionValues) => {
  const from = pluginId || cmd?.from;
  // TODO(himanshu): If no plugin id is provided, it should list all plugins available. Maybe in some other command?
  if (!from) {
    throw new Error(
      'Missing both <plugin-id> or a package.json file path in the --from flag.',
    );
  }
  const pkg = await loadPackageJson(from);
  await installPluginAndPeerPlugins(pkg);
};
