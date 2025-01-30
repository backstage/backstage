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

import { RuleSetRule, WebpackPluginInstance } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { svgrTemplate } from '../svgrTemplate';

type Transforms = {
  loaders: RuleSetRule[];
  plugins: WebpackPluginInstance[];
};

type TransformOptions = {
  isDev: boolean;
  isBackend?: boolean;
  rspack?: typeof import('@rspack/core').rspack;
};

export const transforms = (options: TransformOptions): Transforms => {
  const { isDev, isBackend, rspack } = options;

  const CssExtractRspackPlugin: typeof MiniCssExtractPlugin = rspack
    ? (rspack.CssExtractRspackPlugin as unknown as typeof MiniCssExtractPlugin)
    : MiniCssExtractPlugin;

  // This ensures that styles inserted from the style-loader and any
  // async style chunks are always given lower priority than JSS styles.
  // Note that this function is stringified and executed in the browser
  // after transpilation, so stick to simple syntax
  function insertBeforeJssStyles(element: any) {
    const head = document.head;
    // This makes sure that any style elements we insert get put before the
    // dynamic styles from JSS, such as the ones from `makeStyles()`.
    // TODO(Rugvip): This will likely break in material-ui v5, keep an eye on it.
    const firstJssNode = head.querySelector('style[data-jss]');
    if (!firstJssNode) {
      head.appendChild(element);
    } else {
      head.insertBefore(element, firstJssNode);
    }
  }

  const loaders = [
    {
      test: /\.(tsx?)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: rspack ? 'builtin:swc-loader' : require.resolve('swc-loader'),
          options: {
            jsc: {
              target: 'es2022',
              externalHelpers: !isBackend,
              parser: {
                syntax: 'typescript',
                tsx: !isBackend,
                dynamicImport: true,
              },
              transform: {
                react: isBackend
                  ? undefined
                  : {
                      runtime: 'automatic',
                      refresh: isDev,
                    },
              },
            },
          },
        },
      ],
    },
    {
      test: /\.(jsx?|mjs|cjs)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: rspack ? 'builtin:swc-loader' : require.resolve('swc-loader'),
          options: {
            jsc: {
              target: 'es2022',
              externalHelpers: !isBackend,
              parser: {
                syntax: 'ecmascript',
                jsx: !isBackend,
                dynamicImport: true,
              },
              transform: {
                react: isBackend
                  ? undefined
                  : {
                      runtime: 'automatic',
                      refresh: isDev,
                    },
              },
            },
          },
        },
      ],
    },
    {
      test: /\.(js|mjs|cjs)$/,
      resolve: {
        fullySpecified: false,
      },
    },
    {
      test: [/\.icon\.svg$/],
      use: [
        {
          loader: rspack ? 'builtin:swc-loader' : require.resolve('swc-loader'),
          options: {
            jsc: {
              target: 'es2022',
              externalHelpers: !isBackend,
              parser: {
                syntax: 'ecmascript',
                jsx: !isBackend,
                dynamicImport: true,
              },
            },
          },
        },
        {
          loader: require.resolve('@svgr/webpack'),
          options: { babel: false, template: svgrTemplate },
        },
      ],
    },
    {
      test: [
        /\.bmp$/,
        /\.gif$/,
        /\.jpe?g$/,
        /\.png$/,
        /\.frag$/,
        /\.vert$/,
        { and: [/\.svg$/, { not: [/\.icon\.svg$/] }] },
        /\.xml$/,
        /\.ico$/,
        /\.webp$/,
      ],
      type: 'asset/resource',
      generator: {
        filename: 'static/[name].[hash:8][ext]',
      },
    },
    {
      test: /\.(eot|woff|woff2|ttf)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/[name].[hash][ext][query]',
      },
    },
    {
      test: /\.ya?ml$/,
      use: require.resolve('yml-loader'),
    },
    {
      include: /\.(md)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/[name].[hash][ext][query]',
      },
    },
    {
      test: /\.css$/i,
      use: [
        isDev
          ? {
              loader: require.resolve('style-loader'),
              options: {
                insert: insertBeforeJssStyles,
              },
            }
          : CssExtractRspackPlugin.loader,
        {
          loader: require.resolve('css-loader'),
          options: {
            sourceMap: true,
          },
        },
      ],
    },
  ];

  const plugins = new Array<WebpackPluginInstance>();

  if (!isDev) {
    plugins.push(
      new CssExtractRspackPlugin({
        filename: 'static/[name].[contenthash:8].css',
        chunkFilename: 'static/[name].[id].[contenthash:8].css',
        insert: insertBeforeJssStyles, // Only applies to async chunks
      }),
    );
  }

  return { loaders, plugins };
};
