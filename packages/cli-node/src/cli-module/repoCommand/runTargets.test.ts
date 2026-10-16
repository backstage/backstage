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

import { createRunCommand, mergeRunTargets } from './runTargets';

const options = {
  description: 'Run tests',
  packageCommand: ['package', 'test'],
  packageArgs: ['--no-watch'],
};

describe('mergeRunTargets', () => {
  it('allows identical duplicates and rejects conflicting ones', () => {
    const merged = mergeRunTargets([
      { name: 'test', options, moduleName: '@a/one' },
      { name: 'test', options: { ...options }, moduleName: '@a/two' },
      { name: 'lint', options, moduleName: '@a/two' },
    ]);
    expect(Array.from(merged.keys())).toEqual(['test', 'lint']);

    expect(() =>
      mergeRunTargets([
        { name: 'test', options, moduleName: '@a/one' },
        {
          name: 'test',
          options: { ...options, includeDependents: false },
          moduleName: '@a/two',
        },
      ]),
    ).toThrow(
      'Conflicting run target "test" registered by "@a/one" and "@a/two" with different options',
    );
  });
});

describe('createRunCommand', () => {
  const targets = mergeRunTargets([
    { name: 'test', options, moduleName: '@a/one' },
  ]);
  const info = { usage: 'cli repo run', name: 'repo run' };

  const runRepoCommand = jest.fn();

  beforeEach(() => {
    runRepoCommand.mockReset();
    jest.spyOn(process.stdout, 'write').mockReturnValue(true);
  });

  it('lists targets, dispatches, and rejects unknown targets', async () => {
    const command = createRunCommand(targets, runRepoCommand);
    const execute = command.execute as (c: any) => Promise<void>;
    expect(command.path).toEqual(['repo', 'run']);

    await execute({ args: ['--help'], info });
    expect(process.stdout.write).toHaveBeenCalledWith(
      expect.stringContaining('test  Run tests'),
    );
    expect(runRepoCommand).not.toHaveBeenCalled();

    await execute({ args: ['test', '--since', 'main'], info });
    expect(runRepoCommand).toHaveBeenCalledWith(options, {
      args: ['--since', 'main'],
      info: { usage: 'cli repo run test', name: 'repo run test' },
    });

    await expect(execute({ args: ['nope'], info })).rejects.toThrow(
      'Unknown run target "nope", available targets are: test',
    );
  });
});
