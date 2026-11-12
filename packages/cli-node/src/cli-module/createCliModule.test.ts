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
  it('registers package commands under package, with an optional condition', async () => {
    const condition = () => true;
    const module = createCliModule({
      packageJson: { name: '@example/package' },
      init: async reg => {
        reg.addCommand({
          path: ['repo', 'test'],
          description: 'Test the repository',
          execute: async () => {},
        });
        reg.addPackageCommand({
          command: ['lint'],
          description: 'Lint the package',
          if: condition,
          execute: async () => {},
        });
        reg.addPackageCommand({
          command: ['test', 'unit'],
          description: 'Test the package',
          execute: async () => {},
        });
      },
    });

    const commands = await OpaqueCliModule.toInternal(module).commands;
    expect(commands).toEqual([
      expect.objectContaining({ path: ['repo', 'test'] }),
      expect.objectContaining({ path: ['package', 'lint'], if: condition }),
      expect.objectContaining({ path: ['package', 'test', 'unit'] }),
    ]);
    expect(commands[1]).not.toHaveProperty('command');
  });
});
