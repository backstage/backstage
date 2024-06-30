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
import { SearchEntry } from 'ldapjs';
import lodashSet from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import { buildOrgHierarchy } from './org';
import { LdapClient } from './client';
import { GroupConfig, UserConfig } from './config';
import {
  LDAP_DN_ANNOTATION,
  LDAP_RDN_ANNOTATION,
  LDAP_UUID_ANNOTATION,
} from './constants';
import { LdapVendor } from './vendors';
import { GroupTransformer, UserTransformer } from './types';
import { mapStringAttr } from './util';
import { LoggerService } from '@backstage/backend-plugin-api';

/**
 * The default implementation of the transformation from an LDAP entry to a
 * User entity.
 *
 * @public
 */
export async function defaultUserTransformer(
  vendor: LdapVendor,
  config: UserConfig,
  entry: SearchEntry,
): Promise<UserEntity | undefined> {
  const { set, map } = config;

  const entity: UserEntity = {
    apiVersion: 'backstage.io/v1beta1',
    kind: 'User',
    metadata: {
      name: '',
      annotations: {},
    },
    spec: {
      profile: {},
      memberOf: [],
    },
  };

  if (set) {
    for (const [path, value] of Object.entries(set)) {
      lodashSet(entity, path, cloneDeep(value));
    }
  }

  mapStringAttr(entry, vendor, map.name, v => {
    entity.metadata.name = v;
  });
  mapStringAttr(entry, vendor, map.description, v => {
    entity.metadata.description = v;
  });
  mapStringAttr(entry, vendor, map.rdn, v => {
    entity.metadata.annotations![LDAP_RDN_ANNOTATION] = v;
  });
  mapStringAttr(entry, vendor, vendor.uuidAttributeName, v => {
    entity.metadata.annotations![LDAP_UUID_ANNOTATION] = v;
  });
  mapStringAttr(entry, vendor, vendor.dnAttributeName, v => {
    entity.metadata.annotations![LDAP_DN_ANNOTATION] = v;
  });
  mapStringAttr(entry, vendor, map.displayName, v => {
    entity.spec.profile!.displayName = v;
  });
  mapStringAttr(entry, vendor, map.email, v => {
    entity.spec.profile!.email = v;
  });
  mapStringAttr(entry, vendor, map.picture, v => {
    entity.spec.profile!.picture = v;
  });

  return entity;
}

/**
 * Reads users out of an LDAP provider.
 *
 * @param client - The LDAP client
 * @param config - The user data configuration
 * @param opts - Additional options
 */
export async function readLdapUsers(
  client: LdapClient,
  config: UserConfig[],
  opts?: { transformer?: UserTransformer },
): Promise<{
  users: UserEntity[]; // With all relations empty
  userMemberOf: Map<string, Set<string>>; // DN -> DN or UUID of groups
}> {
  if (config.length === 0) {
    return { users: [], userMemberOf: new Map() };
  }
  const entities: UserEntity[] = [];
  const userMemberOf: Map<string, Set<string>> = new Map();

  const vendor = await client.getVendor();
  const transformer = opts?.transformer ?? defaultUserTransformer;

  for (const cfg of config) {
    const { dn, options, map } = cfg;
    await client.searchStreaming(dn, options, async user => {
      const entity = await transformer(vendor, cfg, user);

      if (!entity) {
        return;
      }

      mapReferencesAttr(user, vendor, map.memberOf, (myDn, vs) => {
        ensureItems(userMemberOf, myDn, vs);
      });
      entities.push(entity);
    });
  }

  return { users: entities, userMemberOf };
}

/**
 * The default implementation of the transformation from an LDAP entry to a
 * Group entity.
 *
 * @public
 */
export async function defaultGroupTransformer(
  vendor: LdapVendor,
  config: GroupConfig,
  entry: SearchEntry,
): Promise<GroupEntity | undefined> {
  const { set, map } = config;
  const entity: GroupEntity = {
    apiVersion: 'backstage.io/v1beta1',
    kind: 'Group',
    metadata: {
      name: '',
      annotations: {},
    },
    spec: {
      type: 'unknown',
      profile: {},
      children: [],
    },
  };

  if (set) {
    for (const [path, value] of Object.entries(set)) {
      lodashSet(entity, path, cloneDeep(value));
    }
  }

  mapStringAttr(entry, vendor, map.name, v => {
    entity.metadata.name = v;
  });
  mapStringAttr(entry, vendor, map.description, v => {
    entity.metadata.description = v;
  });
  mapStringAttr(entry, vendor, map.rdn, v => {
    entity.metadata.annotations![LDAP_RDN_ANNOTATION] = v;
  });
  mapStringAttr(entry, vendor, vendor.uuidAttributeName, v => {
    entity.metadata.annotations![LDAP_UUID_ANNOTATION] = v;
  });
  mapStringAttr(entry, vendor, vendor.dnAttributeName, v => {
    entity.metadata.annotations![LDAP_DN_ANNOTATION] = v;
  });
  mapStringAttr(entry, vendor, map.type, v => {
    entity.spec.type = v;
  });
  mapStringAttr(entry, vendor, map.displayName, v => {
    entity.spec.profile!.displayName = v;
  });
  mapStringAttr(entry, vendor, map.email, v => {
    entity.spec.profile!.email = v;
  });
  mapStringAttr(entry, vendor, map.picture, v => {
    entity.spec.profile!.picture = v;
  });

  return entity;
}

