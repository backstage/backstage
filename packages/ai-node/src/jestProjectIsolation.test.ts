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

import { spawnSync } from 'node:child_process';
import {
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

describe('Jest project isolation', () => {
  it('keeps the AI resolver when another project runs first', () => {
    const root = path.resolve(__dirname, '../../..');
    const dir = mkdtempSync(path.join(tmpdir(), 'ai-jest-isolation-'));
    try {
      const sequencer = path.join(dir, 'sequencer.cjs');
      writeFileSync(
        sequencer,
        `const Sequencer = require(${JSON.stringify(
          require.resolve('@jest/test-sequencer'),
        )}).default;
module.exports = class extends Sequencer {
  sort(tests) { return tests.sort((a, b) => Number(b.path.includes(${JSON.stringify(
    `${path.sep}cli-node${path.sep}`,
  )})) - Number(a.path.includes(${JSON.stringify(
          `${path.sep}cli-node${path.sep}`,
        )}))); }
};`,
      );
      const result = spawnSync(
        process.execPath,
        [
          path.join(root, 'packages/cli/bin/backstage-cli'),
          'repo',
          'test',
          '--maxWorkers=2',
          '--no-cache',
          '--testSequencer',
          sequencer,
          '--runTestsByPath',
          'packages/cli-node/src/concurrency/runConcurrentTasks.test.ts',
          'packages/ai-node/src/observability/observability.test.ts',
        ],
        {
          cwd: root,
          env: {
            ...process.env,
            CI: '1',
            NODE_OPTIONS: `${
              process.env.NODE_OPTIONS ?? ''
            } --experimental-vm-modules`,
          },
          encoding: 'utf8',
          timeout: 55_000,
        },
      );
      if (result.status !== 0) {
        throw new Error(
          `Multi-project Jest run failed: ${result.error ?? result.stderr}`,
        );
      }

      const ids = ['packages', 'plugins'].flatMap(group =>
        readdirSync(path.join(root, group), { withFileTypes: true })
          .filter(entry => entry.isDirectory())
          .flatMap(entry => {
            try {
              const pkg = JSON.parse(
                readFileSync(
                  path.join(root, group, entry.name, 'package.json'),
                  'utf8',
                ),
              );
              return pkg.name === '@backstage/plugin-ai-common' ||
                pkg.jest?.resolver?.includes('jestResolver.js')
                ? [pkg.jest?.id]
                : [];
            } catch (error) {
              if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
              throw error;
            }
          }),
      );
      expect(ids.length).toBeGreaterThan(0);
      expect(ids.every(id => typeof id === 'string' && id.length > 0)).toBe(
        true,
      );
      expect(new Set(ids).size).toBe(ids.length);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }, 60_000);
});
