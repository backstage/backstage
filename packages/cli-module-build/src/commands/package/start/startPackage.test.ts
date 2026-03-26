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

import { createMockDirectory } from '@backstage/backend-test-utils';
import { resolveEntryPath } from './startPackage';

describe('resolveEntryPath', () => {
  const mockDir = createMockDirectory();

  afterEach(() => {
    mockDir.clear();
  });

  it('should remove file extensions', () => {
    mockDir.setContent({
      'dev/custom.tsx': '// dev app code',
    });

    const result = resolveEntryPath('dev/custom.tsx', mockDir.path);

    expect(result).toBe('dev/custom');
  });

  it('should remove trailing slashes', () => {
    mockDir.setContent({
      'dev/alpha.ts': '// dev app code',
    });

    const result = resolveEntryPath('dev/alpha/', mockDir.path);

    expect(result).toBe('dev/alpha');
  });

  it('should handle multiple dots in filename', () => {
    mockDir.setContent({
      'index.alpha.ts': 'export const data = {};',
    });

    const result = resolveEntryPath('index.alpha.ts', mockDir.path);

    expect(result).toBe('index.alpha');
  });

  it('should handle simple directory names', () => {
    mockDir.setContent({
      'dev/index.ts': '// dev app code',
    });

    const result = resolveEntryPath('dev', mockDir.path);

    expect(result).toBe('dev/index');
  });

  it('should handle nested directory paths', () => {
    mockDir.setContent({
      'dev/alpha/index.ts': '// dev app code',
    });

    const result = resolveEntryPath('dev/alpha', mockDir.path);

    expect(result).toBe('dev/alpha/index');
  });

  it('should return the file when there is a directory with the same name', () => {
    mockDir.setContent({
      'dev/alpha.ts': '// dev app code',
      'dev/app-config.yaml': '// dev app config',
      'dev/alpha/index.ts': '// dev app code',
      'dev/alpha/app-config.yaml': '// dev app config',
    });

    const result = resolveEntryPath('dev/alpha', mockDir.path);

    expect(result).toBe('dev/alpha');
  });
});
