/*
 * Copyright 2026 The Backstage Authors
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
import os from 'node:os';
import http from 'node:http';
import fs from 'fs-extra';
import chokidar from 'chokidar';
import serveHandler from 'serve-handler';
import openBrowser from 'react-dev-utils/openBrowser';
import { ConfigReader } from '@backstage/config';
import { TechdocsGenerator } from '@backstage/plugin-techdocs-node';
import HTTPServer from '../../lib/httpServer';
import { createLogger, getLogStream } from '../../lib/utility';

export async function serveSource(opts: OptionValues, previewAppPath: string) {
  if (!['dual', 'source'].includes(opts.publishing))
    throw new Error('Preview publishing mode must be legacy, dual, or source');
  const devMode = Boolean(process.env.TECHDOCS_CLI_DEV_MODE);
  const previewPort = devMode ? 7007 : Number(opts.previewAppPort);
  const logger = createLogger({ verbose: opts.verbose });
  const inputDir = path.resolve(opts.sourceDir ?? '.');
  const working = await fs.mkdtemp(path.join(os.tmpdir(), 'techdocs-preview-'));
  let current = '';
  let revision = 0;
  let generation = 0;
  let lastError = '';
  const generator = TechdocsGenerator.fromConfig(
    new ConfigReader({
      techdocs: {
        migration: { publishing: opts.publishing },
        generator: {
          runIn: opts.docker ? 'docker' : 'local',
          dockerImage: opts.dockerImage,
        },
      },
    }),
    { logger },
  );
  const build = async () => {
    const outputDir = path.join(working, String(generation++));
    const preparedDir = path.join(working, 'input');
    try {
      await fs.remove(preparedDir);
      await fs.copy(inputDir, preparedDir, {
        filter: source =>
          !['node_modules', '.git', 'site', '.yarn'].includes(
            path.basename(source),
          ),
      });
      await fs.ensureDir(outputDir);
      await generator.run({
        inputDir: preparedDir,
        outputDir,
        logger,
        logStream: getLogStream(logger),
      });
      current = outputDir;
      revision++;
      lastError = '';
      logger.info('Documentation preview updated');
      // Keep the previous snapshot for requests already in flight.
      if (generation > 2)
        await fs.remove(path.join(working, String(generation - 3)));
    } catch (error) {
      lastError = error.message;
      logger.error(`Preview build failed: ${lastError}`);
      if (!current) throw error;
    }
  };
  let watcher: ReturnType<typeof chokidar.watch> | undefined;
  let preview: http.Server | undefined;
  let assets: http.Server | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pending = Promise.resolve();
  try {
    await build();
    assets = http.createServer((request, response) => {
      const url = new URL(request.url ?? '/', 'http://localhost');
      if (url.pathname === '/_techdocs/preview.json') {
        response.setHeader('Content-Type', 'application/json');
        response.setHeader('Cache-Control', 'no-store');
        response.end(JSON.stringify({ revision, error: lastError }));
        return;
      }
      request.url = request.url?.replace(
        /^\/static\/docs\/[^/]+\/[^/]+\/[^/]+/,
        '',
      );
      response.setHeader('Cache-Control', 'no-store');
      void serveHandler(request, response, {
        public: current,
        cleanUrls: false,
      });
    });
    await new Promise<void>((resolve, reject) => {
      assets!.once('error', reject);
      assets!.listen(0, '127.0.0.1', resolve);
    });
    const address = assets.address();
    if (!address || typeof address === 'string')
      throw new Error('Preview server did not bind');
    preview = await new HTTPServer(
      previewAppPath,
      previewPort,
      `http://127.0.0.1:${address.port}`,
      opts.verbose,
      true,
    ).serve();
    watcher = chokidar.watch(inputDir, {
      ignoreInitial: true,
      ignored: source =>
        /(^|[/\\])(node_modules|\.git|site|\.yarn)([/\\]|$)/.test(source),
    });
    watcher.on('all', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        pending = pending.then(build).catch(error => {
          logger.error(error.message);
        });
      }, 200);
    });
    const url = `http://localhost:${
      devMode ? 3000 : previewPort
    }/docs/default/component/local/?techdocs-preview=source`;
    logger.info(`Serving documentation preview at ${url}`);
    openBrowser(url);
    await new Promise<void>(resolve => {
      const stop = () => {
        process.off('SIGINT', stop);
        process.off('SIGTERM', stop);
        resolve();
      };
      process.on('SIGINT', stop);
      process.on('SIGTERM', stop);
    });
  } finally {
    clearTimeout(timer);
    await watcher?.close();
    await pending;
    await Promise.all(
      [preview, assets].map(
        server =>
          server && new Promise<void>(resolve => server.close(() => resolve())),
      ),
    );
    await fs.remove(working);
  }
}
