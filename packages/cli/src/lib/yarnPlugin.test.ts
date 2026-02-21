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

import { createMockDirectory } from '@backstage/backend-test-utils';
import { targetPaths } from '@backstage/cli-common';
import { getHasYarnPlugin } from './yarnPlugin';

const mockDir = createMockDirectory();

describe('getHasYarnPlugin', () => {
  beforeEach(() => {
    mockDir.clear();
    jest
      .spyOn(targetPaths, 'resolveRoot')
      .mockImplementation((...args: string[]) => mockDir.resolve(...args));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return false when .yarnrc.yml does not exist', async () => {
    mockDir.setContent({});

    const result = await getHasYarnPlugin();
    expect(result).toBe(false);
  });

  it('should return false when .yarnrc.yml is empty', async () => {
    mockDir.setContent({
      '.yarnrc.yml': '',
    });

    const result = await getHasYarnPlugin();
    expect(result).toBe(false);
  });

  it('should return false when plugins array is empty', async () => {
    mockDir.setContent({
      '.yarnrc.yml': 'plugins: []',
    });

    const result = await getHasYarnPlugin();
    expect(result).toBe(false);
  });

  it('should return false when plugins array does not contain backstage plugin', async () => {
    mockDir.setContent({
      '.yarnrc.yml': `
plugins:
  - path: .yarn/plugins/@yarnpkg/plugin-typescript.cjs
  - path: .yarn/plugins/@yarnpkg/plugin-workspace-tools.cjs
`,
    });

    const result = await getHasYarnPlugin();
    expect(result).toBe(false);
  });

  it('should return true when backstage plugin is present', async () => {
    mockDir.setContent({
      '.yarnrc.yml': `
plugins:
  - path: .yarn/plugins/@yarnpkg/plugin-typescript.cjs
  - path: .yarn/plugins/@yarnpkg/plugin-backstage.cjs
  - path: .yarn/plugins/@yarnpkg/plugin-workspace-tools.cjs
`,
    });

    const result = await getHasYarnPlugin();
    expect(result).toBe(true);
  });

  it('should return true when backstage plugin is the only plugin', async () => {
    mockDir.setContent({
      '.yarnrc.yml': `
plugins:
  - path: .yarn/plugins/@yarnpkg/plugin-backstage.cjs
`,
    });

    const result = await getHasYarnPlugin();
    expect(result).toBe(true);
  });

  it('should throw error when .yarnrc.yml has invalid content', async () => {
    mockDir.setContent({
      '.yarnrc.yml': 'invalid: yaml: content: [',
    });

    await expect(getHasYarnPlugin()).rejects.toThrow();
  });

  it('should throw error when .yarnrc.yml has unexpected structure', async () => {
    mockDir.setContent({
      '.yarnrc.yml': `
plugins: "not an array"
`,
    });

    await expect(getHasYarnPlugin()).rejects.toThrow(
      'Unexpected content in .yarnrc.yml',
    );
  });

  it('should handle plugins with different structure', async () => {
    mockDir.setContent({
      '.yarnrc.yml': `
plugins:
  - path: .yarn/plugins/@yarnpkg/plugin-backstage.cjs
  - path: .yarn/plugins/@yarnpkg/plugin-typescript.cjs
`,
    });

    const result = await getHasYarnPlugin();
    expect(result).toBe(true);
  });
});
