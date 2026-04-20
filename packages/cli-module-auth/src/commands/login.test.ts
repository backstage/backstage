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

const mockUpsertInstance = jest.fn();
const mockGetInstanceByName = jest.fn();
const mockWithMetadataLock = jest
  .fn()
  .mockImplementation((fn: Function) => fn());

const mockSecretStoreSet = jest.fn();
jest.mock('../lib/storage', () => ({
  upsertInstance: (...args: any[]) => mockUpsertInstance(...args),
  getInstanceByName: (...args: any[]) => mockGetInstanceByName(...args),
  withMetadataLock: (...args: any[]) => mockWithMetadataLock(...args),
  getAllInstances: jest
    .fn()
    .mockResolvedValue({ instances: [], selected: undefined }),
}));

jest.mock('@internal/cli', () => ({
  getSecretStore: jest.fn().mockResolvedValue({
    set: (...args: any[]) => mockSecretStoreSet(...args),
  }),
  getAuthInstanceService: jest.fn().mockReturnValue('test-service'),
}));

jest.mock('cleye', () => ({
  cli: jest.fn().mockReturnValue({
    flags: {
      backendUrl: 'https://backstage.example.com',
      noBrowser: true,
      instance: 'test-instance',
    },
  }),
}));

const mockWaitForCode = jest.fn().mockResolvedValue({
  code: 'test-code',
  state: 'test-state',
});
const mockClose = jest.fn();
jest.mock('../lib/localServer', () => ({
  startCallbackServer: jest.fn().mockResolvedValue({
    url: 'http://localhost:9999/callback',
    waitForCode: () => mockWaitForCode(),
    close: () => mockClose(),
  }),
}));

jest.mock('../lib/pkce', () => ({
  generateVerifier: jest.fn().mockReturnValue('test-verifier'),
  challengeFromVerifier: jest.fn().mockReturnValue('test-challenge'),
}));

jest.mock('../lib/http', () => ({
  httpJson: jest.fn().mockResolvedValue({
    access_token: 'new-access-token',
    token_type: 'bearer',
    expires_in: 3600,
    refresh_token: 'new-refresh-token',
  }),
}));

jest.mock('node:crypto', () => ({
  randomBytes: jest.fn().mockReturnValue({
    toString: () => 'test-state',
  }),
}));

jest.mock('node:child_process', () => ({ spawn: jest.fn() }));
jest.mock('fs-extra', () => ({ readFile: jest.fn() }));
jest.mock('glob', () => ({ sync: jest.fn().mockReturnValue([]) }));
jest.mock('yaml', () => ({ parse: jest.fn() }));
jest.mock('inquirer', () => ({ prompt: jest.fn() }));

import loginCommand from './login';

// Mock global fetch for the metadata endpoint check
const originalFetch = global.fetch;
beforeAll(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({}),
  }) as any;
});
afterAll(() => {
  global.fetch = originalFetch;
});

const baseContext: CliCommandContext = {
  args: [],
  info: { name: 'login', description: 'Log in to Backstage' },
} as unknown as CliCommandContext;

describe('login command - metadata preservation', () => {
  let stdoutSpy: jest.SpiedFunction<typeof process.stdout.write>;
  let stderrSpy: jest.SpiedFunction<typeof process.stderr.write>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockWithMetadataLock.mockImplementation((fn: Function) => fn());
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

  it('preserves metadata and selected flag when re-logging into an existing instance', async () => {
    mockGetInstanceByName.mockResolvedValue({
      name: 'test-instance',
      baseUrl: 'https://backstage.example.com',
      clientId: 'old-client',
      issuedAt: 1000,
      accessTokenExpiresAt: 2000,
      selected: true,
      metadata: { pluginSources: ['catalog', 'scaffolder'] },
    });

    await loginCommand({
      ...baseContext,
      args: [
        '--backendUrl',
        'https://backstage.example.com',
        '--instance',
        'test-instance',
        '--noBrowser',
      ],
    });

    expect(mockUpsertInstance).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'test-instance',
        selected: true,
        metadata: { pluginSources: ['catalog', 'scaffolder'] },
      }),
    );
  });

  it('sets metadata and selected to undefined for a new instance', async () => {
    mockGetInstanceByName.mockRejectedValue(new Error('Not found'));

    await loginCommand({
      ...baseContext,
      args: [
        '--backendUrl',
        'https://backstage.example.com',
        '--instance',
        'new-instance',
        '--noBrowser',
      ],
    });

    expect(mockUpsertInstance).toHaveBeenCalledWith(
      expect.objectContaining({
        selected: undefined,
        metadata: undefined,
      }),
    );
  });
});
