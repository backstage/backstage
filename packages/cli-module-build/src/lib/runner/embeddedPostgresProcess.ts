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
  const { spawn } =
    require('node:child_process') as typeof import('node:child_process');
  const { once } = require('node:events') as typeof import('node:events');

  function terminate(pid: number) {
    if (process.platform === 'win32') {
      const { execFileSync } =
        require('node:child_process') as typeof import('node:child_process');
      execFileSync('taskkill', ['/pid', String(pid), '/f', '/t'], {
        stdio: 'ignore',
        windowsHide: true,
        timeout: 2000,
      });
    } else {
      try {
        process.kill(-pid, 'SIGKILL');
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ESRCH') {
          throw error;
        }
      }
    }
  }

  // The library runs in its own group so its exit hooks cannot terminate the
  // supervisor. Keep the worker alive until explicit shutdown, including after
  // PostgreSQL exits on its own, so it cannot run beforeExit hooks unexpectedly.
  function runPostgres(
    entryPath: string,
    databaseDir: string,
    terminateWorker: (pid: number) => void,
  ) {
    const { pathToFileURL } = require('node:url') as typeof import('node:url');
    const { once: workerOnce } =
      require('node:events') as typeof import('node:events');
    let stopping = false;
    let stop: () => void;
    const stopped = new Promise<void>(resolve => {
      stop = () => {
        stopping = true;
        resolve();
      };
    });
    process.on('message', message => {
      if (
        message &&
        typeof message === 'object' &&
        'type' in message &&
        message.type === 'shutdown'
      ) {
        stop!();
      }
    });
    process.once('disconnect', () => {
      setTimeout(() => terminateWorker(process.pid), 2000).unref();
      stop!();
    });
    setInterval(() => {}, 60_000);
    async function startPostgres() {
      const [options] = (await workerOnce(process, 'message')) as [
        EmbeddedDbConnectionConfig,
      ];
      let pg: import('embedded-postgres').default | undefined;
      try {
        const { default: EmbeddedPostgres } = (await import(
          pathToFileURL(entryPath).href
        )) as typeof import('embedded-postgres');
        pg = new EmbeddedPostgres({
          databaseDir,
          user: options.user,
          password: options.password,
          port: options.port,
          persistent: false,
          postgresFlags: options.flags?.postgres ?? [],
          initdbFlags: options.flags?.initdb ?? [],
          onError(messageOrError) {
            process.send?.(
              { log: String(messageOrError) },
              undefined,
              undefined,
              () => {},
            );
          },
          onLog() {},
        });
        await pg.initialise();
        if (!stopping) {
          await pg.start();
          process.send?.({ ready: true }, undefined, undefined, () => {});
        }
        await stopped;
      } catch (error) {
        if (process.connected) {
          await new Promise<void>(resolve => {
            process.send?.({ error: String(error) }, undefined, undefined, () =>
              resolve(),
            );
          });
        }
        throw error;
      } finally {
        await pg?.stop();
      }
    }
    startPostgres().then(
      () => process.exit(0),
      () => process.exit(1),
    );
  }

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

  async function main() {
    if (stopping) {
      return;
    }
    const message = await Promise.race([once(process, 'message'), stopped]);
    if (stopping) {
      return;
    }
    const [options] = message as [EmbeddedDbConnectionConfig];
    // Older CLI versions sweep backstage-dev-db-* directories without PID markers.
    const tmpDir = await fs.mkdtemp(
      resolvePath(os.tmpdir(), 'backstage-embedded-db-'),
    );
    let worker: ReturnType<typeof spawn> | undefined;
    let exited: Promise<unknown> | undefined;
    try {
      if (stopping) {
        return;
      }
      worker = spawn(
        process.execPath,
        [
          '--eval',
          `(${runPostgres.toString()})(${JSON.stringify(
            modulePath,
          )}, ${JSON.stringify(tmpDir)}, ${terminate.toString()})`,
        ],
        {
          detached: true,
          windowsHide: true,
          stdio: ['ignore', 'ignore', 'ignore', 'ipc'],
        },
      );
      exited = once(worker, 'close');
      worker.on('message', response => {
        if (response && typeof response === 'object' && 'error' in response) {
          process.exitCode = 1;
          requestStop!();
        }
        if (process.connected) {
          process.send?.(response, undefined, undefined, () => {});
        }
      });
      worker.send(options);
      await Promise.race([
        stopped,
        exited.then(() => {
          throw new Error('Embedded Postgres worker exited unexpectedly');
        }),
      ]);
    } finally {
      // Give PostgreSQL a short chance to release OS resources. A separate
      // supervisor can still terminate a blocked worker or a hanging stop().
      const timeout = setTimeout(() => {
        if (worker?.pid) {
          terminate(worker.pid);
        }
      }, 2000);
      try {
        if (worker?.connected) {
          worker.send({ type: 'shutdown' }, () => {});
        }
        await exited?.catch(() => {});
      } finally {
        clearTimeout(timeout);
        // Also collect descendants if the worker exited unexpectedly.
        if (
          worker?.pid &&
          (process.platform !== 'win32' ||
            (worker.exitCode === null && worker.signalCode === null))
        ) {
          terminate(worker.pid);
        }
      }
      await fs.rm(tmpDir, { recursive: true, force: true, maxRetries: 3 });
    }
  }

  main()
    .catch(error => {
      process.exitCode = 1;
      if (process.connected) {
        process.send?.(
          { error: String(error) },
          undefined,
          undefined,
          () => {},
        );
      } else {
        console.error(error);
      }
    })
    .finally(() => {
      if (process.connected) {
        process.disconnect?.();
      }
    });
}
