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

const { ensureRemoteBranch, pushBranch } = require('./patch-release-for-pr');

test('seeds a missing remote branch at the release base', async t => {
  const getRef = t.mock.fn(async () => {
    throw Object.assign(new Error('Not Found'), { status: 404 });
  });
  const createRef = t.mock.fn(async () => {});
  const runCommand = t.mock.fn(async () => {});

  await ensureRemoteBranch({
    branchName: 'patch-release',
    baseSha: 'release-base-sha',
    client: { git: { createRef, getRef } },
    runCommand,
  });

  assert.equal(getRef.mock.calls[0].arguments[0].owner, 'backstage');
  assert.equal(getRef.mock.calls[0].arguments[0].repo, 'backstage');
  assert.equal(getRef.mock.calls[0].arguments[0].ref, 'heads/patch-release');
  assert.equal(createRef.mock.calls[0].arguments[0].owner, 'backstage');
  assert.equal(createRef.mock.calls[0].arguments[0].repo, 'backstage');
  assert.equal(
    createRef.mock.calls[0].arguments[0].ref,
    'refs/heads/patch-release',
  );
  assert.equal(createRef.mock.calls[0].arguments[0].sha, 'release-base-sha');
  assert.deepEqual(Array.from(runCommand.mock.calls[0].arguments), [
    'git',
    'fetch',
    'origin',
    'refs/heads/patch-release:refs/remotes/origin/patch-release',
  ]);
});

test('fetches an existing remote branch without recreating it', async t => {
  const getRef = t.mock.fn(async () => ({ data: { object: { sha: 'sha' } } }));
  const createRef = t.mock.fn(async () => {});
  const runCommand = t.mock.fn(async () => {});

  await ensureRemoteBranch({
    branchName: 'patch-release',
    baseSha: 'release-base-sha',
    client: { git: { createRef, getRef } },
    runCommand,
  });

  assert.equal(getRef.mock.callCount(), 1);
  assert.equal(createRef.mock.callCount(), 0);
  assert.equal(runCommand.mock.callCount(), 1);
  assert.deepEqual(Array.from(runCommand.mock.calls[0].arguments), [
    'git',
    'fetch',
    'origin',
    'refs/heads/patch-release:refs/remotes/origin/patch-release',
  ]);
});

test('accepts a branch created concurrently', async t => {
  let getRefAttempt = 0;
  const getRef = t.mock.fn(async () => {
    getRefAttempt += 1;
    if (getRefAttempt === 1) {
      throw Object.assign(new Error('Not Found'), { status: 404 });
    }
    return { data: { object: { sha: 'concurrent-sha' } } };
  });
  const createRef = t.mock.fn(async () => {
    throw Object.assign(new Error('Reference already exists'), {
      status: 422,
    });
  });
  const runCommand = t.mock.fn(async () => {});

  await ensureRemoteBranch({
    branchName: 'patch-release',
    baseSha: 'release-base-sha',
    client: { git: { createRef, getRef } },
    runCommand,
  });

  assert.equal(getRef.mock.callCount(), 2);
  assert.equal(createRef.mock.callCount(), 1);
  assert.equal(runCommand.mock.callCount(), 1);
});

test('does not hide other branch creation validation errors', async t => {
  const getRef = t.mock.fn(async () => {
    throw Object.assign(new Error('Not Found'), { status: 404 });
  });
  const createError = Object.assign(new Error('Invalid SHA'), { status: 422 });
  const createRef = t.mock.fn(async () => {
    throw createError;
  });
  const runCommand = t.mock.fn(async () => {});

  await assert.rejects(
    ensureRemoteBranch({
      branchName: 'patch-release',
      baseSha: 'invalid-sha',
      client: { git: { createRef, getRef } },
      runCommand,
    }),
    createError,
  );

  assert.equal(getRef.mock.callCount(), 2);
  assert.equal(runCommand.mock.callCount(), 0);
});

test('retries GitHub workflow-check timeouts while pushing', async t => {
  let attempt = 0;
  const runCommand = t.mock.fn(async () => {
    attempt += 1;
    if (attempt === 1) {
      throw new Error(
        'Unable to determine if workflow can be created or updated due to timeout; `workflows` scope may be required.',
      );
    }
  });
  const wait = t.mock.fn(async () => {});

  await pushBranch('patch-release', { runCommand, wait });

  assert.equal(runCommand.mock.callCount(), 2);
  assert.deepEqual(Array.from(wait.mock.calls[0].arguments), [5_000]);
});

test('does not retry other push failures', async t => {
  const error = new Error('permission denied');
  const runCommand = t.mock.fn(async () => {
    throw error;
  });
  const wait = t.mock.fn(async () => {});

  await assert.rejects(
    pushBranch('patch-release', { runCommand, wait }),
    error,
  );

  assert.equal(runCommand.mock.callCount(), 1);
  assert.equal(wait.mock.callCount(), 0);
});
