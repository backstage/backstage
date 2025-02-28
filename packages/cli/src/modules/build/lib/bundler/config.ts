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

import { BundlingOptions, ModuleFederationOptions } from './types';
import { resolve as resolvePath, dirname } from 'path';
import chalk from 'chalk';
import webpack from 'webpack';

import { BundlingPaths } from './paths';
import { Config } from '@backstage/config';
import ESLintPlugin from 'eslint-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { ModuleFederationPlugin } from '@module-federation/enhanced/webpack';
import ModuleScopePlugin from 'react-dev-utils/ModuleScopePlugin';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { paths as cliPaths } from '../../../../lib/paths';
import fs from 'fs-extra';
import { optimization as optimizationConfig } from './optimization';
import pickBy from 'lodash/pickBy';
import { runPlain } from '../../../../lib/run';
import { transforms } from './transforms';
import { version } from '../../../../lib/version';
import yn from 'yn';
import { hasReactDomClient } from './hasReactDomClient';
import { createWorkspaceLinkingPlugins } from './linkWorkspaces';
import { ConfigInjectingHtmlWebpackPlugin } from './ConfigInjectingHtmlWebpackPlugin';

const BUILD_CACHE_ENV_VAR = 'BACKSTAGE_CLI_EXPERIMENTAL_BUILD_CACHE';

export function resolveBaseUrl(
  config: Config,
  moduleFederation?: ModuleFederationOptions,
): URL {
  const baseUrl = config.getOptionalString('app.baseUrl');

  const defaultBaseUrl =
    moduleFederation?.mode === 'remote'
      ? `http://localhost:${process.env.PORT ?? '3000'}`
      : 'http://localhost:3000';

  try {
    return new URL(baseUrl ?? '/', defaultBaseUrl);
  } catch (error) {
    throw new Error(`Invalid app.baseUrl, ${error}`);
  }
}

export function resolveEndpoint(
  config: Config,
  moduleFederation?: ModuleFederationOptions,
): {
  host: string;
  port: number;
} {
  const url = resolveBaseUrl(config, moduleFederation);

  return {
    host: config.getOptionalString('app.listen.host') ?? url.hostname,
    port:
      config.getOptionalNumber('app.listen.port') ??
      Number(url.port) ??
      (url.protocol === 'https:' ? 443 : 80),
  };
}

async function readBuildInfo() {
  const timestamp = Date.now();

  let commit: string | undefined;
  try {
    commit = await runPlain('git', 'rev-parse', 'HEAD');
  } catch (error) {
    // ignore, see below
  }

  let gitVersion: string | undefined;
  try {
    gitVersion = await runPlain('git', 'describe', '--always');
  } catch (error) {
    // ignore, see below
  }

  if (commit === undefined || gitVersion === undefined) {
    console.info(
      'NOTE: Did not compute git version or commit hash, could not execute the git command line utility',
    );
  }

  const { version: packageVersion } = await fs.readJson(
    cliPaths.resolveTarget('package.json'),
  );

  return {
    cliVersion: version,
    gitVersion: gitVersion ?? 'unknown',
    packageVersion,
    timestamp,
    commit: commit ?? 'unknown',
  };
}

