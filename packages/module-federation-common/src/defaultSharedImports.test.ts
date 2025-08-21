/*
 * Copyright 2025 The Backstage Authors
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

import { defaultSharedImports } from './defaultSharedImports';
import { getSharedImportsInconsistentVersions } from './getSharedImportsInconsistentVersions';

describe('defaultSharedImports', () => {
  it('should have versions that match installed package versions', () => {
    expect(
      getSharedImportsInconsistentVersions(
        './defaultSharedImports',
        m => m.defaultSharedImports,
      ),
    ).toEqual([]);
  });

  it('should have module functions that can be imported', async () => {
    for (const sharedImport of defaultSharedImports) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(typeof sharedImport.module).toBe('function');

      // Test that the module function returns a Promise
      const modulePromise = sharedImport.module();
      expect(modulePromise).toBeInstanceOf(Promise);
    }
  });

  it('should have unique package names', () => {
    const packageNames = defaultSharedImports.map(imp => imp.name);
    const uniqueNames = new Set(packageNames);

    expect(uniqueNames.size).toBe(packageNames.length);
  });
});
