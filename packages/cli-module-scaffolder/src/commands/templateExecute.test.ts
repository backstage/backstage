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
const mockQueryEntities = jest.fn();

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
jest.mock('../lib/ScaffolderClient', () => ({
  ScaffolderClient: jest.fn().mockImplementation(() => ({
    execute: mockExecute,
  })),
}));
jest.mock('../lib/catalogClient', () => ({
  createCatalogClient: jest.fn().mockImplementation(() => ({
    queryEntities: mockQueryEntities,
  })),
}));

import templateExecute from './templateExecute';
import { cli } from 'cleye';

const mockCli = cli as jest.MockedFunction<typeof cli>;
const actualCli = jest.requireActual<typeof import('cleye')>('cleye').cli;

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

  it('throws when neither a reference nor --template-ref is provided', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: {} });

    await expect(templateExecute(ctx([]))).rejects.toThrow(
      'Template reference or --template-ref is required',
    );
  });

  it('allows templates without input values', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { 'template-ref': 'template:default/my-tpl' },
    });
    mockExecute.mockResolvedValue({ taskId: 'task-123' });

    await templateExecute(ctx([]));

    expect(mockExecute).toHaveBeenCalledWith({
      templateRef: 'template:default/my-tpl',
      values: {},
      secrets: undefined,
    });
  });

  it('executes template with --template-ref and --value', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: {
        'template-ref': 'template:default/my-tpl',
        value: ['name=my-app'],
      },
    });
    mockExecute.mockResolvedValue({ taskId: 'task-123' });

    await templateExecute(ctx([]));

    expect(mockExecute).toHaveBeenCalledWith({
      templateRef: 'template:default/my-tpl',
      values: { name: 'my-app' },
      secrets: undefined,
    });

    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(JSON.parse(output)).toEqual({ taskId: 'task-123' });
  });

  it('passes secrets when provided', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: {
        'template-ref': 'template:default/my-tpl',
        value: ['name=app'],
        secret: ['token=secret'],
      },
    });
    mockExecute.mockResolvedValue({ taskId: 'task-456' });

    await templateExecute(ctx([]));

    expect(mockExecute).toHaveBeenCalledWith({
      templateRef: 'template:default/my-tpl',
      values: { name: 'app' },
      secrets: { token: 'secret' },
    });
  });

  it('accepts a positional full template reference', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: {},
      _: { ref: 'template:prod/my-tpl' },
    });
    mockExecute.mockResolvedValue({ taskId: 'task-789' });

    await templateExecute(ctx(['template:prod/my-tpl']));

    expect(mockQueryEntities).not.toHaveBeenCalled();
    expect(mockExecute).toHaveBeenCalledWith({
      templateRef: 'template:prod/my-tpl',
      values: {},
      secrets: undefined,
    });
  });

  it('rejects an empty positional template reference', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: {},
      _: { ref: '   ' },
    });

    await expect(templateExecute(ctx(['   ']))).rejects.toThrow(
      'Entity reference cannot be empty',
    );
  });

  it('resolves a short positional template reference from the catalog', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: {},
      _: { ref: 'my-tpl' },
    });
    mockQueryEntities.mockResolvedValue({
      items: [
        {
          kind: 'Template',
          metadata: { namespace: 'prod', name: 'my-tpl' },
        },
      ],
    });
    mockExecute.mockResolvedValue({ taskId: 'task-789' });

    await templateExecute(ctx(['my-tpl']));

    expect(mockQueryEntities).toHaveBeenCalledWith(
      { query: { kind: 'template', 'metadata.name': 'my-tpl' } },
      { token: 'tok' },
    );
    expect(mockExecute).toHaveBeenCalledWith(
      expect.objectContaining({ templateRef: 'Template:prod/my-tpl' }),
    );
  });

  it('accepts repeatable values and secrets', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: {
        'template-ref': 'template:default/my-tpl',
        value: ['name=my-app', 'owner=team-a', 'replicas=3'],
        secret: ['token=secret', 'enabled=true'],
      },
    });
    mockExecute.mockResolvedValue({ taskId: 'task-789' });

    await templateExecute(ctx([]));

    expect(mockExecute).toHaveBeenCalledWith({
      templateRef: 'template:default/my-tpl',
      values: { name: 'my-app', owner: 'team-a', replicas: 3 },
      secrets: { token: 'secret', enabled: true },
    });
  });

  it('rejects JSON objects containing equals signs for --value', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: {
        'template-ref': 'template:default/my-tpl',
        value: ['{"url":"https://example.com?a=b"}'],
      },
    });

    await expect(templateExecute(ctx([]))).rejects.toThrow(
      'JSON object input is not supported; use repeatable key=value flags',
    );
  });

  it('rejects removed JSON values and secrets flags during parsing', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(code => {
      throw new Error(`process.exit(${code})`);
    });
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (mockCli as jest.Mock).mockImplementationOnce(actualCli);

    try {
      await expect(
        templateExecute(
          ctx([
            'template:default/my-tpl',
            '--values',
            '{"name":"my-app"}',
            '--secrets',
            '{"token":"secret"}',
          ]),
        ),
      ).rejects.toThrow('process.exit(1)');
      expect(errorSpy).toHaveBeenCalledWith(
        'Error: Unknown flag: --values. (Did you mean --value?)',
      );
      expect(errorSpy).toHaveBeenCalledWith(
        'Error: Unknown flag: --secrets. (Did you mean --secret?)',
      );
    } finally {
      exitSpy.mockRestore();
      errorSpy.mockRestore();
    }
  });
});
