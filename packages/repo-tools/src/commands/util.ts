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

import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { openSync, closeSync, readFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Matches ANSI SGR escape sequences (e.g. bold, color, reset)
const ansiPattern = new RegExp(`${String.fromCharCode(0x1b)}\\[[0-9;]*m`, 'g');

/**
 * Redirect stdout to a temp file so that output is captured reliably even when
 * child processes call process.exit() before async buffers have been flushed.
 *
 * Uses async spawn so that multiple invocations can run concurrently when
 * combined with a concurrency limiter.
 */
export function createBinRunner(cwd: string, path: string) {
  return (...command: string[]) => {
    return new Promise<string>((resolve, reject) => {
      const args = path ? [path, ...command] : command;
      const outPath = join(tmpdir(), `backstage-cli-out-${randomUUID()}.txt`);
      const outFd = openSync(outPath, 'w');

      const child = spawn('node', args, {
        cwd,
        env: { ...process.env, NO_COLOR: '1' },
        stdio: ['ignore', outFd, 'pipe'],
      });

      // The fd is duplicated by the OS for the child process, so we can
      // close our copy immediately after spawn.
      closeSync(outFd);

      const stderrChunks: Buffer[] = [];
      child.stderr?.on('data', chunk => stderrChunks.push(chunk));

      child.on('error', err => {
        try {
          unlinkSync(outPath);
        } catch {
          /* ignore cleanup errors */
        }
        reject(new Error(`Process error: ${err.message}`));
      });

      child.on('close', (code, signal) => {
        try {
          const stdout = readFileSync(outPath, 'utf8').replace(ansiPattern, '');
          const stderr = Buffer.concat(stderrChunks).toString();

          if (signal) {
            reject(
              new Error(`Process was killed with signal ${signal}\n${stderr}`),
            );
          } else if (code !== 0) {
            reject(new Error(`Process exited with code ${code}\n${stderr}`));
          } else if (stderr.trim()) {
            reject(new Error(`Command printed error output: ${stderr}`));
          } else {
            resolve(stdout);
          }
        } finally {
          try {
            unlinkSync(outPath);
          } catch {
            /* ignore cleanup errors */
          }
        }
      });
    });
  };
}
