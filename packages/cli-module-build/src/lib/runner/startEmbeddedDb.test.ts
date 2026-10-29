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
  let parents: ChildProcess[];
  let output: string;
  let port: number;

  beforeEach(async () => {
    dir = await fs.mkdtemp(resolvePath(os.tmpdir(), 'backstage-db-test-'));
    port = await getPortPromise({ port: 25_000 });
    output = '';
    parents = [];
  });

  afterEach(async () => {
    for (const child of parents) {
      if (child.pid && child.exitCode === null && child.signalCode === null) {
        if (process.platform === 'win32') {
          child.kill('SIGKILL');
        } else {
          process.kill(-child.pid, 'SIGKILL');
        }
        await once(child, 'exit');
      }
    }
    await fs.remove(dir);
  });

  async function start(
    backend = false,
    connection = '',
    env: Record<string, string> = {},
  ) {
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
        TMPDIR: dir,
        TEMP: dir,
        TMP: dir,
        ...env,
        TEST_CONFIG: configPath,
        TEST_PORT: String(port),
        TEST_EVENTS: resolvePath(dir, 'events'),
        TEST_BACKEND: backend ? '1' : '',
      },
    });
    parents.push(parent);
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

  it('drains on reload and graceful CLI shutdown while keeping the same database', async () => {
    const reloadFile = resolvePath(dir, 'reload.cjs');
    await fs.writeFile(reloadFile, 'module.exports = 0;\n');
    const { exit } = await start(true, '', { TEST_RELOAD_FILE: reloadFile });
    const eventsPath = resolvePath(dir, 'events');
    const readEvents = () => fs.readFile(eventsPath, 'utf8').catch(() => '');
    await waitFor(async () => (await readEvents()).includes('ready:'));
    const databaseDir = (await readEvents()).match(/database:(.+)/)![1];
    parent.stdin!.write('\n');
    await waitFor(
      async () => (await readEvents()).split('ready:').length === 3,
    );
    expect((await readEvents()).match(/drained/g)).toHaveLength(1);
    expect((await readEvents()).match(/database:(.+)/g)).toEqual([
      `database:${databaseDir}`,
      `database:${databaseDir}`,
    ]);
    expect(await isAvailable()).toBe(true);
    await fs.writeFile(reloadFile, 'module.exports = 1;\n');
    await waitFor(
      async () => (await readEvents()).split('ready:').length === 4,
    );
    expect((await readEvents()).match(/drained/g)).toHaveLength(2);
    expect((await readEvents()).match(/database:(.+)/g)).toEqual(
      Array(3).fill(`database:${databaseDir}`),
    );
    parent.send('terminate');
    expect(await exit).toEqual([0, null]);
    expect((await readEvents()).match(/drained/g)).toHaveLength(3);
    expect(await isAvailable()).toBe(false);
    expect(await fs.pathExists(databaseDir)).toBe(false);
  }, 30_000);

  describeUnix('terminal signals', () => {
    it('drains on reload but interrupts immediately and cleans PostgreSQL in the background', async () => {
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
      expect((await readEvents()).match(/drained/g)).toHaveLength(1);
      await waitFor(async () => !(await fs.pathExists(databaseDir)));
      expect(await isAvailable()).toBe(false);
      expect(await fs.pathExists(databaseDir)).toBe(false);
      expect(() => process.kill(postgresPid, 0)).toThrow();
    }, 30_000);
  });

  describeUnix('interrupts', () => {
    it('skips shutdown hooks for a parent-only interrupt and interrupts an existing drain', async () => {
      for (const draining of [false, true]) {
        const { exit } = await start(true);
        const eventsPath = resolvePath(dir, 'events');
        const readEvents = () =>
          fs.readFile(eventsPath, 'utf8').catch(() => '');
        await waitFor(async () => (await readEvents()).includes('ready:'));
        const databaseDir = (await readEvents()).match(/database:(.+)/)![1];
        if (draining) {
          parent.stdin!.write('\n');
          await waitFor(async () => (await readEvents()).includes('draining'));
        }
        process.kill(parent.pid!, 'SIGINT');
        expect(await exit).toEqual([0, null]);
        await waitFor(async () => !(await fs.pathExists(databaseDir)));
        const events = await readEvents();
        expect(events).not.toContain('drained');
        expect(events.match(/ready:/g)).toHaveLength(1);
        expect(events.includes('draining')).toBe(draining);
        await fs.remove(eventsPath);
      }
    }, 30_000);

    it('releases CLI output streams without waiting for a stopped PostgreSQL process', async () => {
      const { exit } = await start(true);
      const closed = once(parent, 'close');
      const eventsPath = resolvePath(dir, 'events');
      await waitFor(async () =>
        (
          await fs.readFile(eventsPath, 'utf8').catch(() => '')
        ).includes('ready:'),
      );
      const databaseDir = (await fs.readFile(eventsPath, 'utf8')).match(
        /database:(.+)/,
      )![1];
      const pid = Number(
        (
          await fs.readFile(resolvePath(databaseDir, 'postmaster.pid'), 'utf8')
        ).split('\n')[0],
      );
      process.kill(pid, 'SIGSTOP');
      try {
        process.kill(parent.pid!, 'SIGINT');
        expect(
          await Promise.race([closed, delay(3000).then(() => 'timed out')]),
        ).toEqual([0, null]);
        expect(await exit).toEqual([0, null]);
        expect(await fs.pathExists(databaseDir)).toBe(true);
      } finally {
        process.kill(pid, 'SIGCONT');
      }
      await waitFor(async () => !(await fs.pathExists(databaseDir)));
    }, 30_000);

    it('interrupts a blocked backend during startup', async () => {
      const { exit } = await start(true, '', { TEST_BLOCK_STARTUP: '1' });
      const eventsPath = resolvePath(dir, 'events');
      await waitFor(async () =>
        (
          await fs.readFile(eventsPath, 'utf8').catch(() => '')
        ).includes('booting'),
      );
      process.kill(parent.pid!, 'SIGINT');
      expect(
        await Promise.race([exit, delay(3000).then(() => 'timed out')]),
      ).toEqual([0, null]);
      await waitFor(
        async () =>
          !(
            await fs.readdir(dir)
          ).some(name => name.startsWith('backstage-embedded-db-')),
      );
      expect(await fs.readFile(eventsPath, 'utf8')).toBe('booting\n');
    }, 30_000);

    it('cancels database initialization without starting a backend', async () => {
      const { exit } = await start(true);
      await waitFor(async () =>
        (
          await fs.readdir(dir)
        ).some(name => name.startsWith('backstage-embedded-db-')),
      );
      process.kill(parent.pid!, 'SIGINT');
      expect(await exit).toEqual([0, null]);
      await waitFor(
        async () =>
          !(
            await fs.readdir(dir)
          ).some(name => name.startsWith('backstage-embedded-db-')),
      );
      expect(await fs.pathExists(resolvePath(dir, 'events'))).toBe(false);
      expect(await isAvailable()).toBe(false);
    }, 30_000);
  });

  describeUnix('PostgreSQL exits first', () => {
    it('closes without waiting for an exit event that already happened', async () => {
      const { exit, ready } = await start();
      await ready;
      const databaseDir = await fs.readFile(
        resolvePath(dir, 'database'),
        'utf8',
      );
      const pid = Number(
        (
          await fs.readFile(resolvePath(databaseDir, 'postmaster.pid'), 'utf8')
        ).split('\n')[0],
      );
      process.kill(pid, 'SIGINT');
      await waitFor(async () => !(await isAvailable()));
      parent.send('close');
      expect(
        await Promise.race([exit, delay(3000).then(() => 'timed out')]),
      ).toEqual([0, null]);
      expect(await fs.pathExists(databaseDir)).toBe(false);
    }, 30_000);
  });

  it('keeps concurrent development databases isolated', async () => {
    const first = await start();
    const firstParent = parent;
    await first.ready;
    const firstDirectory = await fs.readFile(
      resolvePath(dir, 'database'),
      'utf8',
    );
    port = await getPortPromise({ port: 25_000 });
    const second = await start();
    await second.ready;
    const secondDirectory = await fs.readFile(
      resolvePath(dir, 'database'),
      'utf8',
    );
    expect(secondDirectory).not.toBe(firstDirectory);
    firstParent.send('close');
    expect(await first.exit).toEqual([0, null]);
    expect(await fs.pathExists(firstDirectory)).toBe(false);
    expect(await fs.pathExists(secondDirectory)).toBe(true);
    expect(await isAvailable()).toBe(true);
    parent.send('close');
    expect(await second.exit).toEqual([0, null]);
    expect(await fs.pathExists(secondDirectory)).toBe(false);
  }, 30_000);

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
