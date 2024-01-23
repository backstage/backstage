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

import { PackageGraph } from '@backstage/cli-node';
import { AppConfig } from '@backstage/config';
import chalk from 'chalk';
import fs from 'fs-extra';
import uniq from 'lodash/uniq';
import openBrowser from 'react-dev-utils/openBrowser';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import {
  forbiddenDuplicatesFilter,
  includedFilter,
} from '../../commands/versions/lint';
import { paths as libPaths } from '../../lib/paths';
import { loadCliConfig } from '../config';
import { Lockfile } from '../versioning';
import { createConfig, resolveBaseUrl } from './config';
import { createDetectedModulesEntryPoint } from './packageDetection';
import { resolveBundlingPaths, resolveOptionalBundlingPaths } from './paths';
import { ServeOptions } from './types';
import { hasReactDomClient } from './hasReactDomClient';

export async function serveBundle(options: ServeOptions) {
  const paths = resolveBundlingPaths(options);
  const targetPkg = await fs.readJson(paths.targetPackageJson);

  if (options.verifyVersions) {
    const lockfile = await Lockfile.load(
      libPaths.resolveTargetRoot('yarn.lock'),
    );
    const result = lockfile.analyze({
      filter: includedFilter,
      localPackages: PackageGraph.fromPackages(
        await PackageGraph.listTargetPackages(),
      ),
    });
    const problemPackages = [...result.newVersions, ...result.newRanges]
      .map(({ name }) => name)
      .filter(forbiddenDuplicatesFilter);

    if (problemPackages.length > 1) {
      console.log(
        chalk.yellow(
          `⚠️   Some of the following packages may be outdated or have duplicate installations:

          ${uniq(problemPackages).join(', ')}
        `,
        ),
      );
      console.log(
        chalk.yellow(
          `⚠️   This can be resolved using the following command:

          yarn backstage-cli versions:check --fix
      `,
        ),
      );
    }

    if (
      targetPkg.dependencies?.['react-router']?.includes('beta') ||
      targetPkg.dependencies?.['react-router-dom']?.includes('beta')
    ) {
      // eslint-disable-next-line no-console
      console.warn(
        chalk.yellow(`
DEPRECATION WARNING: React Router Beta is deprecated and support for it will be removed in a future release.
                     Please migrate to use React Router v6 stable.
                     See https://backstage.io/docs/tutorials/react-router-stable-migration
`),
      );
    }
  }

  checkReactVersion();

  const { name } = await fs.readJson(libPaths.resolveTarget('package.json'));

  let webpackServer: WebpackDevServer | undefined = undefined;
  let viteServer: import('vite').ViteDevServer | undefined = undefined;

  let latestFrontendAppConfigs: AppConfig[] = [];

  const cliConfig = await loadCliConfig({
    args: options.configPaths,
    fromPackage: name,
    withFilteredKeys: true,
    watch(appConfigs) {
      latestFrontendAppConfigs = appConfigs;

      webpackServer?.invalidate();
      viteServer?.restart();
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

  const detectedModulesEntryPoint = await createDetectedModulesEntryPoint({
    config: fullConfig,
    targetPath: paths.targetPath,
    watch() {
      webpackServer?.invalidate();
      viteServer?.restart();
    },
  });

  const commonConfigOptions = {
    ...options,
    checksEnabled: options.checksEnabled,
    isDev: true,
    baseUrl: url,
    frontendConfig,
    getFrontendAppConfigs: () => {
      return latestFrontendAppConfigs;
    },
  };

  const config = await createConfig(paths, {
    ...commonConfigOptions,
    additionalEntryPoints: detectedModulesEntryPoint,
  });

  if (process.env.EXPERIMENTAL_VITE) {
    const { default: vite } = await import('vite');
    const { default: viteReact } = await import('@vitejs/plugin-react');
    const { nodePolyfills: viteNodePolyfills } = await import(
      'vite-plugin-node-polyfills'
    );
    const { createHtmlPlugin: viteHtml } = await import('vite-plugin-html');
    viteServer = await vite.createServer({
      define: {
        global: 'window',
        'process.argv': JSON.stringify(process.argv),
        'process.env.APP_CONFIG': JSON.stringify(cliConfig.frontendAppConfigs),
        // This allows for conditional imports of react-dom/client, since there's no way
        // to check for presence of it in source code without module resolution errors.
        'process.env.HAS_REACT_DOM_CLIENT': JSON.stringify(hasReactDomClient()),
      },
      plugins: [
        viteReact(),
        viteNodePolyfills(),
        viteHtml({
          entry: paths.targetEntry,
          // todo(blam): we should look at contributing to thPe plugin here
          // to support absolute paths, but works in the interim at least.
          template: 'public/index.html',
          inject: {
            data: {
              config: frontendConfig,
              publicPath: config.output?.publicPath,
            },
          },
        }),
      ],
      server: {
        host,
        port,
      },
      publicDir: paths.targetPublic,
      root: paths.targetPath,
    });
  } else {
    const publicPaths = await resolveOptionalBundlingPaths({
      entry: 'src/index-public-experimental',
      dist: 'dist/public',
    });
    if (publicPaths) {
      console.log(
        chalk.yellow(
          `⚠️  WARNING: The app /public entry point is an experimental feature that may receive immediate breaking changes.`,
        ),
      );
    }
    const compiler = publicPaths
      ? webpack([
          config,
          await createConfig(publicPaths, {
            ...commonConfigOptions,
            publicSubPath: '/public',
          }),
        ])
      : webpack(config);

    webpackServer = new WebpackDevServer(
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
        proxy: targetPkg.proxy,
        // When the dev server is behind a proxy, the host and public hostname differ
        allowedHosts: [url.hostname],
        client: {
          webSocketURL: 'auto://0.0.0.0:0/ws',
        },
      },
      compiler,
    );
  }

  await viteServer?.listen();
  await new Promise<void>(async (resolve, reject) => {
    if (webpackServer) {
      webpackServer.startCallback((err?: Error) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    } else {
      resolve();
    }
  });

  openBrowser(url.href);

  const waitForExit = async () => {
    for (const signal of ['SIGINT', 'SIGTERM'] as const) {
      process.on(signal, () => {
        webpackServer?.close();
        viteServer?.close();
        // exit instead of resolve. The process is shutting down and resolving a promise here logs an error
        process.exit();
      });
    }

    // Block indefinitely and wait for the interrupt signal
    return new Promise(() => {});
  };

  return waitForExit;
}

function checkReactVersion() {
  try {
    // Make sure we're looking at the root of the target repo
    const reactPkgPath = require.resolve('react/package.json', {
      paths: [libPaths.targetRoot],
    });
    const reactPkg = require(reactPkgPath);
    if (reactPkg.version.startsWith('16.')) {
      console.log(
        chalk.yellow(
          `
⚠️                                                                           ⚠️
⚠️ You are using React version 16, which is deprecated for use in Backstage. ⚠️
⚠️ Please upgrade to React 17 by updating your packages/app dependencies.    ⚠️
⚠️                                                                           ⚠️
`,
        ),
      );
    }
  } catch {
    /* ignored */
  }
}
