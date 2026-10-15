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

const os = require('node:os');
const fs = require('fs-extra');
const { resolve: resolvePath } = require('node:path');
const { once } = require('node:events');

const TEMP_DIR_PREFIX = 'backstage-dev-db-';
const PID_FILE = 'backstage.pid';

async function cleanStaleDatabases() {
  const entries = (await fs.readdir(os.tmpdir())).filter(d =>
    d.startsWith(TEMP_DIR_PREFIX),
  );
  await Promise.all(
    entries.map(async d => {
      const dir = resolvePath(os.tmpdir(), d);
      const raw = await fs
        .readFile(resolvePath(dir, PID_FILE), 'utf8')
        .catch(() => undefined);
      const pid = raw ? Number(raw.trim()) : NaN;
      if (pid) {
        try {
          process.kill(pid, 0);
          return;
        } catch {
          // The owning helper has exited.
        }
      }
      await fs.remove(dir);
    }),
  );
}

async function main() {
  // Register before starting: the parent may disappear during initialization.
  const disconnected = once(process, 'disconnect');
  const message = await Promise.race([once(process, 'message'), disconnected]);
  if (!process.connected) {
    return;
  }
  const [options] = message;
  let pg;
  let tmpDir;
  let started = false;
  try {
    const { default: EmbeddedPostgres } = await import(
      'embedded-postgres'
    ).catch(error => {
      throw new Error(
        `Failed to load 'embedded-postgres' which is required when using ` +
          `'embedded-postgres' as the database client. It must be installed ` +
          `as an explicit dependency in your project: ${error.message}`,
      );
    });
    await cleanStaleDatabases();
    tmpDir = await fs.mkdtemp(resolvePath(os.tmpdir(), TEMP_DIR_PREFIX));
    pg = new EmbeddedPostgres({
      databaseDir: tmpDir,
      user: options.user,
      password: options.password,
      port: options.port,
      persistent: false,
      postgresFlags: options.flags?.postgres ?? [],
      initdbFlags: options.flags?.initdb ?? [],
      onError(messageOrError) {
        console.error('[embedded-postgres]', messageOrError);
      },
      onLog() {},
    });
    await pg.initialise();
    await fs.writeFile(resolvePath(tmpDir, PID_FILE), String(process.pid));
    await pg.start();
    started = true;
    if (process.connected) {
      // A concurrent parent exit is handled by the disconnect listener.
      process.send({ ready: true }, () => {});
    }
    await disconnected;
  } finally {
    try {
      if (started) {
        await pg.stop();
      }
    } finally {
      if (tmpDir) {
        await fs.remove(tmpDir);
      }
    }
  }
}

main().catch(error => {
  process.exitCode = 1;
  if (process.connected) {
    process.send({ error: String(error) }, () => {
      if (process.connected) {
        process.disconnect();
      }
    });
  } else {
    console.error(error);
  }
});
