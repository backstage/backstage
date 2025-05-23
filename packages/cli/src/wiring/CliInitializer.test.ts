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
import { createCliPlugin } from './factory';

process.exit = jest.fn() as any;

describe('CliInitializer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should run commands', async () => {
    expect.assertions(2);
    process.argv = ['node', 'cli', 'test'];
    const initializer = new CliInitializer();
    initializer.add(
      createCliPlugin({
        pluginId: 'test',
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
      createCliPlugin({
        pluginId: 'test',
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
      createCliPlugin({
        pluginId: 'test',
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
});
