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
import path from 'node:path';
import openBrowser from 'react-dev-utils/openBrowser';
import { findOwnPaths, RunOnOutput } from '@backstage/cli-common';
import HTTPServer from '../../lib/httpServer';
import { runMkdocsServer } from '../../lib/mkdocsServer';
import { createLogger } from '../../lib/utility';
import { getMkdocsYml } from '@backstage/plugin-techdocs-node';
import fs from 'fs-extra';
import { checkIfDockerIsOperational } from './utils';
import { getEngineConfig } from '../../lib/engineConfig';

function findPreviewBundlePath(): string {
  try {
    return path.join(
      path.dirname(require.resolve('techdocs-cli-embedded-app/package.json')),
      'dist',
    );
  } catch {
    // If the techdocs-cli-embedded-app package is not available it means we're
    // running a published package. For published packages the preview bundle is
    // copied to dist/embedded-app be the prepack script.
    //
    // This can be tested by running `yarn pack` and extracting the resulting tarball into a directory.
    // Within the extracted directory, run `npm install --only=prod`.
    // Once that's done you can test the CLI in any directory using `node <tmp-dir>/package <command>`.
    /* eslint-disable-next-line no-restricted-syntax */
    return findOwnPaths(__dirname).resolve('dist/embedded-app');
  }
}

function getPreviewAppPath(opts: OptionValues): string {
  return opts.previewAppBundlePath ?? findPreviewBundlePath();
}

export default async function serve(opts: OptionValues) {
  const logger = createLogger({ verbose: opts.verbose });
  const engine = opts.engine ?? 'mkdocs'; // default engine is mkdocs
  const engineConfig = getEngineConfig(engine);

  // Determine if we want to run in local dev mode or not
  // This will run the backstage http server on a different port and only used
  // for proxying mkdocs to the backstage app running locally (e.g. with webpack-dev-server)
  const isDevMode = Object.keys(process.env).includes('TECHDOCS_CLI_DEV_MODE')
    ? true
    : false;

  const backstageBackendPort = 7007;

  const docsPort = opts.docsPort ?? opts.mkdocsPort ?? '8000';
  if (opts.mkdocsPort && !opts.docsPort) {
    logger.warn(
      '--mkdocs-port is deprecated and will be removed in a future release. Use --docs-port instead.',
    );
  }

  const docsDockerAddr = `http://0.0.0.0:${docsPort}`;
  const docsLocalAddr = `http://127.0.0.1:${docsPort}`;
  const docsExpectedDevAddr = opts.docker ? docsDockerAddr : docsLocalAddr;

  const configFileName = opts.configFileName ?? opts.mkdocsConfigFileName;
  if (opts.mkdocsConfigFileName && !opts.configFileName) {
    logger.warn(
      '--mkdocs-config-file-name is deprecated and will be removed in a future release. Use --config-file-name instead.',
    );
  }
  const siteName = opts.siteName;

  const { path: mkdocsYmlPath, configIsTemporary } = await getMkdocsYml('./', {
    name: siteName,
    mkdocsConfigFileName: configFileName,
  });

  // Validate that Docker is up and running
  if (opts.docker) {
    const isDockerOperational = await checkIfDockerIsOperational(logger);
    if (!isDockerOperational) {
      return;
    }
  }

  let docsServerHasStarted = false;
  const docsLogFunc: RunOnOutput = data => {
    const logLines = data.toString().split('\n');
    const logPrefix = opts.docker ? `[docker/${engine}]` : `[${engine}]`;
    logLines.forEach(line => {
      if (line === '') {
        return;
      }

      logger.verbose(`${logPrefix} ${line}`);

      if (
        !docsServerHasStarted &&
        line.includes(`${engineConfig.startupLogPattern}`)
      ) {
        docsServerHasStarted = true;
      }
    });
  };
  logger.info(`Starting ${engine} server.`);
  const docsChildProcess = runMkdocsServer({
    port: docsPort,
    dockerImage: opts.dockerImage,
    dockerEntrypoint: opts.dockerEntrypoint,
    dockerOptions: opts.dockerOption,
    useDocker: opts.docker,
    onStdout: docsLogFunc,
    onStderr: docsLogFunc,
    mkdocsConfigFileName: mkdocsYmlPath,
    mkdocsParameterClean: opts.parameterClean || opts.mkdocsParameterClean,
    mkdocsParameterDirtyReload:
      opts.parameterDirtyreload || opts.mkdocsParameterDirtyreload,
    mkdocsParameterStrict: opts.parameterStrict || opts.mkdocsParameterStrict,
  });

  for (let attempt = 0; attempt < 30; attempt++) {
    await new Promise(r => setTimeout(r, 3000));
    if (docsServerHasStarted) {
      break;
    }
    logger.info(`Waiting for ${engine} server to start...`);
  }

  if (!docsServerHasStarted) {
    logger.error(
      `${engine} server did not start. Exiting. Try re-running command with -v option for more details.`,
    );
  }

  const port = isDevMode ? backstageBackendPort : opts.previewAppPort;
  const previewAppPath = getPreviewAppPath(opts);
  const httpServer = new HTTPServer(
    previewAppPath,
    port,
    docsExpectedDevAddr,
    opts.verbose,
  );

  httpServer
    .serve()
    .catch(err => {
      logger.error('Failed to start HTTP server', err);
      docsChildProcess.kill();
      process.exit(1);
    })
    .then(() => {
      openBrowser(`http://localhost:${port}/docs/default/component/local/`);
      logger.info(
        `Serving docs in Backstage at http://localhost:${port}/docs/default/component/local/\nOpening browser.`,
      );
    });

  await docsChildProcess.waitForExit();

  if (configIsTemporary) {
    process.on('exit', async () => {
      fs.rmSync(mkdocsYmlPath, {});
    });
  }
}
