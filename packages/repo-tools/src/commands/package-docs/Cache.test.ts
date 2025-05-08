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

import { Lockfile } from '@backstage/cli-node';
import { PackageDocsCache } from './Cache';
import { join as joinPath } from 'path';
import {
  createMockDirectory,
  MockDirectory,
} from '@backstage/backend-test-utils';

describe('PackageDocsCache', () => {
  let testDir: MockDirectory;
  beforeEach(async () => {
    testDir = createMockDirectory();
  });
  it('should be able to parse cache files', async () => {
    const cache = await PackageDocsCache.loadAsync(
      joinPath(__dirname, 'test-cache'),
      new Lockfile(),
    );
    cache.add('test', 'test');
  });
});
