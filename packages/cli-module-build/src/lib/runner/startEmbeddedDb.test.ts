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

/** @jest-environment node */

import { fork, ChildProcess } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import os from 'node:os';
import fs from 'fs-extra';
import { resolve as resolvePath } from 'node:path';
import { getPortPromise } from 'portfinder';
import { createConnection } from 'node:net';

const describeUnix = process.platform === 'win32' ? describe.skip : describe;

describe('embedded Postgres process lifecycle', () => {
  let dir: string;
  let parent: ChildProcess;
  let output: string;
  let port: number;

  beforeEach(async () => {
    dir = await fs.mkdtemp(resolvePath(os.tmpdir(), 'backstage-db-test-'));
    port = await getPortPromise();
    output = '';
  });

  afterEach(async () => {
    if (parent?.pid && parent.exitCode === null && parent.signalCode === null) {
      if (process.platform === 'win32') {
        parent.kill('SIGKILL');
      } else {
        process.kill(-parent.pid, 'SIGKILL');
      }
      await once(parent, 'exit');
    }
    await fs.remove(dir);
  });

  async function start(backend = false, connection = '') {
    const configPath = resolvePath(dir, 'app-config.yaml');
    await fs.writeFile(
      configPath,
      `backend:\n  database:\n    client: embedded-postgres\n    connection:\n      port: ${port}\n${connection}`,
    );
    parent = fork(require.resolve('./__fixtures__/embeddedDbParent.cjs'), [], {
      detached: true,
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      execArgv: [
        '--require',
        require.resolve('@backstage/cli-node/config/nodeTransform.cjs'),
      ],
      env: {
        ...process.env,
        TEST_CONFIG: configPath,
        TEST_PORT: String(port),
        TEST_EVENTS: resolvePath(dir, 'events'),
        TEST_BACKEND: backend ? '1' : '',
      },
    });
    parent.stdout!.on('data', data => {
      output += data;
    });
    parent.stderr!.on('data', data => {
      output += data;
    });
    const ready = new Promise<void>(resolve => {
      parent.on('message', (message: { client?: string }) => {
        if (message.client === 'pg') {
          resolve();
        }
      });
    });
    return { exit: once(parent, 'exit'), ready };
  }

  async function waitFor(check: () => Promise<boolean>) {
    for (let i = 0; i < 200; i++) {
      if (await check()) {
        return;
      }
      await delay(50);
    }
    throw new Error(`Timed out waiting for database lifecycle: ${output}`);
  }

  async function isAvailable() {
    const socket = createConnection({ port, host: 'localhost' });
    try {
      await once(socket, 'connect');
      return true;
    } catch {
      return false;
    } finally {
      socket.destroy();
    }
  }

  describeUnix('terminal signals', () => {
    it('keeps PostgreSQL available across reload and terminal Ctrl-C until the backend drains', async () => {
      // Do not await the process exit until after sending the shutdown signal.
      const { exit } = await start(true);
      const eventsPath = resolvePath(dir, 'events');
      const readEvents = () => fs.readFile(eventsPath, 'utf8').catch(() => '');
      await waitFor(async () => (await readEvents()).includes('ready:'));
      const firstEvents = await readEvents();
      const databaseDir = firstEvents.match(/database:(.+)/)![1];
      const postgresPid = Number(
        (
          await fs.readFile(resolvePath(databaseDir, 'postmaster.pid'), 'utf8')
        ).split('\n')[0],
      );
      parent.stdin!.write('\n');
      await waitFor(
        async () => (await readEvents()).split('ready:').length === 3,
      );
      expect(await readEvents()).toContain('drained');
      expect(await isAvailable()).toBe(true);
      expect(await readEvents()).not.toBe(firstEvents);
      process.kill(-parent.pid!, 'SIGINT');
      expect(await exit).toEqual([0, null]);
      expect((await readEvents()).match(/drained/g)).toHaveLength(2);
      expect(await isAvailable()).toBe(false);
      expect(await fs.pathExists(databaseDir)).toBe(false);
      expect(() => process.kill(postgresPid, 0)).toThrow();
    }, 30_000);
  });

  it('closes the database when requested by the parent', async () => {
    const { exit, ready } = await start();
    await ready;
    const databaseDir = await fs.readFile(resolvePath(dir, 'database'), 'utf8');
    expect(await isAvailable()).toBe(true);
    parent.send('close');
    expect(await exit).toEqual([0, null]);
    expect(await isAvailable()).toBe(false);
    expect(await fs.pathExists(databaseDir)).toBe(false);
  }, 30_000);

  it('cleans up PostgreSQL when the parent is killed unexpectedly', async () => {
    const { exit, ready } = await start();
    await ready;
    const databaseDir = await fs.readFile(resolvePath(dir, 'database'), 'utf8');
    const postgresPid = Number(
      (
        await fs.readFile(resolvePath(databaseDir, 'postmaster.pid'), 'utf8')
      ).split('\n')[0],
    );
    expect(await isAvailable()).toBe(true);
    process.kill(parent.pid!, 'SIGKILL');
    await exit;
    await waitFor(async () => !(await fs.pathExists(databaseDir)));
    await waitFor(async () => {
      try {
        process.kill(postgresPid, 0);
        return false;
      } catch {
        return true;
      }
    });
    expect(await isAvailable()).toBe(false);
  }, 30_000);

  it('reports startup failure and exits without leaving a helper running', async () => {
    const { exit } = await start(
      false,
      '      flags:\n        initdb: [--invalid-test-option]\n',
    );
    expect((await exit)[0]).toBe(1);
    expect(output).toContain('Postgres init script failed');
    expect(await isAvailable()).toBe(false);
  }, 30_000);
});
