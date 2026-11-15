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

import { createMockDirectory } from '@backstage/backend-test-utils';
import { createBinRunner } from './util';

describe('createBinRunner', () => {
  const mockDir = createMockDirectory();
  const originalForceColor = process.env.FORCE_COLOR;

  afterEach(() => {
    if (originalForceColor === undefined) {
      delete process.env.FORCE_COLOR;
    } else {
      process.env.FORCE_COLOR = originalForceColor;
    }
  });

  it('runs commands without color, even if FORCE_COLOR is set', async () => {
    mockDir.setContent({
      'print-env.js': `console.log(JSON.stringify({ forceColor: process.env.FORCE_COLOR, noColor: process.env.NO_COLOR }));`,
    });
    process.env.FORCE_COLOR = '3';

    const run = createBinRunner(mockDir.path, mockDir.resolve('print-env.js'));

    await expect(run().then(out => JSON.parse(out))).resolves.toEqual({
      noColor: '1',
    });
  });
});
