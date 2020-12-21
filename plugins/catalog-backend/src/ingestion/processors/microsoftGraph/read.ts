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
import limiterFactory from 'p-limit';
import { buildMemberOf, buildOrgHierarchy } from '../util/org';
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
  const promises: Promise<void>[] = [];
  const limiter = limiterFactory(10);

  for await (const user of client.getUsers({
    filter: options?.userFilter,
    select: ['id', 'displayName', 'mail'],
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
          displayName: user.displayName!,
          email: user.mail!,

          // TODO: Additional fields?
          // jobTitle: user.jobTitle || undefined,
          // officeLocation: user.officeLocation || undefined,
          // mobilePhone: user.mobilePhone || undefined,
        },
        memberOf: [],
      },
    };

    // Download the photos in parallel, otherwise it can take quite some time
    const loadPhoto = limiter(async () => {
      entity.spec.profile!.picture = await client.getUserPhotoWithSizeLimit(
        user.id!,
        // We are limiting the photo size, as users with full resolution photos
        // can make the Backstage API slow
        120,
      );
    });

    promises.push(loadPhoto);
    entities.push(entity);
  }

  // Wait for all photos to be downloaded
  await Promise.all(promises);

  return { users: entities };
}

export async function readMicrosoftGraphOrganization(
  client: MicrosoftGraphClient,
  tenantId: string,
): Promise<{
  rootGroup: GroupEntity; // With all relations empty
}> {
  // For now we expect a single root organization
  const organization = await client.getOrganization(tenantId);
  const name = normalizeEntityName(organization.displayName!);
  const rootGroup: GroupEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Group',
    metadata: {
      name: name,
      description: organization.displayName!,
      annotations: {
        [MICROSOFT_GRAPH_TENANT_ID_ANNOTATION]: organization.id!,
      },
    },
    spec: {
      type: 'root',
      profile: {
        displayName: organization.displayName!,
      },
      children: [],
    },
  };

  return { rootGroup };
}

export async function readMicrosoftGraphGroups(
  client: MicrosoftGraphClient,
  tenantId: string,
  options?: { groupFilter?: string },
): Promise<{
  groups: GroupEntity[]; // With all relations empty
  rootGroup: GroupEntity | undefined; // With all relations empty
  groupMember: Map<string, Set<string>>;
  groupMemberOf: Map<string, Set<string>>;
}> {
  const groups: GroupEntity[] = [];
  const groupMember: Map<string, Set<string>> = new Map();
  const groupMemberOf: Map<string, Set<string>> = new Map();
  const limiter = limiterFactory(10);

  const { rootGroup } = await readMicrosoftGraphOrganization(client, tenantId);
  groupMember.set(rootGroup.metadata.name, new Set<string>());
  groups.push(rootGroup);

  const promises: Promise<void>[] = [];

  for await (const group of client.getGroups({
    filter: options?.groupFilter,
    select: ['id', 'displayName', 'description', 'mail', 'mailNickname'],
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
        annotations: {
          [MICROSOFT_GRAPH_GROUP_ID_ANNOTATION]: group.id,
        },
      },
      spec: {
        type: 'team',
        profile: {},
        children: [],
      },
    };

    if (group.description) {
      entity.metadata.description = group.description;
    }
    if (group.displayName) {
      entity.spec.profile!.displayName = group.displayName;
    }
    if (group.mail) {
      entity.spec.profile!.email = group.mail;
    }

    // Download the members in parallel, otherwise it can take quite some time
    const loadGroupMembers = limiter(async () => {
      for await (const member of client.getGroupMembers(group.id!)) {
        if (!member.id) {
          continue;
        }

        if (member['@odata.type'] === '#microsoft.graph.user') {
          ensureItem(groupMemberOf, member.id, group.id!);
        }

        if (member['@odata.type'] === '#microsoft.graph.group') {
          ensureItem(groupMember, group.id!, member.id);
        }
      }
    });

    // TODO: Loading groups doesn't work right now as Microsoft Graph doesn't
    // allows this yet: https://microsoftgraph.uservoice.com/forums/920506-microsoft-graph-feature-requests/suggestions/37884922-allow-application-to-set-or-update-a-group-s-photo
    /*/ / Download the photos in parallel, otherwise it can take quite some time
    const loadPhoto = limiter(async () => {
      entity.spec.profile!.picture = await client.getGroupPhotoWithSizeLimit(
        group.id!,
        // We are limiting the photo size, as groups with full resolution photos
        // can make the Backstage API slow
        120,
      );
    });

    promises.push(loadPhoto);*/
    promises.push(loadGroupMembers);
    groups.push(entity);
  }

  // Wait for all group members and photos to be loaded
  await Promise.all(promises);

  return {
    groups,
    rootGroup,
    groupMember,
    groupMemberOf,
  };
}

