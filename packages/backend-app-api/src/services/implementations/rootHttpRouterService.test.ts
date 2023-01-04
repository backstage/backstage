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

import { findConflictingPath } from './rootHttpRouterService';

describe('findConflictingPath', () => {
  it('finds conflicts when present', () => {
    expect(findConflictingPath(['/a'], '/a')).toBe('/a');
    expect(findConflictingPath(['/b'], '/a')).toBe(undefined);
    expect(findConflictingPath(['/a'], '/a/b')).toBe('/a');
    expect(findConflictingPath(['/a'], '/aa/b')).toBe(undefined);
    expect(findConflictingPath(['/aa'], '/a/b')).toBe(undefined);
    expect(findConflictingPath(['/a/b'], '/a')).toBe('/a/b');
    expect(findConflictingPath(['/a/b'], '/aa')).toBe(undefined);
    expect(findConflictingPath(['/b/a'], '/a')).toBe(undefined);
    expect(findConflictingPath(['/a'], '/aa')).toBe(undefined);
  });
});
