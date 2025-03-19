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
const distDir = 'css';
const componentsDir = 'src/components';

// Core files
const cssFiles = [
  { path: `${cssDir}/core.css`, newName: 'core.css' },
  { path: `${cssDir}/components.css`, newName: 'components.css' },
  { path: `${cssDir}/styles.css`, newName: 'styles.css' },
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

// Add watch mode support
const args = process.argv.slice(2);
const watchMode = args.includes('--watch');

async function buildCSS(logs = true) {
  // Bundle and transform files
  cssFiles.forEach(file => {
    let { code: bundleCode } = bundle({
      filename: file.path,
    });

    let { code } = transform({
      filename: `${distDir}/${file.newName}`,
      code: bundleCode,
    });

    fs.writeFileSync(`${distDir}/${file.newName}`, code);

    if (logs) {
      console.log(chalk.blue('CSS bundled: ') + file.newName);
    }
  });

  if (logs) {
    console.log(chalk.green('CSS files bundled successfully!'));
  }
}

if (watchMode) {
  // Watch both directories for changes
  [cssDir, componentsDir].forEach(dir => {
    fs.watch(dir, { recursive: true }, (eventType, filename) => {
      if (filename?.endsWith('.css')) {
        console.log(
          chalk.yellow(`Changes detected in ${filename}, rebuilding...`),
        );
        buildCSS(false).catch(console.error);
      }
    });
  });

  // Initial build
  buildCSS().catch(console.error);
  console.log(chalk.yellow('Watching for CSS changes...'));
} else {
  buildCSS().catch(console.error);
}
