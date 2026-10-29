/*
 * Copyright 2026 The Backstage Authors
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

/** @jest-environment node */

import { spawnSync } from 'node:child_process';

it('exits immediately on development interrupts but preserves graceful restart and standalone signal handlers', () => {
  for (const channel of ['1', '']) {
    for (const event of ['SIGINT', 'SIGTERM', 'restart']) {
      const result = spawnSync(
        process.execPath,
        [
          '--eval',
          `
        require(${JSON.stringify(
          require.resolve('../config/nodeTransform.cjs'),
        )});
        process.on('SIGINT', () => {
          console.log('shutdown hook');
          process.exit(0);
        });
        process.on('SIGTERM', () => {
          console.log('shutdown hook');
          process.exit(0);
        });
        if (${JSON.stringify(event)} === 'restart') {
          process.emit('message', { type: '@backstage/cli/channel/shutdown' });
          process.exit(0);
        }
        process.emit(${JSON.stringify(event)}, ${JSON.stringify(event)});
      `,
        ],
        {
          encoding: 'utf8',
          env: { ...process.env, BACKSTAGE_CLI_CHANNEL: channel },
          timeout: 10_000,
        },
      );
      expect(result.error).toBeUndefined();
      expect(result.stderr).toBe('');
      expect(result.status).toBe(
        channel === '1' && event === 'SIGINT' ? 130 : 0,
      );
      expect(result.stdout.includes('shutdown hook')).toBe(
        channel === '1' ? event !== 'SIGINT' : event !== 'restart',
      );
    }
  }
});
