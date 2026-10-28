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

import type { EmbeddedDbConnectionConfig } from './startEmbeddedDb';

// This function is serialized into a separate Node process. Keep all runtime
// dependencies and helpers inside its body.
export function embeddedPostgresProcess(modulePath: string) {
  const os = require('node:os') as typeof import('node:os');
  const fs = require('node:fs/promises') as typeof import('node:fs/promises');
  const { resolve: resolvePath } =
    require('node:path') as typeof import('node:path');
  const { once } = require('node:events') as typeof import('node:events');
  const { pathToFileURL } = require('node:url') as typeof import('node:url');

  // Older CLI versions sweep backstage-dev-db-* directories without PID markers.
  const TEMP_DIR_PREFIX = 'backstage-embedded-db-';
  async function main() {
    // Register before starting: the parent may disappear during initialization.
    const disconnected = once(process, 'disconnect');
    const message = await Promise.race([
      once(process, 'message'),
      disconnected,
    ]);
    if (!process.connected) {
      return;
    }
    const [options] = message as [EmbeddedDbConnectionConfig];
    let pg;
    let tmpDir;
    let started = false;
    try {
      const { default: EmbeddedPostgres } = (await import(
        pathToFileURL(modulePath).href
      ).catch(error => {
        throw new Error(
          `Failed to load 'embedded-postgres' which is required when using ` +
            `'embedded-postgres' as the database client. It must be installed ` +
            `as an explicit dependency in your project: ${error.message}`,
        );
      })) as typeof import('embedded-postgres');
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
      await pg.start();
      started = true;
      if (process.connected) {
        // A concurrent parent exit is handled by the disconnect listener.
        process.send?.({ ready: true }, undefined, undefined, () => {});
      }
      await disconnected;
    } finally {
      try {
        if (started && pg) {
          await pg.stop();
        }
      } finally {
        if (tmpDir) {
          await fs.rm(tmpDir, { recursive: true, force: true });
        }
      }
    }
  }

  main().catch(error => {
    process.exitCode = 1;
    if (process.connected) {
      process.send?.({ error: String(error) }, undefined, undefined, () => {
        if (process.connected) {
          process.disconnect?.();
        }
      });
    } else {
      console.error(error);
    }
  });
}
