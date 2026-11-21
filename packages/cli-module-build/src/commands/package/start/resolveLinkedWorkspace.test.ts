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
import { resolveLinkedWorkspace } from './resolveLinkedWorkspace';

describe('resolveLinkedWorkspace', () => {
  const mockDir = createMockDirectory();

  it('accepts Yarn and pnpm workspaces, and rejects other directories', async () => {
    mockDir.setContent({
      yarn: { 'package.json': JSON.stringify({ workspaces: ['packages/*'] }) },
      pnpm: {
        'package.json': JSON.stringify({ name: 'root' }),
        'pnpm-workspace.yaml': 'packages:\n  - packages/*\n',
      },
      'pnpm-settings': {
        'package.json': JSON.stringify({ name: 'single' }),
        'pnpm-workspace.yaml': 'nodeLinker: hoisted\n',
      },
      'pnpm-broken': {
        'package.json': JSON.stringify({ name: 'root' }),
        'pnpm-workspace.yaml': 'packages: [\n',
      },
      // A broken pnpm-workspace.yaml that Yarn ignores
      'yarn-leftover': {
        'package.json': JSON.stringify({ workspaces: ['packages/*'] }),
        'pnpm-workspace.yaml': 'packages: [\n',
      },
    });

    await expect(resolveLinkedWorkspace(undefined)).resolves.toBeUndefined();
    await expect(resolveLinkedWorkspace(mockDir.resolve('yarn'))).resolves.toBe(
      mockDir.resolve('yarn'),
    );
    await expect(resolveLinkedWorkspace(mockDir.resolve('pnpm'))).resolves.toBe(
      mockDir.resolve('pnpm'),
    );
    await expect(
      resolveLinkedWorkspace(mockDir.resolve('yarn-leftover')),
    ).resolves.toBe(mockDir.resolve('yarn-leftover'));

    // A pnpm-workspace.yaml with only settings belongs to a single package
    await expect(
      resolveLinkedWorkspace(mockDir.resolve('pnpm-settings')),
    ).rejects.toThrow(
      `Invalid workspace link, directory is not a workspace: ${mockDir.resolve(
        'pnpm-settings',
      )}`,
    );
    await expect(
      resolveLinkedWorkspace(mockDir.resolve('pnpm-broken')),
    ).rejects.toThrow('Failed to read pnpm-workspace.yaml in linked workspace');
    await expect(
      resolveLinkedWorkspace(mockDir.resolve('missing')),
    ).rejects.toThrow('Invalid workspace link, directory does not exist');
  });
});
