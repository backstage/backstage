/*
 * Copyright 2026 The Backstage Authors
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

const assert = require('node:assert/strict');
const { test } = require('node:test');

const {
  createRelease,
  getReleaseDescriptionFromCommit,
} = require('./create-github-release');

test('uses placeholder notes when the release commit has no pull request', async t => {
  t.mock.method(console, 'warn', () => {});
  const getPullRequest = t.mock.fn();
  const client = {
    repos: {
      listPullRequestsAssociatedWithCommit: async () => ({ data: [] }),
    },
    pulls: {
      get: getPullRequest,
    },
  };

  const result = await getReleaseDescriptionFromCommit(
    { sha: 'commit-sha', message: 'generate release' },
    client,
  );

  assert.equal(result, 'The release notes will be updated soon.');
  assert.equal(getPullRequest.mock.callCount(), 0);
});

test('only marks the highest paginated stable release as latest', async t => {
  t.mock.method(console, 'log', () => {});

  const firstPage = [
    { name: 'v1.50.7' },
    ...Array.from({ length: 99 }, (_, index) => ({
      name: `unrelated-tag-${index}`,
    })),
  ];
  const listTags = t.mock.fn(async () => ({ data: firstPage }));
  const createReleaseRequest = t.mock.fn(async () => ({
    status: 201,
    data: {
      html_url: 'https://github.com/backstage/backstage/releases/v1.50.7',
    },
  }));
  const client = {
    paginate: t.mock.fn(async (method, parameters) => {
      const { data } = await method(parameters);
      return [...data, { name: 'v1.55.2' }];
    }),
    repos: {
      createRelease: createReleaseRequest,
      listTags,
    },
  };

  await createRelease({
    client,
    createPublishedRelease: true,
    releaseDescription: 'Release notes',
    tagName: 'v1.50.7',
  });
  await createRelease({
    client,
    createPublishedRelease: true,
    releaseDescription: 'Release notes',
    tagName: 'v1.55.2',
  });
  await createRelease({
    client,
    createPublishedRelease: true,
    releaseDescription: 'Release notes',
    tagName: 'v1.56.0-next.1',
  });
  await createRelease({
    client,
    createPublishedRelease: false,
    releaseDescription: 'Release notes',
    tagName: 'v1.55.2',
  });

  assert.deepEqual(
    createReleaseRequest.mock.calls.map(call => call.arguments[0].make_latest),
    ['false', 'true', 'false', 'false'],
  );
  assert.equal(client.paginate.mock.callCount(), 2);
  assert.deepEqual(client.paginate.mock.calls[0].arguments.slice(0, 2), [
    listTags,
    { owner: 'backstage', repo: 'backstage', per_page: 100 },
  ]);
});
