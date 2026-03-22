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

const mockListForPlugin = jest.fn();
const mockExecute = jest.fn();

jest.mock('cleye', () => ({ cli: jest.fn().mockReturnValue({ flags: {} }) }));
jest.mock('../lib/resolveAuth', () => ({ resolveAuth: jest.fn() }));
jest.mock('../lib/ActionsClient', () => ({
  ActionsClient: jest.fn().mockImplementation(() => ({
    listForPlugin: mockListForPlugin,
    execute: mockExecute,
  })),
}));

import executeCommand from './execute';
import { cli } from 'cleye';
import { resolveAuth } from '../lib/resolveAuth';

const mockCli = cli as jest.MockedFunction<typeof cli>;
const mockResolveAuth = resolveAuth as jest.MockedFunction<typeof resolveAuth>;

const baseContext: CliCommandContext = {
  args: [],
  info: { name: 'execute', description: 'Execute an action' },
} as unknown as CliCommandContext;

const testAction = {
  id: 'catalog:refresh',
  name: 'refresh',
  schema: {
    input: {
      properties: {
        entityRef: { type: 'string', description: 'Entity reference' },
        dryRun: { type: 'boolean', description: 'Dry run mode' },
      },
      required: ['entityRef'],
    },
    output: {},
  },
};

function authResponse() {
  return {
    accessToken: 'test-token',
    baseUrl: 'https://backstage.example.com',
    instanceName: 'default',
    pluginSources: ['catalog'],
  };
}

describe('execute command', () => {
  let stderrSpy: jest.SpiedFunction<typeof process.stderr.write>;

  beforeEach(() => {
    jest.clearAllMocks();
    stderrSpy = jest
      .spyOn(process.stderr, 'write')
      .mockImplementation(() => true);
  });

  afterEach(() => {
    stderrSpy.mockRestore();
  });

  it('shows action-specific flags in help when action ID is provided', async () => {
    mockResolveAuth.mockResolvedValue(authResponse());
    mockListForPlugin.mockResolvedValue([testAction]);

    await executeCommand({
      ...baseContext,
      args: ['catalog:refresh', '--help'],
    });

    expect(mockResolveAuth).toHaveBeenCalled();
    expect(mockListForPlugin).toHaveBeenCalledWith('catalog:refresh');

    const cliCall = mockCli.mock.calls[0][0];
    const cliFlags = cliCall.flags as Record<string, unknown>;
    expect(cliFlags.entityRef).toEqual({
      type: String,
      description: 'Entity reference (required)',
    });
    expect(cliFlags.dryRun).toEqual({
      type: Boolean,
      description: 'Dry run mode',
    });
    expect(cliFlags.instance).toBeDefined();
  });

  it('falls back to generic help with a message when auth fails', async () => {
    mockResolveAuth.mockRejectedValue(new Error('Not authenticated'));

    await executeCommand({
      ...baseContext,
      args: ['catalog:refresh', '--help'],
    });

    expect(stderrSpy).toHaveBeenCalledWith(
      'Unable to retrieve action schema. Showing generic help.\n',
    );

    const cliCall = mockCli.mock.calls[0][0];
    const cliFlags = cliCall.flags as Record<string, unknown>;
    expect(cliFlags.instance).toBeDefined();
    expect(cliFlags.entityRef).toBeUndefined();
  });

  it('falls back to generic help when action is not found', async () => {
    mockResolveAuth.mockResolvedValue(authResponse());
    mockListForPlugin.mockResolvedValue([]);

    await executeCommand({
      ...baseContext,
      args: ['catalog:refresh', '--help'],
    });

    const cliCall = mockCli.mock.calls[0][0];
    const cliFlags = cliCall.flags as Record<string, unknown>;
    expect(cliFlags.entityRef).toBeUndefined();
    expect(cliFlags.instance).toBeDefined();
  });

  it('shows generic help when no action ID is provided with --help', async () => {
    await executeCommand({
      ...baseContext,
      args: ['--help'],
    });

    expect(mockResolveAuth).not.toHaveBeenCalled();

    const cliCall = mockCli.mock.calls[0][0];
    const cliFlags = cliCall.flags as Record<string, unknown>;
    expect(cliCall.parameters).toEqual(['<action-id>']);
    expect(cliFlags.instance).toBeDefined();
    expect(Object.keys(cliFlags)).toEqual(['instance']);
  });

  it('shows help and throws when no action ID and no --help flag', async () => {
    await expect(
      executeCommand({
        ...baseContext,
        args: [],
      }),
    ).rejects.toThrow('Action ID is required');

    expect(mockResolveAuth).not.toHaveBeenCalled();
    const cliCall = mockCli.mock.calls[0][0];
    expect(cliCall.parameters).toEqual(['<action-id>']);
  });

  it('extracts --instance flag for auth when showing help', async () => {
    mockResolveAuth.mockResolvedValue(authResponse());
    mockListForPlugin.mockResolvedValue([testAction]);

    await executeCommand({
      ...baseContext,
      args: ['--instance', 'staging', 'catalog:refresh', '--help'],
    });

    expect(mockResolveAuth).toHaveBeenCalledWith('staging');
  });

  it('executes action and prints output on success', async () => {
    mockResolveAuth.mockResolvedValue(authResponse());
    mockListForPlugin.mockResolvedValue([testAction]);
    mockExecute.mockResolvedValue({ refreshed: true });
    (mockCli as jest.Mock).mockReturnValue({
      flags: {
        entityRef: 'component:default/foo',
        instance: undefined,
        help: undefined,
      },
    });

    const stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);

    await executeCommand({
      ...baseContext,
      args: ['catalog:refresh', '--entityRef', 'component:default/foo'],
    });

    expect(mockExecute).toHaveBeenCalledWith('catalog:refresh', {
      entityRef: 'component:default/foo',
    });
    expect(stdoutSpy).toHaveBeenCalledWith(
      `${JSON.stringify({ refreshed: true }, null, 2)}\n`,
    );

    stdoutSpy.mockRestore();
  });

  it('throws when action is not found during execution', async () => {
    mockResolveAuth.mockResolvedValue(authResponse());
    mockListForPlugin.mockResolvedValue([]);
    (mockCli as jest.Mock).mockReturnValue({ flags: { help: undefined } });

    await expect(
      executeCommand({
        ...baseContext,
        args: ['catalog:unknown'],
      }),
    ).rejects.toThrow(
      'Action "catalog:unknown" not found. Run "actions list" to see available actions.',
    );
  });
});
