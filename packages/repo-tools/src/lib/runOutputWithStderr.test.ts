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

import { runOutputWithStderr } from './runOutputWithStderr';

describe('runOutputWithStderr', () => {
  it('returns stdout on success and includes stderr in failures', async () => {
    await expect(
      runOutputWithStderr(['node', '-e', 'console.log("ok")']),
    ).resolves.toBe('ok');

    await expect(
      runOutputWithStderr([
        'node',
        '-e',
        'console.error("boom details"); process.exit(3)',
      ]),
    ).rejects.toThrow(/boom details/);
  });
});
