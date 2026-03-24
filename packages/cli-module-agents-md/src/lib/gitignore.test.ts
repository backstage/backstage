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
import { ensureGitignore } from './gitignore';

// Mock targetPaths to use a temp directory
const mockResolveRoot = jest.fn();
jest.mock('@backstage/cli-common', () => ({
  targetPaths: {
    get rootDir() {
      return mockResolveRoot('');
    },
    resolveRoot: (...paths: string[]) => mockResolveRoot(...paths),
  },
}));

describe('ensureGitignore', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(resolvePath(os.tmpdir(), 'gitignore-test-'));
    mockResolveRoot.mockImplementation((...paths: string[]) =>
      resolvePath(tempDir, ...paths),
    );
  });

  afterEach(() => {
    fs.removeSync(tempDir);
  });

  it('creates .gitignore when absent', async () => {
    const result = await ensureGitignore('.backstage-docs');

    expect(result).toBe(true);
    const content = await fs.readFile(
      resolvePath(tempDir, '.gitignore'),
      'utf8',
    );
    expect(content).toContain('.backstage-docs/');
  });

  it('appends entry when not present', async () => {
    await fs.writeFile(
      resolvePath(tempDir, '.gitignore'),
      'node_modules/\ndist/\n',
      'utf8',
    );

    const result = await ensureGitignore('.backstage-docs');

    expect(result).toBe(true);
    const content = await fs.readFile(
      resolvePath(tempDir, '.gitignore'),
      'utf8',
    );
    expect(content).toContain('node_modules/');
    expect(content).toContain('.backstage-docs/');
  });

  it('does not duplicate entry if already present', async () => {
    await fs.writeFile(
      resolvePath(tempDir, '.gitignore'),
      'node_modules/\n.backstage-docs/\n',
      'utf8',
    );

    const result = await ensureGitignore('.backstage-docs');

    expect(result).toBe(false);
    const content = await fs.readFile(
      resolvePath(tempDir, '.gitignore'),
      'utf8',
    );
    // Should appear only once
    const matches = content.match(/\.backstage-docs\//g);
    expect(matches).toHaveLength(1);
  });

  it('normalizes docsDir with trailing slash and ./ prefix', async () => {
    const result = await ensureGitignore('./.backstage-docs/');

    expect(result).toBe(true);
    const content = await fs.readFile(
      resolvePath(tempDir, '.gitignore'),
      'utf8',
    );
    expect(content).toContain('.backstage-docs/');
    expect(content).not.toContain('./.backstage-docs');
    expect(content).not.toContain('.backstage-docs//');
  });

  it('does not add extra blank line when appending', async () => {
    await fs.writeFile(
      resolvePath(tempDir, '.gitignore'),
      'node_modules/\n',
      'utf8',
    );

    await ensureGitignore('.backstage-docs');

    const content = await fs.readFile(
      resolvePath(tempDir, '.gitignore'),
      'utf8',
    );
    expect(content).toBe(
      'node_modules/\n# Backstage docs for AI agents\n.backstage-docs/\n',
    );
  });
});
