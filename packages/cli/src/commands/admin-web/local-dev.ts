/*
 * Copyright 2020 The Backstage Authors
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

import { serveBundle } from '../../lib/bundler';
import path from 'path';
import { ConfigReader } from '@backstage/config';

console.log('CLI spoolin');

async function main() {
  /* eslint-disable-next-line no-restricted-syntax */
  const targetDir = path.resolve(__dirname, 'embedded/');
  const waitForExit = await serveBundle({
    entry: path.resolve(targetDir, 'index'),
    targetDir,
    checksEnabled: false,
    frontendAppConfigs: [],
    frontendConfig: new ConfigReader(
      {
        app: {
          baseUrl: 'http://127.0.0.1:7008',
        },
      },
      '',
    ),
    fullConfig: new ConfigReader({}, ''),
  });

  await waitForExit();
}

main().then(() => {});
