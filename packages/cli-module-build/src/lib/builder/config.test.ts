/*
 * Copyright 2020 The Backstage Authors
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

import { ExternalOption, OutputOptions, rollup } from 'rollup';
import { makeRollupConfigs } from './config';
import { Output } from './types';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { targetPaths } from '@backstage/cli-common';
import { relative as relativePath } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { getPortPromise } from 'portfinder';

describe('makeRollupConfigs', () => {
  it('uses emitted declarations for JavaScript and TypeScript entry points', async () => {
    const mockDir = createMockDirectory();
    mockDir.setContent({ 'index.d.ts': '', 'helper.d.ts': '' });
    try {
      const declarationDir = relativePath(
        targetPaths.resolveRoot('dist-types'),
        mockDir.path,
      );
      const [config] = await makeRollupConfigs({
        outputs: new Set([Output.types]),
        packageJson: {
          name: 'test',
          version: '0.0.0',
          exports: {
            '.': `./${declarationDir}/index.ts`,
            './helper': `./${declarationDir}/helper.js`,
            './config/*': './config/*.js',
          },
        },
        workspacePackages: [],
      });
      expect(config.input).toEqual({
        index: mockDir.resolve('index.d.ts'),
        helper: mockDir.resolve('helper.d.ts'),
      });
    } finally {
      mockDir.clear();
    }
  });

  it('produces an executable JavaScript database helper entry point', async () => {
    const [config] = await makeRollupConfigs({
      targetDir: targetPaths.resolveRoot('packages/cli-module-build'),
      outputs: new Set([Output.cjs]),
      packageJson: {
        name: 'test',
        version: '0.0.0',
        exports: { './embedded-postgres': './src/embeddedPostgres.js' },
      },
      workspacePackages: [],
    });
    const bundle = await rollup(config);
    let code: string;
    try {
      const { output } = await bundle.generate(
        (config.output as OutputOptions[])[0],
      );
      const entry = output.find(
        chunk => chunk.type === 'chunk' && chunk.isEntry,
      );
      if (entry?.type !== 'chunk') {
        throw new Error('Missing database helper entry point');
      }
      code = entry.code;
    } finally {
      await bundle.close();
    }

    const child = spawn(process.execPath, ['-e', code], {
      cwd: targetPaths.rootDir,
      stdio: ['ignore', 'ignore', 'pipe', 'ipc'],
      detached: true,
    });
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
      expect(await exit).toEqual([0, null]);
    }
  }, 30_000);

  it('should mark external modules correctly', async () => {
    const importerPath = '/some/path.ts'; // when specified we don't care about the path

    const [config] = await makeRollupConfigs({
      outputs: new Set([Output.cjs]),
      packageJson: {
        name: 'test',
        version: '0.0.0',
        main: './src/index.ts',
      },
      workspacePackages: [],
    });
    const external = config.external as Exclude<
      ExternalOption,
      string | RegExp | (string | RegExp)[]
    >;

    expect(external('foo', importerPath, false)).toBe(true);
    expect(external('./foo', importerPath, false)).toBe(false);
    expect(external('/foo', importerPath, false)).toBe(false);
    expect(external('.\\foo', importerPath, false)).toBe(false);
    expect(external('c:\\foo', importerPath, false)).toBe(false);
    expect(external('@foo/bar', importerPath, false)).toBe(true);
    expect(external('../foo', importerPath, false)).toBe(false);

    // Modules without an importer are entry points, i.e. not external
    expect(external('foo', undefined, false)).toBe(false);
    expect(external('./foo', undefined, false)).toBe(false);
    expect(external('/foo', undefined, false)).toBe(false);
    expect(external('.\\foo', undefined, false)).toBe(false);
    expect(external('c:\\foo', undefined, false)).toBe(false);
    expect(external('@foo/bar', undefined, false)).toBe(false);
    expect(external('../foo', undefined, false)).toBe(false);

    // After modules have been resolved they're never marked as external
    expect(external('foo', importerPath, true)).toBe(false);
    expect(external('./foo', importerPath, true)).toBe(false);
    expect(external('/foo', importerPath, true)).toBe(false);
    expect(external('.\\foo', importerPath, true)).toBe(false);
    expect(external('c:\\foo', importerPath, true)).toBe(false);
    expect(external('@foo/bar', importerPath, true)).toBe(false);
    expect(external('../foo', importerPath, true)).toBe(false);

    // Node.js built-ins remain external after resolution
    expect(external('node:stream', importerPath, true)).toBe(true);
  });
});
