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

import { transform, bundle } from 'lightningcss';
import fs from 'fs';
import path from 'path';

// Check if core.css and components.css exist
const cssFiles = ['src/css/core.css', 'src/css/components.css'];
const distDir = 'dist/css';

cssFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.error(`${file} does not exist`);
    process.exit(1);
  }
});

// Ensure the dist/css directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

cssFiles.forEach(file => {
  let { code: bundleCode } = bundle({
    filename: file,
  });

  let { code, map } = transform({
    filename: `${distDir}/${path.basename(file)}`,
    code: bundleCode,
    minify: true,
    sourceMap: true,
  });

  fs.writeFileSync(`${distDir}/${path.basename(file)}`, code);
  fs.writeFileSync(`${distDir}/${path.basename(file)}.map`, map);

  // Clear the content of the original CSS file
  fs.writeFileSync(file, '');
});
