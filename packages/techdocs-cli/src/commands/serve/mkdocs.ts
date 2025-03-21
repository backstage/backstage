/*
 * Copyright 2020 The Backstage Authors
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

import { OptionValues } from 'commander';
import openBrowser from 'react-dev-utils/openBrowser';
import { createLogger } from '../../lib/utility';
import { runMkdocsServer } from '../../lib/mkdocsServer';
import { LogFunc, waitForSignal } from '../../lib/run';
import { getMkdocsYml } from '@backstage/plugin-techdocs-node';
import fs from 'fs-extra';
import { checkIfDockerIsOperational } from './utils';

export default async function serveMkdocs(opts: OptionValues) {
  const logger = createLogger({ verbose: opts.verbose });

  const dockerAddr = `http://0.0.0.0:${opts.port}`;
  const localAddr = `http://127.0.0.1:${opts.port}`;
  const expectedDevAddr = opts.docker ? dockerAddr : localAddr;

  if (opts.docker) {
    const isDockerOperational = await checkIfDockerIsOperational(logger);
    if (!isDockerOperational) {
      return;
    }
  }

  const { path: mkdocsYmlPath, configIsTemporary } = await getMkdocsYml(
    './',
    opts.siteName,
  );

  // We want to open browser only once based on a log.
  let boolOpenBrowserTriggered = false;

  const logFunc: LogFunc = data => {
    // Sometimes the lines contain an unnecessary extra new line in between
    const logLines = data.toString().split('\n');
    const logPrefix = opts.docker ? '[docker/mkdocs]' : '[mkdocs]';
    logLines.forEach(line => {
      if (line === '') {
        return;
      }

      // Logs from container is verbose.
      logger.verbose(`${logPrefix} ${line}`);

      // When the server has started, open a new browser tab for the user.
      if (
        !boolOpenBrowserTriggered &&
        line.includes(`Serving on ${expectedDevAddr}`)
      ) {
        // Always open the local address, since 0.0.0.0 belongs to docker
        logger.info(`\nStarting mkdocs server on ${localAddr}\n`);
        openBrowser(localAddr);
        boolOpenBrowserTriggered = true;
      }
    });
  };
  // mkdocs writes all of its logs to stderr by default, and not stdout.
  // https://github.com/mkdocs/mkdocs/issues/879#issuecomment-203536006
  // Had me questioning this whole implementation for half an hour.

  // Commander stores --no-docker in cmd.docker variable
  const childProcess = await runMkdocsServer({
    port: opts.port,
    dockerImage: opts.dockerImage,
    dockerEntrypoint: opts.dockerEntrypoint,
    dockerOptions: opts.dockerOption,
    useDocker: opts.docker,
    stdoutLogFunc: logFunc,
    stderrLogFunc: logFunc,
  });

  // Keep waiting for user to cancel the process
  await waitForSignal([childProcess]);

  if (configIsTemporary) {
    process.on('exit', async () => {
      fs.rmSync(mkdocsYmlPath, {});
    });
  }
}
