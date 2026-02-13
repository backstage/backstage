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

import { resolve as resolvePath } from 'node:path';
import { BundlingOptions, ModuleFederationRemoteOptions } from './types';
import { rspack, Configuration } from '@rspack/core';

import { BundlingPaths } from './paths';
import { Config } from '@backstage/config';
import ESLintRspackPlugin from 'eslint-rspack-plugin';
import { TsCheckerRspackPlugin } from 'ts-checker-rspack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ModuleScopePlugin from 'react-dev-utils/ModuleScopePlugin';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { paths as cliPaths } from '../../../../lib/paths';
import fs from 'fs-extra';
import { optimization as optimizationConfig } from './optimization';
import pickBy from 'lodash/pickBy';
import { runOutput } from '@backstage/cli-common';
import { transforms } from './transforms';
import { version } from '../../../../lib/version';
import yn from 'yn';
import { hasReactDomClient } from './hasReactDomClient';
import { createWorkspaceLinkingPlugins } from './linkWorkspaces';
import { ConfigInjectingHtmlWebpackPlugin } from './ConfigInjectingHtmlWebpackPlugin';

export function resolveBaseUrl(
  config: Config,
  moduleFederationRemote?: ModuleFederationRemoteOptions,
): URL {
  const baseUrl = config.getOptionalString('app.baseUrl');

  const defaultBaseUrl = moduleFederationRemote
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
  moduleFederationRemote?: ModuleFederationRemoteOptions,
): {
  host: string;
  port: number;
} {
  const url = resolveBaseUrl(config, moduleFederationRemote);

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
    commit = await runOutput(['git', 'rev-parse', 'HEAD']);
  } catch (error) {
    // ignore, see below
  }

  let gitVersion: string | undefined;
  try {
    gitVersion = await runOutput(['git', 'describe', '--always']);
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
): Promise<Configuration> {
  const {
    checksEnabled,
    isDev,
    frontendConfig,
    moduleFederationRemote,
    publicSubPath = '',
    webpack,
  } = options;

  const { plugins, loaders } = transforms(options);
  // Any package that is part of the monorepo but outside the monorepo root dir need
  // separate resolution logic.

  const validBaseUrl = resolveBaseUrl(frontendConfig, moduleFederationRemote);
  let publicPath = validBaseUrl.pathname.replace(/\/$/, '');
  if (publicSubPath) {
    publicPath = `${publicPath}${publicSubPath}`.replace('//', '/');
  }

  if (isDev) {
    const { host, port } = resolveEndpoint(
      options.frontendConfig,
      options.moduleFederationRemote,
    );

    const refreshOptions = {
      overlay: {
        sockProtocol: 'ws',
        sockHost: host,
        sockPort: port,
      },
    } as const;

    if (webpack) {
      const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
      plugins.push(new ReactRefreshPlugin(refreshOptions));
    } else {
      const RspackReactRefreshPlugin = require('@rspack/plugin-react-refresh');
      plugins.push(new RspackReactRefreshPlugin(refreshOptions));
    }
  }

  if (checksEnabled) {
    const TsCheckerPlugin = webpack
      ? (require('fork-ts-checker-webpack-plugin') as typeof import('fork-ts-checker-webpack-plugin'))
      : TsCheckerRspackPlugin;
    const ESLintPlugin = webpack
      ? (require('eslint-webpack-plugin') as typeof import('eslint-webpack-plugin'))
      : ESLintRspackPlugin;
    plugins.push(
      new TsCheckerPlugin({
        typescript: { configFile: paths.targetTsConfig, memoryLimit: 8192 },
      }),
      new ESLintPlugin({
        cache: false, // Cache seems broken
        context: paths.targetPath,
        files: ['**/*.(ts|tsx|mts|cts|js|jsx|mjs|cjs)'],
      }),
    );
  }

  const bundler = webpack ? (webpack as unknown as typeof rspack) : rspack;

  // TODO(blam): process is no longer auto polyfilled by webpack in v5.
  // we use the provide plugin to provide this polyfill, but lets look
  // to remove this eventually!
  plugins.push(
    new bundler.ProvidePlugin({
      process: require.resolve('process/browser'),
      Buffer: ['buffer', 'Buffer'],
    }),
  );

  if (!options.moduleFederationRemote) {
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
    if (webpack) {
      // Config injection via index.html doesn't work across reloads with
      // WebPack, so we rely on the APP_CONFIG injection instead
      plugins.push(new HtmlWebpackPlugin(templateOptions));
    } else {
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

  if (options.moduleFederationRemote) {
    const AdaptedModuleFederationPlugin = webpack
      ? (require('@module-federation/enhanced/webpack')
          .ModuleFederationPlugin as unknown as typeof ModuleFederationPlugin)
      : ModuleFederationPlugin;

    const exposes = options.moduleFederationRemote.exposes
      ? Object.fromEntries(
          Object.entries(options.moduleFederationRemote?.exposes).map(
            ([k, v]) => [k, resolvePath(paths.targetPath, v)],
          ),
        )
      : {
          '.': paths.targetEntry,
        };

    plugins.push(
      new AdaptedModuleFederationPlugin({
        filename: 'remoteEntry.js',
        exposes,
        name: options.moduleFederationRemote.name,
        runtime: false,
        shared: options.moduleFederationRemote.sharedDependencies,
      }),
    );
  }

  const buildInfo = await readBuildInfo();

  plugins.push(
    webpack
      ? new webpack.DefinePlugin({
          'process.env.BUILD_INFO': JSON.stringify(buildInfo),
          'process.env.APP_CONFIG': webpack.DefinePlugin.runtimeValue(
            () => JSON.stringify(options.getFrontendAppConfigs()),
            true,
          ),
          // This allows for conditional imports of react-dom/client, since there's no way
          // to check for presence of it in source code without module resolution errors.
          'process.env.HAS_REACT_DOM_CLIENT': JSON.stringify(
            hasReactDomClient(),
          ),
        })
      : new bundler.DefinePlugin({
          'process.env.BUILD_INFO': JSON.stringify(buildInfo),
          'process.env.APP_CONFIG': JSON.stringify([]), // Inject via index.html instead
          // This allows for conditional imports of react-dom/client, since there's no way
          // to check for presence of it in source code without module resolution errors.
          'process.env.HAS_REACT_DOM_CLIENT': JSON.stringify(
            hasReactDomClient(),
          ),
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
  const reactRefreshFiles = webpack
    ? [
        require.resolve(
          '@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js',
        ),
        require.resolve(
          '@pmmmwh/react-refresh-webpack-plugin/overlay/index.js',
        ),
        require.resolve('react-refresh'),
      ]
    : [];

  const mode = isDev ? 'development' : 'production';
  const optimization = optimizationConfig(options);

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
      ...(webpack && {
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
      uniqueName: options.moduleFederationRemote?.name,
      path: paths.targetDist,
      publicPath: options.moduleFederationRemote ? 'auto' : `${publicPath}/`,
      filename: isDev ? '[name].js' : 'static/[name].[contenthash:8].js',
      chunkFilename: isDev
        ? '[name].chunk.js'
        : 'static/[name].[contenthash:8].chunk.js',
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
      lazyCompilation: yn(process.env.EXPERIMENTAL_LAZY_COMPILATION),
      ...(!webpack && {
        // We're still using `style-loader` for custom `insert` option
        css: false,
      }),
    },
    plugins,
  };
}
