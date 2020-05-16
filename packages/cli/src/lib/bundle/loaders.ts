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

import { Module } from 'webpack';

export const loaders = (): Module['rules'] => {
  return [
    {
      test: /\.(tsx?)$/,
      exclude: /node_modules/,
      loader: '@sucrase/webpack-loader',
      options: {
        transforms: ['typescript', 'jsx', 'react-hot-loader'],
      },
    },
    {
      test: /\.(jsx?|mjs)$/,
      exclude: /node_modules/,
      loader: '@sucrase/webpack-loader',
      options: {
        transforms: ['jsx', 'react-hot-loader'],
      },
    },
    {
      test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.frag/, /\.xml/],
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'static/media/[name].[hash:8].[ext]',
      },
    },
    {
      test: /\.ya?ml$/,
      use: 'yml-loader',
    },
    {
      include: /\.(md)$/,
      use: 'raw-loader',
    },
    {
      test: /\.css$/i,
      use: ['style-loader', 'css-loader'],
    },
  ];
};
