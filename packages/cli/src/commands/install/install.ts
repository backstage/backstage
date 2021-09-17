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

import fs from 'fs-extra';
import chalk from 'chalk';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import {
  Step,
  StepAppRoute,
  StepMessage,
  StepDependencies,
  PackageWithInstallRecipe,
} from './types';
import { fetchPackageInfo } from '../../lib/versioning';
import { NotFoundError } from '../../lib/errors';
import { paths } from '../../lib/paths';
import { run } from '../../lib/run';

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

class PluginInstaller {
  static async resolveSteps(pkg: PackageWithInstallRecipe) {
    const steps = new Array<Step>();

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
      dependencies,
    });

    // TODO(Rugvip): validate input
    for (const step of pkg.installationRecipe?.steps ?? []) {
      if (step.type === 'app-route') {
        steps.push({
          ...step,
          packageName: pkg.name,
        });
      } else if (step.type === 'message') {
        steps.push(step);
      } else {
        throw new Error(`Unsupported step type: ${step.type}`);
      }
    }

    return steps;
  }

  constructor(private readonly steps: Step[]) {}

  /**
   * Updates package.json files with the dependencies and devDependencies.
   */
  private async stepDependencies(step: StepDependencies) {
    // yarn --cwd packages/app add
    const byTarget = groupBy(step.dependencies, 'target');

    // Go through each target package and install the dependencies.
    for (const [target, deps] of Object.entries(byTarget)) {
      const pkgPath = paths.resolveTargetRoot(target, 'package.json');
      const pkgJson = await fs.readJson(pkgPath);

      // Populate each type of dependency object, dependencies, devDependencies, etc.
      const depTypes = new Set<string>();
      for (const dep of deps) {
        depTypes.add(dep.type);
        pkgJson[dep.type][dep.name] = dep.query;
      }

      // Be nice and sort the dependencies alphabetically
      for (const depType of depTypes) {
        pkgJson[depType] = Object.fromEntries(
          sortBy(Object.entries(pkgJson[depType]), ([key]) => key),
        );
      }
      await fs.writeJson(pkgPath, pkgJson, { spaces: 2 });
    }

    console.log();
    console.log(
      `Running ${chalk.blue('yarn install')} to install new versions`,
    );
    console.log();
    await run('yarn', ['install']);
  }

  private async stepAppRoute(step: StepAppRoute) {
    const appTsxPath = paths.resolveTargetRoot('packages/app/src/App.tsx');
    const contents = await fs.readFile(appTsxPath, 'utf-8');
    let failed = false;

    // Add a new route just above the end of the FlatRoutes block
    const contentsWithRoute = contents.replace(
      /(\s*)<\/FlatRoutes>/,
      `$1  <Route path="${step.path}" element={${step.element}} />$1</FlatRoutes>`,
    );
    if (contentsWithRoute === contents) {
      failed = true;
    }

    // Grab the component name from the element
    const componentName = step.element.match(/[A-Za-z0-9]+/)?.[0];
    if (!componentName) {
      throw new Error(`Could not find component name in ${step.element}`);
    }

    // Add plugin import
    // TODO(Rugvip): Attempt to add this among the other plugin imports
    const contentsWithImport = contentsWithRoute.replace(
      /^import /m,
      `import { ${componentName} } from '${step.packageName}';\nimport `,
    );
    if (contentsWithImport === contentsWithRoute) {
      failed = true;
    }

    if (failed) {
      console.log(
        'Failed to automatically add a route to package/app/src/App.tsx',
      );
      console.log(`Action needed, add the following:`);
      console.log(`1. import { ${componentName} } from '${step.packageName}';`);
      console.log(`2. <Route path="${step.path}" element={${step.element}} />`);
    } else {
      await fs.writeFile(appTsxPath, contentsWithImport);
    }
  }

  private async stepMessage(step: StepMessage) {
    console.log([step.message].flat().join(''));
  }

  async run() {
    for (const step of this.steps) {
      // TODO(Rugvip): Add spinners, nicer message about the step.
      console.log(`Running step ${step.type}`);
      if (step.type === 'dependencies') {
        await this.stepDependencies(step);
      } else if (step.type === 'app-route') {
        await this.stepAppRoute(step);
      } else if (step.type === 'message') {
        await this.stepMessage(step);
      }
    }
  }
}

export default async (pluginId: string) => {
  // TODO(himanshu): If no plugin id is provided, it should list all plugins available. Maybe in some other command?

  const pkg = await fetchPluginPackage(pluginId);
  const Steps = await PluginInstaller.resolveSteps(pkg);
  const installer = new PluginInstaller(Steps);
  await installer.run();
};
