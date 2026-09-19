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
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const mockDryRun = jest.fn();

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
    dryRun: mockDryRun,
  })),
}));

import templateDryRun from './templateDryRun';
import { cli } from 'cleye';

const mockCli = cli as jest.MockedFunction<typeof cli>;
const actualCli = jest.requireActual<typeof import('cleye')>('cleye').cli;

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

  it('throws when neither --template-file nor --template-ref is provided', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: {} });

    await expect(templateDryRun(ctx([]))).rejects.toThrow(
      '--template-file or --template-ref is required',
    );
  });

  it('reports a validation error when the template is not valid YAML', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { 'template-ref': '{not: valid: yaml' },
    });

    await templateDryRun(ctx([]));

    expect(mockDryRun).not.toHaveBeenCalled();
    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    const result = JSON.parse(output);
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Failed to parse YAML template');
  });

  it('dry-runs the parsed template with default values', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { 'template-ref': 'kind: Template\nmetadata:\n  name: my-tpl' },
    });
    mockDryRun.mockResolvedValue({ steps: [], output: {}, log: [] });

    await templateDryRun(ctx([]));

    expect(mockDryRun).toHaveBeenCalledWith({
      template: { kind: 'Template', metadata: { name: 'my-tpl' } },
      values: {},
    });

    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    const result = JSON.parse(output);
    expect(result).toEqual({
      valid: true,
      message: 'Template validation successful',
      log: [],
      output: {},
      steps: [],
    });
  });

  it('passes values when provided and maps log entries', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: {
        'template-ref': 'kind: Template\nmetadata:\n  name: my-tpl',
        value: ['name=app'],
      },
    });
    mockDryRun.mockResolvedValue({
      steps: [{ id: 'step-1', name: 'fetch', action: 'fetch:template' }],
      output: { url: 'https://example.com' },
      log: [{ body: { message: 'hello', stepId: 'step-1', status: 'ok' } }],
    });

    await templateDryRun(ctx([]));

    expect(mockDryRun).toHaveBeenCalledWith({
      template: { kind: 'Template', metadata: { name: 'my-tpl' } },
      values: { name: 'app' },
    });

    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    const result = JSON.parse(output);
    expect(result.log).toEqual([
      { message: 'hello', stepId: 'step-1', status: 'ok' },
    ]);
    expect(result.steps).toEqual([
      { id: 'step-1', name: 'fetch', action: 'fetch:template' },
    ]);
  });

  it('reads the template from --template-file with repeatable values', async () => {
    const directory = mkdtempSync(join(tmpdir(), 'template-dry-run-'));
    const templatePath = join(directory, 'template.yaml');
    writeFileSync(templatePath, 'kind: Template\nmetadata:\n  name: my-tpl');
    (mockCli as jest.Mock).mockReturnValue({
      flags: {
        'template-file': templatePath,
        value: ['name=my-app', 'owner=team-a', 'replicas=3'],
      },
    });
    mockDryRun.mockResolvedValue({ steps: [], output: {}, log: [] });

    try {
      await templateDryRun(ctx(['--template-file', templatePath]));
    } finally {
      rmSync(directory, { recursive: true });
    }

    expect(mockDryRun).toHaveBeenCalledWith({
      template: { kind: 'Template', metadata: { name: 'my-tpl' } },
      values: { name: 'my-app', owner: 'team-a', replicas: 3 },
    });
  });

  it('rejects the removed JSON --values flag during parsing', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(code => {
      throw new Error(`process.exit(${code})`);
    });
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (mockCli as jest.Mock).mockImplementationOnce(actualCli);

    try {
      await expect(
        templateDryRun(
          ctx([
            '--template-ref',
            'kind: Template\nmetadata:\n  name: my-tpl',
            '--values',
            '{"name":"my-app"}',
          ]),
        ),
      ).rejects.toThrow('process.exit(1)');
      expect(errorSpy).toHaveBeenCalledWith(
        'Error: Unknown flag: --values. (Did you mean --value?)',
      );
    } finally {
      exitSpy.mockRestore();
      errorSpy.mockRestore();
    }
  });
});
