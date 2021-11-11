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
import path from 'path';
import openBrowser from 'react-dev-utils/openBrowser';
import HTTPServer from '../../lib/httpServer';
import { runMkdocsServer } from '../../lib/mkdocsServer';
import { LogFunc, waitForSignal } from '../../lib/run';
import { createLogger } from '../../lib/utility';

export default async function serve(cmd: Command) {
  const logger = createLogger({ verbose: cmd.verbose });

  // Determine if we want to run in local dev mode or not
  // This will run the backstage http server on a different port and only used
  // for proxying mkdocs to the backstage app running locally (e.g. with webpack-dev-server)
  const isDevMode = Object.keys(process.env).includes('TECHDOCS_CLI_DEV_MODE')
    ? true
    : false;

  // TODO: Backstage app port should also be configurable as a CLI option. However, since we bundle
  // a backstage app, we define app.baseUrl in the app-config.yaml.
  // Hence, it is complicated to make this configurable.
  const backstagePort = 3000;
  const backstageBackendPort = 7000;

  const mkdocsDockerAddr = `http://0.0.0.0:${cmd.mkdocsPort}`;
  const mkdocsLocalAddr = `http://127.0.0.1:${cmd.mkdocsPort}`;
  const mkdocsExpectedDevAddr = cmd.docker ? mkdocsDockerAddr : mkdocsLocalAddr;

  let mkdocsServerHasStarted = false;
  const mkdocsLogFunc: LogFunc = data => {
    // Sometimes the lines contain an unnecessary extra new line
    const logLines = data.toString().split('\n');
    const logPrefix = cmd.docker ? '[docker/mkdocs]' : '[mkdocs]';
    logLines.forEach(line => {
      if (line === '') {
        return;
      }

      logger.verbose(`${logPrefix} ${line}`);

      // When the server has started, open a new browser tab for the user.
      if (
        !mkdocsServerHasStarted &&
        line.includes(`Serving on ${mkdocsExpectedDevAddr}`)
      ) {
        mkdocsServerHasStarted = true;
      }
    });
  };
  // mkdocs writes all of its logs to stderr by default, and not stdout.
  // https://github.com/mkdocs/mkdocs/issues/879#issuecomment-203536006
  // Had me questioning this whole implementation for half an hour.
  logger.info('Starting mkdocs server.');
  const mkdocsChildProcess = await runMkdocsServer({
    port: cmd.mkdocsPort,
    dockerImage: cmd.dockerImage,
    useDocker: cmd.docker,
    stdoutLogFunc: mkdocsLogFunc,
    stderrLogFunc: mkdocsLogFunc,
  });

  // Wait until mkdocs server has started so that Backstage starts with docs loaded
  // Takes 1-5 seconds
  for (let attempt = 0; attempt < 10; attempt++) {
    await new Promise(r => setTimeout(r, 1000));
    if (mkdocsServerHasStarted) {
      break;
    }
    logger.info('Waiting for mkdocs server to start...');
  }

  if (!mkdocsServerHasStarted) {
    logger.error(
      'mkdocs server did not start. Exiting. Try re-running command with -v option for more details.',
    );
  }

  // Run the embedded-techdocs Backstage app
  const techdocsPreviewBundlePath = path.join(
    path.dirname(require.resolve('@techdocs/cli/package.json')),
    'dist',
    'techdocs-preview-bundle',
  );

  const httpServer = new HTTPServer(
    techdocsPreviewBundlePath,
    isDevMode ? backstageBackendPort : backstagePort,
    cmd.mkdocsPort,
    cmd.verbose,
  );

  httpServer
    .serve()
    .catch(err => {
      logger.error(err);
      mkdocsChildProcess.kill();
      process.exit(1);
    })
    .then(() => {
      // The last three things default/component/local/ don't matter. They can be anything.
      openBrowser(
        `http://localhost:${backstagePort}/docs/default/component/local/`,
      );
      logger.info(
        `Serving docs in Backstage at http://localhost:${backstagePort}/docs/default/component/local/\nOpening browser.`,
      );
    });

  try {
    await waitForSignal([mkdocsChildProcess]);
    process.exit(0);
  } catch {
    process.exit(1);
  }
}
