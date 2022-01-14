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
import { GitLabClient, paginated } from './client';
import { getGroupMembers } from './users';

export type GroupNode = {
  entity: GroupEntity;
  parent: number | null;
  children: number[];
};

export type GroupAdjacency = Map<number, GroupNode>;

type Group = {
  id: number;
  web_url: string;
  name: string;
  path: string;
  description: string;
  full_name: string;
  full_path: string;
  created_at: string;
  parent_id: number | null;
};

type SharedGroup = {
  group_id: number;
  group_name: string;
  group_full_path: string;
  group_access_level: number;
  expires_at?: string;
};

export async function getGroups(
  client: GitLabClient,
  _id: string,
  pathDelimiter: string,
  groupType: string = 'team',
): Promise<GroupAdjacency> {
  const groups = paginated<Group>(
    options => client.pagedRequest('/groups', options),
    { per_page: 100 },
  );

  const groupAdjacency = new Map<number, GroupNode>();
  for await (const result of groups) {
    const entity: GroupEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: {
        name: result.full_path.replaceAll('/', pathDelimiter),
      },
      spec: {
        type: groupType,
        profile: {},
        children: [],
        members: [],
      },
    };
    if (result.name) entity.spec!.profile!.displayName = result.name;
    if (result.description) entity.metadata!.description = result.description;

    if (!groupAdjacency.has(result.id)) {
      groupAdjacency.set(result.id, {
        children: [],
        parent: result.parent_id,
        entity,
      });
    }
  }
  await populateChildrenMembers(client, groupAdjacency);
  mapChildrenToEntityRefs(groupAdjacency);
  return groupAdjacency;
}

export async function populateChildrenMembers(
  client: GitLabClient,
  groupAdjacency: GroupAdjacency,
) {
  // map ids of children using parent for each group node
  for (const [id, { parent, entity }] of groupAdjacency) {
    // append as child of parent if present
    if (parent !== null) {
      const parentGroupNode = groupAdjacency.get(parent);
      if (parentGroupNode) {
        parentGroupNode.children.push(id);
      }
    }
    // populate direct members
    const users = await getGroupMembers(client, String(id), false);
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
      const sharedGroupUsers = await getGroupMembers(client, sharedID, false);
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
    return shared_with_groups.map((group: SharedGroup) =>
      String(group.group_id),
    );
  }
  return [];
}

function mapChildrenToEntityRefs(groupAdjacency: GroupAdjacency) {
  // map entity references of children from ids
  for (const [_, { entity, children }] of groupAdjacency) {
    for (const child of children) {
      const childEntity = groupAdjacency.get(child)?.entity;
      if (childEntity) {
        entity.spec!.children!.push(
          stringifyEntityRef({
            kind: 'group',
            name: childEntity.metadata!.name,
          }),
        );
      }
    }
  }
}

export function parseGitLabGroupUrl(url: string): null | string {
  let path = new URL(url).pathname.substr(1).split('/');

  // handle "/" pathname resulting in an array with the empty string
  if (path.length === 1 && path[0].length === 0) {
    return null; // no group path
  }

  if (path.length >= 1) {
    // handle reserved groups keyword if present
    if (path[0] === 'groups') {
      path = path.slice(1);
    }

    // group path cannot be empty after /groups/
    if (path.length === 0) {
      throw new Error('GitLab group URL is missing a group path');
    }

    // consume each path component until /-/ which is used to delimit subpages
    const components = [];
    for (const component of path) {
      if (component === '-') {
        break;
      }
      components.push(component);
    }
    return components.join('/');
  }

  throw new Error('GitLab group URL is invalid');
}
