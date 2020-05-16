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

import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ModuleScopePlugin from 'react-dev-utils/ModuleScopePlugin';
import { BundlingPaths } from './paths';
import { loaders } from './loaders';
import { optimization } from './optimization';
import { BundlingOptions } from './types';
// import checkRequiredFiles from 'react-dev-utils/checkRequiredFiles';
// import ModuleNotFoundPlugin from 'react-dev-utils/ModuleNotFoundPlugin';
// import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
// import evalSourceMapMiddleware from 'react-dev-utils/evalSourceMapMiddleware';
// import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';

export function createConfig(
  paths: BundlingPaths,
  options: BundlingOptions,
): webpack.Configuration {
  const { checksEnabled, isDev } = options;

  const plugins = [
    new HtmlWebpackPlugin({
      template: paths.targetHtml,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ];

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

  return {
    mode: isDev ? 'development' : 'production',
    profile: false,
    bail: false,
    devtool: isDev ? 'cheap-module-eval-source-map' : 'source-map',
    context: paths.targetPath,
    entry: [require.resolve('react-hot-loader/patch'), paths.targetEntry],
    resolve: {
      extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx'],
      mainFields: ['main:src', 'browser', 'module', 'main'],
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
      rules: loaders(),
    },
    output: {
      publicPath: '/',
      filename: 'bundle.js',
    },
    optimization: optimization(options),
    plugins,
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
  };
}
