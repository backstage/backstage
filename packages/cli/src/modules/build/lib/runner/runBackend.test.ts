/*
 * Copyright 2020 The Backstage Authors
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

import { runBackend } from './runBackend';

// Mock external dependencies
jest.mock('chokidar', () => ({
  watch: jest.fn(() => ({
    on: jest.fn().mockReturnThis(),
    add: jest.fn(),
  })),
}));

jest.mock('cross-spawn', () =>
  jest.fn(() => ({
    on: jest.fn().mockReturnThis(),
    once: jest.fn().mockReturnThis(),
    kill: jest.fn(),
    killed: false,
    exitCode: null,
    pid: 12345,
  })),
);

jest.mock('../ipc', () => ({
  IpcServer: jest.fn().mockImplementation(() => ({
    addChild: jest.fn(),
  })),
  ServerDataStore: {
    bind: jest.fn(),
  },
}));

jest.mock('ctrlc-windows', () => ({
  ctrlc: jest.fn(),
}));

describe('runBackend', () => {
  let originalEnv: NodeJS.ProcessEnv;
  let originalPlatform: string;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };
    originalPlatform = process.platform;

    // Clear environment variables that we're testing
    delete process.env.NODE_ENV;
    delete process.env.NODE_OPTIONS;

    // Mock process.stdin.on to prevent actual stdin reading
    jest.spyOn(process.stdin, 'on').mockReturnValue(process.stdin);

    // Mock process.once to prevent actual signal handling
    jest.spyOn(process, 'once').mockReturnValue(process);
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
    });

    jest.clearAllMocks();
  });

  describe('NODE_OPTIONS environment variable', () => {
    it('should add --no-node-snapshot when NODE_OPTIONS is not set', async () => {
      delete process.env.NODE_OPTIONS;

      runBackend({
        entry: 'src/index',
      });

      expect(process.env.NODE_OPTIONS).toBe('--no-node-snapshot');
    });

    it('should append --no-node-snapshot when NODE_OPTIONS exists without it', async () => {
      process.env.NODE_OPTIONS = '--max-old-space-size=4096';

      runBackend({
        entry: 'src/index',
      });

      expect(process.env.NODE_OPTIONS).toBe(
        '--max-old-space-size=4096 --no-node-snapshot',
      );
    });

    it('should not add --no-node-snapshot when --node-snapshot already exists', async () => {
      process.env.NODE_OPTIONS = '--node-snapshot --max-old-space-size=4096';

      runBackend({
        entry: 'src/index',
      });

      expect(process.env.NODE_OPTIONS).toBe(
        '--node-snapshot --max-old-space-size=4096',
      );
    });

    it('should not add --no-node-snapshot when --node-snapshot exists in the middle of NODE_OPTIONS', async () => {
      process.env.NODE_OPTIONS =
        '--max-old-space-size=4096 --node-snapshot --inspect';

      runBackend({
        entry: 'src/index',
      });

      expect(process.env.NODE_OPTIONS).toBe(
        '--max-old-space-size=4096 --node-snapshot --inspect',
      );
    });

    it('should handle NODE_OPTIONS with trailing spaces', async () => {
      process.env.NODE_OPTIONS = '--max-old-space-size=4096 ';

      runBackend({
        entry: 'src/index',
      });

      expect(process.env.NODE_OPTIONS).toBe(
        '--max-old-space-size=4096  --no-node-snapshot',
      );
    });
  });

  describe('NODE_ENV environment variable', () => {
    it('should set NODE_ENV to development when not set', async () => {
      delete process.env.NODE_ENV;

      runBackend({
        entry: 'src/index',
      });

      expect(process.env.NODE_ENV).toBe('development');
    });

    it('should not override existing NODE_ENV', async () => {
      process.env.NODE_ENV = 'production';

      runBackend({
        entry: 'src/index',
      });

      expect(process.env.NODE_ENV).toBe('production');
    });
  });

  describe('combined environment setup', () => {
    it('should set both NODE_ENV and NODE_OPTIONS when neither is set', async () => {
      delete process.env.NODE_ENV;
      delete process.env.NODE_OPTIONS;

      runBackend({
        entry: 'src/index',
      });

      expect(process.env.NODE_ENV).toBe('development');
      expect(process.env.NODE_OPTIONS).toBe('--no-node-snapshot');
    });

    it('should handle both environment variables independently', async () => {
      process.env.NODE_ENV = 'test';
      process.env.NODE_OPTIONS = '--inspect';

      runBackend({
        entry: 'src/index',
      });

      expect(process.env.NODE_ENV).toBe('test');
      expect(process.env.NODE_OPTIONS).toBe('--inspect --no-node-snapshot');
    });
  });
});
