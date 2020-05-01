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

import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import imageFiles from 'rollup-plugin-image-files';
import json from '@rollup/plugin-json';
import { RollupWatchOptions } from 'rollup';
import { paths } from 'lib/paths';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.esm.js',
    format: 'module',
  },
  plugins: [
    peerDepsExternal({
      includeDependencies: true,
    }),
    resolve({
      mainFields: ['browser', 'module', 'main'],
    }),
    commonjs({
      include: ['node_modules/**', '../../node_modules/**'],
      exclude: ['**/*.stories.*', '**/*.test.*'],
    }),
    postcss(),
    imageFiles(),
    json(),
    typescript({
      include: `${paths.resolveTarget('src')}/**/*.{js,jsx,ts,tsx}`,
      tsconfigOverride: {
        // The dev folder is for the local plugin serve, ignore it in the build
        // If we don't do this we get a folder structure similar to dist/{src,dev}/...
        exclude: ['dev'],
        compilerOptions: {
          // Use absolute path to src dir as root for declarations, relying on the default
          // seems to produce declaration maps that are relative to dist/ instead of src/
          // Using a relative path like ../src doesn't work either becaus it will be used as is in subdirs.
          sourceRoot: paths.resolveTarget('src'),
        },
      },
      clean: true,
    }),
  ],
} as RollupWatchOptions;
