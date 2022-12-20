/*
 * Copyright 2022 The Backstage Authors
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

const replace = require('replace');
const { existsSync, writeFileSync, mkdirSync } = require('fs');
const path = require('path');

const PLACEHOLDER = `---
id: "index"
title: "Package Index"
description: "Index of all Backstage Packages"
---
Run \`yarn build:api-docs\` to generate the API docs.
`;

async function main() {
  const referencesDir = '../docs/reference';
  if (existsSync(referencesDir)) {
    console.log('Removing HTML comments from docs/reference folder');
    replace({
      regex: '<!--(.*?)-->',
      replacement: '',
      paths: [referencesDir],
      recursive: true,
      silent: false,
    });
  } else {
    mkdirSync(referencesDir);
    writeFileSync(path.join(referencesDir, 'index.md'), PLACEHOLDER);
  }
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});
