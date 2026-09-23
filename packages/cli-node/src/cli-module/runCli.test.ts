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

import { createCliModule } from './createCliModule';
import { runCli } from './runCli';

const originalArgv = process.argv;
const originalUnhandledRejectionListeners = new Set(
  process.listeners('unhandledRejection'),
);

describe('runCli', () => {
  beforeEach(() => {
    jest.spyOn(process, 'exit').mockImplementation((() => undefined) as never);
  });

  afterEach(() => {
    process.argv = originalArgv;
    for (const listener of process.listeners('unhandledRejection')) {
      if (!originalUnhandledRejectionListeners.has(listener)) {
        process.removeListener('unhandledRejection', listener);
      }
    }
    jest.restoreAllMocks();
  });

  it('runs commands from a collection of modules', async () => {
    expect.assertions(4);
    process.argv = ['node', 'cli', 'repo', 'test', 'src', '--verbose'];

    const buildModule = createCliModule({
      packageJson: { name: '@example/build' },
      init: async reg => {
        reg.addCommand({
          path: ['repo', 'build'],
          description: 'Build the repository',
          execute: async () => {},
        });
      },
    });
    const testModule = createCliModule({
      packageJson: { name: '@example/test' },
      init: async reg => {
        reg.addCommand({
          path: ['repo', 'test'],
          description: 'Test the repository',
          execute: async context => {
            expect(context.args).toEqual(['src', '--verbose']);
            expect(context.info).toEqual({
              name: 'repo test',
              usage: 'example-cli repo test',
            });
          },
        });
      },
    });

    await runCli({
      modules: [buildModule, testModule],
      name: 'example-cli',
      version: '1.2.3',
    });

    expect(process.exit).toHaveBeenCalledWith(0);
    expect(process.exit).toHaveBeenCalledTimes(1);
  });

  it('forwards help flags to leaf commands', async () => {
    expect.assertions(2);
    process.argv = ['node', 'cli', 'test', '--help'];

    const testModule = createCliModule({
      packageJson: { name: '@example/test' },
      init: async reg => {
        reg.addCommand({
          path: ['test'],
          description: 'Test the repository',
          execute: async ({ args }) => {
            expect(args).toEqual(['--help']);
          },
        });
      },
    });

    await runCli({
      modules: [testModule],
      name: 'example-cli',
    });

    expect(process.exit).toHaveBeenCalledWith(0);
  });

  it('renders help for nested command groups', async () => {
    process.argv = ['node', 'cli', 'help', 'repo'];
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const testModule = createCliModule({
      packageJson: { name: '@example/test' },
      init: async reg => {
        reg.addCommand({
          path: ['repo', 'test'],
          description: 'Test the repository',
          execute: async () => {},
        });
        reg.addCommand({
          path: ['repo', 'secret'],
          description: 'Hidden command',
          experimental: true,
          execute: async () => {},
        });
      },
    });

    await runCli({
      modules: [testModule],
      name: 'example-cli',
    });

    const helpOutput = logSpy.mock.calls.flat().join('\n');
    expect(helpOutput).toContain('example-cli repo');
    expect(helpOutput).toContain('test');
    expect(helpOutput).not.toContain('secret');
    expect(process.exit).toHaveBeenCalledWith(0);
    logSpy.mockRestore();
  });

  it('supports the short version flag', async () => {
    process.argv = ['node', 'cli', '-V'];
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await runCli({
      modules: [],
      name: 'example-cli',
      version: '1.2.3',
    });

    expect(logSpy).toHaveBeenCalledWith('1.2.3');
    expect(process.exit).toHaveBeenCalledWith(0);
    logSpy.mockRestore();
  });

  it('supports the short version flag after a nested leaf command', async () => {
    process.argv = ['node', 'cli', 'repo', 'test', '-V'];
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const testModule = createCliModule({
      packageJson: { name: '@example/test' },
      init: async reg => {
        reg.addCommand({
          path: ['repo', 'test'],
          description: 'Test the repository',
          execute: async () => {
            throw new Error('Command should not be executed');
          },
        });
      },
    });

    await runCli({
      modules: [testModule],
      name: 'example-cli',
      version: '1.2.3',
    });

    expect(logSpy).toHaveBeenCalledWith('1.2.3');
    expect(process.exit).toHaveBeenCalledWith(0);
    logSpy.mockRestore();
  });

  it('allows modules to define the help command', async () => {
    expect.assertions(2);
    process.argv = ['node', 'cli', 'help'];

    const testModule = createCliModule({
      packageJson: { name: '@example/test' },
      init: async reg => {
        reg.addCommand({
          path: ['help'],
          description: 'Custom help command',
          execute: async ({ args }) => {
            expect(args).toEqual([]);
          },
        });
      },
    });

    await runCli({
      modules: [testModule],
      name: 'example-cli',
    });

    expect(process.exit).toHaveBeenCalledWith(0);
  });

  it('reports invalid nested commands', async () => {
    process.argv = ['node', 'cli', 'repo', 'missing'];
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const testModule = createCliModule({
      packageJson: { name: '@example/test' },
      init: async reg => {
        reg.addCommand({
          path: ['repo', 'test'],
          description: 'Test the repository',
          execute: async () => {},
        });
      },
    });

    await runCli({
      modules: [testModule],
      name: 'example-cli',
    });

    expect(logSpy.mock.calls.flat().join('\n')).toContain(
      'Invalid command: repo missing',
    );
    expect(process.exit).toHaveBeenCalledWith(1);
    logSpy.mockRestore();
  });

  it('reports conflicts between modules', async () => {
    const firstModule = createCliModule({
      packageJson: { name: '@example/first' },
      init: async reg => {
        reg.addCommand({
          path: ['repo', 'test'],
          description: 'First test command',
          execute: async () => {},
        });
      },
    });
    const secondModule = createCliModule({
      packageJson: { name: '@example/second' },
      init: async reg => {
        reg.addCommand({
          path: ['repo', 'test'],
          description: 'Second test command',
          execute: async () => {},
        });
      },
    });

    await expect(
      runCli({
        modules: [firstModule, secondModule],
        name: 'example-cli',
      }),
    ).rejects.toThrow(
      'Command "repo test" from "@example/second" conflicts with an existing command from "@example/first"',
    );
  });

  it('reports conflicts between parent and nested commands', async () => {
    const nestedModule = createCliModule({
      packageJson: { name: '@example/nested' },
      init: async reg => {
        reg.addCommand({
          path: ['repo', 'test'],
          description: 'Nested command',
          execute: async () => {},
        });
      },
    });
    const parentModule = createCliModule({
      packageJson: { name: '@example/parent' },
      init: async reg => {
        reg.addCommand({
          path: ['repo'],
          description: 'Parent command',
          execute: async () => {},
        });
      },
    });

    await expect(
      runCli({
        modules: [nestedModule, parentModule],
        name: 'example-cli',
      }),
    ).rejects.toThrow(
      'Command "repo" from "@example/parent" conflicts with an existing command from "@example/nested"',
    );

    await expect(
      runCli({
        modules: [parentModule, nestedModule],
        name: 'example-cli',
      }),
    ).rejects.toThrow(
      'Command "repo test" from "@example/nested" conflicts with an existing command from "@example/parent"',
    );
  });

  it('registers the unhandled rejection handler once', async () => {
    process.argv = ['node', 'cli'];

    await runCli({
      modules: [],
      name: 'example-cli',
    });
    const listenerCount = process.listenerCount('unhandledRejection');

    await runCli({
      modules: [],
      name: 'example-cli',
    });

    expect(process.listenerCount('unhandledRejection')).toBe(listenerCount);
  });
});
