/*
 * Copyright 2022 The Backstage Authors
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
import { findRoleFromCommand } from './role';

const mockDir = createMockDirectory();
overrideTargetPaths(mockDir.path);

describe('findRoleFromCommand', () => {
  beforeEach(() => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        name: 'test',
        backstage: {
          role: 'web-library',
        },
      }),
    });
  });

  it('provides role info by role', async () => {
    await expect(findRoleFromCommand({})).resolves.toEqual('web-library');

    await expect(
      findRoleFromCommand({ role: 'node-library' }),
    ).resolves.toEqual('node-library');

    await expect(findRoleFromCommand({ role: 'invalid' })).rejects.toThrow(
      `Unknown package role 'invalid'`,
    );
  });
});
