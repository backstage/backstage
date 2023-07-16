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
import YAML from 'js-yaml';
import { isEqual, cloneDeep } from 'lodash';
import { join } from 'path';
import chalk from 'chalk';
import { relative as relativePath, resolve as resolvePath } from 'path';
import Parser from '@apidevtools/swagger-parser';
import { runner } from './runner';
import { paths as cliPaths } from '../../lib/paths';
import { TS_MODULE, TS_SCHEMA_PATH, YAML_SCHEMA_PATH } from './constants';
import { promisify } from 'util';
import { exec as execCb } from 'child_process';
import { getPortPromise } from 'portfinder';

const exec = promisify(execCb);

async function test(directoryPath: string) {
  const openapiPath = join(directoryPath, YAML_SCHEMA_PATH);
  if (!(await fs.pathExists(openapiPath))) {
    return;
  }
  try {
    const port = await getPortPromise({
      port: 20_000,
      stopPort: 21_000,
    });
    const reverseProxyPort = await getPortPromise({
      port: 21_001,
      stopPort: 22_000,
    });
    await exec(
      `yarn optic capture ${YAML_SCHEMA_PATH} https://localhost:${port} --proxy-port ${reverseProxyPort} --command "yarn test --ci --no-watch"`,
      {
        cwd: directoryPath,
        env: {
          NODE_ENV: 'test',
          PORT: `${port}`,
          REVERSE_PROXY_PORT: `${reverseProxyPort}`,
        },
      },
    );
    await exec(`yarn optic verify ${YAML_SCHEMA_PATH}`, {
      cwd: directoryPath,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function bulkCommand(paths: string[] = []): Promise<void> {
  const resultsList = await runner(paths, dir => test(dir));

  let failed = false;
  for (const { relativeDir, resultText } of resultsList) {
    if (resultText) {
      console.log();
      console.log(chalk.red(`OpenAPI validation failed in ${relativeDir}:`));
      console.log(resultText.trimStart());

      failed = true;
    }
  }

  if (failed) {
    process.exit(1);
  } else {
    console.log(chalk.green('Verified all files.'));
  }
}
