/*
 * Copyright 2023 The Backstage Authors
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
import { join } from 'path';
import { YAML_SCHEMA_PATH } from '../../../../lib/openapi/constants';

import { paths as cliPaths } from '../../../../lib/paths';
import { runner } from '../../../../lib/runner';
import chalk from 'chalk';
import { exec } from '../../../../lib/exec';

const ROUTER_TEST_PATHS = [
  'src/service/router.test.ts',
  'src/service/createRouter.test.ts',
];

async function init(directoryPath: string) {
  const openapiPath = join(directoryPath, YAML_SCHEMA_PATH);
  if (!(await fs.pathExists(openapiPath))) {
    throw new Error(
      `You do not have an OpenAPI YAML file at ${openapiPath}. Please create one and retry this command. If you already have existing test cases for your router, see 'backstage-repo-tools package schema openapi test --update'`,
    );
  }
  const opticConfigFilePath = join(directoryPath, 'optic.yml');
  if (await fs.pathExists(opticConfigFilePath)) {
    throw new Error(`This directory already has an optic.yml file. Exiting.`);
  }
  await fs.writeFile(
    opticConfigFilePath,
    `ruleset:
    - breaking-changes
capture:
    ${YAML_SCHEMA_PATH}:
        # 🔧 Runnable example with simple get requests.
        # Run with "PORT=3000 optic capture ${YAML_SCHEMA_PATH} --update interactive" in '${directoryPath}'
        # You can change the server and the 'requests' section to experiment
        server:
            # This will not be used by 'backstage-repo-tools schema openapi test', but may be useful for interactive updates.
            url: http://localhost:3000
        requests:
            # ℹ️ Requests should be sent to the Optic proxy, the address of which is injected into 'run.command's env as OPTIC_PROXY (or the value of 'run.proxy_variable').
            run:
                # 🔧 Specify a command that will generate traffic
                command: yarn backstage-cli package test --no-watch ${ROUTER_TEST_PATHS.map(
                  e => `"${e}"`,
                ).join(' ')} 
  `,
  );
  if (await cliPaths.resolveTargetRoot('node_modules/.bin/prettier')) {
    await exec(`yarn prettier`, ['--write', opticConfigFilePath]);
  }
}

export default async function initCommand(paths: string[] = []) {
  const resultsList = await runner(paths, dir => init(dir), {
    concurrencyLimit: 5,
  });

  let failed = false;
  for (const { relativeDir, resultText } of resultsList) {
    if (resultText) {
      console.log();
      console.log(
        chalk.red(`Failed to initialize ${relativeDir} for OpenAPI commands.`),
      );
      console.log(resultText.trimStart());

      failed = true;
    }
  }

  if (failed) {
    process.exit(1);
  } else {
    console.log(chalk.green(`All directories have already been configured.`));
  }
}
