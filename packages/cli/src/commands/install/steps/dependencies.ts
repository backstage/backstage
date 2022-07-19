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
import { paths } from '../../../lib/paths';
import { run } from '../../../lib/run';
import { Step, createStepDefinition } from '../types';

type Data = {
  dependencies: Array<{
    target: string;
    type: 'dependencies';
    name: string;
    query: string;
  }>;
};

class DependenciesStep implements Step {
  constructor(private readonly data: Data) {}

  async run() {
    const { dependencies } = this.data;
    // yarn --cwd packages/app add
    const byTarget = groupBy(dependencies, 'target');

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
}

export const dependencies = createStepDefinition<Data>({
  type: 'dependencies',

  deserialize() {
    throw new Error('The dependency step may not be defined in JSON');
  },

  create(data: Data) {
    return new DependenciesStep(data);
  },
});
