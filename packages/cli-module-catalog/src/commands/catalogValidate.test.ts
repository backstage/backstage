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
import { Readable } from 'node:stream';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const mockValidateEntity = jest.fn();

jest.mock('cleye', () => ({
  cli: jest.fn().mockReturnValue({ flags: {} }),
}));
jest.mock('../lib/resolveAuth', () => ({
  resolveAuth: jest.fn().mockResolvedValue({
    accessToken: 'tok',
    baseUrl: 'https://backstage.example.com',
    instanceName: 'default',
    pluginSources: ['catalog'],
  }),
}));
jest.mock('../lib/catalogClient', () => ({
  createCatalogClient: jest.fn().mockImplementation(() => ({
    validateEntity: mockValidateEntity,
  })),
}));

import catalogValidate from './catalogValidate';
import { cli } from 'cleye';

const mockCli = cli as jest.MockedFunction<typeof cli>;

const ctx = (args: string[]): CliCommandContext =>
  ({
    args,
    info: { name: 'catalog validate', usage: 'backstage-cli catalog validate' },
  } as unknown as CliCommandContext);

const validEntityYaml = [
  'apiVersion: backstage.io/v1alpha1',
  'kind: Component',
  'metadata:',
  '  name: my-svc',
  'spec:',
  '  type: service',
].join('\n');

describe('catalog validate', () => {
  let stdoutSpy: jest.SpiedFunction<typeof process.stdout.write>;
  let directory: string;
  let entityPath: string;

  beforeEach(() => {
    jest.clearAllMocks();
    process.exitCode = undefined;
    stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
    directory = mkdtempSync(join(tmpdir(), 'catalog-validate-'));
    entityPath = join(directory, 'catalog-info.yaml');
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
    rmSync(directory, { recursive: true });
    process.exitCode = undefined;
  });

  const readOutput = () =>
    JSON.parse(stdoutSpy.mock.calls.map(c => c[0]).join(''));

  it('requires a file argument', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: {}, _: {} });

    await expect(catalogValidate(ctx([]))).rejects.toThrow(
      'An entity YAML file is required',
    );
  });

  it('reports invalid YAML without calling the catalog and exits with 1', async () => {
    writeFileSync(entityPath, '{not: valid: yaml');
    (mockCli as jest.Mock).mockReturnValue({
      flags: {},
      _: { file: entityPath },
    });

    await catalogValidate(ctx([entityPath]));

    expect(mockValidateEntity).not.toHaveBeenCalled();
    const [result] = readOutput();
    expect(result.isValid).toBe(false);
    expect(result.isValidYaml).toBe(false);
    expect(result.errors[0]).toContain('YAML parsing error');
    expect(process.exitCode).toBe(1);
  });

  it('validates every document in a multi-document file', async () => {
    writeFileSync(
      entityPath,
      `${validEntityYaml}\n---\n${validEntityYaml.replace(
        'my-svc',
        'other-svc',
      )}\n---\n`,
    );
    (mockCli as jest.Mock).mockReturnValue({
      flags: {},
      _: { file: entityPath },
    });
    mockValidateEntity
      .mockResolvedValueOnce({ valid: true })
      .mockResolvedValueOnce({
        valid: false,
        errors: [{ name: 'Error', message: 'bad entity' }],
      });

    await catalogValidate(ctx([entityPath]));

    expect(mockValidateEntity).toHaveBeenCalledTimes(2);
    expect(readOutput()).toEqual([
      {
        isValid: true,
        isValidYaml: true,
        errors: [],
        entity: expect.objectContaining({
          metadata: { name: 'my-svc' },
        }),
      },
      {
        isValid: false,
        isValidYaml: true,
        errors: ['bad entity'],
        entity: undefined,
      },
    ]);
    expect(process.exitCode).toBe(1);
  });

  it('throws a usage error for empty input without calling the catalog', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: {},
      _: { file: entityPath },
    });

    for (const content of ['', '# just a comment\n', '---\n---\n']) {
      writeFileSync(entityPath, content);
      await expect(catalogValidate(ctx([entityPath]))).rejects.toThrow(
        'no entities to validate',
      );
    }
    expect(mockValidateEntity).not.toHaveBeenCalled();
    expect(stdoutSpy).not.toHaveBeenCalled();
  });

  it('validates a well-formed entity read from a file', async () => {
    writeFileSync(entityPath, validEntityYaml);
    (mockCli as jest.Mock).mockReturnValue({
      flags: {},
      _: { file: entityPath },
    });
    mockValidateEntity.mockResolvedValue({ valid: true });

    await catalogValidate(ctx([entityPath]));

    expect(mockValidateEntity).toHaveBeenCalledWith(
      expect.objectContaining({ kind: 'Component' }),
      'url:https://localhost/entity-validator',
      { token: 'tok' },
    );
    expect(readOutput()).toEqual([
      {
        isValid: true,
        isValidYaml: true,
        errors: [],
        entity: expect.objectContaining({ kind: 'Component' }),
      },
    ]);
    expect(process.exitCode).toBeUndefined();
  });

  it('reads the entity from stdin when the file is "-"', async () => {
    const stdin = Object.getOwnPropertyDescriptor(process, 'stdin')!;
    Object.defineProperty(process, 'stdin', {
      value: Readable.from([validEntityYaml]),
      configurable: true,
    });
    (mockCli as jest.Mock).mockReturnValue({ flags: {}, _: { file: '-' } });
    mockValidateEntity.mockResolvedValue({ valid: true });

    try {
      await catalogValidate(ctx(['-']));
    } finally {
      Object.defineProperty(process, 'stdin', stdin);
    }

    expect(mockValidateEntity).toHaveBeenCalledWith(
      expect.objectContaining({ kind: 'Component' }),
      'url:https://localhost/entity-validator',
      { token: 'tok' },
    );
  });

  it('passes --location to the catalog', async () => {
    writeFileSync(entityPath, validEntityYaml);
    (mockCli as jest.Mock).mockReturnValue({
      flags: { location: 'url:https://example.com' },
      _: { file: entityPath },
    });
    mockValidateEntity.mockResolvedValue({ valid: true });

    await catalogValidate(ctx([entityPath]));

    expect(mockValidateEntity).toHaveBeenCalledWith(
      expect.anything(),
      'url:https://example.com',
      { token: 'tok' },
    );
  });

  it('reports schema validation errors from the catalog and exits with 1', async () => {
    writeFileSync(entityPath, validEntityYaml);
    (mockCli as jest.Mock).mockReturnValue({
      flags: {},
      _: { file: entityPath },
    });
    mockValidateEntity.mockResolvedValue({
      valid: false,
      errors: [{ name: 'Error', message: 'missing apiVersion' }],
    });

    await catalogValidate(ctx([entityPath]));

    expect(readOutput()).toEqual([
      {
        isValid: false,
        isValidYaml: true,
        errors: ['missing apiVersion'],
        entity: undefined,
      },
    ]);
    expect(process.exitCode).toBe(1);
  });

  it('propagates catalog request failures instead of reporting an invalid entity', async () => {
    writeFileSync(entityPath, validEntityYaml);
    (mockCli as jest.Mock).mockReturnValue({
      flags: {},
      _: { file: entityPath },
    });
    mockValidateEntity.mockRejectedValue(new Error('network error'));

    await expect(catalogValidate(ctx([entityPath]))).rejects.toThrow(
      'network error',
    );
    expect(stdoutSpy).not.toHaveBeenCalled();
  });
});
