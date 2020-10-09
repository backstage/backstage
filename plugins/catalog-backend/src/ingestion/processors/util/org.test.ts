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

import { GroupEntity } from '@backstage/catalog-model';
import { buildOrgHierarchy } from './org';

function g(
  name: string,
  parent: string | undefined,
  children: string[],
): GroupEntity {
  return {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Group',
    metadata: { name },
    spec: { type: 'team', parent, children, ancestors: [], descendants: [] },
  };
}

describe('buildOrgHierarchy', () => {
  it('adds groups to their parent.children', () => {
    const a = g('a', undefined, []);
    const b = g('b', 'a', []);
    const c = g('c', 'b', []);
    const d = g('d', 'a', []);
    buildOrgHierarchy([a, b, c, d]);
    expect(a.spec.children).toEqual(expect.arrayContaining(['b', 'd']));
    expect(b.spec.children).toEqual(expect.arrayContaining(['c']));
    expect(c.spec.children).toEqual([]);
    expect(d.spec.children).toEqual([]);
  });

  it('fills out descendants', () => {
    const a = g('a', undefined, []);
    const b = g('b', 'a', []);
    const c = g('c', 'b', []);
    const d = g('d', 'a', []);
    buildOrgHierarchy([a, b, c, d]);
    expect(a.spec.descendants).toEqual(expect.arrayContaining(['b', 'c', 'd']));
    expect(b.spec.descendants).toEqual(expect.arrayContaining(['c']));
    expect(c.spec.descendants).toEqual([]);
    expect(d.spec.descendants).toEqual([]);
  });

  it('fills out ancestors', () => {
    const a = g('a', undefined, []);
    const b = g('b', 'a', []);
    const c = g('c', 'b', []);
    const d = g('d', 'a', []);
    buildOrgHierarchy([a, b, c, d]);
    expect(a.spec.ancestors).toEqual([]);
    expect(b.spec.ancestors).toEqual(expect.arrayContaining(['a']));
    expect(c.spec.ancestors).toEqual(expect.arrayContaining(['a', 'b']));
    expect(d.spec.ancestors).toEqual(expect.arrayContaining(['a']));
  });
});
