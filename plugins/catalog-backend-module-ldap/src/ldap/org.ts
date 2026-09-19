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

import {
  GroupEntity,
  stringifyEntityRef,
  UserEntity,
} from '@backstage/catalog-model';
import { setImmediate } from 'node:timers/promises';

// TODO: Copied from plugin-catalog-backend, but we could also export them from
// there. Or move them to catalog-model.

const HIERARCHY_BATCH_SIZE = 1_000;

function* buildOrgHierarchyInBatches(groups: GroupEntity[]) {
  const groupsByRef = new Map<string, GroupEntity>();
  const refsByGroup = new Map<GroupEntity, string>();
  const childRefsByGroup = new Map<GroupEntity, Set<string>>();
  for (const group of groups) {
    const ref = stringifyEntityRef(group);
    groupsByRef.set(ref, group);
    refsByGroup.set(group, ref);
    childRefsByGroup.set(group, new Set(group.spec.children));
    yield;
  }

  //
  // Make sure that g.parent.children contain g
  //

  for (const group of groups) {
    const selfRef = refsByGroup.get(group)!;
    const parentRef = group.spec.parent;
    if (parentRef) {
      const parent = groupsByRef.get(parentRef);
      const childRefs = parent && childRefsByGroup.get(parent);
      if (parent && childRefs && !childRefs.has(selfRef)) {
        parent.spec.children.push(selfRef);
        childRefs.add(selfRef);
      }
    }
    yield;
  }

  //
  // Make sure that g.children.parent is g
  //

  for (const group of groups) {
    const selfRef = refsByGroup.get(group)!;
    for (const childRef of group.spec.children) {
      const child = groupsByRef.get(childRef);
      if (child && !child.spec.parent) {
        child.spec.parent = selfRef;
      }
      yield;
    }
  }
}

export function buildOrgHierarchy(groups: GroupEntity[]) {
  const batches = buildOrgHierarchyInBatches(groups);
  while (!batches.next().done) {
    // Consume all hierarchy work synchronously.
  }
}

export async function buildOrgHierarchyAsync(groups: GroupEntity[]) {
  let processedItems = 0;
  const batches = buildOrgHierarchyInBatches(groups);
  while (!batches.next().done) {
    if (++processedItems % HIERARCHY_BATCH_SIZE === 0) {
      await setImmediate();
    }
  }
}

// Ensure that users have their transitive group memberships. Requires that
// the groups were previously processed with buildOrgHierarchy()
export function buildMemberOf(groups: GroupEntity[], users: UserEntity[]) {
  const groupsByRef = new Map(groups.map(g => [stringifyEntityRef(g), g]));

  users.forEach(user => {
    const transitiveMemberOf = new Set<string>();

    const todo = [
      ...(user.spec.memberOf ?? []),
      ...groups
        .filter(g => g.spec.members?.includes(stringifyEntityRef(user)))
        .map(g => stringifyEntityRef(g)),
    ];

    for (;;) {
      const current = todo.pop();
      if (!current) {
        break;
      }

      if (!transitiveMemberOf.has(current)) {
        transitiveMemberOf.add(current);
        const group = groupsByRef.get(current);
        if (group?.spec.parent) {
          todo.push(group.spec.parent);
        }
      }
    }

    user.spec.memberOf = [...transitiveMemberOf];
  });
}
