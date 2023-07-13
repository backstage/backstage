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

import fs from 'fs-extra';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import openBrowser from 'react-dev-utils/openBrowser';
import { createConfig, resolveBaseUrl } from './config';
import { ServeOptions } from './types';
import { resolveBundlingPaths } from './paths';
import { paths as libPaths } from '../../lib/paths';
import { loadCliConfig } from '../config';
import chalk from 'chalk';
import { AppConfig } from '@backstage/config';

export async function serveBundle(options: ServeOptions) {
  const { name } = await fs.readJson(libPaths.resolveTarget('package.json'));

  let server: WebpackDevServer | undefined = undefined;
  let latestFrontendAppConfigs: AppConfig[] = [];

  const cliConfig = await loadCliConfig({
    args: options.configPaths,
    fromPackage: name,
    withFilteredKeys: true,
    watch(appConfigs) {
      latestFrontendAppConfigs = appConfigs;
      server?.invalidate();
    },
  });
  latestFrontendAppConfigs = cliConfig.frontendAppConfigs;

  const appBaseUrl = cliConfig.frontendConfig.getString('app.baseUrl');
  const backendBaseUrl = cliConfig.frontendConfig.getString('backend.baseUrl');
  if (appBaseUrl === backendBaseUrl) {
    console.log(
      chalk.yellow(
        `⚠️   Conflict between app baseUrl and backend baseUrl:

    app.baseUrl:     ${appBaseUrl}
    backend.baseUrl: ${backendBaseUrl}

    Must have unique hostname and/or ports.

    This can be resolved by changing app.baseUrl and backend.baseUrl to point to their respective local development ports.
`,
      ),
    );
  }

  const { frontendConfig, fullConfig } = cliConfig;
  const url = resolveBaseUrl(frontendConfig);

  const host =
    frontendConfig.getOptionalString('app.listen.host') || url.hostname;
  const port =
    frontendConfig.getOptionalNumber('app.listen.port') ||
    Number(url.port) ||
    (url.protocol === 'https:' ? 443 : 80);

  const paths = resolveBundlingPaths(options);
  const pkgPath = paths.targetPackageJson;
  const pkg = await fs.readJson(pkgPath);
  const config = await createConfig(paths, {
    checksEnabled: options.checksEnabled,
    isDev: true,
    baseUrl: url,
    frontendConfig,
    getFrontendAppConfigs: () => {
      return latestFrontendAppConfigs;
    },
  });

  const compiler = webpack(config);

  server = new WebpackDevServer(
    {
      hot: !process.env.CI,
      devMiddleware: {
        publicPath: config.output?.publicPath as string,
        stats: 'errors-warnings',
      },
      static: paths.targetPublic
        ? {
            publicPath: config.output?.publicPath as string,
            directory: paths.targetPublic,
          }
        : undefined,
      historyApiFallback: {
        // Paths with dots should still use the history fallback.
        // See https://github.com/facebookincubator/create-react-app/issues/387.
        disableDotRule: true,

        // The index needs to be rewritten relative to the new public path, including subroutes.
        index: `${config.output?.publicPath}index.html`,
      },
      https:
        url.protocol === 'https:'
          ? {
              cert: fullConfig.getString('app.https.certificate.cert'),
              key: fullConfig.getString('app.https.certificate.key'),
            }
          : false,
      host,
      port,
      proxy: pkg.proxy,
      // When the dev server is behind a proxy, the host and public hostname differ
      allowedHosts: [url.hostname],
      client: {
        webSocketURL: 'auto://0.0.0.0:0/ws',
      },
    } as any,
    compiler as any,
  );

  await new Promise<void>((resolve, reject) => {
    server?.startCallback((err?: Error) => {
      if (err) {
        reject(err);
        return;
      }

      openBrowser(url.href);
      resolve();
    });
  });

  const waitForExit = async () => {
    for (const signal of ['SIGINT', 'SIGTERM'] as const) {
      process.on(signal, () => {
        server?.close();
        // exit instead of resolve. The process is shutting down and resolving a promise here logs an error
        process.exit();
      });
    }

    // Block indefinitely and wait for the interrupt signal
    return new Promise(() => {});
  };

  return waitForExit;
}
