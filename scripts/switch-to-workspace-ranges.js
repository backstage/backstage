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
const { resolve: resolvePath } = require('path');
const { getPackages } = require('@manypkg/get-packages');

/** @typedef {import("@manypkg/get-packages").Package["packageJson"]} Pkg */

function transformDepField(deps) {
  const newPkg = JSON.parse(JSON.stringify(deps));

  for (const [name, version] of Object.entries(newPkg)) {
    if (name.startsWith('@backstage/') || name.startsWith('@internal/')) {
      const match = version.match(/^(\^|~)?[0-9]+\.[0-9]+\.[0-9]+/);
      if (match) {
        const specifier = match[1] || '*';
        newPkg[name] = `workspace:${specifier}`;
      }
    }
  }
  return newPkg;
}

/**
 *
 * @param {Pkg} pkg
 */
function transformDeps(pkg) {
  /** @type {Pkg} */
  const newPkg = JSON.parse(JSON.stringify(pkg));

  if (newPkg.dependencies) {
    newPkg.dependencies = transformDepField(newPkg.dependencies);
  }
  if (newPkg.devDependencies) {
    newPkg.devDependencies = transformDepField(newPkg.devDependencies);
  }
  if (newPkg.peerDependencies) {
    newPkg.peerDependencies = transformDepField(newPkg.peerDependencies);
  }
  if (newPkg.optionalDependencies) {
    newPkg.optionalDependencies = transformDepField(
      newPkg.optionalDependencies,
    );
  }

  return newPkg;
}

async function main() {
  const { root, packages } = await getPackages();
  for (const { dir, packageJson } of [root, ...packages]) {
    const pkgPath = resolvePath(dir, 'package.json');

    const newPackageJson = transformDeps(packageJson);
    await fs.writeJson(pkgPath, newPackageJson, { spaces: 2 });
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
