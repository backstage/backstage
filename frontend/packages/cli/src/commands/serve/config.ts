import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ModuleScopePlugin from 'react-dev-utils/ModuleScopePlugin';
import { Paths } from './paths';
// import checkRequiredFiles from 'react-dev-utils/checkRequiredFiles';
// import ModuleNotFoundPlugin from 'react-dev-utils/ModuleNotFoundPlugin';
// import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
// import evalSourceMapMiddleware from 'react-dev-utils/evalSourceMapMiddleware';
// import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';

export function createConfig(paths: Paths): webpack.Configuration {
  return {
    mode: 'development',
    profile: false,
    bail: false,
    devtool: 'cheap-module-eval-source-map',
    entry: [
      require.resolve('webpack-dev-server/client') + '?/',
      require.resolve('webpack/hot/dev-server'),
      paths.appDevEntry,
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      plugins: [
        new ModuleScopePlugin(
          [paths.appSrc, paths.appDev],
          [paths.appPackageJson],
        ),
      ],
    },
    module: {
      rules: [
        {
          test: /\.(tsx?|jsx?|mjs)$/,
          enforce: 'pre',
          include: [paths.appSrc, paths.appDev],
          use: {
            loader: 'eslint-loader',
            options: {
              emitWarning: true,
            },
          },
        },
        {
          test: /\.(tsx?|jsx?|mjs)$/,
          include: [paths.appSrc, paths.appDev],
          exclude: /node_modules/,
          loader: 'ts-loader',
          options: {
            // disable type checker - handled by ForkTsCheckerWebpackPlugin
            transpileOnly: true,
          },
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.frag/, /\.xml/],
          loader: 'url-loader',
          include: paths.appAssets,
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
      ],
    },
    output: {
      publicPath: '/',
      filename: 'bundle.js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: paths.appHtml,
      }),
      new ForkTsCheckerWebpackPlugin({
        async: true,
        useTypescriptIncrementalApi: true,
        checkSyntacticErrors: true,
        tsconfig: paths.appTsConfig,
        reportFiles: ['**', '!**/__tests__/**', '!**/?(*.)(spec|test).*'],
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
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
