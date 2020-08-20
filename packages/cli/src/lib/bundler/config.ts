/*
 * Copyright 2020 Spotify AB
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

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ModuleScopePlugin from 'react-dev-utils/ModuleScopePlugin';
import StartServerPlugin from 'start-server-webpack-plugin';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import { optimization } from './optimization';
import { Config } from '@backstage/config';
import { BundlingPaths } from './paths';
import { transforms } from './transforms';
import { BundlingOptions, BackendBundlingOptions } from './types';

export function resolveBaseUrl(config: Config): URL {
  const baseUrl = config.getString('app.baseUrl');
  try {
    return new URL(baseUrl);
  } catch (error) {
    throw new Error(`Invalid app.baseUrl, ${error}`);
  }
}

export function createConfig(
  paths: BundlingPaths,
  options: BundlingOptions,
): webpack.Configuration {
  const { checksEnabled, isDev } = options;

  const { plugins, loaders } = transforms(options);

  const baseUrl = options.config.getString('app.baseUrl');
  const validBaseUrl = new URL(baseUrl);

  if (checksEnabled) {
    plugins.push(
      new ForkTsCheckerWebpackPlugin({
        tsconfig: paths.targetTsConfig,
        eslint: true,
        eslintOptions: {
          parserOptions: {
            project: paths.targetTsConfig,
            tsconfigRootDir: paths.targetPath,
          },
        },
        reportFiles: ['**', '!**/__tests__/**', '!**/?(*.)(spec|test).*'],
      }),
    );
  }

  plugins.push(
    new webpack.EnvironmentPlugin({
      APP_CONFIG: options.appConfigs,
    }),
  );

  plugins.push(
    new HtmlWebpackPlugin({
      template: paths.targetHtml,
      templateParameters: {
        publicPath: validBaseUrl.pathname.replace(/\/$/, ''),
        app: {
          title: options.config.getString('app.title'),
          baseUrl: validBaseUrl.href,
        },
      },
    }),
  );

  return {
    mode: isDev ? 'development' : 'production',
    profile: false,
    node: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
    optimization: optimization(options),
    bail: false,
    performance: {
      hints: false, // we check the gzip size instead
    },
    devtool: isDev ? 'cheap-module-eval-source-map' : 'source-map',
    context: paths.targetPath,
    entry: [require.resolve('react-hot-loader/patch'), paths.targetEntry],
    resolve: {
      extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx'],
      mainFields: ['browser', 'module', 'main'],
      plugins: [
        new ModuleScopePlugin(
          [paths.targetSrc, paths.targetDev],
          [paths.targetPackageJson],
        ),
      ],
      alias: {
        'react-dom': '@hot-loader/react-dom',
      },
    },
    module: {
      rules: loaders,
    },
    output: {
      path: paths.targetDist,
      publicPath: validBaseUrl.pathname,
      filename: isDev ? '[name].js' : 'static/[name].[hash:8].js',
      chunkFilename: isDev
        ? '[name].chunk.js'
        : 'static/[name].[chunkhash:8].chunk.js',
    },
    plugins,
  };
}

export function createBackendConfig(
  paths: BundlingPaths,
  options: BackendBundlingOptions,
): webpack.Configuration {
  const { checksEnabled, isDev } = options;

  const { loaders } = transforms(options);

  return {
    mode: isDev ? 'development' : 'production',
    profile: false,
    ...(isDev
      ? {
          watch: true,
          watchOptions: {
            ignored: [/node_modules\/(?!\@backstage)/],
          },
        }
      : {}),
    externals: [
      nodeExternals({
        modulesDir: paths.rootNodeModules,
        allowlist: ['webpack/hot/poll?100', /\@backstage\/.*/],
      }),
      nodeExternals({
        modulesDir: paths.targetNodeModules,
        allowlist: ['webpack/hot/poll?100', /\@backstage\/.*/],
      }),
    ],
    target: 'node' as const,
    node: {
      __dirname: true,
      __filename: true,
      global: true,
    },
    bail: false,
    performance: {
      hints: false, // we check the gzip size instead
    },
    devtool: isDev ? 'cheap-module-eval-source-map' : 'source-map',
    context: paths.targetPath,
    entry: [
      'webpack/hot/poll?100',
      paths.targetRunFile ? paths.targetRunFile : paths.targetEntry,
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx'],
      mainFields: ['browser', 'module', 'main'],
      modules: [paths.targetNodeModules, paths.rootNodeModules],
      plugins: [
        new ModuleScopePlugin(
          [paths.targetSrc, paths.targetDev],
          [paths.targetPackageJson],
        ),
      ],
      alias: {
        'react-dom': '@hot-loader/react-dom',
      },
    },
    module: {
      rules: loaders,
    },
    output: {
      path: paths.targetDist,
      filename: isDev ? '[name].js' : '[name].[hash:8].js',
      chunkFilename: isDev
        ? '[name].chunk.js'
        : '[name].[chunkhash:8].chunk.js',
    },
    plugins: [
      new StartServerPlugin({
        name: 'main.js',
        nodeArgs: options.inspectEnabled ? ['--inspect'] : undefined,
      }),
      new webpack.HotModuleReplacementPlugin(),
      ...(checksEnabled
        ? [
            new ForkTsCheckerWebpackPlugin({
              tsconfig: paths.targetTsConfig,
              eslint: true,
              eslintOptions: {
                parserOptions: {
                  project: paths.targetTsConfig,
                  tsconfigRootDir: paths.targetPath,
                },
              },
              reportFiles: ['**', '!**/__tests__/**', '!**/?(*.)(spec|test).*'],
            }),
          ]
        : []),
    ],
  };
}
