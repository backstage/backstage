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
import { runDocServer, generatorDefaults } from '../../lib/docServer';
import { RunOnOutput } from '@backstage/cli-common';
import { getMkdocsYml } from '@backstage/plugin-techdocs-node';
import fs from 'fs-extra';
import { checkIfDockerIsOperational } from './utils';

export default async function serveEngine(opts: OptionValues) {
  const logger = createLogger({ verbose: opts.verbose });

  const generatorType = opts.generatorType || 'techdocs-mkdocs';
  const defaults =
    generatorDefaults[generatorType] ?? generatorDefaults['techdocs-mkdocs'];
  const localAddr = `http://127.0.0.1:${opts.port}`;

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

  const serverName =
    generatorType === 'techdocs-zensical' ? 'zensical' : 'mkdocs';
  const logFunc: RunOnOutput = data => {
    // Sometimes the lines contain an unnecessary extra new line or carriage return
    const logLines = data.toString().replace(/\r/g, '\n').split('\n');
    const logPrefix = opts.docker
      ? `[docker/${serverName}]`
      : `[${serverName}]`;
    logLines.forEach(line => {
      const cleanLine = line.trim();
      if (cleanLine === '') {
        return;
      }

      // Logs from container is verbose.
      logger.verbose(`${logPrefix} ${cleanLine}`);

      // When the server has started, open a new browser tab for the user.
      if (!boolOpenBrowserTriggered && defaults.servePattern.test(cleanLine)) {
        // Always open the local address, since 0.0.0.0 belongs to docker
        logger.info(`\nStarting ${serverName} server on ${localAddr}\n`);
        openBrowser(localAddr);
        boolOpenBrowserTriggered = true;
      }
    });
  };
  // mkdocs/zensical writes all of its logs to stderr by default, and not stdout.
  // https://github.com/mkdocs/mkdocs/issues/879#issuecomment-203536006

  // Commander stores --no-docker in cmd.docker variable
  const childProcess = runDocServer({
    port: opts.port,
    dockerImage: opts.dockerImage,
    dockerEntrypoint: opts.dockerEntrypoint,
    dockerOptions: opts.dockerOption,
    useDocker: opts.docker,
    onStdout: logFunc,
    onStderr: logFunc,
    generatorType,
  });

  // Keep waiting for user to cancel the process
  await childProcess.waitForExit();

  if (configIsTemporary) {
    process.on('exit', async () => {
      fs.rmSync(mkdocsYmlPath, {});
    });
  }
}
