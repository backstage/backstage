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

import type { CliCommandContext } from '@backstage/cli-node';

const mockExecute = jest.fn();

jest.mock('cleye', () => ({
  cli: jest.fn().mockReturnValue({ flags: {} }),
}));
jest.mock('../lib/resolveAuth', () => ({
  resolveAuth: jest.fn().mockResolvedValue({
    accessToken: 'tok',
    baseUrl: 'https://backstage.example.com',
    instanceName: 'default',
    pluginSources: ['scaffolder'],
  }),
}));
jest.mock('../lib/ActionsClient', () => ({
  ActionsClient: jest.fn().mockImplementation(() => ({
    execute: mockExecute,
  })),
}));

import templateExecute from './templateExecute';
import { cli } from 'cleye';

const mockCli = cli as jest.MockedFunction<typeof cli>;

const ctx = (args: string[]): CliCommandContext =>
  ({
    args,
    info: { name: 'template execute', usage: 'backstage-cli template execute' },
  } as unknown as CliCommandContext);

describe('template execute', () => {
  let stdoutSpy: jest.SpiedFunction<typeof process.stdout.write>;
  let stderrSpy: jest.SpiedFunction<typeof process.stderr.write>;

  beforeEach(() => {
    jest.clearAllMocks();
    stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
    stderrSpy = jest
      .spyOn(process.stderr, 'write')
      .mockImplementation(() => true);
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
  });

  it('throws when --template-ref is missing', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: {} });

    await expect(templateExecute(ctx([]))).rejects.toThrow(
      '--template-ref is required',
    );
  });

  it('performs dry-run by default (no --confirm)', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { 'template-ref': 'template:default/my-tpl' },
    });
    mockExecute.mockResolvedValue({ steps: [], output: {} });

    await templateExecute(ctx(['--template-ref', 'template:default/my-tpl']));

    expect(mockExecute).toHaveBeenCalledWith('scaffolder:dry-run-template', {
      templateYaml: 'template:default/my-tpl',
      values: undefined,
    });

    const stderr = stderrSpy.mock.calls.map(c => c[0]).join('');
    expect(stderr).toContain('Dry-run mode');
  });

  it('executes for real with --confirm and --values', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: {
        'template-ref': 'template:default/my-tpl',
        values: '{"name":"my-app"}',
        confirm: true,
      },
    });
    mockExecute.mockResolvedValue({ taskId: 'task-123' });

    await templateExecute(
      ctx([
        '--template-ref',
        'template:default/my-tpl',
        '--values',
        '{"name":"my-app"}',
        '--confirm',
      ]),
    );

    expect(mockExecute).toHaveBeenCalledWith('scaffolder:execute-template', {
      templateRef: 'template:default/my-tpl',
      values: { name: 'my-app' },
    });
  });

  it('throws when --confirm is set but --values is missing', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { 'template-ref': 'template:default/my-tpl', confirm: true },
    });

    await expect(
      templateExecute(
        ctx(['--template-ref', 'template:default/my-tpl', '--confirm']),
      ),
    ).rejects.toThrow('--values is required');
  });

  it('passes secrets when provided with --confirm', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: {
        'template-ref': 'template:default/my-tpl',
        values: '{"name":"app"}',
        secrets: '{"token":"secret"}',
        confirm: true,
      },
    });
    mockExecute.mockResolvedValue({ taskId: 'task-456' });

    await templateExecute(ctx([]));

    expect(mockExecute).toHaveBeenCalledWith('scaffolder:execute-template', {
      templateRef: 'template:default/my-tpl',
      values: { name: 'app' },
      secrets: { token: 'secret' },
    });
  });
});
