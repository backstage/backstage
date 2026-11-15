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

import fs from 'node:fs';
import os from 'node:os';
import { join as joinPath } from 'node:path';
import typeDeps from './type-deps';

describe('type-deps', () => {
  const originalCwd = process.cwd();
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(joinPath(os.tmpdir(), 'type-deps-'));
    fs.writeFileSync(
      joinPath(tmpDir, 'package.json'),
      JSON.stringify({ name: 'root', private: true }),
    );
    process.chdir(tmpDir);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    process.chdir(originalCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('fails if there are no built packages to check, and passes otherwise', async () => {
    const exit = jest
      .spyOn(process, 'exit')
      .mockImplementation((() => {}) as () => never);
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});

    await typeDeps();

    expect(exit).toHaveBeenCalledWith(1);
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('No packages with built type declarations'),
    );

    exit.mockClear();
    error.mockClear();
    tmpDir = fs.mkdtempSync(joinPath(os.tmpdir(), 'type-deps-'));
    process.chdir(tmpDir);
    fs.writeFileSync(
      joinPath(tmpDir, 'package.json'),
      JSON.stringify({ name: 'root', private: true, workspaces: ['pkg'] }),
    );
    fs.writeFileSync(joinPath(tmpDir, 'yarn.lock'), '');
    fs.mkdirSync(joinPath(tmpDir, 'pkg/dist'), { recursive: true });
    fs.writeFileSync(
      joinPath(tmpDir, 'pkg/package.json'),
      JSON.stringify({
        name: 'pkg',
        version: '1.0.0',
        main: 'dist/index.js',
        types: 'dist/index.d.ts',
      }),
    );
    fs.writeFileSync(joinPath(tmpDir, 'pkg/dist/index.d.ts'), 'export {};\n');

    await typeDeps();

    expect(error).not.toHaveBeenCalled();
    expect(exit).not.toHaveBeenCalled();
  });
});
