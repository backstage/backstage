#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
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

const { Octokit } = require('@octokit/rest');
const path = require('path');
const fs = require('fs-extra');

const baseOptions = {
  owner: 'backstage',
  repo: 'backstage',
};

async function main() {
  const { GITHUB_SHA, GITHUB_TOKEN } = process.env;
  if (!GITHUB_SHA) {
    throw new Error('GITHUB_SHA is not set');
  }
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is not set');
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN });

  const rootPath = path.resolve(__dirname, '..');
  const { version: currentVersion } = await fs.readJson(
    path.join(rootPath, 'package.json'),
  );

  const tagName = `v${currentVersion}`;

  console.log(`Creating release tag ${tagName}`);

  const annotatedTag = await octokit.git.createTag({
    ...baseOptions,
    tag: tagName,
    message: tagName,
    object: GITHUB_SHA,
    type: 'commit',
  });

  try {
    await octokit.git.createRef({
      ...baseOptions,
      ref: `refs/tags/${tagName}`,
      sha: annotatedTag.data.sha,
    });
  } catch (ex) {
    if (
      ex.status === 422 &&
      ex.response.data.message === 'Reference already exists'
    ) {
      throw new Error(`Tag ${tagName} already exists in repository`);
    }
    console.error(`Tag creation for ${tagName} failed`);
    throw ex;
  }

  console.log(`::set-output name=tag_name::${tagName}`);
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});
