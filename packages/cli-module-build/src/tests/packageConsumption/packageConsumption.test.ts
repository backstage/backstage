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

import { execFile } from 'node:child_process';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { promisify } from 'node:util';
import { pathToFileURL } from 'node:url';
import fs from 'fs-extra';
import * as tar from 'tar';
import { targetPaths } from '@backstage/cli-common';
import { buildPackage, getOutputsForRole, Output } from '../../lib/builder';
import { productionPack } from '../../lib/packager/productionPack';

const execFileAsync = promisify(execFile);
const fixtures = resolve(__dirname, '__fixtures__');

// Jest orchestrates the experiment. It must never load the published package.
const nativeEnv = { ...process.env, NODE_OPTIONS: '', NODE_PATH: '' };

async function timed<T>(label: string, action: () => Promise<T>): Promise<T> {
  const start = performance.now();
  try {
    return await action();
  } finally {
    if (process.env.BACKSTAGE_COMPAT_TIMINGS) {
      console.log(
        `package consumption: ${label} ${(performance.now() - start).toFixed(
          0,
        )} ms`,
      );
    }
  }
}

describe('published common-library consumption', () => {
  let directory: string;
  let consumer: string;
  let installed: string;

  beforeAll(async () => {
    directory = await fs.realpath(
      await fs.mkdtemp(resolve(tmpdir(), 'backstage-package-consumption-')),
    );
    const producer = resolve(directory, 'producer');
    const staged = resolve(directory, 'staged');
    const archive = resolve(directory, 'common.tgz');
    consumer = resolve(directory, 'consumer');
    installed = resolve(consumer, 'node_modules/@backstage-test/compat-common');

    await fs.copy(resolve(fixtures, 'common'), producer);
    const pkg = await fs.readJson(resolve(producer, 'package.json'));
    const outputs = getOutputsForRole(pkg.backstage.role);
    // This first slice covers runtime output, not declaration generation. See README.md.
    outputs.delete(Output.types);
    await timed('build', () =>
      buildPackage({
        targetDir: producer,
        outputs,
        workspacePackages: [],
      }),
    );
    await timed('publication rewrite', () =>
      productionPack({
        packageDir: producer,
        targetDir: staged,
      }),
    );

    // This repository keeps its pinned Yarn release on disk. Avoid Corepack and installs.
    const { packageManager } = await fs.readJson(
      targetPaths.resolveRoot('package.json'),
    );
    const yarnPath = targetPaths.resolveRoot(
      '.yarn/releases',
      `${packageManager.replace('@', '-')}.cjs`,
    );
    await fs.writeFile(resolve(staged, 'yarn.lock'), '');
    await timed('yarn pack', () =>
      execFileAsync(process.execPath, [yarnPath, 'pack', '--out', archive], {
        cwd: staged,
        env: {
          ...nativeEnv,
          YARN_ENABLE_NETWORK: '0',
          YARN_ENABLE_TELEMETRY: '0',
          YARN_IGNORE_PATH: '1',
        },
        timeout: 30_000,
      }),
    );

    await timed('consumer setup', async () => {
      await fs.copy(resolve(fixtures, 'consumers'), consumer);
      await fs.copy(
        resolve(fixtures, 'node_modules'),
        resolve(consumer, 'node_modules'),
      );
      await fs.ensureDir(installed);
      await tar.x({ file: archive, cwd: installed, strip: 1 });
      // No original source or staging tree remains available to rescue a broken archive.
      await fs.remove(producer);
      await fs.remove(staged);
    });
  }, 60_000);

  afterAll(async () => {
    if (directory) {
      await fs.remove(directory);
    }
  });

  it('loads root and alpha through native require and import, including external dependencies', async () => {
    expect(await fs.pathExists(resolve(installed, 'src'))).toBe(false);
    expect((await fs.lstat(installed)).isSymbolicLink()).toBe(false);
    const consumerDir = consumer;
    const results = [];
    for (const entry of ['require.cjs', 'import.mjs']) {
      const { stdout } = await timed(entry, () =>
        execFileAsync(process.execPath, [entry], {
          cwd: consumerDir,
          env: nativeEnv,
          timeout: 10_000,
        }),
      );
      const result = JSON.parse(stdout);
      expect(result).toEqual({
        value: 42,
        alphaValue: 43,
        asyncValue: 44,
        entries: [expect.any(String), expect.any(String)],
      });
      for (const resolved of result.entries) {
        expect(resolved.startsWith(`${pathToFileURL(installed).href}/`)).toBe(
          true,
        );
      }
      results.push(result);
    }
    // Selecting CJS for both consumers could conceal a broken ESM artifact.
    // This guards the experiment's coverage, not the spelling of output filenames.
    expect(results[0].entries[0]).not.toBe(results[1].entries[0]);
    expect(results[0].entries[1]).not.toBe(results[1].entries[1]);
  }, 30_000);
});
