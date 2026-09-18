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

import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import merge from 'lodash/merge';
import {
  LDAP_DN_ANNOTATION,
  LDAP_RDN_ANNOTATION,
  LDAP_UUID_ANNOTATION,
} from './constants';
import { resolveOrgRelations } from './relations';
import { RecursivePartial } from './util';

function user(data: RecursivePartial<UserEntity>): UserEntity {
  return merge(
    {},
    {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: { name: 'name', annotations: {} },
      spec: { profile: {}, memberOf: [] },
    } as UserEntity,
    data,
  );
}

function group(data: RecursivePartial<GroupEntity>): GroupEntity {
  return merge(
    {},
    {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: { name: 'name', annotations: {} },
      spec: { type: 'type', children: [] },
    } as GroupEntity,
    data,
  );
}

const emptyRelations = () => ({
  userMemberOf: new Map<string, Set<string>>(),
  groupMemberOf: new Map<string, Set<string>>(),
  groupMember: new Map<string, Set<string>>(),
});

describe('resolveOrgRelations', () => {
  it('yields while indexing a large organization', async () => {
    const groups = Array.from({ length: 1_001 }, (_, index) =>
      group({ metadata: { name: `group-${index}` } }),
    );
    let timerRan = false;
    setImmediate(() => {
      timerRan = true;
    });

    await resolveOrgRelations(groups, [], emptyRelations());

    expect(timerRan).toBe(true);
  });

  it('yields while resolving relation sources without edges', async () => {
    const userMemberOf = new Map(
      Array.from({ length: 1_001 }, (_, index) => [
        `user-${index}`,
        new Set<string>(),
      ]),
    );
    let timerRan = false;
    setImmediate(() => {
      timerRan = true;
    });

    await resolveOrgRelations([], [], {
      userMemberOf,
      groupMemberOf: new Map(),
      groupMember: new Map(),
    });

    expect(timerRan).toBe(true);
  });

  it('continues yielding while resolving dense relation edges', async () => {
    const parent = group({
      metadata: {
        name: 'parent',
        annotations: { [LDAP_DN_ANNOTATION]: 'parent' },
      },
    });
    const users = Array.from({ length: 999 }, (_, index) =>
      user({
        metadata: {
          name: `user-${index}`,
          annotations: { [LDAP_DN_ANNOTATION]: `user-${index}` },
        },
      }),
    );
    const userMemberOf = new Map(
      users.map(entity => [
        entity.metadata.annotations![LDAP_DN_ANNOTATION],
        new Set(['parent']),
      ]),
    );
    const groupMember = new Map([
      [
        'parent',
        new Set(
          users.map(entity => entity.metadata.annotations![LDAP_DN_ANNOTATION]),
        ),
      ],
    ]);
    let eventLoopTurns = 0;
    const countTurn = () => {
      eventLoopTurns += 1;
      if (eventLoopTurns < 2) {
        setImmediate(countTurn);
      }
    };
    setImmediate(countTurn);

    await resolveOrgRelations([parent], users, {
      userMemberOf,
      groupMemberOf: new Map(),
      groupMember,
    });

    expect(eventLoopTurns).toBe(2);
  });

  it('does not partially apply relations when planning fails', async () => {
    const originalParent = 'group:default/original';
    const parent = group({
      metadata: {
        name: 'parent',
        annotations: { [LDAP_DN_ANNOTATION]: 'parent' },
      },
      spec: { children: ['group:default/original-child'] },
    });
    const failingGroup = group({ metadata: { name: 'failing' } });
    Object.defineProperty(failingGroup.spec, 'children', {
      get() {
        throw new Error('fixture failure');
      },
    });
    const member = user({
      metadata: {
        name: 'member',
        annotations: { [LDAP_DN_ANNOTATION]: 'member' },
      },
      spec: { memberOf: [originalParent] },
    });

    await expect(
      resolveOrgRelations([parent, failingGroup], [member], {
        userMemberOf: new Map([['member', new Set(['parent'])]]),
        groupMemberOf: new Map(),
        groupMember: new Map(),
      }),
    ).rejects.toThrow('fixture failure');

    expect(member.spec.memberOf).toEqual([originalParent]);
    expect(parent.spec.children).toEqual(['group:default/original-child']);
  });

  it.each([LDAP_DN_ANNOTATION, LDAP_RDN_ANNOTATION, LDAP_UUID_ANNOTATION])(
    'resolves references through %s',
    async annotation => {
      const parent = group({
        metadata: { name: 'parent', annotations: { [annotation]: 'pa' } },
      });
      const child = group({
        metadata: { name: 'child', annotations: { [annotation]: 'ca' } },
      });
      const member = user({
        metadata: { name: 'member', annotations: { [annotation]: 'ma' } },
      });

      await resolveOrgRelations([parent, child], [member], {
        userMemberOf: new Map([['ma', new Set(['pa'])]]),
        groupMemberOf: new Map([['ca', new Set(['pa'])]]),
        groupMember: new Map(),
      });

      expect([parent, child, member]).toEqual([
        group({
          metadata: { name: 'parent', annotations: { [annotation]: 'pa' } },
          spec: { children: ['group:default/child'] },
        }),
        group({
          metadata: { name: 'child', annotations: { [annotation]: 'ca' } },
          spec: { parent: 'group:default/parent' },
        }),
        user({
          metadata: { name: 'member', annotations: { [annotation]: 'ma' } },
          spec: { memberOf: ['group:default/parent'] },
        }),
      ]);
    },
  );

  it('prefers an exact alias before the lowercase DN alias', async () => {
    const exact = group({
      metadata: {
        name: 'exact',
        annotations: { [LDAP_DN_ANNOTATION]: 'TEAM' },
      },
    });
    const lowercase = group({
      metadata: {
        name: 'lowercase',
        annotations: { [LDAP_DN_ANNOTATION]: 'team' },
      },
    });
    const member = user({
      metadata: {
        name: 'member',
        annotations: { [LDAP_DN_ANNOTATION]: 'USER' },
      },
    });

    await resolveOrgRelations([exact, lowercase], [member], {
      userMemberOf: new Map([['USER', new Set(['TEAM'])]]),
      groupMemberOf: new Map(),
      groupMember: new Map(),
    });

    expect(member.spec.memberOf).toEqual(['group:default/exact']);
  });

  it('lets the last indexed entity win alias collisions', async () => {
    const first = group({
      metadata: {
        name: 'first',
        annotations: { [LDAP_UUID_ANNOTATION]: 'shared' },
      },
    });
    const second = group({
      metadata: {
        name: 'second',
        annotations: { [LDAP_UUID_ANNOTATION]: 'shared' },
      },
    });
    const member = user({
      metadata: {
        name: 'member',
        annotations: { [LDAP_UUID_ANNOTATION]: 'member' },
      },
    });

    await resolveOrgRelations([first, second], [member], {
      userMemberOf: new Map([['member', new Set(['shared'])]]),
      groupMemberOf: new Map(),
      groupMember: new Map(),
    });

    expect(member.spec.memberOf).toEqual(['group:default/second']);
  });

  it('prefers users when a member alias matches both entity kinds', async () => {
    const parent = group({
      metadata: {
        name: 'parent',
        annotations: { [LDAP_DN_ANNOTATION]: 'parent' },
      },
    });
    const child = group({
      metadata: {
        name: 'child',
        annotations: { [LDAP_DN_ANNOTATION]: 'shared' },
      },
    });
    const member = user({
      metadata: {
        name: 'member',
        annotations: { [LDAP_DN_ANNOTATION]: 'shared' },
      },
    });

    await resolveOrgRelations([parent, child], [member], {
      userMemberOf: new Map(),
      groupMemberOf: new Map(),
      groupMember: new Map([['parent', new Set(['shared'])]]),
    });

    expect(member.spec.memberOf).toEqual(['group:default/parent']);
    expect(parent.spec.children).toEqual([]);
    expect(child.spec.parent).toBeUndefined();
  });

  it('ignores unknown relation references', async () => {
    const parent = group({
      metadata: {
        name: 'parent',
        annotations: { [LDAP_DN_ANNOTATION]: 'parent' },
      },
    });
    const member = user({
      metadata: {
        name: 'member',
        annotations: { [LDAP_DN_ANNOTATION]: 'member' },
      },
    });

    await resolveOrgRelations([parent], [member], {
      userMemberOf: new Map([['member', new Set(['parent', 'missing'])]]),
      groupMemberOf: new Map(),
      groupMember: new Map([['parent', new Set(['missing'])]]),
    });

    expect(member.spec.memberOf).toEqual(['group:default/parent']);
    expect(parent.spec.children).toEqual([]);
  });

  it('preserves transformer relations when LDAP has no replacement', async () => {
    const parent = group({
      metadata: { name: 'parent' },
      spec: { children: [] },
    });
    const child = group({
      metadata: { name: 'child' },
      spec: { parent: 'group:default/parent', children: [] },
    });
    const member = user({
      metadata: { name: 'member' },
      spec: { memberOf: ['group:default/child'] },
    });

    await resolveOrgRelations([parent, child], [member], emptyRelations());

    expect([parent, child, member]).toEqual([
      group({
        metadata: { name: 'parent' },
        spec: { children: ['group:default/child'] },
      }),
      group({
        metadata: { name: 'child' },
        spec: { parent: 'group:default/parent', children: [] },
      }),
      user({
        metadata: { name: 'member' },
        spec: { memberOf: ['group:default/child'] },
      }),
    ]);
  });

  it('preserves first-group-wins behavior for multiple parents', async () => {
    const first = group({
      metadata: {
        name: 'first',
        annotations: { [LDAP_DN_ANNOTATION]: 'first' },
      },
    });
    const second = group({
      metadata: {
        name: 'second',
        annotations: { [LDAP_DN_ANNOTATION]: 'second' },
      },
    });
    const child = group({
      metadata: {
        name: 'child',
        annotations: { [LDAP_DN_ANNOTATION]: 'child' },
      },
    });

    await resolveOrgRelations([first, second, child], [], {
      userMemberOf: new Map(),
      groupMemberOf: new Map(),
      groupMember: new Map([
        ['first', new Set(['child'])],
        ['second', new Set(['child'])],
      ]),
    });

    expect(first.spec.children).toEqual(['group:default/child']);
    expect(second.spec.children).toEqual(['group:default/child']);
    expect(child.spec.parent).toBe('group:default/first');
  });

  it('terminates and preserves a cyclic hierarchy', async () => {
    const a = group({
      metadata: { name: 'a' },
      spec: { parent: 'group:default/b', children: [] },
    });
    const b = group({
      metadata: { name: 'b' },
      spec: { parent: 'group:default/a', children: [] },
    });

    await resolveOrgRelations([a, b], [], emptyRelations());

    expect(a.spec).toEqual({
      type: 'type',
      parent: 'group:default/b',
      children: ['group:default/b'],
    });
    expect(b.spec).toEqual({
      type: 'type',
      parent: 'group:default/a',
      children: ['group:default/a'],
    });
  });
});
