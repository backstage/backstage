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
import limiterFactory from 'p-limit';
import { MicrosoftGraphClient } from './client';
import {
  MICROSOFT_GRAPH_GROUP_ID_ANNOTATION,
  MICROSOFT_GRAPH_TENANT_ID_ANNOTATION,
  MICROSOFT_GRAPH_USER_ID_ANNOTATION,
} from './constants';
import { buildMemberOf, buildOrgHierarchy } from './org';
import {
  GroupTransformer,
  OrganizationTransformer,
  UserTransformer,
} from './types';
import {
  defaultGroupTransformer,
  defaultOrganizationTransformer,
  defaultUserTransformer,
} from './defaultTransformers';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { LoggerService } from '@backstage/backend-plugin-api';

const PAGE_SIZE = 999;

export async function readMicrosoftGraphUsers(
  client: MicrosoftGraphClient,
  options: {
    queryMode?: 'basic' | 'advanced';
    userExpand?: string;
    userFilter?: string;
    userSelect?: string[];
    loadUserPhotos?: boolean;
    transformer?: UserTransformer;
    logger: LoggerService;
  },
): Promise<{
  users: UserEntity[]; // With all relations empty
}> {
  const users = client.getUsers(
    {
      filter: options.userFilter,
      expand: options.userExpand,
      select: options.userSelect,
      top: PAGE_SIZE,
    },
    options.queryMode,
  );

  return {
    users: await transformUsers(
      client,
      users,
      options.logger,
      options.loadUserPhotos,
      options.transformer,
    ),
  };
}

export async function readMicrosoftGraphUsersInGroups(
  client: MicrosoftGraphClient,
  options: {
    queryMode?: 'basic' | 'advanced';
    userExpand?: string;
    userFilter?: string;
    userSelect?: string[];
    loadUserPhotos?: boolean;
    userGroupMemberSearch?: string;
    userGroupMemberFilter?: string;
    groupExpand?: string;
    transformer?: UserTransformer;
    logger: LoggerService;
  },
): Promise<{
  users: UserEntity[]; // With all relations empty
}> {
  const limiter = limiterFactory(10);

  const userGroupMemberPromises: Promise<void>[] = [];
  const userGroupMembers = new Map<string, MicrosoftGraph.User>();

  for await (const group of client.getGroups(
    {
      expand: options.groupExpand,
      filter: options.userGroupMemberFilter,
      search: options.userGroupMemberSearch,
      select: ['id', 'displayName'],
      top: PAGE_SIZE,
    },
    options.queryMode,
  )) {
    // Process all groups in parallel, otherwise it can take quite some time
    userGroupMemberPromises.push(
      limiter(async () => {
        let groupMemberCount = 0;
        for await (const user of client.getGroupUserMembers(
          group.id!,
          {
            expand: options.userExpand,
            filter: options.userFilter,
            select: options.userSelect,
            top: PAGE_SIZE,
          },
          options.queryMode,
        )) {
          userGroupMembers.set(user.id!, user);
          groupMemberCount++;
        }
        options.logger.debug('Read users from group', {
          groupId: group.id,
          groupName: group.displayName,
          memberCount: groupMemberCount,
        });
      }),
    );
  }

  // Wait for all group members
  await Promise.all(userGroupMemberPromises);

  options.logger.info('Read users from group membership', {
    groupCount: userGroupMemberPromises.length,
    userCount: userGroupMembers.size,
  });

  return {
    users: await transformUsers(
      client,
      userGroupMembers.values(),
      options.logger,
      options.loadUserPhotos,
      options.transformer,
    ),
  };
}

export async function readMicrosoftGraphOrganization(
  client: MicrosoftGraphClient,
  tenantId: string,
  options?: { transformer?: OrganizationTransformer },
): Promise<{
  rootGroup?: GroupEntity; // With all relations empty
}> {
  // For now we expect a single root organization
  const organization = await client.getOrganization(tenantId);
  const transformer = options?.transformer ?? defaultOrganizationTransformer;
  const rootGroup = await transformer(organization);

  return { rootGroup };
}

