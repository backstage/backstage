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

import { run, runOutput, runCheck } from './run';
import { ExitCodeError } from './errors';

describe('run', () => {
  const activeChildren: Array<{ kill: () => void }> = [];

  afterEach(() => {
    // Clean up any active child processes
    activeChildren.forEach(child => {
      try {
        child.kill();
      } catch {
        // Ignore errors during cleanup
      }
    });
    activeChildren.length = 0;
    jest.restoreAllMocks();
  });

  describe('run', () => {
    it('should throw error for empty args', () => {
      expect(() => run([])).toThrow('run requires at least one argument');
    });

    it('should run a successful command', async () => {
      const child = run(['node', '--version']);
      activeChildren.push(child);
      await expect(child.waitForExit()).resolves.not.toThrow();
    });

    it('should throw ExitCodeError for non-zero exit code', async () => {
      const child = run(['node', '--eval', 'process.exit(1)']);
      activeChildren.push(child);
      await expect(child.waitForExit()).rejects.toThrow(ExitCodeError);
      await expect(child.waitForExit()).rejects.toThrow(
        /Command 'node --eval process\.exit\(1\)' exited with code 1/,
      );
    });

    it('should call onStdout callback', async () => {
      const stdoutChunks: Buffer[] = [];
      const child = run(['node', '--version'], {
        onStdout: data => stdoutChunks.push(data),
      });
      activeChildren.push(child);
      await child.waitForExit();
      expect(stdoutChunks.length).toBeGreaterThan(0);
      const output = Buffer.concat(stdoutChunks).toString();
      expect(output).toMatch(/v\d+\.\d+\.\d+/);
    });

    it('should call onStderr callback', async () => {
      const stderrChunks: Buffer[] = [];
      const child = run(['node', '--eval', 'console.error("test error")'], {
        onStderr: data => stderrChunks.push(data),
      });
      activeChildren.push(child);
      await child.waitForExit();
      expect(stderrChunks.length).toBeGreaterThan(0);
      const output = Buffer.concat(stderrChunks).toString();
      expect(output).toContain('test error');
    });

    it('should use custom stdio', async () => {
      const child = run(['node', '--version'], {
        stdio: 'pipe',
      });
      activeChildren.push(child);
      expect(child.stdout).toBeTruthy();
      expect(child.stderr).toBeTruthy();
      await child.waitForExit();
    });

    it('should use custom env', async () => {
      const customEnv = { CUSTOM_VAR: 'test-value' };
      const child = run(
        ['node', '--eval', 'console.log(process.env.CUSTOM_VAR)'],
        {
          env: customEnv,
          onStdout: data => {
            const output = data.toString();
            expect(output).toContain('test-value');
          },
        },
      );
      activeChildren.push(child);
      await child.waitForExit();
    });

    it('should set FORCE_COLOR in env', async () => {
      const child = run(
        ['node', '--eval', 'console.log(process.env.FORCE_COLOR)'],
        {
          onStdout: data => {
            const output = data.toString();
            expect(output.trim()).toBe('true');
          },
        },
      );
      activeChildren.push(child);
      await child.waitForExit();
    });

    it('should handle process already exited', async () => {
      const child = run(['node', '--version']);
      activeChildren.push(child);
      // Wait for it to complete
      await child.waitForExit();
      // Call waitForExit again - should return immediately
      await expect(child.waitForExit()).resolves.not.toThrow();
    });

    it('should handle multiple simultaneous calls to waitForExit', async () => {
      const child = run(['node', '--version']);
      activeChildren.push(child);
      // Call waitForExit multiple times simultaneously
      const [result1, result2, result3] = await Promise.all([
        child.waitForExit(),
        child.waitForExit(),
        child.waitForExit(),
      ]);
      // All should resolve successfully
      expect(result1).toBeUndefined();
      expect(result2).toBeUndefined();
      expect(result3).toBeUndefined();
    });

    it('should handle multiple simultaneous calls to waitForExit with error', async () => {
      const child = run(['node', '--eval', 'process.exit(1)']);
      activeChildren.push(child);
      // Call waitForExit multiple times simultaneously
      const promises = [
        child.waitForExit(),
        child.waitForExit(),
        child.waitForExit(),
      ];
      // All should reject with the same error
      for (const promise of promises) {
        await expect(promise).rejects.toThrow(ExitCodeError);
        await expect(promise).rejects.toThrow(
          /Command 'node --eval process\.exit\(1\)' exited with code 1/,
        );
      }
    });

    it('should handle signal handlers cleanup', async () => {
      const child = run(['node', '--version']);
      activeChildren.push(child);
      const originalListeners = process.listenerCount('SIGINT');
      await child.waitForExit();
      // Signal handlers should be cleaned up
      expect(process.listenerCount('SIGINT')).toBe(originalListeners);
    });

    it('should kill child process on SIGINT', async () => {
      const child = run(['node', '--eval', 'setTimeout(() => {}, 10000)']);
      activeChildren.push(child);
      const killSpy = jest.spyOn(child, 'kill');
      // Start waiting (this registers signal handlers)
      const waitPromise = child.waitForExit();
      // Simulate SIGINT
      process.emit('SIGINT' as any, 'SIGINT');
      // Give it a moment
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(killSpy).toHaveBeenCalled();
      killSpy.mockRestore();
      // Clean up
      child.kill();
      // Wait for cleanup
      try {
        await Promise.race([
          waitPromise,
          new Promise(resolve => setTimeout(resolve, 100)),
        ]);
      } catch {
        // Expected to fail
      }
    });

    it('should kill child process on SIGTERM', async () => {
      const child = run(['node', '--eval', 'setTimeout(() => {}, 10000)']);
      activeChildren.push(child);
      const killSpy = jest.spyOn(child, 'kill');
      // Start waiting (this registers signal handlers)
      const waitPromise = child.waitForExit();
      // Simulate SIGTERM
      process.emit('SIGTERM' as any, 'SIGTERM');
      // Give it a moment
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(killSpy).toHaveBeenCalled();
      killSpy.mockRestore();
      // Clean up
      child.kill();
      // Wait for cleanup
      try {
        await Promise.race([
          waitPromise,
          new Promise(resolve => setTimeout(resolve, 100)),
        ]);
      } catch {
        // Expected to fail
      }
    });

    it('should not kill already killed process on signal', async () => {
      const child = run(['node', '--version']);
      activeChildren.push(child);
      await child.waitForExit();
      const killSpy = jest.spyOn(child, 'kill');
      // Simulate SIGINT after process has exited
      process.emit('SIGINT' as any, 'SIGINT');
      await new Promise(resolve => setTimeout(resolve, 100));
      // Should not be called since process already exited
      expect(killSpy).not.toHaveBeenCalled();
      killSpy.mockRestore();
    });

    it('should handle process error', async () => {
      const child = run(['nonexistent-command-12345']);
      activeChildren.push(child);
      await expect(child.waitForExit()).rejects.toThrow();
    });
  });

  describe('runOutput', () => {
    it('should throw error for empty args', async () => {
      await expect(runOutput([])).rejects.toThrow(
        'runOutput requires at least one argument',
      );
    });

    it('should return stdout', async () => {
      const output = await runOutput([
        'node',
        '--eval',
        'console.log("test output")',
      ]);
      expect(output).toBe('test output');
    });

    it('should trim output', async () => {
      const output = await runOutput([
        'node',
        '--eval',
        'console.log("  test output  ")',
      ]);
      expect(output).toBe('test output');
    });

    it('should attach stdout to error on failure', async () => {
      let error: Error | undefined;
      try {
        await runOutput([
          'node',
          '--eval',
          'console.log("stdout before error"); process.exit(1)',
        ]);
      } catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(ExitCodeError);
      expect((error as Error & { stdout?: string }).stdout).toContain(
        'stdout before error',
      );
    });

    it('should attach stderr to error on failure', async () => {
      let error: Error | undefined;
      try {
        await runOutput([
          'node',
          '--eval',
          'console.error("stderr error"); process.exit(1)',
        ]);
      } catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(ExitCodeError);
      expect((error as Error & { stderr?: string }).stderr).toContain(
        'stderr error',
      );
    });

    it('should call custom onStdout callback', async () => {
      const customChunks: Buffer[] = [];
      const output = await runOutput(
        ['node', '--eval', 'console.log("test")'],
        {
          onStdout: data => customChunks.push(data),
        },
      );
      expect(output).toBe('test');
      expect(customChunks.length).toBeGreaterThan(0);
    });

    it('should call custom onStderr callback', async () => {
      const customChunks: Buffer[] = [];
      await runOutput(
        ['node', '--eval', 'console.error("error"); console.log("ok")'],
        {
          onStderr: data => customChunks.push(data),
        },
      );
      expect(customChunks.length).toBeGreaterThan(0);
      const errorOutput = Buffer.concat(customChunks).toString();
      expect(errorOutput).toContain('error');
    });
  });

  describe('runCheck', () => {
    it('should return true for successful command', async () => {
      const result = await runCheck(['node', '--version']);
      expect(result).toBe(true);
    });

    it('should return false for failed command', async () => {
      const result = await runCheck(['node', '--eval', 'process.exit(1)']);
      expect(result).toBe(false);
    });

    it('should return false for nonexistent command', async () => {
      const result = await runCheck(['nonexistent-command-12345']);
      expect(result).toBe(false);
    });
  });
});
