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

// eslint-disable-next-line @backstage/no-undeclared-imports -- Test fixture using a development dependency.
const { Client } = require('pg');
const fs = require('node:fs');

const config = JSON.parse(process.env.APP_CONFIG_backend_database);
const client = new Client({
  ...config.connection,
  port: Number(process.env.TEST_PORT),
  database: 'postgres',
});
let stopping = false;

async function stop() {
  if (stopping) {
    return;
  }
  stopping = true;
  // Query throughout a deliberately slow plugin shutdown hook.
  for (let i = 0; i < 10; i++) {
    await new Promise(resolve => setTimeout(resolve, 100));
    await client.query('SELECT 1');
  }
  fs.appendFileSync(process.env.TEST_EVENTS, 'drained\n');
  await client.end();
  process.exit(0);
}
client.on('error', error => {
  console.error(error);
  process.exit(1);
});
client.connect().then(async () => {
  const { rows } = await client.query('SHOW data_directory');
  fs.appendFileSync(
    process.env.TEST_EVENTS,
    `database:${rows[0].data_directory}\n`,
  );
  process.on('SIGINT', () => stop());
  process.on('SIGTERM', () => stop());
  fs.appendFileSync(process.env.TEST_EVENTS, `ready:${process.pid}\n`);
});
