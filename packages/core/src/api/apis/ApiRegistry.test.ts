/*
 * Copyright 2020 Spotify AB
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

import ApiRegistry from './ApiRegistry';
import ApiRef from './ApiRef';

describe('ApiRegistry', () => {
  const x1Ref = new ApiRef<number>({ id: 'x', description: '' });
  const x2Ref = new ApiRef<string>({ id: 'x', description: '' });

  it('should be created', () => {
    const registry = ApiRegistry.from([]);
    expect(registry.get(x1Ref)).toBe(undefined);
  });

  it('should be created with APIs', () => {
    const registry = ApiRegistry.from([
      [x1Ref, 3],
      [x2Ref, 'y'],
    ]);
    expect(registry.get(x1Ref)).toBe(3);
    expect(registry.get(x2Ref)).toBe('y');
  });

  it('should be built', () => {
    const registry = ApiRegistry.builder().build();
    expect(registry.get(x1Ref)).toBe(undefined);
  });

  it('should be built with APIs', () => {
    const builder = ApiRegistry.builder();
    builder.add(x1Ref, 3);
    builder.add(x2Ref, 'y');

    const registry = builder.build();
    expect(registry.get(x1Ref)).toBe(3);
    expect(registry.get(x2Ref)).toBe('y');
  });
});
