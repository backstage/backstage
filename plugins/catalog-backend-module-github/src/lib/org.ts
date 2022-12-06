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
  DEFAULT_NAMESPACE,
  GroupEntity,
  parseEntityRef,
  stringifyEntityRef,
  UserEntity,
} from '@backstage/catalog-model';

export function buildOrgHierarchy(groups: GroupEntity[]) {
  const groupsByName = new Map(groups.map(g => [g.metadata.name, g]));

  //
  // Make sure that g.parent.children contain g
  //

  for (const group of groups) {
    const selfName = group.metadata.name;
    const parentName = group.spec.parent;
    if (parentName) {
      const parent = groupsByName.get(parentName);
      if (parent && !parent.spec.children.includes(selfName)) {
        parent.spec.children.push(selfName);
      }
    }
  }

  //
  // Make sure that g.children.parent is g
  //

  for (const group of groups) {
    const selfName = group.metadata.name;
    for (const childName of group.spec.children) {
      const child = groupsByName.get(childName);
      if (child && !child.spec.parent) {
        child.spec.parent = selfName;
      }
    }
  }
}

// Ensure that users have their direct group memberships.
export function assignGroupsToUsers(
  users: UserEntity[],
  groups: GroupEntity[],
) {
  const groupMemberUsers = new Map(
    groups.map(group => {
      const groupKey =
        group.metadata.namespace &&
        group.metadata.namespace !== DEFAULT_NAMESPACE
          ? `${group.metadata.namespace}/${group.metadata.name}`
          : group.metadata.name;
      // Fully qualify member refs so they can be keyed off of since they may contain namespace prefixes
      return [
        groupKey,
        group.spec.members?.map(m =>
          stringifyEntityRef(parseEntityRef(m, { defaultKind: 'user' })),
        ) || [],
      ];
    }),
  );

  const usersByRef = new Map(users.map(u => [stringifyEntityRef(u), u]));
  for (const [groupName, userRefs] of groupMemberUsers.entries()) {
    for (const ref of userRefs) {
      const user = usersByRef.get(ref);
      if (user && !user.spec.memberOf?.includes(groupName)) {
        if (!user.spec.memberOf) {
          user.spec.memberOf = [];
        }
        user.spec.memberOf.push(groupName);
      }
    }
  }
}

// Ensure that users have their transitive group memberships. Requires that
// the groups were previously processed with buildOrgHierarchy()
export function buildMemberOf(groups: GroupEntity[], users: UserEntity[]) {
  const groupsByName = new Map(groups.map(g => [g.metadata.name, g]));

  users.forEach(user => {
    const transitiveMemberOf = new Set<string>();

    const todo = [
      ...(user.spec.memberOf ?? []),
      ...groups
        .filter(g => g.spec.members?.includes(user.metadata.name))
        .map(g => g.metadata.name),
    ];

    for (;;) {
      const current = todo.pop();
      if (!current) {
        break;
      }

      if (!transitiveMemberOf.has(current)) {
        transitiveMemberOf.add(current);
        const group = groupsByName.get(current);
        if (group?.spec.parent) {
          todo.push(group.spec.parent);
        }
      }
    }

    user.spec.memberOf = [...transitiveMemberOf];
  });
}
