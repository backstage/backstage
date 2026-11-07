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
import { formatContent, formatFiles } from './formatter';

const mockDir = createMockDirectory();

jest.mock('@backstage/cli-common', () => ({
  ...jest.requireActual('@backstage/cli-common'),
  targetPaths: {
    resolveRoot: (...paths: string[]) => mockDir.resolve(...paths),
  },
}));

const mockPrettier = {
  version: '2.8.8',
  // The fake parser is only inferred for .ts files, and ignored.ts is ignored
  // by the .prettierignore file.
  getFileInfo: jest.fn(async (file: string, { ignorePath }: any) => ({
    ignored:
      file.endsWith('ignored.ts') && ignorePath.endsWith('.prettierignore'),
    inferredParser: file.endsWith('.ts') ? 'typescript' : null,
  })),
  format: jest.fn((content: string, _options: any) => {
    if (content.includes('fail')) {
      throw new Error('format exploded');
    }
    return content.toUpperCase();
  }),
  resolveConfig: Object.assign(
    jest.fn(async () => ({ semi: false })),
    {
      sync: jest.fn(() => ({ semi: false })),
    },
  ),
};

describe('formatter', () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    jest.doMock('prettier', () => mockPrettier);
  });

  it('formats content, and returns it as is on failure', () => {
    expect(formatContent('a', '/root/report.md')).toBe('A');
    expect(mockPrettier.format).toHaveBeenCalledWith('a', {
      semi: false,
      filepath: '/root/report.md',
    });
    expect(warn).not.toHaveBeenCalled();

    expect(formatContent('fail', '/root/report.md')).toBe('fail');
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('format exploded'),
    );
  });

  it('formats files and directories, skipping what it should', async () => {
    mockDir.setContent({
      'file.ts': 'file',
      dir: {
        'nested.ts': 'nested',
        'ignored.ts': 'ignored',
        'unsupported.txt': 'unsupported',
        node_modules: { 'dep.ts': 'dep' },
      },
      'other.ts': 'other',
    });

    await formatFiles([mockDir.resolve('file.ts'), mockDir.resolve('dir')]);

    expect(mockDir.content()).toEqual({
      'file.ts': 'FILE',
      dir: {
        'nested.ts': 'NESTED',
        'ignored.ts': 'ignored',
        'unsupported.txt': 'unsupported',
        node_modules: { 'dep.ts': 'dep' },
      },
      'other.ts': 'other',
    });
  });

  it('fails on formatting errors and aborts', async () => {
    mockDir.setContent({ 'bad.ts': 'fail' });
    await expect(formatFiles([mockDir.resolve('bad.ts')])).rejects.toThrow(
      'format exploded',
    );

    const controller = new AbortController();
    controller.abort();
    await expect(
      formatFiles([mockDir.resolve('bad.ts')], { signal: controller.signal }),
    ).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('does nothing without Prettier', async () => {
    jest.resetModules();
    jest.doMock('prettier', () => {
      throw Object.assign(new Error('missing'), { code: 'MODULE_NOT_FOUND' });
    });
    mockDir.setContent({ 'file.ts': 'file' });

    expect(formatContent('a', '/root/report.md')).toBe('a');
    await formatFiles([mockDir.resolve('file.ts')]);

    expect(mockDir.content()).toEqual({ 'file.ts': 'file' });
    expect(warn).not.toHaveBeenCalled();
  });
});
