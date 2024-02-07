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

const fs = require('fs-extra');
const path = require('path');

const YARN_REGISTRY = 'https://registry.yarnpkg.com';
const NPM_REGISTRY = 'https://registry.npmjs.org';
const SEED_FILE = 'seed-yarn.lock';

function formatLockEntry(package, query, version, distData) {
  let header = `${package}@${query}`;
  if (package.includes('@')) {
    header = `"${header}"`;
  }
  header += ':';

  return [
    '',
    header,
    `  version "${version}"`,
    `  resolved "${distData.tarball.replace(NPM_REGISTRY, YARN_REGISTRY)}#${
      distData.shasum
    }"`,
    `  integrity ${distData.integrity}`,
    '',
  ].join('\n');
}

async function main(package, query, version) {
  if (!package || !query || !version) {
    console.error(
      `Usage: yarn add-lock-seed <package-name> <query> <version>

Example: yarn lock-seed @backstage/cli ^1.0.0 1.2.3`,
    );
    return false;
  }

  const res = await fetch(`${YARN_REGISTRY}/${package}/${version}`);
  if (!res.ok) {
    console.error(
      `Failed to fetch package info for ${package} v${version}: ${await res.text()}`,
    );
    return false;
  }

  const data = await res.json();

  const entry = formatLockEntry(package, query, version, data.dist);

  const lockSeedPath = path.resolve(__dirname, `../${SEED_FILE}`);

  await fs.appendFile(lockSeedPath, entry, 'utf8');

  console.log(`Added the following entry to ${SEED_FILE}:\n${entry}`);

  return true;
}

main(...process.argv.slice(2))
  .then(ok => process.exit(ok ? 0 : 1))
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  });
