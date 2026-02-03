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
import spawn from 'cross-spawn';

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
  const mockSpawn = spawn as jest.MockedFunction<typeof spawn>;

  beforeEach(() => {
    // Use fake timers to control debounce
    jest.useFakeTimers();

    // Save original environment
    originalEnv = { ...process.env };
    process.env = { NODE_ENV: 'test' };
    originalPlatform = process.platform;

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
    jest.useRealTimers();
  });

  describe('--no-node-snapshot argument handling', () => {
    it('should pass --no-node-snapshot when NODE_OPTIONS is not set', () => {
      delete process.env.NODE_OPTIONS;

      runBackend({
        entry: 'src/index',
      });

      // Fast-forward past the debounce delay (100ms)
      jest.advanceTimersByTime(100);

      expect(mockSpawn).toHaveBeenCalled();
      const spawnArgs = mockSpawn.mock.calls[0][1] as string[];
      expect(spawnArgs).toContain('--no-node-snapshot');
    });

    it('should pass --no-node-snapshot when NODE_OPTIONS exists without --node-snapshot', () => {
      process.env.NODE_OPTIONS = '--max-old-space-size=4096';

      runBackend({
        entry: 'src/index',
      });

      // Fast-forward past the debounce delay (100ms)
      jest.advanceTimersByTime(100);

      expect(mockSpawn).toHaveBeenCalled();
      const spawnArgs = mockSpawn.mock.calls[0][1] as string[];
      expect(spawnArgs).toContain('--no-node-snapshot');
    });

    it('should not pass --no-node-snapshot when --node-snapshot already exists in NODE_OPTIONS', () => {
      process.env.NODE_OPTIONS = '--node-snapshot --max-old-space-size=4096';

      runBackend({
        entry: 'src/index',
      });

      // Fast-forward past the debounce delay (100ms)
      jest.advanceTimersByTime(100);

      expect(mockSpawn).toHaveBeenCalled();
      const spawnArgs = mockSpawn.mock.calls[0][1] as string[];
      expect(spawnArgs).not.toContain('--no-node-snapshot');
    });

    it('should not pass --no-node-snapshot when --node-snapshot exists in the middle of NODE_OPTIONS', () => {
      process.env.NODE_OPTIONS =
        '--max-old-space-size=4096 --node-snapshot --inspect';

      runBackend({
        entry: 'src/index',
      });

      // Fast-forward past the debounce delay (100ms)
      jest.advanceTimersByTime(100);

      expect(mockSpawn).toHaveBeenCalled();
      const spawnArgs = mockSpawn.mock.calls[0][1] as string[];
      expect(spawnArgs).not.toContain('--no-node-snapshot');
    });

    it('should pass --no-node-snapshot even with trailing spaces in NODE_OPTIONS', () => {
      process.env.NODE_OPTIONS = '--max-old-space-size=4096 ';

      runBackend({
        entry: 'src/index',
      });

      // Fast-forward past the debounce delay (100ms)
      jest.advanceTimersByTime(100);

      expect(mockSpawn).toHaveBeenCalled();
      const spawnArgs = mockSpawn.mock.calls[0][1] as string[];
      expect(spawnArgs).toContain('--no-node-snapshot');
    });

    it('should pass --no-node-snapshot alongside other option args like --inspect', () => {
      delete process.env.NODE_OPTIONS;

      runBackend({
        entry: 'src/index',
        inspectEnabled: true,
      });

      // Fast-forward past the debounce delay (100ms)
      jest.advanceTimersByTime(100);

      expect(mockSpawn).toHaveBeenCalled();
      const spawnArgs = mockSpawn.mock.calls[0][1] as string[];
      expect(spawnArgs).toContain('--no-node-snapshot');
      expect(spawnArgs).toContain('--inspect');
    });
  });
});
