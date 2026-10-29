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

import { createMockDirectory } from '@backstage/backend-test-utils';
import { targetPaths } from '@backstage/cli-common';
import { execFileSync, spawn } from 'node:child_process';
import { once } from 'node:events';
import { readdirSync, writeFileSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import { getPortPromise } from 'portfinder';
import { OutputOptions, rollup } from 'rollup';
import { makeRollupConfigs } from '../builder/config';
import { Output } from '../builder/types';

const describeUnix = process.platform === 'win32' ? describe.skip : describe;

describe('embeddedPostgresProcess', () => {
  const mockDir = createMockDirectory();

  async function compileSource(minify: boolean) {
    const [config] = await makeRollupConfigs({
      targetDir: targetPaths.resolveRoot('packages/cli-module-build'),
      outputs: new Set([Output.cjs]),
      minify,
      packageJson: {
        name: 'test',
        version: '0.0.0',
        exports: { '.': './src/lib/runner/embeddedPostgresProcess.ts' },
      },
      workspacePackages: [],
    });
    const bundle = await rollup(config);
    let source: string;
    try {
      const { output } = await bundle.generate(
        (config.output as OutputOptions[])[0],
      );
      const entry = output.find(
        chunk => chunk.type === 'chunk' && chunk.isEntry,
      );
      if (entry?.type !== 'chunk') {
        throw new Error('Missing database helper module');
      }
      source = execFileSync(
        process.execPath,
        [
          '--eval',
          `${entry.code};process.stdout.write(module.exports.embeddedPostgresProcess.toString());`,
        ],
        { encoding: 'utf8', timeout: 10_000 },
      );
    } finally {
      await bundle.close();
    }

    return source;
  }

  it('can be stringified and run in isolation after normal and minified builds', async () => {
    for (const minify of [false, true]) {
      const otherDatabases = {
        'backstage-dev-db-initializing': { 'keep.txt': 'initializing' },
        'backstage-dev-db-abandoned': {
          'backstage.pid': 'invalid',
          'keep.txt': 'abandoned',
        },
      };
      mockDir.setContent(otherDatabases);
      const source = await compileSource(minify);

      const child = spawn(
        process.execPath,
        [
          '--eval',
          `(${source})(${JSON.stringify(
            require.resolve('embedded-postgres'),
          )}, ${JSON.stringify(require.resolve('async-exit-hook'))})`,
        ],
        {
          env: {
            ...process.env,
            TMPDIR: mockDir.path,
            TEMP: mockDir.path,
            TMP: mockDir.path,
          },
          stdio: ['ignore', 'ignore', 'pipe', 'ipc'],
          detached: true,
        },
      );
      let stderr = '';
      child.stderr!.on('data', data => {
        stderr += data;
      });
      const exit = once(child, 'exit');
      try {
        const ready = once(child, 'message');
        child.send({
          user: 'postgres',
          password: 'postgres',
          port: await getPortPromise({ port: 20_000 }),
        });
        expect(
          await Promise.race([
            ready,
            exit.then(() => {
              throw new Error(`Helper exited before readiness: ${stderr}`);
            }),
          ]),
        ).toEqual([{ ready: true }]);
        expect(
          readdirSync(mockDir.path)
            .filter(name => name.startsWith('backstage-dev-db-'))
            .sort(),
        ).toEqual(Object.keys(otherDatabases).sort());
      } finally {
        if (minify && process.platform !== 'win32' && child.connected) {
          child.kill('SIGTERM');
        } else if (child.connected) {
          child.disconnect();
        }
        const result = await exit;
        expect(result).toEqual([0, null]);
        expect(mockDir.content({ shouldReadAsText: true })).toEqual(
          otherDatabases,
        );
        mockDir.clear();
      }
    }
  }, 30_000);

  describeUnix('cleanup deadline', () => {
    it('terminates only its own group when initialization or shutdown hangs', async () => {
      const source = await compileSource(true);
      for (const initializing of [false, true]) {
        const unrelated = spawn(
          process.execPath,
          ['--eval', 'setInterval(() => {}, 1000)'],
          {
            stdio: 'ignore',
            detached: true,
          },
        );
        const unrelatedExit = once(unrelated, 'exit');
        const fakeModule = resolvePath(mockDir.path, 'fake-postgres.mjs');
        writeFileSync(
          fakeModule,
          `
          import { writeFile } from 'node:fs/promises';
          export default class {
            constructor(options) { this.dir = options.databaseDir; }
            async initialise() {
              if (${initializing}) {
                process.send({ initializing: true });
                await new Promise(() => setInterval(() => {}, 1000));
              }
            }
            async start() {
              await writeFile(this.dir + '/postmaster.pid', ${JSON.stringify(
                String(unrelated.pid),
              )});
            }
            stop() { return new Promise(() => {}); }
          }
        `,
        );
        const helper = spawn(
          process.execPath,
          [
            '--eval',
            `(${source})(${JSON.stringify(fakeModule)}, ${JSON.stringify(
              require.resolve('async-exit-hook'),
            )})`,
          ],
          {
            env: { ...process.env, TMPDIR: mockDir.path },
            stdio: ['ignore', 'ignore', 'ignore', 'ipc'],
            detached: true,
          },
        );
        const helperExit = once(helper, 'exit');
        try {
          const ready = once(helper, 'message');
          helper.send({
            user: 'postgres',
            password: 'postgres',
            port: 20000,
          });
          expect(await ready).toEqual([
            initializing ? { initializing: true } : { ready: true },
          ]);
          helper.disconnect();
          expect(await helperExit).toEqual([null, 'SIGKILL']);
          expect(() => process.kill(unrelated.pid!, 0)).not.toThrow();
        } finally {
          if (helper.exitCode === null && helper.signalCode === null) {
            process.kill(-helper.pid!, 'SIGKILL');
            await helperExit;
          }
          unrelated.kill('SIGKILL');
          await unrelatedExit;
          mockDir.clear();
        }
      }
    }, 45_000);
  });
});