/**
 * Reads groups out of an LDAP provider.
 *
 * @param client - The LDAP client
 * @param config - The group data configuration
 * @param opts - Additional options
 */
export async function readLdapGroups(
  client: LdapClient,
  config: GroupConfig[],
  opts?: {
    transformer?: GroupTransformer;
  },
): Promise<{
  groups: GroupEntity[]; // With all relations empty
  groupMemberOf: Map<string, Set<string>>; // DN -> DN or UUID of groups
  groupMember: Map<string, Set<string>>; // DN -> DN or UUID of groups & users
}> {
  if (config.length === 0) {
    return { groups: [], groupMemberOf: new Map(), groupMember: new Map() };
  }
  const groups: GroupEntity[] = [];
  const groupMemberOf: Map<string, Set<string>> = new Map();
  const groupMember: Map<string, Set<string>> = new Map();

  const vendor = await client.getVendor();
  const transformer = opts?.transformer ?? defaultGroupTransformer;

  for (const cfg of config) {
    const { dn, map, options } = cfg;

    await client.searchStreaming(dn, options, async entry => {
      if (!entry) {
        return;
      }

      const entity = await transformer(vendor, cfg, entry);

      if (!entity) {
        return;
      }

      mapReferencesAttr(entry, vendor, map.memberOf, (myDn, vs) => {
        ensureItems(groupMemberOf, myDn, vs);
      });
      mapReferencesAttr(entry, vendor, map.members, (myDn, vs) => {
        ensureItems(groupMember, myDn, vs);
      });

      groups.push(entity);
    });
  }

  return {
    groups,
    groupMemberOf,
    groupMember,
  };
}

/**
 * Reads users and groups out of an LDAP provider.
 *
 * @param client - The LDAP client
 * @param userConfig - The user data configuration
 * @param groupConfig - The group data configuration
 * @param options - Additional options
 *
 * @public
 */
export async function readLdapOrg(
  client: LdapClient,
  userConfig: UserConfig[],
  groupConfig: GroupConfig[],
  options: {
    groupTransformer?: GroupTransformer;
    userTransformer?: UserTransformer;
    logger: LoggerService;
  },
): Promise<{
  users: UserEntity[];
  groups: GroupEntity[];
}> {
  // Invokes the above "raw" read functions and stitches together the results
  // with all relations etc filled in.

  const { users, userMemberOf } = await readLdapUsers(client, userConfig, {
    transformer: options?.userTransformer,
  });
  const { groups, groupMemberOf, groupMember } = await readLdapGroups(
    client,
    groupConfig,
    { transformer: options?.groupTransformer },
  );

  resolveRelations(groups, users, userMemberOf, groupMemberOf, groupMember);
  users.sort((a, b) => a.metadata.name.localeCompare(b.metadata.name));
  groups.sort((a, b) => a.metadata.name.localeCompare(b.metadata.name));

  return { users, groups };
}

//
// Helpers
//

// Maps a multi-valued attribute of references to other objects, to a consumer
function mapReferencesAttr(
  entry: SearchEntry,
  vendor: LdapVendor,
  attributeName: string | undefined,
  setter: (sourceDn: string, targets: string[]) => void,
) {
  if (attributeName) {
    const values = vendor.decodeStringAttribute(entry, attributeName);
    const dn = vendor.decodeStringAttribute(entry, vendor.dnAttributeName);
    if (values && dn && dn.length === 1) {
      setter(dn[0], values);
    }
  }
}

// Inserts a number of values in a key-values mapping
function ensureItems(
  target: Map<string, Set<string>>,
  key: string,
  values: string[],
) {
  if (key) {
    let set = target.get(key);
    if (!set) {
      set = new Set();
      target.set(key, set);
    }
    for (const value of values) {
      if (value) {
        set!.add(value);
      }
    }
  }
}

/**
 * Takes groups and entities with empty relations, and fills in the various
 * relations that were returned by the readers, and forms the org hierarchy.
 *
 * @param groups - Group entities with empty relations; modified in place
 * @param users - User entities with empty relations; modified in place
 * @param userMemberOf - For a user DN, the set of group DNs or UUIDs that the
 *        user is a member of
 * @param groupMemberOf - For a group DN, the set of group DNs or UUIDs that
 *        the group is a member of (parents in the hierarchy)
 * @param groupMember - For a group DN, the set of group DNs or UUIDs that are
 *        members of the group (children in the hierarchy)
 */
