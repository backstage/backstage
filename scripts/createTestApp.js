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

const { spawnPiped, waitFor, waitForExit, print } = require('./helpers');

async function createTestApp() {
  print('Creating a Backstage App');
  const createApp = spawnPiped(['yarn', 'create-app']);

  try {
    let stdout = '';
    createApp.stdout.on('data', data => {
      stdout = stdout + data.toString('utf8');
    });

    await waitFor(() => stdout.includes('Enter a name for the app'));
    createApp.stdin.write('test-app\n');

    print('Waiting for app create script to be done');
    await waitForExit(createApp);

    print('Test app created');
  } finally {
    createApp.kill();
  }
}

module.exports = createTestApp;