export function resolveRelations(
  rootGroup: GroupEntity | undefined,
  groups: GroupEntity[],
  users: UserEntity[],
  groupMember: Map<string, Set<string>>,
  groupMemberOf: Map<string, Set<string>>,
) {
  // Build reference lookup tables, we reference them by the id the the graph
  const groupMap: Map<string, GroupEntity> = new Map(); // by group-id or tenant-id

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

  // Resolve all member relationships into the reverse direction
  const parentGroups = new Map<string, Set<string>>();

  groupMember.forEach((members, groupId) =>
    members.forEach(m => ensureItem(parentGroups, m, groupId)),
  );

  // Make sure every group (except root) has at least one parent. If the parent is missing, add the root.
  if (rootGroup) {
    const tenantId = rootGroup.metadata.annotations![
      MICROSOFT_GRAPH_TENANT_ID_ANNOTATION
    ];

    groups.forEach(group => {
      const groupId = group.metadata.annotations![
        MICROSOFT_GRAPH_GROUP_ID_ANNOTATION
      ];

      if (!groupId) {
        return;
      }

      if (retrieveItems(parentGroups, groupId).size === 0) {
        ensureItem(parentGroups, groupId, tenantId);
        ensureItem(groupMember, tenantId, groupId);
      }
    });
  }

  groups.forEach(group => {
    const id =
      group.metadata.annotations![MICROSOFT_GRAPH_GROUP_ID_ANNOTATION] ??
      group.metadata.annotations![MICROSOFT_GRAPH_TENANT_ID_ANNOTATION];

    retrieveItems(groupMember, id).forEach(m => {
      const childGroup = groupMap.get(m);
      if (childGroup) {
        group.spec.children.push(childGroup.metadata.name);
      }
    });

    retrieveItems(parentGroups, id).forEach(p => {
      const parentGroup = groupMap.get(p);
      if (parentGroup) {
        // TODO: Only having a single parent group might not match every companies model, but fine for now.
        group.spec.parent = parentGroup.metadata.name;
      }
    });
  });

  // Make sure that all groups have proper parents and children
  buildOrgHierarchy(groups);

  // Set relations for all users
  users.forEach(user => {
    const id = user.metadata.annotations![MICROSOFT_GRAPH_USER_ID_ANNOTATION];

    retrieveItems(groupMemberOf, id).forEach(p => {
      const parentGroup = groupMap.get(p);
      if (parentGroup) {
        user.spec.memberOf.push(parentGroup.metadata.name);
      }
    });
  });

  // Make sure all transitive memberships are available
  buildMemberOf(groups, users);
}

export async function readMicrosoftGraphOrg(
  client: MicrosoftGraphClient,
  tenantId: string,
  options?: { userFilter?: string; groupFilter?: string },
): Promise<{ users: UserEntity[]; groups: GroupEntity[] }> {
  const { users } = await readMicrosoftGraphUsers(client, {
    userFilter: options?.userFilter,
  });
  const {
    groups,
    rootGroup,
    groupMember,
    groupMemberOf,
  } = await readMicrosoftGraphGroups(client, tenantId, {
    groupFilter: options?.groupFilter,
  });

  resolveRelations(rootGroup, groups, users, groupMember, groupMemberOf);
  users.sort((a, b) => a.metadata.name.localeCompare(b.metadata.name));
  groups.sort((a, b) => a.metadata.name.localeCompare(b.metadata.name));

  return { users, groups };
}

function ensureItem(
  target: Map<string, Set<string>>,
  key: string,
  value: string,
) {
  let set = target.get(key);
  if (!set) {
    set = new Set();
    target.set(key, set);
  }
  set!.add(value);
}

function retrieveItems(
  target: Map<string, Set<string>>,
  key: string,
): Set<string> {
  return target.get(key) ?? new Set();
}
