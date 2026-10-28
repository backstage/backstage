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
import { getPortPromise } from 'portfinder';
import { OutputOptions, rollup } from 'rollup';
import { makeRollupConfigs } from '../builder/config';
import { Output } from '../builder/types';

describe('embeddedPostgresProcess', () => {
  const mockDir = createMockDirectory();

  it('can be stringified and run in isolation after normal and minified builds', async () => {
    for (const minify of [false, true]) {
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

      const child = spawn(
        process.execPath,
        [
          '--eval',
          `(${source})(${JSON.stringify(
            require.resolve('embedded-postgres'),
          )})`,
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
      } finally {
        if (child.connected) {
          child.disconnect();
        }
        const result = await exit;
        mockDir.clear();
        expect(result).toEqual([0, null]);
      }
    }
  }, 30_000);
});
