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
export function embeddedPostgresProcess(
  modulePath: string,
  exitHookPath: string,
) {
  const os = require('node:os') as typeof import('node:os');
  const fs = require('node:fs/promises') as typeof import('node:fs/promises');
  const { resolve: resolvePath } =
    require('node:path') as typeof import('node:path');
  const { once } = require('node:events') as typeof import('node:events');
  const { pathToFileURL } = require('node:url') as typeof import('node:url');

  // Older CLI versions sweep backstage-dev-db-* directories without PID markers.
  const TEMP_DIR_PREFIX = 'backstage-embedded-db-';
  let stopping = !process.connected;
  let requestStop: () => void;
  const stopped = new Promise<void>(resolve => {
    requestStop = () => {
      stopping = true;
      resolve();
    };
  });
  process.once('disconnect', requestStop!);
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
    process.on(signal, requestStop!);
  }
  async function stopPostgres(pg: { stop(): Promise<void> }, tmpDir: string) {
    const rawPid = await fs
      .readFile(resolvePath(tmpDir, 'postmaster.pid'), 'utf8')
      .catch(error => {
        if (error.code !== 'ENOENT') {
          throw error;
        }
        return '';
      });
    const pid = Number(rawPid.split('\n')[0]);
    if (Number.isSafeInteger(pid) && pid > 0) {
      // stop() can wait forever if PostgreSQL exited before it attached
      // its exit listener. Also watch the OS process and bound shutdown.
      const stop = pg.stop().catch(error => console.error(error));
      const deadline = Date.now() + 10_000;
      for (;;) {
        try {
          process.kill(pid, Date.now() < deadline ? 0 : 'SIGKILL');
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code === 'ESRCH') {
            break;
          }
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      await Promise.race([
        stop,
        new Promise(resolve => setTimeout(resolve, 50)),
      ]);
    }
  }

  async function main() {
    if (stopping) {
      return;
    }
    const message = await Promise.race([once(process, 'message'), stopped]);
    if (stopping) {
      return;
    }
    const [options] = message as [EmbeddedDbConnectionConfig];
    let pg;
    let tmpDir;

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
      // The helper owns shutdown. Disable the library's competing signal and
      // beforeExit handlers through its public exit-hook API.
      const exitHook = require(exitHookPath) as {
        hookedEvents(): string[];
        unhookEvent(event: string): void;
      };
      for (const event of exitHook.hookedEvents()) {
        exitHook.unhookEvent(event);
      }
      if (stopping) {
        return;
      }
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
      if (stopping) {
        return;
      }
      await pg.start();
      if (!stopping && process.connected) {
        // A concurrent parent exit is handled by the disconnect listener.
        process.send?.({ ready: true }, undefined, undefined, () => {});
      }
      await stopped;
    } finally {
      if (pg && tmpDir) {
        await stopPostgres(pg, tmpDir);
      }
      if (tmpDir) {
        await fs.rm(tmpDir, { recursive: true, force: true });
      }
    }
  }

  main()
    .then(() => {
      if (process.connected) {
        process.disconnect?.();
      }
    })
    .catch(error => {
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
