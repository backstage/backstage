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
