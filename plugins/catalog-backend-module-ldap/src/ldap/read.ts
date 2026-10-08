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

import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import { Entry } from 'ldapts';
import lodashSet from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import { LdapClient } from './client';
import { GroupConfig, UserConfig, VendorConfig } from './config';
import {
  LDAP_DN_ANNOTATION,
  LDAP_RDN_ANNOTATION,
  LDAP_UUID_ANNOTATION,
} from './constants';
import { LdapVendor } from './vendors';
import { GroupTransformer, UserTransformer } from './types';
import { mapStringAttr } from './util';
import { LoggerService } from '@backstage/backend-plugin-api';
import { InputError } from '@backstage/errors';
import { resolveOrgRelations } from './relations';

/**
 * The default implementation of the transformation from an LDAP entry to a
 * User entity.
 *
 * @public
 */
export async function defaultUserTransformer(
  vendor: LdapVendor,
  config: UserConfig,
  entry: Entry,
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

  if (!entity.metadata.name) {
    throw new InputError(
      `User syncing failed: missing '${map.name}' attribute, consider applying a user filter to skip processing users with incomplete data.`,
    );
  }

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
  userConfig: UserConfig[],
  vendorConfig: VendorConfig | undefined,
  opts?: { transformer?: UserTransformer },
): Promise<{
  users: UserEntity[]; // With all relations empty
  userMemberOf: Map<string, Set<string>>; // DN -> DN or UUID of groups
}> {
  if (userConfig.length === 0) {
    return { users: [], userMemberOf: new Map() };
  }
  const entities: UserEntity[] = [];
  const userMemberOf: Map<string, Set<string>> = new Map();
  const vendorDefaults = await client.getVendor();
  const vendor: LdapVendor = {
    dnAttributeName:
      vendorConfig?.dnAttributeName ?? vendorDefaults.dnAttributeName,
    uuidAttributeName:
      vendorConfig?.uuidAttributeName ?? vendorDefaults.uuidAttributeName,
    decodeStringAttribute: vendorDefaults.decodeStringAttribute,
  };
  const transformer = opts?.transformer ?? defaultUserTransformer;

  for (const cfg of userConfig) {
    const { dn, options, map } = cfg;
    const searchResult = await client.search(dn, options);
    for (const entry of searchResult.searchEntries) {
      const entity = await transformer(vendor, cfg, entry);

      if (!entity) {
        continue;
      }

      mapReferencesAttr(entry, vendor, map.memberOf, (myDn, vs) => {
        ensureItems(userMemberOf, myDn, vs);
      });

      entities.push(entity);
    }
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
  entry: Entry,
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

  if (!entity.metadata.name) {
    throw new InputError(
      `Group syncing failed: missing '${map.name}' attribute, consider applying a group filter to skip processing groups with incomplete data.`,
    );
  }

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
  groupConfig: GroupConfig[],
  vendorConfig: VendorConfig | undefined,
  opts?: {
    transformer?: GroupTransformer;
  },
): Promise<{
  groups: GroupEntity[]; // With all relations empty
  groupMemberOf: Map<string, Set<string>>; // DN -> DN or UUID of groups
  groupMember: Map<string, Set<string>>; // DN -> DN or UUID of groups & users
}> {
  if (groupConfig.length === 0) {
    return { groups: [], groupMemberOf: new Map(), groupMember: new Map() };
  }
  const groups: GroupEntity[] = [];
  const groupMemberOf: Map<string, Set<string>> = new Map();
  const groupMember: Map<string, Set<string>> = new Map();

  const vendorDefaults = await client.getVendor();
  const vendor: LdapVendor = {
    dnAttributeName:
      vendorConfig?.dnAttributeName ?? vendorDefaults.dnAttributeName,
    uuidAttributeName:
      vendorConfig?.uuidAttributeName ?? vendorDefaults.uuidAttributeName,
    decodeStringAttribute: vendorDefaults.decodeStringAttribute,
  };

  const transformer = opts?.transformer ?? defaultGroupTransformer;

  for (const cfg of groupConfig) {
    const { dn, map, options } = cfg;
    const searchResult = await client.search(dn, options);
    for (const entry of searchResult.searchEntries) {
      const entity = await transformer(vendor, cfg, entry);

      if (!entity) {
        continue;
      }

      mapReferencesAttr(entry, vendor, map.memberOf, (myDn, vs) => {
        ensureItems(groupMemberOf, myDn, vs);
      });

      mapReferencesAttr(entry, vendor, map.members, (myDn, vs) => {
        ensureItems(groupMember, myDn, vs);
      });

      groups.push(entity);
    }
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
  vendorConfig: VendorConfig | undefined,
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

  const { users, userMemberOf } = await readLdapUsers(
    client,
    userConfig,
    vendorConfig,
    {
      transformer: options?.userTransformer,
    },
  );
  const { groups, groupMemberOf, groupMember } = await readLdapGroups(
    client,
    groupConfig,
    vendorConfig,
    { transformer: options?.groupTransformer },
  );

  await resolveOrgRelations(groups, users, {
    userMemberOf,
    groupMemberOf,
    groupMember,
  });
  users.sort((a, b) => a.metadata.name.localeCompare(b.metadata.name));
  groups.sort((a, b) => a.metadata.name.localeCompare(b.metadata.name));

  return { users, groups };
}

//
// Helpers
//

// Maps a multi-valued attribute of references to other objects, to a consumer
function mapReferencesAttr(
  entry: Entry,
  vendor: LdapVendor,
  attributeName: string | undefined | null,
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
