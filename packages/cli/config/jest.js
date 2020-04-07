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

const fs = require('fs');
const path = require('path');

// If the package has it's own jest config, we use that instead. It will have to
// manually extend @spotify/web-scripts/config/jest.config.js that is desired
if (fs.existsSync('jest.config.js')) {
  module.exports = require(path.resolve('jest.config.js'));
} else if (fs.existsSync('jest.config.ts')) {
  module.exports = require(path.resolve('jest.config.ts'));
} else {
  const extraOptions = {
    modulePaths: ['<rootDir>'],
  };

  // Use src/setupTests.ts as the default location for configuring test env
  if (fs.existsSync('src/setupTests.ts')) {
    extraOptions.setupFilesAfterEnv = ['<rootDir>/setupTests.ts'];
  }

  module.exports = {
    // We base the jest config on web-scripts, it's pretty flat so we skip any complex merging of config objects
    // Config can be found here: https://github.com/spotify/web-scripts/blob/master/packages/web-scripts/config/jest.config.js
    ...require('@spotify/web-scripts/config/jest.config.js'),

    ...extraOptions,

    // If the package has a jest object in package.json we merge that config in. This is the recommended
    // location for configuring tests.
    ...require(path.resolve('package.json')).jest,
  };
}
