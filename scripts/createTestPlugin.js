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

async function createTestPlugin() {
  print('Creating a Backstage Plugin');
  const createPlugin = spawnPiped(['yarn', 'create-plugin']);

  try {
    let stdout = '';
    createPlugin.stdout.on('data', data => {
      stdout = stdout + data.toString('utf8');
    });

    await waitFor(() => stdout.includes('Enter an ID for the plugin'));
    createPlugin.stdin.write('test-plugin\n');

    await waitFor(() => stdout.includes('Enter the owner(s) of the plugin'));
    createPlugin.stdin.write('@someuser\n');

    print('Waiting for plugin create script to be done');
    await waitForExit(createPlugin);

    print('Test plugin created');
  } finally {
    createPlugin.kill();
  }
}

module.exports = createTestPlugin;
