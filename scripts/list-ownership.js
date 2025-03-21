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
const globby = require('globby');
const sloc = require('sloc');
const codeownersUtils = require('codeowners-utils');
const { resolve: resolvePath } = require('path');

async function loadOwners(rootDir) {
  const codeowners = await codeownersUtils.loadOwners(rootDir);

  return function getOwners(path) {
    const { owners } = codeownersUtils.matchFile(path, codeowners);
    if (
      owners.includes('@backstage/maintainers') &&
      owners.includes('@backstage/reviewers')
    ) {
      return owners.filter(owner => owner !== '@backstage/reviewers');
    }
    return owners;
  };
}

function createLocCounter(rootDir) {
  return async path => {
    const content = await fs.readFile(resolvePath(rootDir, path), 'utf-8');
    const stats = sloc(content, 'ts');
    return stats.source;
  };
}

async function printOwnerDirectories(allFiles, getOwners, getLoc, onlyOwner) {
  const countByPath = new Map();

  let total = 0;
  let totalShare = 0;
  for (const file of allFiles) {
    const owners = getOwners(file);
    const loc = await getLoc(file);

    if (owners.includes(onlyOwner)) {
      const share = loc / owners.length;
      total += loc;
      totalShare += share;

      const path = file.split('/').slice(0, 2).join('/');
      if ((await fs.stat(path)).isDirectory()) {
        countByPath.set(path, (countByPath.get(path) || 0) + share);
      }
    }
  }

  const sortedPaths = Array.from(countByPath)
    .map(([path, loc]) => ({ path, loc: Math.round(loc) }))
    .sort((a, b) => b.loc - a.loc);

  const maxPathLen = Math.max(...sortedPaths.map(({ path }) => path.length));
  for (const { path, loc } of sortedPaths) {
    console.log(`${path.padEnd(maxPathLen)} ${loc}`);
  }
  console.log();
  console.log('Total share:', Math.round(totalShare));
  console.log('Total lines of code:', total);
}

async function printAllOwners(allFiles, getOwners, getLoc) {
  const countByOwners = new Map();

  let total = 0;
  for (const file of allFiles) {
    const owners = getOwners(file);
    const loc = await getLoc(file);

    total += loc;
    const share = loc / owners.length;
    for (const owner of owners) {
      countByOwners.set(owner, (countByOwners.get(owner) || 0) + share);
    }
  }

  const sortedOwners = Array.from(countByOwners)
    .map(([owner, loc]) => ({ owner, loc: Math.round(loc) }))
    .sort((a, b) => b.loc - a.loc);

  const maxOwnerLen = Math.max(
    ...sortedOwners.map(({ owner }) => owner.length),
  );
  for (const { owner, loc } of sortedOwners) {
    console.log(`${owner.padEnd(maxOwnerLen)} ${loc}`);
  }
  console.log();
  console.log('Total lines of code:', total);
}

async function main(onlyOwner) {
  const rootDir = resolvePath(__dirname, '..');

  const allFiles = await globby(
    [
      '**/*.{js,jsx,ts,tsx,mjs,cjs}',
      '!**/*.{generated,test}.*',
      '!**/{__fixtures__,fixtures}',
    ],
    {
      cwd: rootDir,
      gitignore: true,
      followSymbolicLinks: false,
    },
  );

  const getOwners = await loadOwners(rootDir);
  const getLoc = createLocCounter(rootDir);

  if (onlyOwner) {
    await printOwnerDirectories(allFiles, getOwners, getLoc, onlyOwner);
  } else {
    await printAllOwners(allFiles, getOwners, getLoc);
  }
}

main(...process.argv.slice(2)).catch(err => {
  console.error(err.stack);
  process.exit(1);
});
