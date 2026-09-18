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

import {
  GroupEntity,
  stringifyEntityRef,
  UserEntity,
} from '@backstage/catalog-model';
import {
  LDAP_DN_ANNOTATION,
  LDAP_RDN_ANNOTATION,
  LDAP_UUID_ANNOTATION,
} from './constants';

export type RawLdapRelations = {
  userMemberOf: ReadonlyMap<string, ReadonlySet<string>>;
  groupMemberOf: ReadonlyMap<string, ReadonlySet<string>>;
  groupMember: ReadonlyMap<string, ReadonlySet<string>>;
};

type OrgEntity = UserEntity | GroupEntity;

class EntityIndex<T extends OrgEntity> {
  readonly #byRef = new Map<string, T>();
  readonly #refByEntity = new Map<T, string>();
  readonly #refByAlias = new Map<string, string>();

  add(entity: T): void {
    const ref = stringifyEntityRef(entity);
    this.#byRef.set(ref, entity);
    this.#refByEntity.set(entity, ref);

    const annotations = entity.metadata.annotations;
    this.#addAlias(ref, ref);
    this.#addAlias(annotations?.[LDAP_DN_ANNOTATION], ref);
    this.#addAlias(annotations?.[LDAP_DN_ANNOTATION]?.toLowerCase(), ref);
    this.#addAlias(annotations?.[LDAP_RDN_ANNOTATION], ref);
    this.#addAlias(annotations?.[LDAP_UUID_ANNOTATION], ref);
  }

  resolve(alias: string): string | undefined {
    return (
      this.#refByAlias.get(alias) ?? this.#refByAlias.get(alias.toLowerCase())
    );
  }

  get(ref: string): T | undefined {
    return this.#byRef.get(ref);
  }

  ref(entity: T): string {
    return this.#refByEntity.get(entity)!;
  }

  #addAlias(alias: string | undefined, ref: string): void {
    if (alias) {
      this.#refByAlias.set(alias, ref);
    }
  }
}

type OrgRelationGraph = {
  userMemberOf: Map<string, Set<string>>;
  groupParents: Map<string, Set<string>>;
  groupChildren: Map<string, Set<string>>;
};

type PlannedGroupRelations = {
  parent: string | undefined;
  children: string[];
  childSet: Set<string>;
};

function addToSet(
  map: Map<string, Set<string>>,
  source: string,
  target: string,
): void {
  let values = map.get(source);
  if (!values) {
    values = new Set();
    map.set(source, values);
  }
  values.add(target);
}

function buildGraph(
  userIndex: EntityIndex<UserEntity>,
  groupIndex: EntityIndex<GroupEntity>,
  relations: RawLdapRelations,
): OrgRelationGraph {
  const graph: OrgRelationGraph = {
    userMemberOf: new Map(),
    groupParents: new Map(),
    groupChildren: new Map(),
  };

  for (const [userAlias, groupAliases] of relations.userMemberOf) {
    const userRef = userIndex.resolve(userAlias);
    if (!userRef) {
      continue;
    }
    for (const groupAlias of groupAliases) {
      const groupRef = groupIndex.resolve(groupAlias);
      if (groupRef) {
        addToSet(graph.userMemberOf, userRef, groupRef);
      }
    }
  }

  for (const [groupAlias, parentAliases] of relations.groupMemberOf) {
    const groupRef = groupIndex.resolve(groupAlias);
    if (!groupRef) {
      continue;
    }
    for (const parentAlias of parentAliases) {
      const parentRef = groupIndex.resolve(parentAlias);
      if (parentRef) {
        addToSet(graph.groupParents, groupRef, parentRef);
        addToSet(graph.groupChildren, parentRef, groupRef);
      }
    }
  }

  for (const [groupAlias, memberAliases] of relations.groupMember) {
    const groupRef = groupIndex.resolve(groupAlias);
    if (!groupRef) {
      continue;
    }
    for (const memberAlias of memberAliases) {
      const userRef = userIndex.resolve(memberAlias);
      if (userRef) {
        addToSet(graph.userMemberOf, userRef, groupRef);
        continue;
      }

      const childRef = groupIndex.resolve(memberAlias);
      if (childRef) {
        addToSet(graph.groupChildren, groupRef, childRef);
        addToSet(graph.groupParents, childRef, groupRef);
      }
    }
  }

  return graph;
}

export async function resolveOrgRelations(
  groups: GroupEntity[],
  users: UserEntity[],
  relations: RawLdapRelations,
): Promise<void> {
  const userIndex = new EntityIndex<UserEntity>();
  const groupIndex = new EntityIndex<GroupEntity>();
  for (const user of users) {
    userIndex.add(user);
  }
  for (const group of groups) {
    groupIndex.add(group);
  }

  const graph = buildGraph(userIndex, groupIndex, relations);
  const plannedUserMemberOf = new Map<UserEntity, string[]>();
  for (const [userRef, groupRefs] of graph.userMemberOf) {
    const user = userIndex.get(userRef);
    if (user) {
      plannedUserMemberOf.set(user, [...groupRefs].sort());
    }
  }

  const plannedGroupRelations = new Map<GroupEntity, PlannedGroupRelations>();
  const plannedGroupsByRef = new Map<string, PlannedGroupRelations>();
  for (const group of groups) {
    const ref = groupIndex.ref(group);
    const isIndexedEntity = groupIndex.get(ref) === group;
    const parents = isIndexedEntity ? graph.groupParents.get(ref) : undefined;
    const children = isIndexedEntity ? graph.groupChildren.get(ref) : undefined;
    const planned = {
      parent:
        parents?.size === 1 ? parents.values().next().value : group.spec.parent,
      children: children ? [...children].sort() : [...group.spec.children],
      childSet: new Set(children ?? group.spec.children),
    };
    plannedGroupRelations.set(group, planned);
    plannedGroupsByRef.set(ref, planned);
  }

  for (const group of groups) {
    const selfRef = groupIndex.ref(group);
    const parentRef = plannedGroupRelations.get(group)!.parent;
    if (parentRef) {
      const parent = plannedGroupsByRef.get(parentRef);
      if (parent && !parent.childSet.has(selfRef)) {
        parent.children.push(selfRef);
        parent.childSet.add(selfRef);
      }
    }
  }

  for (const group of groups) {
    const selfRef = groupIndex.ref(group);
    const planned = plannedGroupRelations.get(group)!;
    for (const childRef of planned.children) {
      const child = plannedGroupsByRef.get(childRef);
      if (child && !child.parent) {
        child.parent = selfRef;
      }
    }
  }

  for (const [user, memberOf] of plannedUserMemberOf) {
    user.spec.memberOf = memberOf;
  }
  for (const [group, planned] of plannedGroupRelations) {
    if (planned.parent) {
      group.spec.parent = planned.parent;
    }
    group.spec.children = planned.children;
  }
}
