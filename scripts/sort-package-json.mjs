#!/usr/bin/env node
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

import sortPackage from 'sort-package-json';
import fs from 'fs-extra';

const sortOrder = [
  'name',
  'version',
  'description',
  'backstage',
  'publishConfig',
  // ...and whatever is not in here, goes in the library's default order
];

const files = process.argv.slice(2).filter(arg => !arg.startsWith('--'));

for (const file of files) {
  const originalPackage = JSON.parse(fs.readFileSync(file).toString());
  const sortedPackage = JSON.stringify(
    sortPackage(originalPackage, { sortOrder }),
    null,
    2,
  );
  fs.writeFileSync(file, `${sortedPackage}\n`);
}
