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

import { Command } from 'commander';
import openBrowser from 'react-dev-utils/openBrowser';
import { createLogger } from '../../lib/utility';
import { runMkdocsServer } from '../../lib/mkdocsServer';
import { LogFunc, waitForSignal } from '../../lib/run';

export default async function serveMkdocs(cmd: Command) {
  const logger = createLogger({ verbose: cmd.verbose });

  const dockerAddr = `http://0.0.0.0:${cmd.port}`;
  const localAddr = `http://127.0.0.1:${cmd.port}`;
  const expectedDevAddr = cmd.docker ? dockerAddr : localAddr;
  // We want to open browser only once based on a log.
  let boolOpenBrowserTriggered = false;

  const logFunc: LogFunc = data => {
    // Sometimes the lines contain an unnecessary extra new line in between
    const logLines = data.toString().split('\n');
    const logPrefix = cmd.docker ? '[docker/mkdocs]' : '[mkdocs]';
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
    port: cmd.port,
    dockerImage: cmd.dockerImage,
    useDocker: cmd.docker,
    stdoutLogFunc: logFunc,
    stderrLogFunc: logFunc,
  });

  // Keep waiting for user to cancel the process
  await waitForSignal([childProcess]);
}
