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
import chalk from 'chalk';
/* eslint-enable no-restricted-imports */

const srcFile = 'src/css/styles.css';
const distDir = 'css';
const distFile = `${distDir}/styles.css`;

// Check if styles.css exists
if (!fs.existsSync(srcFile)) {
  console.error(`${srcFile} does not exist`);
  process.exit(1);
}

// Ensure the dist/css directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const args = process.argv.slice(2);
const watchMode = args.includes('--watch');

async function buildCSS(logs = true) {
  const css = fs.readFileSync(srcFile);

  let { code: bundleCode } = bundle({
    filename: srcFile,
  });

  const { code } = transform({
    filename: distFile,
    code: bundleCode,
    minify: false,
  });
  fs.writeFileSync(distFile, code);
  if (logs) {
    console.log(chalk.blue('CSS transformed and minified: ') + 'styles.css');
    console.log(chalk.green('CSS file built successfully!'));
  }
}

if (watchMode) {
  fs.watch('src/css', { recursive: true }, (eventType, filename) => {
    if (filename === 'styles.css') {
      console.log(
        chalk.yellow(`Changes detected in ${filename}, rebuilding...`),
      );
      buildCSS(false).catch(console.error);
    }
  });
  buildCSS().catch(console.error);
  console.log(chalk.yellow('Watching for CSS changes...'));
} else {
  buildCSS().catch(console.error);
}
