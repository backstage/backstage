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
    let closeCallback: ((code: number) => void) | undefined;
    mockProcess = {
      stdout: new PassThrough(),
      stderr: new PassThrough(),
      on: jest.fn((event: string, callback: (code: number) => void) => {
        if (event === 'close') {
          closeCallback = callback;
          // Don't call immediately, allow tests to control when it's called
        }
      }),
      emitClose: (code: number = 0) => {
        if (closeCallback) {
          closeCallback(code);
        }
      },
    };
    mockSpawn.mockReturnValue(mockProcess);

    mockLogStream = new PassThrough();

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      child: jest.fn(),
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
    const promise = executeShellCommand({
      command: 'echo',
      args: ['Hello World'],
      logger: mockLogger,
    });

    // Simulate command output
    mockProcess.stdout.emit('data', Buffer.from('Hello World\n'));
    mockProcess.emitClose(0);

    await promise;

    expect(logStreamSpy).not.toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalledWith('Hello World');
    expect(mockLogger.error).not.toHaveBeenCalledWith(expect.anything());
  });

  it('should execute with logStream but no logger', async () => {
    const logStreamSpy = jest.spyOn(mockLogStream, 'write');

    const promise = executeShellCommand({
      command: 'echo',
      args: ['Hello World'],
      logStream: mockLogStream,
    });

    mockProcess.stdout.emit('data', Buffer.from('Hello World\n'));
    mockProcess.stderr.emit('data', Buffer.from('Command not found\n'));
    mockProcess.emitClose(0);

    await promise;

    expect(logStreamSpy).toHaveBeenCalledWith(expect.any(Buffer));
    expect(logStreamSpy).toHaveBeenCalledTimes(2);
    expect(mockLogger.info).not.toHaveBeenCalled();
  });

  it('should execute with both logger and logStream', async () => {
    const logStreamSpy = jest.spyOn(mockLogStream, 'write');

    const promise = executeShellCommand({
      command: 'echo',
      args: ['Hello World'],
      logger: mockLogger,
      logStream: mockLogStream,
    });

    mockProcess.stdout.emit('data', Buffer.from('Hello World\n'));
    mockProcess.stderr.emit('data', Buffer.from('Command not found\n'));
    mockProcess.emitClose(0);

    await promise;

    expect(mockLogger.info).toHaveBeenCalledWith('Hello World');
    expect(mockLogger.error).toHaveBeenCalledWith('Command not found');
    expect(logStreamSpy).toHaveBeenCalledTimes(2);
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

  describe('stderr logging configuration', () => {
    it('should default to logging stderr as error (backward compatibility)', async () => {
      const promise = executeShellCommand({
        command: 'test',
        args: [],
        logger: mockLogger,
      });

      // Emit stderr before resolving
      mockProcess.stderr.emit('data', Buffer.from('Some stderr message\n'));
      mockProcess.emitClose(0);

      await promise;

      expect(mockLogger.error).toHaveBeenCalledWith('Some stderr message');
      expect(mockLogger.info).not.toHaveBeenCalled();
      expect(mockLogger.warn).not.toHaveBeenCalled();
      expect(mockLogger.debug).not.toHaveBeenCalled();
    });

    it('should log stderr as info when configured', async () => {
      const promise = executeShellCommand({
        command: 'test',
        args: [],
        logger: mockLogger,
        stderrLogging: { level: 'info' },
      });

      mockProcess.stderr.emit('data', Buffer.from('Verbose output\n'));
      mockProcess.emitClose(0);

      await promise;

      expect(mockLogger.info).toHaveBeenCalledWith('Verbose output');
      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(mockLogger.warn).not.toHaveBeenCalled();
      expect(mockLogger.debug).not.toHaveBeenCalled();
    });

    it('should log stderr as warn when configured', async () => {
      const promise = executeShellCommand({
        command: 'test',
        args: [],
        logger: mockLogger,
        stderrLogging: { level: 'warn' },
      });

      mockProcess.stderr.emit('data', Buffer.from('Warning message\n'));
      mockProcess.emitClose(0);

      await promise;

      expect(mockLogger.warn).toHaveBeenCalledWith('Warning message');
      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(mockLogger.info).not.toHaveBeenCalled();
      expect(mockLogger.debug).not.toHaveBeenCalled();
    });

    it('should log stderr as debug when configured', async () => {
      const promise = executeShellCommand({
        command: 'test',
        args: [],
        logger: mockLogger,
        stderrLogging: { level: 'debug' },
      });

      mockProcess.stderr.emit('data', Buffer.from('Debug message\n'));
      mockProcess.emitClose(0);

      await promise;

      expect(mockLogger.debug).toHaveBeenCalledWith('Debug message');
      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(mockLogger.info).not.toHaveBeenCalled();
      expect(mockLogger.warn).not.toHaveBeenCalled();
    });

    it('should use selector function to route stderr messages', async () => {
      const selector = jest.fn((message: string) => {
        if (message.includes('ERROR')) return 'error';
        if (message.includes('WARN')) return 'warn';
        if (message.includes('DEBUG')) return 'debug';
        return 'info';
      });

      const promise = executeShellCommand({
        command: 'test',
        args: [],
        logger: mockLogger,
        stderrLogging: { selector },
      });

      mockProcess.stderr.emit(
        'data',
        Buffer.from('This is an ERROR message\n'),
      );
      mockProcess.stderr.emit('data', Buffer.from('This is a WARN message\n'));
      mockProcess.stderr.emit('data', Buffer.from('This is a DEBUG message\n'));
      mockProcess.stderr.emit('data', Buffer.from('Normal info message\n'));
      mockProcess.emitClose(0);

      await promise;

      expect(mockLogger.error).toHaveBeenCalledWith('This is an ERROR message');
      expect(mockLogger.warn).toHaveBeenCalledWith('This is a WARN message');
      expect(mockLogger.debug).toHaveBeenCalledWith('This is a DEBUG message');
      expect(mockLogger.info).toHaveBeenCalledWith('Normal info message');
      expect(selector).toHaveBeenCalledTimes(4);
    });

    it('should skip logging when selector returns null', async () => {
      const promise = executeShellCommand({
        command: 'test',
        args: [],
        logger: mockLogger,
        stderrLogging: {
          selector: () => null,
        },
      });

      mockProcess.stderr.emit('data', Buffer.from('Skip this message\n'));
      mockProcess.emitClose(0);

      await promise;

      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(mockLogger.info).not.toHaveBeenCalled();
      expect(mockLogger.warn).not.toHaveBeenCalled();
      expect(mockLogger.debug).not.toHaveBeenCalled();
    });

    it('should skip empty stderr messages', async () => {
      const promise = executeShellCommand({
        command: 'test',
        args: [],
        logger: mockLogger,
        stderrLogging: { level: 'info' },
      });

      mockProcess.stderr.emit('data', Buffer.from('   \n'));
      mockProcess.stderr.emit('data', Buffer.from(''));
      mockProcess.emitClose(0);

      await promise;

      expect(mockLogger.info).not.toHaveBeenCalled();
      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(mockLogger.warn).not.toHaveBeenCalled();
      expect(mockLogger.debug).not.toHaveBeenCalled();
    });

    it('should handle multiple stderr chunks correctly', async () => {
      const promise = executeShellCommand({
        command: 'test',
        args: [],
        logger: mockLogger,
        stderrLogging: { level: 'info' },
      });

      mockProcess.stderr.emit('data', Buffer.from('First message\n'));
      mockProcess.stderr.emit('data', Buffer.from('Second message\n'));
      mockProcess.emitClose(0);

      await promise;

      expect(mockLogger.info).toHaveBeenCalledWith('First message');
      expect(mockLogger.info).toHaveBeenCalledWith('Second message');
      expect(mockLogger.info).toHaveBeenCalledTimes(2);
    });
  });
});
