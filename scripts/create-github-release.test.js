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

const { getReleaseDescriptionFromCommit } = require('./create-github-release');

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
