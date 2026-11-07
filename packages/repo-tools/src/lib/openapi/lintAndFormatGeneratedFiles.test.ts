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
import { formatFiles } from '../formatter';
import { lintAndFormatGeneratedFiles } from './lintAndFormatGeneratedFiles';

const mockDir = createMockDirectory();

// Jest caches failed module lookups per directory, so each case uses a new root
let rootCount = 0;
function setRoot(content: Record<string, any>) {
  const root = `root-${rootCount++}`;
  mockDir.addContent({ [root]: { 'package.json': '{}', ...content } });
  jest.spyOn(process, 'cwd').mockReturnValue(mockDir.resolve(root));
  return mockDir.resolve(root);
}

const cliStub = {
  '@backstage': {
    cli: {
      'package.json': JSON.stringify({
        bin: { 'backstage-cli': 'bin/backstage-cli' },
      }),
    },
  },
};

jest.mock('node:child_process', () => {
  const actual = jest.requireActual('node:child_process');
  return {
    ...actual,
    execFile: jest.fn((_cmd, _args, _opts, callback) => callback(null, '')),
  };
});

jest.mock('../formatter', () => ({
  formatFiles: jest.fn(async () => {}),
}));

describe('lintAndFormatGeneratedFiles', () => {
  const execFileMock = execFile as unknown as jest.Mock;
  const formatFilesMock = formatFiles as unknown as jest.Mock;
  const warn = jest.spyOn(console, 'warn').mockImplementation();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('lints with the resolved CLI, then formats', async () => {
    const root = setRoot({ node_modules: cliStub });

    await lintAndFormatGeneratedFiles(['a b', 'c']);

    const [node, args] = execFileMock.mock.calls[0];
    expect(node).toBe(process.execPath);
    expect(args).toEqual([
      `${root}/node_modules/@backstage/cli/bin/backstage-cli`,
      'package',
      'lint',
      '--fix',
      'a b',
      'c',
    ]);
    expect(formatFilesMock).toHaveBeenCalledWith(['a b', 'c'], undefined);
    expect(warn).not.toHaveBeenCalled();
  });

  it('warns and still formats when linting fails', async () => {
    setRoot({ node_modules: cliStub });
    execFileMock.mockImplementationOnce((_cmd, _args, _opts, callback) =>
      callback(new Error('lint exploded')),
    );

    await expect(lintAndFormatGeneratedFiles(['a'])).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('lint exploded'));
    expect(formatFilesMock).toHaveBeenCalledTimes(1);

    // The same goes for a project where the CLI can't be resolved
    warn.mockClear();
    setRoot({});
    await expect(lintAndFormatGeneratedFiles(['a'])).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(formatFilesMock).toHaveBeenCalledTimes(2);
  });

  it('fails on aborts and formatting errors', async () => {
    setRoot({ node_modules: cliStub });

    const abortError = Object.assign(new Error('aborted'), {
      name: 'AbortError',
    });
    execFileMock.mockImplementationOnce((_cmd, _args, _opts, callback) =>
      callback(abortError),
    );
    await expect(lintAndFormatGeneratedFiles(['a'])).rejects.toBe(abortError);
    expect(formatFilesMock).not.toHaveBeenCalled();

    formatFilesMock.mockRejectedValueOnce(new Error('format exploded'));
    await expect(lintAndFormatGeneratedFiles(['a'])).rejects.toThrow(
      'format exploded',
    );
    expect(warn).not.toHaveBeenCalled();
  });
});
