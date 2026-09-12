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

const { findLatestStableRelease } = require('./find-latest-stable-release');

test('finds the highest stable release using numeric version ordering', () => {
  assert.equal(
    findLatestStableRelease(['v1.9.9', 'v1.10.0', 'v2.0.0', 'v1.54.6']),
    '2.0.0',
  );
});

test('ignores prerelease and malformed tags', () => {
  assert.equal(
    findLatestStableRelease([
      'v1.54.6-next.1',
      'v1.54.6',
      '1.55.0',
      'v1.55',
      'v01.55.0',
      'v2.0.0-beta.1',
      'release-v3.0.0',
    ]),
    '1.54.6',
  );
});

test('fails when no stable release tag is available', () => {
  assert.throws(
    () => findLatestStableRelease(['v1.55.0-next.1', 'not-a-release']),
    /No stable release tags found/,
  );
});
