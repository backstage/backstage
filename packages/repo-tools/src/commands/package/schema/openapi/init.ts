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
import { YAML_SCHEMA_PATH } from '../../../../lib/openapi/constants';
import { paths as cliPaths } from '../../../../lib/paths';
import chalk from 'chalk';
import { exec } from '../../../../lib/exec';
import {
  getPathToCurrentOpenApiSpec,
  getRelativePathToFile,
} from '../../../../lib/openapi/helpers';

const ROUTER_TEST_PATHS = [
  'src/service/router.test.ts',
  'src/service/createRouter.test.ts',
];

async function init() {
  try {
    await getPathToCurrentOpenApiSpec();
  } catch (err) {
    throw new Error(
      `OpenAPI.yaml not found in ${YAML_SCHEMA_PATH}. Please create one and retry this command.`,
    );
  }

  const opticConfigFilePath = await getRelativePathToFile('optic.yml');
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
        # Run with "PORT=3000 optic capture ${YAML_SCHEMA_PATH} --update interactive" in '${
      cliPaths.targetDir
    }'
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

export async function singleCommand() {
  try {
    await init();
    console.log(chalk.green(`Successfully configured.`));
  } catch (err) {
    console.log(chalk.red(`OpenAPI tooling initialization failed.`));
    console.log(err.message);
    process.exit(1);
  }
}
