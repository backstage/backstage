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

import { Step, PackageWithInstallRecipe } from './types';
import { fetchPackageInfo } from '../../lib/versioning';
import { NotFoundError } from '../../lib/errors';
import * as stepDefinitionMap from './steps';
import { Command } from 'commander';
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
  static async resolveSteps(pkg: PackageWithInstallRecipe) {
    const steps: Steps = [];

    // collectDependencies
    // TODO: Deps mean the plugin package itself, and any other backstage plugins/packages it depends on, in its installation recipe.
    const dependencies = [];
    dependencies.push({
      target: 'packages/app',
      type: 'dependencies' as const,
      name: pkg.name,
      query: `^${pkg.version}`,
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

export default async (pluginId?: string, cmd?: Command) => {
  // TODO(himanshu): If no plugin id is provided, it should list all plugins available. Maybe in some other command?

  let pkg: PackageWithInstallRecipe;
  if (pluginId) {
    pkg = await fetchPluginPackage(pluginId);
  } else if (cmd?.from) {
    // TODO(himanshu): Also support reading directly from url
    pkg = await fs.readJson(cmd.from);
  } else {
    throw new Error(
      'Missing both <plugin-id> or a package.json file path in the --from flag.',
    );
  }

  const steps = await PluginInstaller.resolveSteps(pkg);
  const installer = new PluginInstaller(steps);
  await installer.run();
};