export function resolveRelations(
  groups: GroupEntity[],
  users: UserEntity[],
  userMemberOf: Map<string, Set<string>>,
  groupMemberOf: Map<string, Set<string>>,
  groupMember: Map<string, Set<string>>,
) {
  // Build reference lookup tables - all of the relations that are output from
  // the above calls can be expressed as either DNs or UUIDs so we need to be
  // able to find by both, as well as the entity reference. Note that we expect them to not
  // collide here - this is a reasonable assumption as long as the fields are
  // the supported forms.
  const userMap: Map<string, UserEntity> = new Map(); // by entityRef, dn, uuid
  const groupMap: Map<string, GroupEntity> = new Map(); // by entityRef, dn, uuid
  for (const user of users) {
    userMap.set(stringifyEntityRef(user), user);
    userMap.set(user.metadata.annotations![LDAP_DN_ANNOTATION], user);
    userMap.set(user.metadata.annotations![LDAP_RDN_ANNOTATION], user);
    userMap.set(user.metadata.annotations![LDAP_UUID_ANNOTATION], user);
  }
  for (const group of groups) {
    groupMap.set(stringifyEntityRef(group), group);
    groupMap.set(group.metadata.annotations![LDAP_DN_ANNOTATION], group);
    groupMap.set(group.metadata.annotations![LDAP_RDN_ANNOTATION], group);
    groupMap.set(group.metadata.annotations![LDAP_UUID_ANNOTATION], group);
  }

  // This can happen e.g. if entryUUID wasn't returned by the server
  userMap.delete('');
  groupMap.delete('');
  userMap.delete(undefined!);
  groupMap.delete(undefined!);

  // Fill in all of the immediate relations, now keyed on the entity reference. We
  // keep all parents at this point, whether the target model can support more
  // than one or not (it gets filtered farther down). And group children are
  // only groups in here.
  const newUserMemberOf: Map<string, Set<string>> = new Map();
  const newGroupParents: Map<string, Set<string>> = new Map();
  const newGroupChildren: Map<string, Set<string>> = new Map();

  // Resolve and store in the intermediaries. It may seem redundant that the
  // input data has both parent and children directions, as well as both
  // user->group and group->user - the reason is that different LDAP schemas
  // express relations in different directions. Some may have a user memberOf
  // overlay, some don't, for example.
  for (const [userN, groupsN] of userMemberOf.entries()) {
    const user = userMap.get(userN);
    if (user) {
      for (const groupN of groupsN) {
        const group = groupMap.get(groupN);
        if (group) {
          ensureItems(newUserMemberOf, stringifyEntityRef(user), [
            stringifyEntityRef(group),
          ]);
        }
      }
    }
  }
  for (const [groupN, parentsN] of groupMemberOf.entries()) {
    const group = groupMap.get(groupN);
    if (group) {
      for (const parentN of parentsN) {
        const parentGroup = groupMap.get(parentN);
        if (parentGroup) {
          ensureItems(newGroupParents, stringifyEntityRef(group), [
            stringifyEntityRef(parentGroup),
          ]);
          ensureItems(newGroupChildren, stringifyEntityRef(parentGroup), [
            stringifyEntityRef(group),
          ]);
        }
      }
    }
  }
  for (const [groupN, membersN] of groupMember.entries()) {
    const group = groupMap.get(groupN);
    if (group) {
      for (const memberN of membersN) {
        // Group members can be both users and groups in the input model, so
        // try both
        const memberUser = userMap.get(memberN);
        if (memberUser) {
          ensureItems(newUserMemberOf, stringifyEntityRef(memberUser), [
            stringifyEntityRef(group),
          ]);
        } else {
          const memberGroup = groupMap.get(memberN);
          if (memberGroup) {
            ensureItems(newGroupChildren, stringifyEntityRef(group), [
              stringifyEntityRef(memberGroup),
            ]);
            ensureItems(newGroupParents, stringifyEntityRef(memberGroup), [
              stringifyEntityRef(group),
            ]);
          }
        }
      }
    }
  }

  // Write down the relations again into the actual entities
  for (const [userN, groupsN] of newUserMemberOf.entries()) {
    const user = userMap.get(userN);
    if (user) {
      user.spec.memberOf = Array.from(groupsN).sort();
    }
  }
  for (const [groupN, parentsN] of newGroupParents.entries()) {
    if (parentsN.size === 1) {
      const group = groupMap.get(groupN);
      if (group) {
        group.spec.parent = parentsN.values().next().value;
      }
    }
  }
  for (const [groupN, childrenN] of newGroupChildren.entries()) {
    const group = groupMap.get(groupN);
    if (group) {
      group.spec.children = Array.from(childrenN).sort();
    }
  }

  // Fill out the rest of the hierarchy
  buildOrgHierarchy(groups);
}
