#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
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

const semver = require('semver');
const fs = require('fs-extra');
const { getPackages } = require('@manypkg/get-packages');
const path = require('path');

async function main() {
  const [script, version] = process.argv.slice(1);
  if (!version) {
    throw new Error(`Argument must be ${script} <version>`);
  }
  if (!semver.valid(version)) {
    throw new Error(`version '${version}' must be a valid semver`);
  }

  const manifestDir = path.resolve('versions', 'v1', 'releases', version);
  if (await fs.pathExists(manifestDir)) {
    throw new Error(
      `Release manifest path for version ${version} already exists`,
    );
  }

  console.log(`Assembling packages for backstage release ${version}`);
  const { packages } = await getPackages(path.resolve('.'));

  const versions = packages
    .filter(
      p =>
        (p.packageJson.name.startsWith('@backstage/') ||
          p.packageJson.name.startsWith('@techdocs/')) &&
        p.packageJson.private !== true,
    )
    .map(p => {
      return { name: p.packageJson.name, version: p.packageJson.version };
    });
  await fs.ensureDir(manifestDir);
  await fs.writeJSON(
    path.resolve(manifestDir, 'manifest.json'),
    { releaseVersion: version, packages: versions },
    { spaces: 2 },
  );
  const tag = version.includes('next') ? 'next' : 'main';
  const tagPath = path.resolve('versions', 'v1', 'tags', tag);

  // Check if there's an existing version for the tag, and that it's not newer than the one we're adding
  if (await fs.pathExists(tagPath)) {
    const currentTag = await fs.readJSON(
      path.resolve(tagPath, 'manifest.json'),
    );
    if (semver.gt(currentTag.releaseVersion, version)) {
      console.log(
        `Skipping update of ${tagPath} since current current ${tag} version is ${currentTag.releaseVersion}`,
      );
      return;
    }
  }

  // Switch the tag to our new version
  await fs.remove(tagPath);
  await fs.ensureSymlink(path.join('..', 'releases', version), tagPath);
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});
