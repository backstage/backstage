/*
 * Copyright 2025 The Backstage Authors
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

import fs from 'fs-extra';
import os from 'node:os';
import { resolve as resolvePath } from 'node:path';
import { downloadDocs } from './download';

// Track all run() invocations
const mockWaitForExit = jest.fn().mockResolvedValue(undefined);
const mockRun = jest.fn().mockReturnValue({ waitForExit: mockWaitForExit });
const mockResolveRoot = jest.fn();

jest.mock('@backstage/cli-common', () => ({
  run: (...args: any[]) => mockRun(...args),
  targetPaths: {
    resolveRoot: (...paths: string[]) => mockResolveRoot(...paths),
  },
}));

jest.mock('ora', () => {
  return () => ({
    start: jest.fn().mockReturnThis(),
    succeed: jest.fn().mockReturnThis(),
    fail: jest.fn().mockReturnThis(),
  });
});

describe('downloadDocs', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(resolvePath(os.tmpdir(), 'download-test-'));
    mockResolveRoot.mockImplementation((...paths: string[]) =>
      resolvePath(tempDir, ...paths),
    );
    mockRun.mockImplementation(([cmd, ...args]: string[]) => {
      // Simulate git checkout creating a docs folder in the temp clone dir
      if (cmd === 'git' && args[0] === 'checkout') {
        const cloneDir = mockRun.mock.calls[0][0].at(-1);
        if (cloneDir) {
          fs.ensureDirSync(resolvePath(cloneDir, 'docs'));
          fs.writeFileSync(resolvePath(cloneDir, 'docs', 'index.md'), '# Docs');
        }
      }
      return { waitForExit: mockWaitForExit };
    });
    mockWaitForExit.mockResolvedValue(undefined);
  });

  afterEach(() => {
    fs.removeSync(tempDir);
    jest.clearAllMocks();
  });

  it('runs git sparse-checkout commands and copies docs to target', async () => {
    const docsPath = await downloadDocs({
      version: '1.35.0',
      docsDir: '.backstage-docs',
    });

    // Verify git clone was called with correct tag
    expect(mockRun).toHaveBeenCalledTimes(3);
    const cloneArgs = mockRun.mock.calls[0][0];
    expect(cloneArgs).toContain('git');
    expect(cloneArgs).toContain('clone');
    expect(cloneArgs).toContain('--branch');
    expect(cloneArgs).toContain('v1.35.0');

    // Verify sparse-checkout set docs
    const sparseArgs = mockRun.mock.calls[1][0];
    expect(sparseArgs).toEqual(['git', 'sparse-checkout', 'set', 'docs']);

    // Verify checkout
    const checkoutArgs = mockRun.mock.calls[2][0];
    expect(checkoutArgs).toEqual(['git', 'checkout']);

    // Verify docs were copied to target
    expect(docsPath).toBe(resolvePath(tempDir, '.backstage-docs', 'docs'));
    expect(await fs.pathExists(docsPath)).toBe(true);
    expect(await fs.readFile(resolvePath(docsPath, 'index.md'), 'utf8')).toBe(
      '# Docs',
    );
  });

  it('throws when docs folder is not found after checkout', async () => {
    // Override mock to NOT create docs folder on checkout
    mockRun.mockReturnValue({ waitForExit: mockWaitForExit });

    await expect(
      downloadDocs({ version: '1.99.0', docsDir: '.backstage-docs' }),
    ).rejects.toThrow('Failed to download docs for Backstage v1.99.0');
  });

  it('throws a descriptive error when a git command fails', async () => {
    mockWaitForExit.mockRejectedValueOnce(new Error('git clone failed'));

    await expect(
      downloadDocs({ version: '1.35.0', docsDir: '.backstage-docs' }),
    ).rejects.toThrow(/git clone failed/);
  });

  it('strips leading v from version to prevent vv prefix', async () => {
    await downloadDocs({
      version: 'v1.35.0',
      docsDir: '.backstage-docs',
    });

    const cloneArgs = mockRun.mock.calls[0][0];
    expect(cloneArgs).toContain('v1.35.0');
    expect(cloneArgs).not.toContain('vv1.35.0');
  });
});
