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
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const scriptPath = path.resolve(__dirname, 'create-release-tag.js');
const scriptSource = fs.readFileSync(scriptPath, 'utf8');

async function runScript(createRef) {
  const createTagCalls = [];
  const createRefCalls = [];
  const retryDelays = [];
  let exitCode;

  const octokit = {
    git: {
      createTag: async options => {
        createTagCalls.push(options);
        return { data: { sha: 'annotated-tag-sha' } };
      },
      createRef: async options => {
        createRefCalls.push(options);
        return createRef(options);
      },
    },
  };

  const context = {
    __dirname,
    console: { error() {}, log() {}, warn() {} },
    process: {
      env: {
        GITHUB_OUTPUT: '/tmp/github-output',
        GITHUB_TOKEN: 'token',
        RELEASE_SHA: 'release-sha',
      },
      exit(code) {
        exitCode = code;
      },
    },
    require(id) {
      if (id === '@octokit/rest') {
        return {
          Octokit: function Octokit() {
            return octokit;
          },
        };
      }
      if (id === 'fs-extra') {
        return {
          appendFile: async () => {},
          readJson: async () => ({ version: '1.2.3' }),
        };
      }
      return require(id);
    },
    setTimeout(callback, delay) {
      retryDelays.push(delay);
      callback();
    },
  };

  await vm.runInNewContext(scriptSource, context, { filename: scriptPath });

  return { createRefCalls, createTagCalls, exitCode, retryDelays };
}

test('retries transient failures when creating the tag reference', async () => {
  let attempt = 0;
  const result = await runScript(async () => {
    attempt += 1;
    if (attempt < 3) {
      throw Object.assign(new Error('Not Found'), { status: 404 });
    }
  });

  assert.equal(result.exitCode, undefined);
  assert.equal(result.createTagCalls.length, 1);
  assert.equal(result.createRefCalls.length, 3);
  assert.deepEqual(result.retryDelays, [4_000, 8_000]);
});

test('stops after three transient failures', async () => {
  const result = await runScript(async () => {
    throw Object.assign(new Error('Not Found'), { status: 404 });
  });

  assert.equal(result.exitCode, 1);
  assert.equal(result.createTagCalls.length, 1);
  assert.equal(result.createRefCalls.length, 3);
  assert.deepEqual(result.retryDelays, [4_000, 8_000]);
});

test('does not retry other failures', async () => {
  const result = await runScript(async () => {
    throw Object.assign(new Error('Forbidden'), { status: 403 });
  });

  assert.equal(result.exitCode, 1);
  assert.equal(result.createTagCalls.length, 1);
  assert.equal(result.createRefCalls.length, 1);
  assert.deepEqual(result.retryDelays, []);
});
