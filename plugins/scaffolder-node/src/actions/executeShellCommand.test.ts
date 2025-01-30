/*
 * Copyright 2024 The Backstage Authors
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
import { LoggerService } from '@backstage/backend-plugin-api';
import { spawn } from 'child_process';
import { PassThrough, Writable } from 'stream';
import { executeShellCommand } from './executeShellCommand';

jest.mock('child_process', () => ({
  spawn: jest.fn(),
}));

describe('executeShellCommand', () => {
  let mockSpawn: jest.Mock;
  let mockProcess: any;
  let mockLogger: jest.Mocked<LoggerService>;
  let mockLogStream: Writable;

  beforeEach(() => {
    mockSpawn = spawn as jest.Mock;
    mockProcess = {
      stdout: new PassThrough(),
      stderr: new PassThrough(),
      on: jest.fn((event: string, callback: (code: number) => void) => {
        if (event === 'close') {
          callback(0);
        }
      }),
    };
    mockSpawn.mockReturnValue(mockProcess);

    mockLogStream = new PassThrough();

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should execute without logger or logStream', async () => {
    await executeShellCommand({
      command: 'echo',
      args: ['Hello World'],
    });

    expect(mockSpawn).toHaveBeenCalledWith('echo', ['Hello World'], undefined);
  });

  it('should execute with logger but no logStream', async () => {
    const logStreamSpy = jest.spyOn(mockLogStream, 'write');
    await executeShellCommand({
      command: 'echo',
      args: ['Hello World'],
      logger: mockLogger,
    });

    // Simulate command output
    mockProcess.stdout.emit('data', Buffer.from('Hello World\n'));

    mockProcess.on('close', (code: any) => {
      expect(code).toBe(0);
      expect(logStreamSpy).not.toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalledWith('Hello World');
      expect(mockLogger.error).not.toHaveBeenCalledWith(expect.anything());
    });
  });

  it('should execute with logStream but no logger', async () => {
    const logStreamSpy = jest.spyOn(mockLogStream, 'write');

    await executeShellCommand({
      command: 'echo',
      args: ['Hello World'],
      logStream: mockLogStream,
    });

    mockProcess.stdout.emit('data', Buffer.from('Hello World\n'));
    mockProcess.stderr.emit('data', Buffer.from('Command not found\n'));

    mockProcess.on('close', () => {
      expect(logStreamSpy).toHaveBeenCalledWith(expect.any(Buffer));
      expect(logStreamSpy).toHaveBeenCalledTimes(2);
      expect(mockLogger.info).not.toHaveBeenCalled();
    });
  });

  it('should execute with both logger and logStream', async () => {
    const logStreamSpy = jest.spyOn(mockLogStream, 'write');

    await executeShellCommand({
      command: 'echo',
      args: ['Hello World'],
      logger: mockLogger,
      logStream: mockLogStream,
    });

    mockProcess.stdout.emit('data', Buffer.from('Hello World\n'));
    mockProcess.stderr.emit('data', Buffer.from('Command not found\n'));

    mockProcess.on('close', () => {
      expect(mockLogger.info).toHaveBeenCalledWith('Hello World');
      expect(mockLogger.error).toHaveBeenCalledWith('Command not found');
      expect(logStreamSpy).toHaveBeenCalledTimes(2);
    });
  });

  it('should handle non-zero exit code', async () => {
    mockProcess.on.mockImplementation(
      (event: string, callback: (arg0: number) => void) => {
        if (event === 'close') {
          callback(1); // Simulate command failing
        }
      },
    );

    await expect(
      executeShellCommand({
        command: 'echo',
        args: ['Hello World'],
        logger: mockLogger,
      }),
    ).rejects.toThrow('Command echo failed, exit code: 1');
  });
});
