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

import webpack, { Module, Plugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { BundlingOptions } from './types';
import { BundlingPaths } from './paths';

type Transforms = {
  loaders: Module['rules'];
  plugins: Plugin[];
};

export const transforms = (
  paths: BundlingPaths,
  options: BundlingOptions,
): Transforms => {
  const { isDev } = options;

  const loaders = [
    {
      test: /\.(tsx?)$/,
      exclude: /node_modules/,
      loader: require.resolve('@sucrase/webpack-loader'),
      options: {
        transforms: ['typescript', 'jsx', 'react-hot-loader'],
      },
    },
    {
      test: /\.(jsx?|mjs)$/,
      exclude: /node_modules/,
      loader: require.resolve('@sucrase/webpack-loader'),
      options: {
        transforms: ['jsx', 'react-hot-loader'],
      },
    },
    {
      test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.frag/, /\.xml/],
      loader: require.resolve('url-loader'),
      options: {
        limit: 10000,
        name: 'static/media/[name].[hash:8].[ext]',
      },
    },
    {
      test: /\.ya?ml$/,
      use: require.resolve('yml-loader'),
    },
    {
      include: /\.(md)$/,
      use: require.resolve('raw-loader'),
    },
    {
      test: /\.css$/i,
      use: [
        isDev ? require.resolve('style-loader') : MiniCssExtractPlugin.loader,
        {
          loader: require.resolve('css-loader'),
          options: {
            sourceMap: true,
          },
        },
      ],
    },
  ];

  const plugins = new Array<Plugin>();

  plugins.push(
    new HtmlWebpackPlugin({
      template: paths.targetHtml,
    }),
  );

  if (isDev) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  } else {
    plugins.push(
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css',
        chunkFilename: '[name].[id].[contenthash:8].css',
      }),
    );
  }

  return { loaders, plugins };
};
