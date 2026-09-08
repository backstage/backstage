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

const stableReleasePattern = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

function isNewerVersion(version, otherVersion) {
  for (let index = 0; index < version.length; index++) {
    if (version[index] > otherVersion[index]) {
      return true;
    }
    if (version[index] < otherVersion[index]) {
      return false;
    }
  }
  return false;
}

function findLatestStableRelease(tagNames) {
  let latest;

  for (const tagName of tagNames) {
    const match = stableReleasePattern.exec(tagName);
    if (!match) {
      continue;
    }

    const version = match.slice(1).map(part => BigInt(part));
    if (!latest || isNewerVersion(version, latest.version)) {
      latest = { tagName, version };
    }
  }

  if (!latest) {
    throw new Error('No stable release tags found');
  }

  return latest.tagName.slice(1);
}

module.exports = { findLatestStableRelease };
