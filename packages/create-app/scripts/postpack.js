#!/usr/bin/env node
/*
 * Copyright 2021 The Backstage Authors
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

/* eslint-disable no-restricted-syntax */

const fs = require('fs-extra');
const path = require('path');

async function main() {
  const pkgPath = path.resolve(__dirname, '../package.json');
  const pkgBackupPath = path.resolve(__dirname, '../package.json-prepack');

  try {
    await fs.move(pkgBackupPath, pkgPath, { overwrite: true });
  } catch (err) {
    console.error(`Failed to restore package.json during postpack, ${err}`);
  }
}

main().catch(err => {
  console.error(err.stack);
  process.exit(1);
});
