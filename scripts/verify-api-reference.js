#!/usr/bin/env node
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

/* eslint-disable import/no-extraneous-dependencies */

const { resolve: resolvePath } = require('path');
const { promises: fs } = require('fs');

async function main() {
  const indexContent = await fs.readFile(
    resolvePath(__dirname, '../docs/reference/index.md'),
    'utf8',
  );

  if (!indexContent.includes('types used within Backstage')) {
    throw new Error(
      'Could not find package documentation for @backstage/types in the API reference index',
    );
  }
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});