export async function createConfig(
  paths: BundlingPaths,
  options: BundlingOptions,
): Promise<webpack.Configuration> {
  const {
    checksEnabled,
    isDev,
    frontendConfig,
    moduleFederation,
    publicSubPath = '',
    rspack,
  } = options;

  const { plugins, loaders } = transforms(options);
  // Any package that is part of the monorepo but outside the monorepo root dir need
  // separate resolution logic.

  const validBaseUrl = resolveBaseUrl(frontendConfig, moduleFederation);
  let publicPath = validBaseUrl.pathname.replace(/\/$/, '');
  if (publicSubPath) {
    publicPath = `${publicPath}${publicSubPath}`.replace('//', '/');
  }

  if (isDev) {
    const { host, port } = resolveEndpoint(
      options.frontendConfig,
      options.moduleFederation,
    );

    if (rspack) {
      const RspackReactRefreshPlugin = require('@rspack/plugin-react-refresh');
      plugins.push(new RspackReactRefreshPlugin());
    } else {
      plugins.push(
        new ReactRefreshPlugin({
          overlay: {
            sockProtocol: 'ws',
            sockHost: host,
            sockPort: port,
          },
        }),
      );
    }
  }

  if (checksEnabled) {
    plugins.push(
      new ForkTsCheckerWebpackPlugin({
        typescript: { configFile: paths.targetTsConfig, memoryLimit: 4096 },
      }),
      new ESLintPlugin({
        context: paths.targetPath,
        files: ['**/*.(ts|tsx|mts|cts|js|jsx|mjs|cjs)'],
      }),
    );
  }

  const bundler = rspack ? (rspack as unknown as typeof webpack) : webpack;

  // TODO(blam): process is no longer auto polyfilled by webpack in v5.
  // we use the provide plugin to provide this polyfill, but lets look
  // to remove this eventually!
  plugins.push(
    new bundler.ProvidePlugin({
      process: require.resolve('process/browser'),
      Buffer: ['buffer', 'Buffer'],
    }),
  );

  if (options.moduleFederation?.mode !== 'remote') {
    const templateOptions = {
      meta: {
        'backstage-app-mode': options?.appMode ?? 'public',
      },
      template: paths.targetHtml,
      templateParameters: {
        publicPath,
        config: frontendConfig,
      },
    };
    if (rspack) {
      // With Rspack we inject config via index.html, this is both because we
      // can't use APP_CONFIG due to the lack of support for runtime values, but
      // also because we are able to do it and it lines up better with what the
      // app-backend is doing.
      //
      // We still use the html plugin from WebPack, since the Rspack one won't
      // let us inject complex objects like the config.
      plugins.push(
        new ConfigInjectingHtmlWebpackPlugin(
          templateOptions,
          options.getFrontendAppConfigs,
        ),
      );
    } else {
      // Config injection via index.html doesn't work across reloads with
      // WebPack, so we rely on the APP_CONFIG injection instead
      plugins.push(new HtmlWebpackPlugin(templateOptions));
    }
    plugins.push(
      new HtmlWebpackPlugin({
        meta: {
          'backstage-app-mode': options?.appMode ?? 'public',
          // This is added to be written in the later step, and finally read by the extra entry point
          'backstage-public-path': '<%= publicPath %>/',
        },
        minify: false,
        publicPath: '<%= publicPath %>',
        filename: 'index.html.tmpl',
        template: `${require.resolve('raw-loader')}!${paths.targetHtml}`,
      }),
    );
  }

  if (options.moduleFederation) {
    const isRemote = options.moduleFederation?.mode === 'remote';

    const AdaptedModuleFederationPlugin = rspack
      ? (rspack.container
          .ModuleFederationPlugin as unknown as typeof ModuleFederationPlugin)
      : ModuleFederationPlugin;

    const exposes = options.moduleFederation?.exposes
      ? Object.fromEntries(
          Object.entries(options.moduleFederation?.exposes).map(([k, v]) => [
            k,
            resolvePath(paths.targetPath, v),
          ]),
        )
      : {
          '.': paths.targetEntry,
        };

    plugins.push(
      new AdaptedModuleFederationPlugin({
        ...(isRemote && {
          filename: 'remoteEntry.js',
          exposes,
        }),
        name: options.moduleFederation.name,
        runtime: false,
        shared: {
          // React
          react: {
            singleton: true,
            requiredVersion: '*',
            eager: !isRemote,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '*',
            eager: !isRemote,
          },
          // React Router
          'react-router': {
            singleton: true,
            requiredVersion: '*',
            eager: !isRemote,
          },
          'react-router-dom': {
            singleton: true,
            requiredVersion: '*',
            eager: !isRemote,
          },
          // MUI v4
          '@material-ui/core/styles': {
            singleton: true,
            requiredVersion: '*',
            eager: !isRemote,
          },
          '@material-ui/styles': {
            singleton: true,
            requiredVersion: '*',
            eager: !isRemote,
          },
          // MUI v5
          '@mui/material/styles/': {
            singleton: true,
            requiredVersion: '*',
            eager: !isRemote,
          },
          '@emotion/react': {
            singleton: true,
            requiredVersion: '*',
            eager: !isRemote,
          },
        },
      }),
    );
  }

  const buildInfo = await readBuildInfo();

  plugins.push(
    new bundler.DefinePlugin({
      'process.env.BUILD_INFO': JSON.stringify(buildInfo),
      'process.env.APP_CONFIG': rspack
        ? JSON.stringify([]) // Inject via index.html instead
        : bundler.DefinePlugin.runtimeValue(
            () => JSON.stringify(options.getFrontendAppConfigs()),
            true,
          ),
      // This allows for conditional imports of react-dom/client, since there's no way
      // to check for presence of it in source code without module resolution errors.
      'process.env.HAS_REACT_DOM_CLIENT': JSON.stringify(hasReactDomClient()),
    }),
  );

  if (options.linkedWorkspace) {
    plugins.push(
      ...(await createWorkspaceLinkingPlugins(
        bundler,
        options.linkedWorkspace,
      )),
    );
  }

  // These files are required by the transpiled code when using React Refresh.
  // They need to be excluded to the module scope plugin which ensures that files
  // that exist in the package are required.
  const reactRefreshFiles = rspack
    ? []
    : [
        require.resolve(
          '@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js',
        ),
        require.resolve(
          '@pmmmwh/react-refresh-webpack-plugin/overlay/index.js',
        ),
        require.resolve('react-refresh'),
      ];

  const mode = isDev ? 'development' : 'production';
  const optimization = optimizationConfig(options);

  if (
    mode === 'production' &&
    process.env.EXPERIMENTAL_MODULE_FEDERATION &&
    process.env.FORCE_REACT_DEVELOPMENT
  ) {
    console.log(
      chalk.yellow(
        `⚠️  WARNING: Forcing react and react-dom into development mode. This build should not be used in production.`,
      ),
    );

    const reactPackageDirs = [
      `${dirname(require.resolve('react/package.json'))}/`,
      `${dirname(require.resolve('react-dom/package.json'))}/`,
    ];

    // Don't define process.env.NODE_ENV with value matching config.mode. If we
    // don't set this to false, webpack will define the value of
    // process.env.NODE_ENV for us, and the definition below will be ignored.
    optimization.nodeEnv = false;

    // Instead, provide a custom definition which always uses "development" if
    // the module is part of `react` or `react-dom`, and `config.mode` otherwise.
    plugins.push(
      new bundler.DefinePlugin({
        'process.env.NODE_ENV': rspack
          ? // FIXME: see also https://github.com/web-infra-dev/rspack/issues/5606
            JSON.stringify(mode)
          : webpack.DefinePlugin.runtimeValue(({ module }) => {
              if (
                reactPackageDirs.some(val => module.resource.startsWith(val))
              ) {
                return '"development"';
              }

              return `"${mode}"`;
            }),
      }),
    );
  }

  const withCache = yn(process.env[BUILD_CACHE_ENV_VAR], { default: false });

  return {
    mode,
    profile: false,
    ...(isDev
      ? {
          watchOptions: {
            ignored: /node_modules\/(?!__backstage-autodetected-plugins__)/,
          },
        }
      : {}),
    optimization,
    bail: false,
    performance: {
      hints: false, // we check the gzip size instead
    },
    devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',
    context: paths.targetPath,
    entry: [
      require.resolve('@backstage/cli/config/webpack-public-path'),
      ...(options.additionalEntryPoints ?? []),
      paths.targetEntry,
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json', '.wasm'],
      mainFields: ['browser', 'module', 'main'],
      fallback: {
        ...pickBy(require('node-stdlib-browser')),
        module: false,
        dgram: false,
        dns: false,
        fs: false,
        http2: false,
        net: false,
        tls: false,
        child_process: false,

        /* new ignores */
        path: false,
        https: false,
        http: false,
        util: require.resolve('util/'),
      },
      // FIXME: see also https://github.com/web-infra-dev/rspack/issues/3408
      ...(!rspack && {
        plugins: [
          new ModuleScopePlugin(
            [paths.targetSrc, paths.targetDev],
            [paths.targetPackageJson, ...reactRefreshFiles],
          ),
        ],
      }),
    },
    module: {
      rules: loaders,
    },
    output: {
      uniqueName: options.moduleFederation?.name,
      path: paths.targetDist,
      publicPath:
        options.moduleFederation?.mode === 'remote' ? 'auto' : `${publicPath}/`,
      filename: isDev ? '[name].js' : 'static/[name].[fullhash:8].js',
      chunkFilename: isDev
        ? '[name].chunk.js'
        : 'static/[name].[chunkhash:8].chunk.js',
      ...(isDev
        ? {
            devtoolModuleFilenameTemplate: (info: any) =>
              `file:///${resolvePath(info.absoluteResourcePath).replace(
                /\\/g,
                '/',
              )}`,
          }
        : {}),
    },
    experiments: {
      lazyCompilation: !rspack && yn(process.env.EXPERIMENTAL_LAZY_COMPILATION),
      ...(rspack && {
        // We're still using `style-loader` for custom `insert` option
        css: false,
      }),
    },
    plugins,
    ...(withCache && {
      cache: {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      },
    }),
  };
}
