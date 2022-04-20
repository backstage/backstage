/*
 * Copyright 2021 The Backstage Authors
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

import { GroupEntity, stringifyEntityRef } from '@backstage/catalog-model';
import { GitLabClient } from './client';
import { defaultGroupTransformer } from './defaultGroupTransformer';
import {
  GitLabGroupResponse,
  GitLabSharedGroupResponse,
  GroupTransformer,
} from './types';
import { readUsers } from './users';

export type GroupNode = {
  group: GitLabGroupResponse;
  entity: GroupEntity;
};

/**
 * Options to configure GitLab group ingestion.
 */
export type ReadGroupsOptions = {
  groupType?: string;
  pathDelimiter?: string;
  groupTransformer?: GroupTransformer;
  userTransformer?: UserTransformer;
};

export async function readGroups(
  client: GitLabClient,
  targetUrl: string,
  options?: ReadGroupsOptions,
): Promise<GroupEntity[]> {
  const {
    groupType = 'team',
    pathDelimiter = '-',
    groupTransformer,
    userTransformer,
  } = options ?? {};

  const groupsById = new Map<number, GroupNode>();
  for await (const group of client.listGroups(targetUrl)) {
    const entity = groupTransformer
      ? await groupTransformer({
          group: group,
          defaultTransformer: g =>
            defaultGroupTransformer(g, { groupType, pathDelimiter }),
        })
      : defaultGroupTransformer(group, { groupType, pathDelimiter });
    if (entity) {
      groupsById.set(group.id, { group, entity });
    }
  }

  await populateChildrenMembers(client, groupsById);
  mapChildrenToEntityRefs(groupsById);

  return [...groupsById.values()].map(g => g.entity);
}

export async function populateChildrenMembers(
  client: GitLabClient,
  groupsById: Map<number, GroupNode>,
) {
  for (const currentNode of groupsById.values()) {
    // Stitch up child/parent edges
    if (currentNode.group.parent_id !== null) {
      const parentNode = groupsById.get(currentNode.group.parent_id);
      if (parentNode) {
        parentNode.entity.spec.children.push(
          stringifyEntityRef(currentNode.entity),
        );
        currentNode.entity.spec.parent = stringifyEntityRef(parentNode.entity);
      }
    }

    // populate direct members
    const users = await readUsers(client, String(id), {
      inherited: false,
    });
    for (const user of users) {
      entity.spec!.members!.push(
        stringifyEntityRef({
          kind: 'user',
          name: user.metadata.name,
        }),
      );
    }

    // populate direct members of shared_with_groups
    const sharedWithGroups = await getSharedWithGroupsIDs(client, String(id));
    for (const sharedID of sharedWithGroups) {
      // populate direct members
      const sharedGroupUsers = await readUsers(client, sharedID, {
        inherited: false,
      });
      for (const user of sharedGroupUsers) {
        entity.spec!.members!.push(
          stringifyEntityRef({
            kind: 'user',
            name: user.metadata.name,
          }),
        );
      }
    }
  }
}

async function getSharedWithGroupsIDs(
  client: GitLabClient,
  id: string,
): Promise<string[]> {
  const response = await client.request(`/groups/${encodeURIComponent(id)}`);
  const { shared_with_groups } = await response.json();
  if (shared_with_groups) {
    return shared_with_groups.map((group: GitLabSharedGroupResponse) =>
      String(group.group_id),
    );
  }
  return [];
}

function mapChildrenToEntityRefs(groupsById: Map<number, GroupNode>) {
  // map entity references of children from ids
  for (const [_, { entity, children }] of groupsById) {
    for (const child of children) {
      const childEntity = groupsById.get(child)?.entity;
      if (childEntity) {
        entity.spec!.children!.push(stringifyEntityRef(childEntity));
      }
    }
  }
}
