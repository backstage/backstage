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
const fs = require('fs-extra');
const { default: parseChangeset } = require('@changesets/parse');

const privatePackages = new Set([
  'example-app',
  'example-backend',
  'e2e-test',
  'storybook',
  'techdocs-cli-embedded-app',
]);

async function main() {
  process.chdir(resolvePath(__dirname, '../.changeset'));

  const fileNames = await fs.readdir('.');
  const changesetNames = fileNames.filter(
    name => name.endsWith('.md') && name !== 'README.md',
  );

  const changesets = await Promise.all(
    changesetNames.map(async name => {
      const content = await fs.readFile(name, 'utf8');
      return { name, ...parseChangeset(content) };
    }),
  );

  const errors = [];
  for (const changeset of changesets) {
    const privateReleases = changeset.releases.filter(release =>
      privatePackages.has(release.name),
    );
    if (privateReleases.length > 0) {
      const names = privateReleases
        .map(release => `'${release.name}'`)
        .join(', ');
      errors.push({
        name: changeset.name,
        messages: [
          `Should not contain releases of the following packages since they are not published: ${names}`,
        ],
      });
    }
  }

  if (errors.length) {
    console.log();
    console.log('***********************************************************');
    console.log('*             Changeset verification failed!              *');
    console.log('***********************************************************');
    console.log();
    for (const error of errors) {
      console.error(`Changeset '${error.name}' is invalid:`);
      console.log();
      for (const message of error.messages) {
        console.error(`  ${message}`);
      }
    }
    console.log();
    console.log('***********************************************************');
    console.log();
    process.exit(1);
  }
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});
