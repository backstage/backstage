/*
 * Copyright 2024 The Backstage Authors
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
import { CliInitializer } from './wiring/CliInitializer';
import { discoverCliModules } from './wiring/discoverCliModules';

(async () => {
  const initializer = new CliInitializer();

  const discoveredModules = discoverCliModules();

  if (discoveredModules.length > 0) {
    for (const resolvedPath of discoveredModules) {
      initializer.add(import(resolvedPath));
    }
  } else {
    // No CLI modules found in the project root; fall back to the built-in
    // set while printing a deprecation warning.
    console.error(
      chalk.yellow(
        `No CLI modules found in the project root dependencies. ` +
          `Falling back to the built-in set of modules.\n` +
          `This fallback will be removed in a future release. ` +
          `Please add the CLI modules you need as devDependencies ` +
          `in your root package.json.\n`,
      ),
    );

    initializer.add(import('@backstage/cli-module-build'));
    initializer.add(import('@backstage/cli-module-config'));
    initializer.add(import('@backstage/cli-module-create-github-app'));
    initializer.add(import('@backstage/cli-module-info'));
    initializer.add(import('@backstage/cli-module-lint'));
    initializer.add(import('@backstage/cli-module-maintenance'));
    initializer.add(import('@backstage/cli-module-migrate'));
    initializer.add(import('@backstage/cli-module-new'));
    initializer.add(import('@backstage/cli-module-test-jest'));
    initializer.add(import('@backstage/cli-module-translations'));
    initializer.add(import('@backstage/cli-module-auth'));
  }

  await initializer.run();
})();
