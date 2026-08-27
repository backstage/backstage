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

  beforeEach(() => {
    jest.clearAllMocks();
    stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
  });

  it('throws when --entity is missing', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: {} });

    await expect(catalogValidate(ctx([]))).rejects.toThrow(
      '--entity is required',
    );
  });

  it('reports invalid YAML without calling the catalog', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { entity: '{not: valid: yaml' },
    });

    await catalogValidate(ctx([]));

    expect(mockValidateEntity).not.toHaveBeenCalled();
    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    const result = JSON.parse(output);
    expect(result.isValid).toBe(false);
    expect(result.isValidYaml).toBe(false);
  });

  it('validates a well-formed entity', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { entity: validEntityYaml },
    });
    mockValidateEntity.mockResolvedValue({ valid: true });

    await catalogValidate(ctx([]));

    expect(mockValidateEntity).toHaveBeenCalledWith(
      expect.objectContaining({ kind: 'Component' }),
      'url:https://localhost/entity-validator',
      { token: 'tok' },
    );
    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    const result = JSON.parse(output);
    expect(result).toEqual({
      isValid: true,
      isValidYaml: true,
      errors: [],
      entity: expect.objectContaining({ kind: 'Component' }),
    });
  });

  it('passes --location to the catalog', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { entity: validEntityYaml, location: 'url:https://example.com' },
    });
    mockValidateEntity.mockResolvedValue({ valid: true });

    await catalogValidate(ctx([]));

    expect(mockValidateEntity).toHaveBeenCalledWith(
      expect.anything(),
      'url:https://example.com',
      { token: 'tok' },
    );
  });

  it('reports schema validation errors from the catalog', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { entity: validEntityYaml },
    });
    mockValidateEntity.mockResolvedValue({
      valid: false,
      errors: [{ name: 'Error', message: 'missing apiVersion' }],
    });

    await catalogValidate(ctx([]));

    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    const result = JSON.parse(output);
    expect(result).toEqual({
      isValid: false,
      isValidYaml: true,
      errors: ['missing apiVersion'],
      entity: undefined,
    });
  });

  it('reports an error if the catalog request fails', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { entity: validEntityYaml },
    });
    mockValidateEntity.mockRejectedValue(new Error('network error'));

    await catalogValidate(ctx([]));

    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    const result = JSON.parse(output);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('network error');
  });
});
