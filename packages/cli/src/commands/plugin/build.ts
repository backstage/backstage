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

import { Command } from 'commander';
import fs from 'fs-extra';
import recursive from 'recursive-readdir';
import path from 'path';
import { run } from '../../helpers/run';

export default async (cmd: Command) => {
  const args = [
    '--outDir',
    'dist/cjs',
    '--noEmit',
    'false',
    '--module',
    'CommonJS',
  ];

  if (cmd.watch) {
    args.push('--watch');
  }

  await copyStaticAssets();
  await run('tsc', args);
};

const copyStaticAssets = async () => {
  const pluginRoot = fs.realpathSync(process.cwd());
  const source = path.resolve(pluginRoot, 'src');
  const destination = path.resolve(pluginRoot, 'dist', 'cjs');
  const assetFiles = await recursive(source, [
    '**/*.tsx',
    '**/*.ts',
    '**/*.js',
  ]);
  assetFiles.forEach(file => {
    const fileToBeCopied = file.replace(source, destination);
    const dirForFileToBeCopied = path.dirname(fileToBeCopied);
    fs.ensureDirSync(dirForFileToBeCopied);
    fs.copyFileSync(file, file.replace(source, destination).toString());
  });
};
