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

import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import { buildMemberOf, buildOrgHierarchy } from './org';

function g(
  name: string,
  namespace: string,
  parent: string | undefined,
  children: string[],
): GroupEntity {
  return {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Group',
    metadata: { name, namespace },
    spec: { type: 'team', parent, children },
  };
}

describe('buildOrgHierarchy', () => {
  it('adds groups to their parent.children', () => {
    const a = g('a', 'a-namespace', undefined, []);
    const b = g('b', 'b-namespace', 'group:a-namespace/a', []);
    const c = g('c', 'c-namespace', 'group:b-namespace/b', []);
    const d = g('d', 'd-namespace', 'group:a-namespace/a', []);
    buildOrgHierarchy([a, b, c, d]);
    expect(a.spec.children).toEqual(
      expect.arrayContaining(['group:b-namespace/b', 'group:d-namespace/d']),
    );
    expect(b.spec.children).toEqual(
      expect.arrayContaining(['group:c-namespace/c']),
    );
    expect(c.spec.children).toEqual([]);
    expect(d.spec.children).toEqual([]);
  });

  it('sets parent of groups children', () => {
    const a = g('a', 'a-namespace', undefined, [
      'group:b-namespace/b',
      'group:d-namespace/d',
    ]);
    const b = g('b', 'b-namespace', undefined, ['group:c-namespace/c']);
    const c = g('c', 'c-namespace', undefined, []);
    const d = g('d', 'd-namespace', undefined, []);
    buildOrgHierarchy([a, b, c, d]);
    expect(a.spec.parent).toBeUndefined();
    expect(b.spec.parent).toBe('group:a-namespace/a');
    expect(c.spec.parent).toBe('group:b-namespace/b');
    expect(d.spec.parent).toBe('group:a-namespace/a');
  });
});

describe('buildMemberOf', () => {
  it('fills indirect member of groups', () => {
    const a = g('a', 'a-namespace', undefined, []);
    const b = g('b', 'b-namespace', 'group:a-namespace/a', []);
    const c = g('c', 'c-namespace', 'group:b-namespace/b', []);
    const u: UserEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: { name: 'n' },
      spec: { profile: {}, memberOf: ['group:c-namespace/c'] },
    };

    const groups = [a, b, c];
    buildOrgHierarchy(groups);
    buildMemberOf(groups, [u]);
    expect(u.spec.memberOf).toEqual(
      expect.arrayContaining([
        'group:a-namespace/a',
        'group:b-namespace/b',
        'group:c-namespace/c',
      ]),
    );
  });

  it('takes group spec.members into account', () => {
    const a = g('a', 'a-namespace', undefined, []);
    const b = g('b', 'b-namespace', 'group:a-namespace/a', []);
    const c = g('c', 'c-namespace', 'group:b-namespace/b', []);
    c.spec.members = ['user:default/n'];
    const u: UserEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: { name: 'n' },
      spec: { profile: {}, memberOf: [] },
    };

    const groups = [a, b, c];
    buildOrgHierarchy(groups);
    buildMemberOf(groups, [u]);
    expect(u.spec.memberOf).toEqual(
      expect.arrayContaining([
        'group:a-namespace/a',
        'group:b-namespace/b',
        'group:c-namespace/c',
      ]),
    );
  });

  it('is not affected by `:` or `/` in the group or user name', () => {
    const a = g('a:a/a', 'a-namespace', undefined, []);
    const b = g('b:b/b', 'b-namespace', 'group:a-namespace/a:a/a', []);
    const c = g('c:c/c', 'c-namespace', 'group:b-namespace/b:b/b', []);
    c.spec.members = ['user:default/n:n/n'];
    const u: UserEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: { name: 'n:n/n' },
      spec: { profile: {}, memberOf: [] },
    };

    const groups = [a, b, c];
    buildOrgHierarchy(groups);
    buildMemberOf(groups, [u]);
    expect(u.spec.memberOf).toEqual(
      expect.arrayContaining([
        'group:a-namespace/a:a/a',
        'group:b-namespace/b:b/b',
        'group:c-namespace/c:c/c',
      ]),
    );
  });
});
