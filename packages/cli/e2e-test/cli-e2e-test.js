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

const os = require('os');
const fs = require('fs-extra');
const { resolve: resolvePath } = require('path');
const Browser = require('zombie');

const {
  spawnPiped,
  handleError,
  waitForPageWithText,
  waitForExit,
  print,
} = require('./helpers');

const createTestApp = require('./createTestApp');
const createTestPlugin = require('./createTestPlugin');

Browser.localhost('localhost', 3000);

async function createTempDir() {
  return fs.mkdtemp(resolvePath(os.tmpdir(), 'backstage-e2e-'));
}

async function main() {
  process.env.BACKSTAGE_E2E_CLI_TEST = 'true';

  const workDir = process.env.CI ? process.cwd() : await createTempDir();

  process.stdout.write(`Initial directory: ${process.cwd()}\n`);
  process.chdir(workDir);
  process.stdout.write(`Working directory: ${process.cwd()}\n`);

  await createTestApp();

  const appDir = resolvePath(workDir, 'test-app');
  process.chdir(appDir);
  process.stdout.write(`App directory: ${appDir}\n`);

  await createTestPlugin();

  print('Starting the app');
  const startApp = spawnPiped(['yarn', 'start']);

  try {
    const browser = new Browser();

    await waitForPageWithText(browser, '/', 'Welcome to Backstage');
    await waitForPageWithText(
      browser,
      '/test-plugin',
      'Welcome to test-plugin!',
    );

    print('Both App and Plugin loaded correctly');
  } finally {
    startApp.kill();
  }

  await waitForExit(startApp);

  print('All tests done');
  process.exit(0);
}

process.on('unhandledRejection', handleError);
main(process.argv.slice(2)).catch(handleError);
