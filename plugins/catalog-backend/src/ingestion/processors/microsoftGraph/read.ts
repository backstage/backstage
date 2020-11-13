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
import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import { buildOrgHierarchy } from '../util/org';
import { MicrosoftGraphClient } from './client';
import {
  MICROSOFT_GRAPH_GROUP_ID_ANNOTATION,
  MICROSOFT_GRAPH_TENANT_ID_ANNOTATION,
  MICROSOFT_GRAPH_USER_ID_ANNOTATION,
} from './constants';

export function normalizeEntityName(name: string): string {
  return name
    .trim()
    .toLocaleLowerCase()
    .replace(/[^a-zA-Z0-9_\-\.]/g, '_');
}

export async function readMicrosoftGraphUsers(
  client: MicrosoftGraphClient,
  options?: { userFilter?: string },
): Promise<{
  users: UserEntity[]; // With all relations empty
}> {
  const entities: UserEntity[] = [];
  const picturePromises: Promise<void>[] = [];

  for await (const user of client.getUsers({
    filter: options?.userFilter,
    select: ['id', 'displayName', 'mail', ''],
  })) {
    if (!user.id || !user.displayName || !user.mail) {
      continue;
    }

    const name = normalizeEntityName(user.mail);
    const entity: UserEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: {
        name,
        annotations: {
          [MICROSOFT_GRAPH_USER_ID_ANNOTATION]: user.id!,
        },
      },
      spec: {
        profile: {
          displayName: user.displayName || undefined,
          email: user.mail || undefined,

          // TODO: Additional fields?
          // jobTitle: user.jobTitle || undefined,
          // officeLocation: user.officeLocation || undefined,
          // mobilePhone: user.mobilePhone || undefined,
        },
        memberOf: [],
      },
    };

    // Download the photos in parallel, otherwise it can take quite some time
    const loadPhoto = async () => {
      entity.spec.profile!.picture = await client.getUserPhotoWithSizeLimit(
        user.id!,
        // We are limiting the photo size, as users with full resolution photos
        // can make the Backstage API slow
        120,
      );
    };

    picturePromises.push(loadPhoto());
    entities.push(entity);
  }

  // Wait for all photos to be downloaded
  await Promise.all(picturePromises);

  return { users: entities };
}

export async function readMicrosoftGraphOrganizations(
  client: MicrosoftGraphClient,
): Promise<{
  rootGroup?: GroupEntity; // With all relations empty
}> {
  const organizations = await client.getOrganization();

  if (organizations) {
    for (const entry of organizations) {
      if (!entry.id || !entry.displayName) {
        continue;
      }

      // For now we expect a single root orgranization
      const name = normalizeEntityName(entry.displayName);
      const rootGroup: GroupEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: {
          name: name,
          description: entry.displayName,
          annotations: {
            [MICROSOFT_GRAPH_TENANT_ID_ANNOTATION]: entry.id,
          },
        },
        spec: {
          type: 'root',
          ancestors: [],
          children: [],
          descendants: [],
        },
      };

      return { rootGroup };
    }
  }

  return {};
}

export async function readMicrosoftGraphGroups(
  client: MicrosoftGraphClient,
  options?: { groupFilter?: string },
): Promise<{
  groups: GroupEntity[]; // With all relations empty
  rootGroup: GroupEntity | undefined; // With all relations empty
  groupMember: Map<string, Set<string>>;
}> {
  const groups: GroupEntity[] = [];
  const groupMember: Map<string, Set<string>> = new Map();

  const { rootGroup } = await readMicrosoftGraphOrganizations(client);

  if (rootGroup) {
    groupMember.set(rootGroup.metadata.name, new Set<string>());
    groups.push(rootGroup);
  }

  const groupMemberPromises: Promise<void>[] = [];

  for await (const group of client.getGroups({
    filter: options?.groupFilter,
    select: ['id', 'displayName', 'mailNickname'],
  })) {
    if (!group.id || !group.displayName) {
      continue;
    }

    const name = normalizeEntityName(group.mailNickname || group.displayName);
    const entity: GroupEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: {
        name: name,
        description: group.displayName,
        annotations: {
          [MICROSOFT_GRAPH_GROUP_ID_ANNOTATION]: group.id,
        },
      },
      spec: {
        type: 'team',
        // TODO: We could include a group email and picture
        ancestors: [],
        children: [],
        descendants: [],
      },
    };

    const groupMembers = new Set<string>();

    // Download the members in parallel, otherwise it can take quite some time
    const loadGroupMembers = async () => {
      for await (const member of client.getGroupMembers(group.id!)) {
        if (
          !member.id ||
          !(
            member['@odata.type'] === '#microsoft.graph.user' ||
            member['@odata.type'] === '#microsoft.graph.group'
          )
        ) {
          continue;
        }

        groupMembers.add(member.id);
      }
    };

    groupMemberPromises.push(loadGroupMembers());
    groupMember.set(group.id, groupMembers);
    groups.push(entity);
  }

  // Wait for all group members to be loaded
  await Promise.all(groupMemberPromises);

  return {
    groups,
    rootGroup,
    groupMember,
  };
}

export function resolveRelations(
  rootGroup: GroupEntity | undefined,
  groups: GroupEntity[],
  users: UserEntity[],
  groupMember: Map<string, Set<string>>,
) {
  // Build reference lookup tables, we reference them by the id the the graph
  const userMap: Map<string, UserEntity> = new Map(); // by uuid
  const groupMap: Map<string, GroupEntity> = new Map(); // by uuid

  for (const user of users) {
    userMap.set(
      user.metadata.annotations![MICROSOFT_GRAPH_USER_ID_ANNOTATION],
      user,
    );
  }
  for (const group of groups) {
    if (group.metadata.annotations![MICROSOFT_GRAPH_GROUP_ID_ANNOTATION]) {
      groupMap.set(
        group.metadata.annotations![MICROSOFT_GRAPH_GROUP_ID_ANNOTATION],
        group,
      );
    }
    if (group.metadata.annotations![MICROSOFT_GRAPH_TENANT_ID_ANNOTATION]) {
      groupMap.set(
        group.metadata.annotations![MICROSOFT_GRAPH_TENANT_ID_ANNOTATION],
        group,
      );
    }
  }

  // Make sure that every user is at least part of the rootGroup
  if (rootGroup) {
    const groupMembers = groupMember.get(
      rootGroup.metadata.annotations![MICROSOFT_GRAPH_TENANT_ID_ANNOTATION],
    );

    users.forEach(u =>
      groupMembers?.add(
        u.metadata.annotations![MICROSOFT_GRAPH_USER_ID_ANNOTATION],
      ),
    );
  }

  // TODO: For every group, add the group members (users/groups might be missing!)

  // TODO: Also added to partent to every member

  buildOrgHierarchy(groups);
}

export async function readMicrosoftGraphOrg(
  client: MicrosoftGraphClient,
  options?: { userFilter?: string; groupFilter?: string },
): Promise<{ users: UserEntity[]; groups: GroupEntity[] }> {
  const { users } = await readMicrosoftGraphUsers(client, {
    userFilter: options?.userFilter,
  });
  const { groups, rootGroup, groupMember } = await readMicrosoftGraphGroups(
    client,
    {
      groupFilter: options?.groupFilter,
    },
  );

  resolveRelations(rootGroup, groups, users, groupMember);
  users.sort((a, b) => a.metadata.name.localeCompare(b.metadata.name));
  groups.sort((a, b) => a.metadata.name.localeCompare(b.metadata.name));

  return { users, groups };
}
