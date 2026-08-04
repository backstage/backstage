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
    info: {
      name: 'template execute',
      usage: 'backstage-cli template execute',
    },
  } as unknown as CliCommandContext);

describe('template execute', () => {
  let stdoutSpy: jest.SpiedFunction<typeof process.stdout.write>;

  beforeEach(() => {
    jest.clearAllMocks();
    stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
  });

  it('throws when --template-ref is missing', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: {} });

    await expect(templateExecute(ctx([]))).rejects.toThrow(
      '--template-ref is required',
    );
  });

  it('throws when --values is missing', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { 'template-ref': 'template:default/my-tpl' },
    });

    await expect(templateExecute(ctx([]))).rejects.toThrow(
      '--values is required',
    );
  });

  it('executes template with --template-ref and --values', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: {
        'template-ref': 'template:default/my-tpl',
        values: '{"name":"my-app"}',
      },
    });
    mockExecute.mockResolvedValue({ taskId: 'task-123' });

    await templateExecute(ctx([]));

    expect(mockExecute).toHaveBeenCalledWith('scaffolder:execute-template', {
      templateRef: 'template:default/my-tpl',
      values: { name: 'my-app' },
    });
  });

  it('passes secrets when provided', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: {
        'template-ref': 'template:default/my-tpl',
        values: '{"name":"app"}',
        secrets: '{"token":"secret"}',
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
