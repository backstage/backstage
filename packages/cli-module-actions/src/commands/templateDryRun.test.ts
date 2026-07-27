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

import templateDryRun from './templateDryRun';
import { cli } from 'cleye';

const mockCli = cli as jest.MockedFunction<typeof cli>;

const ctx = (args: string[]): CliCommandContext =>
  ({
    args,
    info: {
      name: 'template dry-run',
      usage: 'backstage-cli template dry-run',
    },
  } as unknown as CliCommandContext);

describe('template dry-run', () => {
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

    await expect(templateDryRun(ctx([]))).rejects.toThrow(
      '--template-ref is required',
    );
  });

  it('calls dry-run-template with template ref only', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { 'template-ref': 'template:default/my-tpl' },
    });
    mockExecute.mockResolvedValue({ steps: [], output: {} });

    await templateDryRun(ctx([]));

    expect(mockExecute).toHaveBeenCalledWith('scaffolder:dry-run-template', {
      templateYaml: 'template:default/my-tpl',
    });
  });

  it('passes values when provided', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: {
        'template-ref': 'template:default/my-tpl',
        values: '{"name":"app"}',
      },
    });
    mockExecute.mockResolvedValue({ steps: [] });

    await templateDryRun(ctx([]));

    expect(mockExecute).toHaveBeenCalledWith('scaffolder:dry-run-template', {
      templateYaml: 'template:default/my-tpl',
      values: { name: 'app' },
    });
  });
});
