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
import type { ListResult } from '../lib/ActionsClient';

const mockList = jest.fn();

jest.mock('cleye', () => ({
  cli: jest.fn().mockReturnValue({ flags: {} }),
}));
jest.mock('../lib/resolveAuth', () => ({ resolveAuth: jest.fn() }));
jest.mock('../lib/ActionsClient', () => ({
  ActionsClient: jest.fn().mockImplementation(() => ({
    list: mockList,
  })),
}));

import listCommand from './list';
import { cli } from 'cleye';
import { resolveAuth } from '../lib/resolveAuth';

const mockCli = cli as jest.MockedFunction<typeof cli>;
const mockResolveAuth = resolveAuth as jest.MockedFunction<typeof resolveAuth>;

const baseContext: CliCommandContext = {
  args: [],
  info: { name: 'list', description: 'List actions' },
} as unknown as CliCommandContext;

function authResponse() {
  return {
    accessToken: 'test-token',
    baseUrl: 'https://backstage.example.com',
    instanceName: 'default',
    pluginSources: ['catalog', 'notifications'],
  };
}

describe('list command', () => {
  let stderrSpy: jest.SpiedFunction<typeof process.stderr.write>;
  let stdoutSpy: jest.SpiedFunction<typeof process.stdout.write>;
  let originalExitCode: typeof process.exitCode;

  beforeEach(() => {
    jest.clearAllMocks();
    originalExitCode = process.exitCode;
    process.exitCode = undefined;
    stderrSpy = jest
      .spyOn(process.stderr, 'write')
      .mockImplementation(() => true);
    stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
  });

  afterEach(() => {
    stderrSpy.mockRestore();
    stdoutSpy.mockRestore();
    process.exitCode = originalExitCode;
  });

  it('lists actions from all successful sources and warns about failed ones', async () => {
    mockResolveAuth.mockResolvedValue(authResponse());
    const result: ListResult = {
      grouped: [
        {
          pluginId: 'catalog',
          actions: [
            {
              id: 'catalog:refresh',
              name: 'refresh',
              title: 'Refresh entity',
              schema: { input: {}, output: {} },
            },
          ],
        },
      ],
      failed: [
        {
          pluginId: 'notifications',
          message: 'Request failed with 404 Not Found',
        },
      ],
    };
    mockList.mockResolvedValue(result);

    await listCommand(baseContext);

    const stdout = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(stdout).toContain('catalog:refresh');

    const stderr = stderrSpy.mock.calls.map(c => c[0]).join('');
    expect(stderr).toContain('notifications');
    expect(stderr).toContain('404');

    expect(process.exitCode).toBeUndefined();
  });

  it('sets exit code 1 and lists all failures when every source fails', async () => {
    mockResolveAuth.mockResolvedValue(authResponse());
    const result: ListResult = {
      grouped: [],
      failed: [
        { pluginId: 'catalog', message: 'Request failed with 404 Not Found' },
        { pluginId: 'notifications', message: 'Network error' },
      ],
    };
    mockList.mockResolvedValue(result);

    await listCommand(baseContext);

    const stderr = stderrSpy.mock.calls.map(c => c[0]).join('');
    expect(stderr).toContain('catalog');
    expect(stderr).toContain('notifications');
    expect(process.exitCode).toBe(1);
  });

  it('outputs JSON with actions and errors arrays when --output=json', async () => {
    mockResolveAuth.mockResolvedValue(authResponse());
    (mockCli as jest.Mock).mockReturnValue({
      flags: { output: 'json' },
    });
    const result: ListResult = {
      grouped: [
        {
          pluginId: 'catalog',
          actions: [
            {
              id: 'catalog:refresh',
              name: 'refresh',
              schema: { input: {}, output: {} },
            },
          ],
        },
      ],
      failed: [
        {
          pluginId: 'notifications',
          message: 'Request failed with 404 Not Found',
        },
      ],
    };
    mockList.mockResolvedValue(result);

    await listCommand(baseContext);

    const stdout = stdoutSpy.mock.calls.map(c => c[0]).join('');
    const parsed = JSON.parse(stdout);
    expect(parsed.actions).toEqual([
      {
        id: 'catalog:refresh',
        name: 'refresh',
        pluginId: 'catalog',
        schema: { input: {}, output: {} },
      },
    ]);
    expect(parsed.errors).toEqual([
      {
        pluginId: 'notifications',
        message: 'Request failed with 404 Not Found',
      },
    ]);
    expect(process.exitCode).toBeUndefined();
  });

  it('sets exit code 1 in JSON mode when all sources fail', async () => {
    mockResolveAuth.mockResolvedValue(authResponse());
    (mockCli as jest.Mock).mockReturnValue({
      flags: { output: 'json' },
    });
    const result: ListResult = {
      grouped: [],
      failed: [
        { pluginId: 'catalog', message: 'Request failed with 404 Not Found' },
      ],
    };
    mockList.mockResolvedValue(result);

    await listCommand(baseContext);

    const stdout = stdoutSpy.mock.calls.map(c => c[0]).join('');
    const parsed = JSON.parse(stdout);
    expect(parsed.actions).toEqual([]);
    expect(parsed.errors).toHaveLength(1);
    expect(process.exitCode).toBe(1);
  });

  it('preserves existing behavior when all sources succeed', async () => {
    mockResolveAuth.mockResolvedValue(authResponse());
    const result: ListResult = {
      grouped: [
        {
          pluginId: 'catalog',
          actions: [
            {
              id: 'catalog:refresh',
              name: 'refresh',
              title: 'Refresh',
              schema: { input: {}, output: {} },
            },
          ],
        },
        {
          pluginId: 'notifications',
          actions: [
            {
              id: 'notifications:send',
              name: 'send',
              title: 'Send notification',
              schema: { input: {}, output: {} },
            },
          ],
        },
      ],
      failed: [],
    };
    mockList.mockResolvedValue(result);

    await listCommand(baseContext);

    const stdout = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(stdout).toContain('catalog:refresh');
    expect(stdout).toContain('notifications:send');

    const stderr = stderrSpy.mock.calls.map(c => c[0]).join('');
    expect(stderr).toBe('');

    expect(process.exitCode).toBeUndefined();
  });
});
