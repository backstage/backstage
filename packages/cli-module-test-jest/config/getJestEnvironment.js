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

module.exports = { getJestMajorVersion, getJestEnvironment };
