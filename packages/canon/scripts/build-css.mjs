/*
 * Copyright 2024 The Backstage Authors
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

/* eslint-disable no-restricted-imports */
import { transform, bundle } from 'lightningcss';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { glob } from 'glob';
/* eslint-enable no-restricted-imports */

// Check if core.css and components.css exist
const cssDir = 'src/css';
const distDir = 'dist/css';
const componentsDir = 'src/components';

// Core files
const cssFiles = [
  { path: `${cssDir}/core.css`, newName: 'core.css' },
  { path: `${cssDir}/components.css`, newName: 'components.css' },
];

// Components files
const componentsFiles = glob
  .sync('**/*.css', { cwd: componentsDir })
  .map(file => {
    const folderName = file.split('/')[0].toLocaleLowerCase('en-US');
    return { path: `${componentsDir}/${file}`, newName: `${folderName}.css` };
  });

// Combine core and components files
cssFiles.push(...componentsFiles);

// Check if files exist
cssFiles.forEach(file => {
  if (!fs.existsSync(file.path)) {
    console.error(`${file.originalName} does not exist`);
    process.exit(1);
  }
});

// Ensure the dist/css directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Bundle and transform files
cssFiles.forEach(file => {
  let { code: bundleCode } = bundle({
    filename: file.path,
  });

  let { code, map } = transform({
    filename: `${distDir}/${file.newName}`,
    code: bundleCode,
    minify: true,
    sourceMap: true,
  });

  fs.writeFileSync(`${distDir}/${file.newName}`, code);
  fs.writeFileSync(`${distDir}/${file.newName}.map`, map);

  console.log(chalk.blue('CSS bundled: ') + file.newName);
});

console.log(chalk.green('CSS files bundled successfully!'));
