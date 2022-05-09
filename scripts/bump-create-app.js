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
const { execFile: execFileCb } = require('child_process');
const { promisify } = require('util');

const exec = promisify(execFileCb);

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

  let excludeList = [];
  if (await fs.pathExists('pre.json')) {
    const data = await fs.readJSON('pre.json');
    excludeList = data.changesets.map(name => `${name}.md`);
  }
  const hasCreateAppChanges = changesets
    .filter(({ name }) => !excludeList.includes(name))
    .map(changeset =>
      changeset.releases.some(
        release => release.name === '@backstage/create-app',
      ),
    )
    .includes(true);

  if (hasCreateAppChanges) {
    console.log(
      'Contains create-app changeset, no need to create additional changeset',
    );
    return;
  }
  const ts = Math.round(new Date().getTime() / 1000);
  const fileName = `create-app-${ts}.md`;
  console.log(`Creating ${fileName}`);
  const data = `---
'@backstage/create-app': patch
---\n
Bumped create-app version.\n`;
  await fs.writeFile(fileName, data);
  await exec('git', ['config', 'user.name', `"github-actions[bot]"`]);
  await exec('git', [
    'config',
    'user.email',
    `"github-actions[bot]@users.noreply.github.com"`,
  ]);
  await exec('git', ['add', fileName]);
  await exec('git', ['commit', '-m', 'Add create-app changeset']);
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});
