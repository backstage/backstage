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
import { overrideTargetPaths } from '@backstage/cli-common/testUtils';
import { tryRunPrettier, tryRunPrettierAsync } from './tryRunPrettier';

describe('tryRunPrettier', () => {
  const mockDir = createMockDirectory();

  it('leaves content unformatted when the project does not have prettier', async () => {
    mockDir.setContent({ 'package.json': JSON.stringify({ name: 'root' }) });
    overrideTargetPaths(mockDir.path);

    const content = '#   Title\n\n\n\ntext';
    expect(tryRunPrettier(content)).toBe(content);
    await expect(tryRunPrettierAsync(content)).resolves.toBe(content);
  });
});
