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

import { createMockDirectory } from '@backstage/backend-test-utils';
import { execFile } from 'node:child_process';
import { detectFormatter, formatFiles, tryRunOxfmt } from './formatter';

const mockDir = createMockDirectory();

// Jest caches failed module lookups per directory, so each case uses a new
// repository root
let mockRoot = '';
let rootCount = 0;
function setRoot(content: Record<string, any>) {
  mockRoot = `root-${rootCount++}`;
  mockDir.addContent({ [mockRoot]: content });
}

jest.mock('@backstage/cli-common', () => ({
  ...jest.requireActual('@backstage/cli-common'),
  targetPaths: {
    get rootDir() {
      return mockDir.resolve(mockRoot);
    },
    resolveRoot: (...paths: string[]) => mockDir.resolve(mockRoot, ...paths),
  },
}));

jest.mock('node:child_process', () => {
  const actual = jest.requireActual('node:child_process');
  return {
    ...actual,
    execFile: jest.fn((_cmd, _args, _opts, callback) => callback(null, '')),
  };
});

/** A stand-in for oxfmt that marks the files it writes with their type */
const oxfmtStub = {
  'package.json': JSON.stringify({
    name: 'oxfmt',
    bin: { oxfmt: 'bin/oxfmt' },
  }),
  bin: {
    oxfmt: `
      const fs = require('node:fs');
      for (const file of process.argv.slice(3)) {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('fail')) process.exit(1);
        const mark = file.endsWith('.d.ts') ? 'D' : 'M';
        fs.writeFileSync(file, content.replaceAll('x', mark));
      }
    `,
  },
};

const prettierStub = {
  'package.json': JSON.stringify({ name: 'prettier', bin: './bin.js' }),
  'bin.js': '',
};

describe('formatter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('detects the formatter of the repository', () => {
    const oxfmt = () => ({
      name: 'oxfmt',
      bin: mockDir.resolve(mockRoot, 'node_modules/oxfmt/bin/oxfmt'),
    });
    const prettier = () => ({
      name: 'prettier',
      bin: mockDir.resolve(mockRoot, 'node_modules/prettier/bin.js'),
    });

    setRoot({});
    expect(detectFormatter()).toBeUndefined();

    setRoot({ node_modules: { prettier: prettierStub } });
    expect(detectFormatter()).toEqual(prettier());

    setRoot({ node_modules: { oxfmt: oxfmtStub } });
    expect(detectFormatter()).toEqual(oxfmt());

    // Both installed, Prettier is kept unless oxfmt is configured
    setRoot({
      node_modules: { prettier: prettierStub, oxfmt: oxfmtStub },
    });
    expect(detectFormatter()).toEqual(prettier());

    setRoot({
      'oxfmt.config.ts': 'export default {};',
      node_modules: { prettier: prettierStub, oxfmt: oxfmtStub },
    });
    expect(detectFormatter()).toEqual(oxfmt());
  });

  it('formats files with the detected formatter', async () => {
    const signal = new AbortController().signal;
    const options = { cwd: undefined, signal, maxBuffer: Number.MAX_VALUE };

    setRoot({ node_modules: { prettier: prettierStub } });
    await formatFiles([], { signal });
    expect(execFile).not.toHaveBeenCalled();

    await formatFiles(['a.ts', 'b'], { signal });
    expect(execFile).toHaveBeenLastCalledWith(
      process.execPath,
      [
        mockDir.resolve(mockRoot, 'node_modules/prettier/bin.js'),
        '--write',
        'a.ts',
        'b',
      ],
      options,
      expect.any(Function),
    );

    setRoot({ node_modules: { oxfmt: oxfmtStub } });
    await formatFiles(['a.ts'], { signal });
    expect(execFile).toHaveBeenLastCalledWith(
      process.execPath,
      [
        mockDir.resolve(mockRoot, 'node_modules/oxfmt/bin/oxfmt'),
        '--write',
        'a.ts',
        '--no-error-on-unmatched-pattern',
      ],
      options,
      expect.any(Function),
    );

    setRoot({});
    await formatFiles(['a.ts']);
    expect(execFile).toHaveBeenCalledTimes(2);
  });

  it('formats content with oxfmt in a single run', () => {
    setRoot({ node_modules: { oxfmt: oxfmtStub } });
    const bin = mockDir.resolve(mockRoot, 'node_modules/oxfmt/bin/oxfmt');
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    expect(
      tryRunOxfmt(bin, [
        { content: '# x', extension: '.md' },
        { content: 'let x;', extension: '.d.ts' },
      ]),
    ).toEqual(['# M', 'let D;']);
    expect(warn).not.toHaveBeenCalled();

    expect(
      tryRunOxfmt(bin, [
        { content: '# x', extension: '.md' },
        { content: 'fail', extension: '.d.ts' },
      ]),
    ).toEqual(['# x', 'fail']);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });
});
