#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
/*
 * Copyright 2020 Spotify AB
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

/**
 * This script creates a release on GitHub for the Backstage repository.
 * Given a git tag, it identifies the PR created by changesets which is responsible for creating
 * the git tag. It then uses the PR description consisting of changelogs for packages as the
 * release description.
 *
 * Example:
 *
 * Set GITHUB_TOKEN environment variable.
 *
 * (Dry Run mode, will create a DRAFT release, but will not publish it.)
 * (Draft releases are visible to maintainers and do not notify users.)
 * $ node scripts/get-release-description v0.4.1
 *
 * This will open the git tree at this tag https://github.com/backstage/backstage/tree/v0.4.1
 * It will identify https://github.com/backstage/backstage/pull/3668 as the responsible changeset PR.
 * And will use everything in the PR description under "Releases" section.
 *
 * (Production or GitHub Actions Mode)
 * $ node scripts/get-release-description v0.4.1 true
 *
 * This will do the same steps as above, and will publish the Release with the description.
 */

const { Octokit } = require('@octokit/rest');

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

  const date = new Date();
  const baseTagName = `release-${date.getUTCFullYear()}-${
    date.getUTCMonth() + 1
  }-${date.getUTCDate()}`;

  console.log('Requesting existing tags');

  const existingTags = await octokit.repos.listTags({
    ...baseOptions,
    per_page: 100,
  });
  const existingTagNames = existingTags.data.map(obj => obj.name);

  let tagName = baseTagName;
  let index = 0;
  while (existingTagNames.includes(tagName)) {
    index += 1;
    tagName = `${baseTagName}.${index}`;
  }

  console.log(`Creating release tag ${tagName}`);

  const annotatedTag = await octokit.git.createTag({
    ...baseOptions,
    tag: tagName,
    message: tagName,
    object: GITHUB_SHA,
    type: 'commit',
  });

  await octokit.git.createRef({
    ...baseOptions,
    ref: `refs/tags/${tagName}`,
    sha: annotatedTag.data.sha,
  });

  console.log(`::set-output name=tag_name::${tagName}`);
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});
