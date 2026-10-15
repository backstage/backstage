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

const { runBackend } = require('../runBackend');
const { startEmbeddedDb } = require('../startEmbeddedDb');

async function main() {
  if (process.env.TEST_BACKEND) {
    const waitForExit = await runBackend({
      entry: require.resolve('./embeddedDbBackend.cjs'),
      configPaths: [process.env.TEST_CONFIG],
    });
    await waitForExit();
  } else {
    const db = await startEmbeddedDb({
      configPaths: [process.env.TEST_CONFIG],
    });
    // eslint-disable-next-line @backstage/no-undeclared-imports -- Test fixture using a development dependency.
    const { Client } = require('pg');
    const fs = require('node:fs');
    const { resolve: resolvePath } = require('node:path');
    const client = new Client({
      ...db.configOverride.connection,
      port: Number(process.env.TEST_PORT),
      database: 'postgres',
    });
    await client.connect();
    const { rows } = await client.query('SHOW data_directory');
    await client.end();
    fs.writeFileSync(
      resolvePath(process.env.TEST_EVENTS, '../database'),
      rows[0].data_directory,
    );
    process.send(db.configOverride);
    await new Promise(resolve => process.once('message', resolve));
    await db.close();
  }
}
main().then(
  () => process.exit(0),
  error => {
    console.error(error);
    process.exit(1);
  },
);