export async function readMicrosoftGraphGroups(
  client: MicrosoftGraphClient,
  tenantId: string,
  options?: {
    queryMode?: 'basic' | 'advanced';
    groupExpand?: string;
    groupFilter?: string;
    groupSearch?: string;
    groupSelect?: string[];
    groupIncludeSubGroups?: boolean;
    groupTransformer?: GroupTransformer;
    organizationTransformer?: OrganizationTransformer;
  },
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

  const { rootGroup } = await readMicrosoftGraphOrganization(client, tenantId, {
    transformer: options?.organizationTransformer,
  });
  if (rootGroup) {
    groupMember.set(rootGroup.metadata.name, new Set<string>());
    groups.push(rootGroup);
  }

  const transformer = options?.groupTransformer ?? defaultGroupTransformer;
  const promises: Promise<void>[] = [];

  for await (const group of client.getGroups(
    {
      expand: options?.groupExpand,
      filter: options?.groupFilter,
      search: options?.groupSearch,
      select: options?.groupSelect,
      top: PAGE_SIZE,
    },
    options?.queryMode,
  )) {
    // Process all groups in parallel, otherwise it can take quite some time
    promises.push(
      limiter(async () => {
        // TODO: Loading groups photos doesn't work right now as Microsoft Graph
        // doesn't allows this yet: https://microsoftgraph.uservoice.com/forums/920506-microsoft-graph-feature-requests/suggestions/37884922-allow-application-to-set-or-update-a-group-s-photo
        /* const groupPhoto = await client.getGroupPhotoWithSizeLimit(
          group.id!,
          // We are limiting the photo size, as groups with full resolution photos
          // can make the Backstage API slow
          120,
        );*/

        const entity = await transformer(group /* , groupPhoto*/);

        if (!entity) {
          return;
        }

        for await (const member of client.getGroupMembers(group.id!, {
          top: PAGE_SIZE,
        })) {
          if (!member.id) {
            continue;
          }

          if (member['@odata.type'] === '#microsoft.graph.user') {
            ensureItem(groupMemberOf, member.id, group.id!);
          }

          if (member['@odata.type'] === '#microsoft.graph.group') {
            ensureItem(groupMember, group.id!, member.id);

            if (options?.groupIncludeSubGroups) {
              const groupMemberEntity = await transformer(member);

              if (groupMemberEntity) {
                groups.push(groupMemberEntity);

                for await (const subMember of client.getGroupMembers(
                  member.id!,
                  { top: PAGE_SIZE },
                )) {
                  if (!subMember.id) {
                    continue;
                  }

                  if (subMember['@odata.type'] === '#microsoft.graph.user') {
                    ensureItem(groupMemberOf, subMember.id, member.id!);
                  }

                  if (subMember['@odata.type'] === '#microsoft.graph.group') {
                    ensureItem(groupMember, member.id!, subMember.id);
                  }
                }
              }
            }
          }
        }

        groups.push(entity);
      }),
    );
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
  // Build reference lookup tables, we reference them by the id of the graph
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
    const tenantId =
      rootGroup.metadata.annotations![MICROSOFT_GRAPH_TENANT_ID_ANNOTATION];

    groups.forEach(group => {
      const groupId =
        group.metadata.annotations![MICROSOFT_GRAPH_GROUP_ID_ANNOTATION];

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
        group.spec.children.push(stringifyEntityRef(childGroup));
      }
    });

    retrieveItems(parentGroups, id).forEach(p => {
      const parentGroup = groupMap.get(p);
      if (parentGroup) {
        // TODO: Only having a single parent group might not match every companies model, but fine for now.
        group.spec.parent = stringifyEntityRef(parentGroup);
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
        if (!user.spec.memberOf) {
          user.spec.memberOf = [];
        }
        user.spec.memberOf.push(stringifyEntityRef(parentGroup));
      }
    });
  });

  // Make sure all transitive memberships are available
  buildMemberOf(groups, users);
}

