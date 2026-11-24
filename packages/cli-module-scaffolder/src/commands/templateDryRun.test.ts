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
import { Readable } from 'node:stream';

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
  let directory: string;
  let templatePath: string;
  const templateYaml = 'kind: Template\nmetadata:\n  name: my-tpl';

  beforeEach(() => {
    jest.clearAllMocks();
    process.exitCode = undefined;
    stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
    directory = mkdtempSync(join(tmpdir(), 'template-dry-run-'));
    templatePath = join(directory, 'template.yaml');
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
    rmSync(directory, { recursive: true });
    process.exitCode = undefined;
  });

  const readOutput = () =>
    JSON.parse(stdoutSpy.mock.calls.map(c => c[0]).join(''));

  it('reports a validation error and exits with 1 when the template is not valid YAML', async () => {
    writeFileSync(templatePath, '{not: valid: yaml');
    (mockCli as jest.Mock).mockReturnValue({
      flags: {},
      _: { file: templatePath },
    });

    await templateDryRun(ctx([templatePath]));

    expect(mockDryRun).not.toHaveBeenCalled();
    const result = readOutput();
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Failed to parse YAML template');
    expect(process.exitCode).toBe(1);
  });

  it('dry-runs the template from a file with default values', async () => {
    writeFileSync(templatePath, templateYaml);
    (mockCli as jest.Mock).mockReturnValue({
      flags: {},
      _: { file: templatePath },
    });
    mockDryRun.mockResolvedValue({ steps: [], output: {}, log: [] });

    await templateDryRun(ctx([templatePath]));

    expect(mockDryRun).toHaveBeenCalledWith({
      template: { kind: 'Template', metadata: { name: 'my-tpl' } },
      values: {},
    });
    expect(readOutput()).toEqual({
      valid: true,
      message: 'Template validation successful',
      log: [],
      output: {},
      steps: [],
    });
    expect(process.exitCode).toBeUndefined();
  });

  it('passes repeatable values and maps log entries', async () => {
    writeFileSync(templatePath, templateYaml);
    (mockCli as jest.Mock).mockReturnValue({
      flags: { value: ['name=my-app', 'owner=team-a', 'replicas=3'] },
      _: { file: templatePath },
    });
    mockDryRun.mockResolvedValue({
      steps: [{ id: 'step-1', name: 'fetch', action: 'fetch:template' }],
      output: { url: 'https://example.com' },
      log: [{ body: { message: 'hello', stepId: 'step-1', status: 'ok' } }],
    });

    await templateDryRun(ctx([templatePath]));

    expect(mockDryRun).toHaveBeenCalledWith({
      template: { kind: 'Template', metadata: { name: 'my-tpl' } },
      values: { name: 'my-app', owner: 'team-a', replicas: 3 },
    });
    const result = readOutput();
    expect(result.log).toEqual([
      { message: 'hello', stepId: 'step-1', status: 'ok' },
    ]);
    expect(result.steps).toEqual([
      { id: 'step-1', name: 'fetch', action: 'fetch:template' },
    ]);
  });

  it('reads the template from stdin when the file is "-"', async () => {
    const stdin = Object.getOwnPropertyDescriptor(process, 'stdin')!;
    Object.defineProperty(process, 'stdin', {
      value: Readable.from([templateYaml]),
      configurable: true,
    });
    (mockCli as jest.Mock).mockReturnValue({ flags: {}, _: { file: '-' } });
    mockDryRun.mockResolvedValue({ steps: [], output: {}, log: [] });

    try {
      await templateDryRun(ctx(['-']));
    } finally {
      Object.defineProperty(process, 'stdin', stdin);
    }

    expect(mockDryRun).toHaveBeenCalledWith({
      template: { kind: 'Template', metadata: { name: 'my-tpl' } },
      values: {},
    });
  });

  it('propagates dry-run request failures', async () => {
    writeFileSync(templatePath, templateYaml);
    (mockCli as jest.Mock).mockReturnValue({
      flags: {},
      _: { file: templatePath },
    });
    mockDryRun.mockRejectedValue(new Error('network error'));

    await expect(templateDryRun(ctx([templatePath]))).rejects.toThrow(
      'network error',
    );
  });

  it('rejects the removed JSON --values flag and requires a file during parsing', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(code => {
      throw new Error(`process.exit(${code})`);
    });
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (mockCli as jest.Mock).mockImplementationOnce(actualCli);

    try {
      await expect(
        templateDryRun(ctx(['template.yaml', '--values', '{"name":"my-app"}'])),
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
