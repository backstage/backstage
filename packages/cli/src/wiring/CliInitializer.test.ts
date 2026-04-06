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

import { CliInitializer } from './CliInitializer';
import { createCliModule } from './factory';

process.exit = jest.fn() as any;

describe('createCliModule', () => {
  it('should throw if packageJson has no name', () => {
    expect(() =>
      createCliModule({
        packageJson: { name: '' },
        init: async () => {},
      }),
    ).toThrow('The packageJson provided to createCliModule must have a name');

    expect(() =>
      createCliModule({
        packageJson: {} as any,
        init: async () => {},
      }),
    ).toThrow('The packageJson provided to createCliModule must have a name');
  });
});

describe('CliInitializer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should run commands', async () => {
    expect.assertions(2);
    process.argv = ['node', 'cli', 'test'];
    const initializer = new CliInitializer();
    initializer.add(
      createCliModule({
        packageJson: { name: '@backstage/test' },
        init: async reg =>
          reg.addCommand({
            path: ['test'],
            description: 'test',
            execute: ({ args }) => {
              expect(args).toEqual([]);
              return Promise.resolve();
            },
          }),
      }),
    );
    await initializer.run();
    expect(process.exit).toHaveBeenCalledWith(0);
  });

  it('should pass positional args to the subcommand', async () => {
    expect.assertions(2);
    process.argv = ['node', 'cli', 'test', '[positional]', '<arg>'];
    const initializer = new CliInitializer();
    initializer.add(
      createCliModule({
        packageJson: { name: '@backstage/test' },
        init: async reg =>
          reg.addCommand({
            path: ['test'],
            description: 'test',
            execute: ({ args }) => {
              expect(args).toEqual(['[positional]', '<arg>']);
              return Promise.resolve();
            },
          }),
      }),
    );
    await initializer.run();
    expect(process.exit).toHaveBeenCalledWith(0);
  });

  it('should run commands using a loader', async () => {
    expect.assertions(2);
    process.argv = ['node', 'cli', 'test', '--verbose'];
    const initializer = new CliInitializer();
    initializer.add(
      createCliModule({
        packageJson: { name: '@backstage/test' },
        init: async reg =>
          reg.addCommand({
            path: ['test'],
            description: 'test',
            execute: {
              loader: async () => ({
                default: async ({ args }) => {
                  expect(args).toEqual(['--verbose']);
                },
              }),
            },
          }),
      }),
    );
    await initializer.run();
    expect(process.exit).toHaveBeenCalledWith(0);
  });

  it('should run experimental commands but exclude them from help output', async () => {
    expect.assertions(3);
    process.argv = ['node', 'cli', 'secret'];
    const initializer = new CliInitializer();
    initializer.add(
      createCliModule({
        packageJson: { name: '@backstage/test' },
        init: async reg => {
          reg.addCommand({
            path: ['visible'],
            description: 'A visible command',
            execute: () => Promise.resolve(),
          });
          reg.addCommand({
            path: ['secret'],
            description: 'An experimental command',
            experimental: true,
            execute: ({ args }) => {
              expect(args).toEqual([]);
              return Promise.resolve();
            },
          });
        },
      }),
    );
    await initializer.run();
    expect(process.exit).toHaveBeenCalledWith(0);

    process.argv = ['node', 'cli', '--help'];
    const writeSpy = jest.spyOn(process.stdout, 'write');
    const initializer2 = new CliInitializer();
    initializer2.add(
      createCliModule({
        packageJson: { name: '@backstage/test' },
        init: async reg => {
          reg.addCommand({
            path: ['visible'],
            description: 'A visible command',
            execute: () => Promise.resolve(),
          });
          reg.addCommand({
            path: ['secret'],
            description: 'An experimental command',
            experimental: true,
            execute: () => Promise.resolve(),
          });
        },
      }),
    );
    await initializer2.run();
    const helpOutput = writeSpy.mock.calls.map(c => c[0]).join('');
    expect(helpOutput).not.toContain('secret');
    writeSpy.mockRestore();
  });

  it('should hide tree nodes when all children are experimental', async () => {
    process.argv = ['node', 'cli', '--help'];
    const writeSpy = jest.spyOn(process.stdout, 'write');
    const initializer = new CliInitializer();
    initializer.add(
      createCliModule({
        packageJson: { name: '@backstage/test' },
        init: async reg => {
          reg.addCommand({
            path: ['visible'],
            description: 'A visible command',
            execute: () => Promise.resolve(),
          });
          reg.addCommand({
            path: ['group', 'alpha'],
            description: 'First experimental command',
            experimental: true,
            execute: () => Promise.resolve(),
          });
          reg.addCommand({
            path: ['group', 'beta'],
            description: 'Second experimental command',
            experimental: true,
            execute: () => Promise.resolve(),
          });
        },
      }),
    );
    await initializer.run();
    const helpOutput = writeSpy.mock.calls.map(c => c[0]).join('');
    expect(helpOutput).toContain('visible');
    expect(helpOutput).not.toContain('group');
    writeSpy.mockRestore();
  });

  it('should show tree nodes when some children are visible', async () => {
    process.argv = ['node', 'cli', '--help'];
    const writeSpy = jest.spyOn(process.stdout, 'write');
    const initializer = new CliInitializer();
    initializer.add(
      createCliModule({
        packageJson: { name: '@backstage/test' },
        init: async reg => {
          reg.addCommand({
            path: ['group', 'alpha'],
            description: 'A visible nested command',
            execute: () => Promise.resolve(),
          });
          reg.addCommand({
            path: ['group', 'beta'],
            description: 'An experimental nested command',
            experimental: true,
            execute: () => Promise.resolve(),
          });
        },
      }),
    );
    await initializer.run();
    const helpOutput = writeSpy.mock.calls.map(c => c[0]).join('');
    expect(helpOutput).toContain('group');
    writeSpy.mockRestore();
  });

  it('should pass positional args to the subcommand if nested', async () => {
    expect.assertions(2);
    process.argv = [
      'node',
      'cli',
      'test',
      'nested',
      'command',
      '[positional]',
      '<arg>',
    ];
    const initializer = new CliInitializer();
    initializer.add(
      createCliModule({
        packageJson: { name: '@backstage/test' },
        init: async reg =>
          reg.addCommand({
            path: ['test', 'nested', 'command'],
            description: 'test',
            execute: ({ args }) => {
              expect(args).toEqual(['[positional]', '<arg>']);
              return Promise.resolve();
            },
          }),
      }),
    );
    await initializer.run();
    expect(process.exit).toHaveBeenCalledWith(0);
  });

  it('should silently override array-sourced module with conflicting individual module while keeping siblings', async () => {
    expect.assertions(3);
    process.argv = ['node', 'cli', 'test'];
    const initializer = new CliInitializer();

    const individualModule = createCliModule({
      packageJson: { name: '@backstage/individual' },
      init: async reg =>
        reg.addCommand({
          path: ['test'],
          description: 'individual test',
          execute: ({ args }) => {
            expect(args).toEqual([]);
            return Promise.resolve();
          },
        }),
    });

    const conflictingArrayModule = createCliModule({
      packageJson: { name: '@backstage/array-conflict' },
      init: async reg =>
        reg.addCommand({
          path: ['test'],
          description: 'array test (should be skipped)',
          execute: () => Promise.resolve(),
        }),
    });

    const nonConflictingArrayModule = createCliModule({
      packageJson: { name: '@backstage/array-sibling' },
      init: async reg =>
        reg.addCommand({
          path: ['other'],
          description: 'other command',
          execute: () => Promise.resolve(),
        }),
    });

    initializer.add(individualModule);
    initializer.add([conflictingArrayModule, nonConflictingArrayModule]);

    await initializer.run();
    expect(process.exit).toHaveBeenCalledWith(0);

    // Verify the sibling command is available by running it
    process.argv = ['node', 'cli', 'other'];
    const initializer2 = new CliInitializer();
    initializer2.add(individualModule);
    initializer2.add([conflictingArrayModule, nonConflictingArrayModule]);
    await initializer2.run();
    expect(process.exit).toHaveBeenCalledTimes(2);
  });

  it('should error with package names when two individual modules conflict', async () => {
    const initializer = new CliInitializer();

    initializer.add(
      createCliModule({
        packageJson: { name: '@backstage/module-a' },
        init: async reg =>
          reg.addCommand({
            path: ['conflicting'],
            description: 'from module A',
            execute: () => Promise.resolve(),
          }),
      }),
    );

    initializer.add(
      createCliModule({
        packageJson: { name: '@backstage/module-b' },
        init: async reg =>
          reg.addCommand({
            path: ['conflicting'],
            description: 'from module B',
            execute: () => Promise.resolve(),
          }),
      }),
    );

    await expect(initializer.run()).rejects.toThrow(
      'Command "conflicting" from "@backstage/module-b" conflicts with an existing command from "@backstage/module-a"',
    );
  });

  it('should error with package names when two array-sourced modules conflict', async () => {
    const initializer = new CliInitializer();

    const moduleA = createCliModule({
      packageJson: { name: '@backstage/array-a' },
      init: async reg =>
        reg.addCommand({
          path: ['shared'],
          description: 'from array A',
          execute: () => Promise.resolve(),
        }),
    });

    const moduleB = createCliModule({
      packageJson: { name: '@backstage/array-b' },
      init: async reg =>
        reg.addCommand({
          path: ['shared'],
          description: 'from array B',
          execute: () => Promise.resolve(),
        }),
    });

    initializer.add([moduleA]);
    initializer.add([moduleB]);

    await expect(initializer.run()).rejects.toThrow(
      'Command "shared" from "@backstage/array-b" conflicts with an existing command from "@backstage/array-a"',
    );
  });
});
