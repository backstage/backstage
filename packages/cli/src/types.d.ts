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

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
  }
}

declare module 'rollup-plugin-image-files' {
  export default function image(options?: any): any;
}

declare module '@svgr/rollup' {
  export default function svgr(options?: any): any;
}

declare module '@rollup/plugin-yaml';

declare module 'terser-webpack-plugin';

declare module 'react-dev-utils/formatWebpackMessages' {
  export default function (
    stats: any,
  ): {
    errors: string[];
    warnings: string[];
  };
}

declare module 'react-dev-utils/openBrowser' {
  export default function (url: string): boolean;
}

declare module 'react-dev-utils/ModuleScopePlugin' {
  import webpack = require('webpack');

  export default class ModuleScopePlugin
    implements webpack.WebpackPluginInstance {
    constructor(
      appSrc: string | ReadonlyArray<string>,
      allowedFiles?: ReadonlyArray<string>,
    );
    apply: (compiler: webpack.Compiler) => void;
  }
}

declare module 'react-dev-utils/FileSizeReporter' {
  import webpack = require('webpack');

  export interface OpaqueFileSizes {
    root: string;
    sizes: Record<string, number>;
  }

  /**
   * Captures JS and CSS asset sizes inside the passed `buildFolder`. Save the
   * result value to compare it after the build.
   */
  export function measureFileSizesBeforeBuild(
    buildFolder: string,
  ): Promise<OpaqueFileSizes>;

  /**
   * Prints the JS and CSS asset sizes after the build, and includes a size
   * comparison with `previousFileSizes` that were captured earlier using
   * `measureFileSizesBeforeBuild()`. `maxBundleGzipSize` and
   * `maxChunkGzipSizemay` may optionally be specified to display a warning when
   * the main bundle or a chunk exceeds the specified size (in bytes).
   */
  export function printFileSizesAfterBuild(
    webpackStats: webpack.Stats,
    previousFileSizes: OpaqueFileSizes,
    buildFolder: string,
    maxBundleGzipSize?: number,
    maxChunkGzipSize?: number,
  ): void;
}

declare module 'mini-css-extract-plugin' {
  import webpack = require('webpack');

  /**
   * Lightweight CSS extraction webpack plugin.
   *
   * This plugin extracts CSS into separate files. It creates a CSS file per JS file which
   * contains CSS. It supports On-Demand-Loading of CSS and SourceMaps.
   *
   * Configuration Detail: https://github.com/webpack-contrib/mini-css-extract-plugin#configuration
   */
  export default class MiniCssExtractPlugin {
    /**
     * Webpack loader always used at the end of loaders list (ie. array index zero).
     */
    static loader: string;

    constructor(options?: MiniCssExtractPlugin.PluginOptions);

    /**
     * Apply the plugin
     */
    apply(compiler: webpack.Compiler): void;
  }

  namespace MiniCssExtractPlugin {
    interface PluginOptions {
      /**
       * Works like [`output.filename`](https://webpack.js.org/configuration/output/#outputfilename).
       */
      filename?: Required<webpack.Configuration>['output']['filename'];
      /**
       * Works like [`output.chunkFilename`](https://webpack.js.org/configuration/output/#outputchunkfilename).
       */
      chunkFilename?: string;
      /**
       * For projects where CSS ordering has been mitigated through consistent
       * use of scoping or naming conventions, the CSS order warnings can be
       * disabled by setting this flag to true for the plugin.
       */
      ignoreOrder?: boolean;
      /**
       * Specify where to insert the link tag.
       *
       * A string value specifies a DOM query for a parent element to attach to.
       *
       * A function allows to override default behavior for non-entry CSS chunks.
       * This code will run in the browser alongside your application. It is recommend
       * to only use ECMA 5 features and syntax. The function won't have access to the
       * scope of the webpack configuration module.
       *
       * @default function() { document.head.appendChild(linkTag); }
       */
      insert?: string | ((linkTag: any) => void);
      /**
       * Specify additional html attributes to add to the link tag.
       *
       * Note: These are only applied to dynamically loaded css chunks. To modify link
       * attributes for entry CSS chunks, please use html-webpack-plugin.
       */
      attributes?: Record<string, string>;
      /**
       * This option allows loading asynchronous chunks with a custom link type, such as
       * `<link type="text/css" ...>`.
       *
       * `false` disables the link `type` attribute.
       *
       * @default 'text/css'
       */
      linkType?: string | false | 'text/css';
    }
    interface LoaderOptions {
      /**
       * Overrides [`output.publicPath`](https://webpack.js.org/configuration/output/#outputpublicpath).
       * @default output.publicPath
       */
      publicPath?: string | ((resourcePath: string, context: string) => string);
      /**
       * If false, the plugin will extract the CSS but **will not** emit the file
       * @default true
       */
      emit?: boolean;
      /**
       * By default, `mini-css-extract-plugin` generates JS modules that use the ES modules syntax.
       * There are some cases in which using ES modules is beneficial,
       * like in the case of module concatenation and tree shaking.
       * @default true
       */
      esModule?: boolean;
      modules?: {
        /**
         * Enables/disables ES modules named export for locals.
         *
         * Names of locals are converted to camelCase. It is not allowed to use
         * JavaScript reserved words in CSS class names. Options `esModule` and
         * `modules.namedExport` in css-loader and MiniCssExtractPlugin.loader
         * must be enabled.
         *
         * @default false
         */
        namedExport?: boolean;
      };
    }
  }
}
declare module 'webpack-node-externals' {
  export default function webpackNodeExternals(
    options?: webpackNodeExternals.Options,
  ): any;

  namespace webpackNodeExternals {
    type AllowlistOption = string | RegExp | AllowlistFunctionType;
    type ImportTypeCallback = (moduleName: string) => string;
    /** a function that accepts the module name and returns whether it should be included */
    type AllowlistFunctionType = (moduleName: string) => boolean;
    interface ModulesFromFileType {
      exclude?: string | string[];
      include?: string | string[];
    }

    interface Options {
      /**
       * An array for the externals to allow, so they will be included in the bundle.
       * Can accept exact strings ('module_name'), regex patterns (/^module_name/), or a
       * function that accepts the module name and returns whether it should be included.
       * Important - if you have set aliases in your webpack config with the exact
       * same names as modules in node_modules, you need to allowlist them so Webpack will know
       * they should be bundled.
       * @default []
       */
      allowlist?: AllowlistOption[] | AllowlistOption;
      /**
       * @default ['.bin']
       */
      binaryDirs?: string[];
      /**
       * The method in which unbundled modules will be required in the code. Best to leave as
       * 'commonjs' for node modules.
       * @default 'commonjs'
       */
      importType?:
        | 'var'
        | 'this'
        | 'commonjs'
        | 'amd'
        | 'umd'
        | ImportTypeCallback;
      /**
       * The folder in which to search for the node modules.
       * @default 'node_modules'
       */
      modulesDir?: string;
      /**
       * Additional folders to look for node modules.
       */
      additionalModuleDirs?: string[];
      /**
       * Read the modules from the package.json file instead of the node_modules folder.
       * @default false
       */
      modulesFromFile?: boolean | ModulesFromFileType;
      /**
       * @default false
       */
      includeAbsolutePaths?: boolean;
    }
  }
}
