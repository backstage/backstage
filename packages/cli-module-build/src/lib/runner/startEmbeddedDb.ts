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
import { resolve as resolvePath } from 'node:path';
import { getPortPromise } from 'portfinder';
import { ForwardedError } from '@backstage/errors';
import chalk from 'chalk';

const TEMP_DIR_PREFIX = 'backstage-dev-db-';
const PID_FILE = 'backstage.pid';

function isProcessAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function cleanStaleDatabases() {
  const tmpBase = os.tmpdir();
  const entries = (await fs.readdir(tmpBase)).filter(d =>
    d.startsWith(TEMP_DIR_PREFIX),
  );
  await Promise.all(
    entries.map(async d => {
      const dir = resolvePath(tmpBase, d);
      const raw = await fs
        .readFile(resolvePath(dir, PID_FILE), 'utf8')
        .catch(() => undefined);
      const pid = raw ? Number(raw.trim()) : NaN;
      if (!pid || !isProcessAlive(pid)) {
        await fs.remove(dir);
      }
    }),
  );
}

export async function startEmbeddedDb() {
  console.warn(
    chalk.yellow(
      'WARNING: Using embedded-postgres for local development is experimental and subject to change',
    ),
  );

  const { default: EmbeddedPostgres } = await import('embedded-postgres').catch(
    error => {
      throw new ForwardedError(
        `Failed to load 'embedded-postgres' which is required when using ` +
          `'embedded-postgres' as the database client. It must be installed ` +
          `as an explicit dependency in your project`,
        error,
      );
    },
  );

  await cleanStaleDatabases();

  const host = 'localhost';
  const user = 'postgres';
  const password = 'password';
  const port = await getPortPromise();
  const tmpDir = await fs.mkdtemp(resolvePath(os.tmpdir(), TEMP_DIR_PREFIX));

  const pg = new EmbeddedPostgres({
    databaseDir: tmpDir,
    user,
    password,
    port,
    persistent: false,
    onError(messageOrError) {
      console.error(`[embedded-postgres]`, messageOrError);
    },
    onLog() {},
  });

  try {
    await pg.initialise();
    await fs.writeFile(resolvePath(tmpDir, PID_FILE), String(process.pid));
    await pg.start();
  } catch (error) {
    await pg.stop().catch(() => {});
    await fs.remove(tmpDir).catch(() => {});
    throw error;
  }

  return {
    connection: {
      host,
      user,
      password,
      port,
    },
    async close() {
      await pg.stop();
      await fs.remove(tmpDir);
    },
  };
}
