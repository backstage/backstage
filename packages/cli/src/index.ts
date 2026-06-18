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

async function main() {
  const initializer = new CliInitializer();

  const discoveredModules = discoverCliModules();

  for (const discoveredModule of discoveredModules) {
    initializer.add(
      import(discoveredModule.path).catch(error => {
        throw new Error(
          `Failed to load installed CLI module "${discoveredModule.name}": ${
            error instanceof Error ? error.message : String(error)
          }`,
          { cause: error },
        );
      }),
      discoveredModule.name,
    );
  }

  await initializer.run();
}

main().catch(error => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(chalk.red(message));
  process.exitCode = 1;
});
