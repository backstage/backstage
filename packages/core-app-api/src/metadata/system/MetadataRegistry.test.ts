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

import { createMetadataRef } from '@backstage/core-plugin-api';
import { MetadataRegistry } from './MetadataRegistry';

describe('MetadataRegistry', () => {
  const x1Ref = createMetadataRef<number>({ id: 'x1' });
  const x1DuplicateRef = createMetadataRef<number>({ id: 'x1' });
  const x2Ref = createMetadataRef<string>({ id: 'x2' });

  it('should be created', () => {
    const registry = MetadataRegistry.from([]);
    expect(registry.get(x1Ref)).toBe(undefined);
  });

  it('should be created with metadata', () => {
    const registry = MetadataRegistry.from([
      [x1Ref, 3],
      [x2Ref, 'y'],
    ]);
    expect(registry.get(x1Ref)).toBe(3);
    expect(registry.get(x1DuplicateRef)).toBe(3);
    expect(registry.get(x2Ref)).toBe('y');
  });
});
