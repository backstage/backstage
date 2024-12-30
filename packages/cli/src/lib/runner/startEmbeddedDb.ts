/*
 * Copyright 2024 The Backstage Authors
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

import os from 'node:os';
import fs from 'fs-extra';
import { resolve as resolvePath } from 'path';
import { getPortPromise } from 'portfinder';

export async function startEmbeddedDb() {
  const { default: EmbeddedPostgres } = await import('embedded-postgres').catch(
    error => {
      throw new Error(
        `Failed to load peer dependency 'embedded-postgres' for generating SQL reports. ` +
          `It must be installed as an explicit dependency in your project. Caused by; ${error}`,
      );
    },
  );

  const host = 'localhost';
  const user = 'postgres';
  const password = 'password';
  const port = await getPortPromise();
  const tmpDir = await fs.mkdtemp(
    resolvePath(os.tmpdir(), 'backstage-dev-db-'),
  );
  const pg = new EmbeddedPostgres({
    databaseDir: tmpDir,
    user,
    password,
    port,
    persistent: false,
    onError(_messageOrError) {},
    onLog(_message) {},
  });

  // Create the cluster config files
  await pg.initialise();

  // Start the server
  await pg.start();

  return {
    connection: {
      host,
      user,
      password,
      port,
    },
    async close() {
      await pg.stop();
      await fs.rmdir(tmpDir, { recursive: true, maxRetries: 3 });
    },
  };
}
