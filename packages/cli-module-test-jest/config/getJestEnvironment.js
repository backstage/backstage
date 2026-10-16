/*
 * Copyright 2025 The Backstage Authors
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

// jest-cli, jest-runtime and jest-environment-node are loaded through the installed
// jest, which relies on the package layout of the supported Jest versions.
const SUPPORTED_JEST_MAJOR_VERSIONS = [29, 30];

function resolveJest() {
  let jestVersion;
  try {
    jestVersion = require('jest/package.json').version;
  } catch {
    throw new Error(
      'Jest is not installed. Please install jest@^30 or jest@^29 as a dev dependency.',
    );
  }

  const majorVersion = parseInt(jestVersion.split('.')[0], 10);
  if (!SUPPORTED_JEST_MAJOR_VERSIONS.includes(majorVersion)) {
    throw new Error(
      `Jest ${jestVersion} is not supported. Please install Jest 30 or 29.`,
    );
  }

  return require.resolve('jest');
}

function getJestMajorVersion() {
  const jestVersion = require('jest/package.json').version;
  const majorVersion = parseInt(jestVersion.split('.')[0], 10);
  return majorVersion;
}

function getJestEnvironment() {
  const majorVersion = getJestMajorVersion();

  if (majorVersion >= 30) {
    try {
      require.resolve('@jest/environment-jsdom-abstract');
      require.resolve('jsdom');
    } catch {
      throw new Error(
        'Jest 30+ requires @jest/environment-jsdom-abstract and jsdom. ' +
          'Please install them as dev dependencies.',
      );
    }
    return require.resolve('./jest-environment-jsdom');
  }
  try {
    require.resolve('jest-environment-jsdom');
  } catch {
    throw new Error(
      'Jest 29 requires jest-environment-jsdom. ' +
        'Please install it as a dev dependency.',
    );
  }
  return require.resolve('jest-environment-jsdom');
}

// Resolved through the installed jest, whose jest-config depends on the
// jest-environment-node of the same version.
function getJestNodeEnvironment() {
  const jestCorePath = require.resolve('@jest/core', {
    paths: [resolveJest()],
  });
  const jestConfigPath = require.resolve('jest-config', {
    paths: [jestCorePath],
  });
  return require.resolve('jest-environment-node', { paths: [jestConfigPath] });
}

module.exports = {
  resolveJest,
  getJestMajorVersion,
  getJestEnvironment,
  getJestNodeEnvironment,
};
