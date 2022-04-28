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

import chalk from 'chalk';
import fs from 'fs-extra';
import { relative as relativePath, resolve as resolvePath } from 'path';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import esbuild from 'rollup-plugin-esbuild';
import svgr from '@svgr/rollup';
import dts from 'rollup-plugin-dts';
import json from '@rollup/plugin-json';
import yaml from '@rollup/plugin-yaml';
import { RollupOptions, OutputOptions, RollupWarning } from 'rollup';

import { forwardFileImports } from './plugins';
import { BuildOptions, Output } from './types';
import { paths } from '../paths';
import { svgrTemplate } from '../svgrTemplate';

function isFileImport(source: string) {
  if (source.startsWith('.')) {
    return true;
  }
  if (source.startsWith('/')) {
    return true;
  }
  if (source.match(/[a-z]:/i)) {
    return true;
  }
  return false;
}

export async function makeRollupConfigs(
  options: BuildOptions,
): Promise<RollupOptions[]> {
  const configs = new Array<RollupOptions>();
  const targetDir = options.targetDir ?? paths.targetDir;
  const onwarn = ({ code, message }: RollupWarning) => {
    if (code === 'EMPTY_BUNDLE') {
      return; // We don't care about this one
    }
    if (options.logPrefix) {
      console.log(options.logPrefix + message);
    } else {
      console.log(message);
    }
  };

  const distDir = resolvePath(targetDir, 'dist');

  if (options.outputs.has(Output.cjs) || options.outputs.has(Output.esm)) {
    const output = new Array<OutputOptions>();
    const mainFields = ['module', 'main'];

    if (options.outputs.has(Output.cjs)) {
      output.push({
        dir: distDir,
        entryFileNames: 'index.cjs.js',
        chunkFileNames: 'cjs/[name]-[hash].cjs.js',
        format: 'commonjs',
        sourcemap: true,
      });
    }
    if (options.outputs.has(Output.esm)) {
      output.push({
        dir: distDir,
        entryFileNames: 'index.esm.js',
        chunkFileNames: 'esm/[name]-[hash].esm.js',
        format: 'module',
        sourcemap: true,
      });
      // Assume we're building for the browser if ESM output is included
      mainFields.unshift('browser');
    }

    configs.push({
      input: resolvePath(targetDir, 'src/index.ts'),
      output,
      onwarn,
      preserveEntrySignatures: 'strict',
      // All module imports are always marked as external
      external: (source, importer, isResolved) =>
        Boolean(importer && !isResolved && !isFileImport(source)),
      plugins: [
        resolve({ mainFields }),
        commonjs({
          include: /node_modules/,
          exclude: [/\/[^/]+\.(?:stories|test)\.[^/]+$/],
        }),
        postcss(),
        forwardFileImports({
          exclude: /\.icon\.svg$/,
          include: [
            /\.svg$/,
            /\.png$/,
            /\.gif$/,
            /\.jpg$/,
            /\.jpeg$/,
            /\.eot$/,
            /\.woff$/,
            /\.woff2$/,
            /\.ttf$/,
          ],
        }),
        json(),
        yaml(),
        svgr({
          include: /\.icon\.svg$/,
          template: svgrTemplate,
        }),
        esbuild({
          target: 'es2019',
          minify: options.minify,
        }),
      ],
    });
  }

  if (options.outputs.has(Output.types) && !options.useApiExtractor) {
    const typesInput = paths.resolveTargetRoot(
      'dist-types',
      relativePath(paths.targetRoot, targetDir),
      'src/index.d.ts',
    );

    const declarationsExist = await fs.pathExists(typesInput);
    if (!declarationsExist) {
      const path = relativePath(targetDir, typesInput);
      throw new Error(
        `No declaration files found at ${path}, be sure to run ${chalk.bgRed.white(
          'yarn tsc',
        )} to generate .d.ts files before packaging`,
      );
    }

    configs.push({
      input: typesInput,
      output: {
        file: resolvePath(distDir, 'index.d.ts'),
        format: 'es',
      },
      external: [
        /\.css$/,
        /\.scss$/,
        /\.sass$/,
        /\.svg$/,
        /\.eot$/,
        /\.woff$/,
        /\.woff2$/,
        /\.ttf$/,
      ],
      onwarn,
      plugins: [dts()],
    });
  }

  return configs;
}
