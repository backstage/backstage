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
const { EOL } = require('os');

const baseOptions = {
  owner: 'backstage',
  repo: 'backstage',
};

async function getCurrentReleaseTag() {
  const rootPath = path.resolve(__dirname, '../package.json');
  return fs.readJson(rootPath).then(_ => _.version);
}

async function createGitTag(octokit, commitSha, tagName) {
  const annotatedTag = await octokit.git.createTag({
    ...baseOptions,
    tag: tagName,
    message: tagName,
    object: commitSha,
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
}

async function main() {
  if (!process.env.GITHUB_SHA) {
    throw new Error('GITHUB_SHA is not set');
  }
  if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is not set');
  }
  if (!process.env.GITHUB_OUTPUT) {
    throw new Error('GITHUB_OUTPUT environment variable not set');
  }

  const commitSha = process.env.GITHUB_SHA;
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const releaseVersion = await getCurrentReleaseTag();
  const tagName = `v${releaseVersion}`;

  console.log(`Creating release tag ${tagName} at ${commitSha}`);
  await createGitTag(octokit, commitSha, tagName);

  await fs.appendFile(process.env.GITHUB_OUTPUT, `tag_name=${tagName}${EOL}`);
  await fs.appendFile(
    process.env.GITHUB_OUTPUT,
    `version=${releaseVersion}${EOL}`,
  );
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});