/**
 * Reads an entire org as Group and User entities.
 *
 * @public
 */
export async function readMicrosoftGraphOrg(
  client: MicrosoftGraphClient,
  tenantId: string,
  options: {
    userExpand?: string;
    userFilter?: string;
    userSelect?: string[];
    loadUserPhotos?: boolean;
    userGroupMemberSearch?: string;
    userGroupMemberFilter?: string;
    groupExpand?: string;
    groupSearch?: string;
    groupFilter?: string;
    groupSelect?: string[];
    groupIncludeSubGroups?: boolean;
    queryMode?: 'basic' | 'advanced';
    userTransformer?: UserTransformer;
    groupTransformer?: GroupTransformer;
    organizationTransformer?: OrganizationTransformer;
    logger: LoggerService;
  },
): Promise<{ users: UserEntity[]; groups: GroupEntity[] }> {
  let users: UserEntity[] = [];

  if (options.userGroupMemberFilter || options.userGroupMemberSearch) {
    const { users: usersInGroups } = await readMicrosoftGraphUsersInGroups(
      client,
      {
        queryMode: options.queryMode,
        userExpand: options.userExpand,
        userFilter: options.userFilter,
        userSelect: options.userSelect,
        userGroupMemberFilter: options.userGroupMemberFilter,
        userGroupMemberSearch: options.userGroupMemberSearch,
        loadUserPhotos: options.loadUserPhotos,
        transformer: options.userTransformer,
        logger: options.logger,
      },
    );
    users = usersInGroups;
  } else {
    const { users: usersWithFilter } = await readMicrosoftGraphUsers(client, {
      queryMode: options.queryMode,
      userExpand: options.userExpand,
      userFilter: options.userFilter,
      userSelect: options.userSelect,
      loadUserPhotos: options.loadUserPhotos,
      transformer: options.userTransformer,
      logger: options.logger,
    });
    users = usersWithFilter;
  }
  const { groups, rootGroup, groupMember, groupMemberOf } =
    await readMicrosoftGraphGroups(client, tenantId, {
      queryMode: options.queryMode,
      groupExpand: options.groupExpand,
      groupFilter: options.groupFilter,
      groupSearch: options.groupSearch,
      groupSelect: options.groupSelect,
      groupIncludeSubGroups: options.groupIncludeSubGroups,
      groupTransformer: options.groupTransformer,
      organizationTransformer: options.organizationTransformer,
    });

  resolveRelations(rootGroup, groups, users, groupMember, groupMemberOf);
  users.sort((a, b) => a.metadata.name.localeCompare(b.metadata.name));
  groups.sort((a, b) => a.metadata.name.localeCompare(b.metadata.name));

  return { users, groups };
}

async function transformUsers(
  client: MicrosoftGraphClient,
  users: Iterable<MicrosoftGraph.User> | AsyncIterable<MicrosoftGraph.User>,
  logger: LoggerService,
  loadUserPhotos = true,
  transformer?: UserTransformer,
) {
  const limiter = limiterFactory(10);

  const resolvedTransformer = transformer ?? defaultUserTransformer;
  const promises: Promise<void>[] = [];
  const entities: UserEntity[] = [];

  // Process all users in parallel, otherwise it can take quite some time
  for await (const user of users) {
    promises.push(
      limiter(async () => {
        let userPhoto;
        try {
          if (loadUserPhotos) {
            userPhoto = await client.getUserPhotoWithSizeLimit(
              user.id!,
              // We are limiting the photo size, as users with full resolution photos
              // can make the Backstage API slow
              120,
            );
          }
        } catch (e) {
          logger.warn(`Unable to load user photo for`, {
            user: user.id,
            error: e,
          });
        }

        const entity = await resolvedTransformer(user, userPhoto);

        if (entity) {
          entities.push(entity);
        }
      }),
    );
  }

  // Wait for all users and photos to be downloaded
  await Promise.all(promises);

  logger.debug('Finished transforming users', {
    microsoftUserCount: promises.length,
    backstageUserCount: entities.length,
  });
  return entities;
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
