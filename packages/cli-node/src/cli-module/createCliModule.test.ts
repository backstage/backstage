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

import { OpaqueCliModule } from '@internal/cli';
import { createCliModule } from './createCliModule';

describe('createCliModule', () => {
  it('only allows isEnabled on package commands', async () => {
    const packageModule = createCliModule({
      packageJson: { name: '@example/package' },
      init: async reg => {
        reg.addCommand({
          path: ['package', 'test'],
          description: 'Test the package',
          isEnabled: () => true,
          execute: async () => {},
        });
      },
    });
    await expect(
      OpaqueCliModule.toInternal(packageModule).commands,
    ).resolves.toEqual([
      expect.objectContaining({ path: ['package', 'test'] }),
    ]);

    const repoModule = createCliModule({
      packageJson: { name: '@example/repo' },
      init: async reg => {
        reg.addCommand({
          path: ['repo', 'test'],
          description: 'Test the repository',
          isEnabled: () => true,
          execute: async () => {},
        });
      },
    });
    await expect(
      OpaqueCliModule.toInternal(repoModule).commands,
    ).rejects.toThrow(
      'Command "repo test" from "@example/repo" sets isEnabled, which is only supported for commands under "package"',
    );
  });

  it('validates the paths passed to addRepoCommand', async () => {
    const register = (options: { path: string[]; packageCommand: string[] }) =>
      OpaqueCliModule.toInternal(
        createCliModule({
          packageJson: { name: '@example/repo' },
          init: async reg => {
            reg.addRepoCommand({ description: 'Test', ...options });
          },
        }),
      ).commands;

    await expect(
      register({ path: ['repo', 'test'], packageCommand: ['package', 'test'] }),
    ).resolves.toEqual([expect.objectContaining({ path: ['repo', 'test'] })]);

    await expect(
      register({ path: ['lint'], packageCommand: ['package', 'lint'] }),
    ).rejects.toThrow(
      'Repo command "lint" from "@example/repo" must have a path that starts with "repo"',
    );
    await expect(
      register({ path: ['repo'], packageCommand: ['package', 'lint'] }),
    ).rejects.toThrow('must have a path that starts with "repo"');
    await expect(
      register({ path: ['repo', 'test'], packageCommand: ['repo', 'test'] }),
    ).rejects.toThrow(
      'Repo command "repo test" from "@example/repo" must target a package command, got "repo test"',
    );
    await expect(
      register({ path: ['repo', 'test'], packageCommand: ['package'] }),
    ).rejects.toThrow('must target a package command');
  });
});
