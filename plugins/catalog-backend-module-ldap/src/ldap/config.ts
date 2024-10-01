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
  SchedulerServiceTaskScheduleDefinition,
  readSchedulerServiceTaskScheduleDefinitionFromConfig,
} from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { JsonValue } from '@backstage/types';
import { SearchOptions } from 'ldapjs';
import mergeWith from 'lodash/mergeWith';
import { trimEnd } from 'lodash';
import { RecursivePartial } from './util';

/**
 * The configuration parameters for a single LDAP provider.
 *
 * @public
 */
export type LdapProviderConfig = {
  // The id of the
  id: string;
  // The prefix of the target that this matches on, e.g.
  // "ldaps://ds.example.net", with no trailing slash.
  target: string;
  // TLS settings
  tls?: TLSConfig;
  // The settings to use for the bind command. If none are specified, the bind
  // command is not issued.
  bind?: BindConfig;
  // The settings that govern the reading and interpretation of users
  users: UserConfig[];
  // The settings that govern the reading and interpretation of groups
  groups: GroupConfig[];
  // Schedule configuration for refresh tasks.
  schedule?: SchedulerServiceTaskScheduleDefinition;
  // Configuration for overriding the vendor-specific default attribute names.
  vendor?: VendorConfig;
};

/**
 * TLS settings
 *
 * @public
 */
export type TLSConfig = {
  // Node TLS rejectUnauthorized
  rejectUnauthorized?: boolean;
  // A file containing private keys in PEM format
  keys?: string;
  // A file containing cert chains in PEM format
  certs?: string;
};

/**
 * The settings to use for the a command.
 *
 * @public
 */
export type BindConfig = {
  // The DN of the user to auth as, e.g.
  // uid=ldap-robot,ou=robots,ou=example,dc=example,dc=net
  dn: string;
  // The secret of the user to auth as (its password)
  secret: string;
};

/**
 * The settings that govern the reading and interpretation of users.
 *
 * @public
 */
export type UserConfig = {
  // The DN under which users are stored.
  dn: string;
  // The search options to use.
  // Only the scope, filter, attributes, and paged fields are supported. The
  // default is scope "one" and attributes "*" and "+".
  options: SearchOptions;
  // JSON paths (on a.b.c form) and hard coded values to set on those paths
  set?: { [path: string]: JsonValue };
  // Mappings from well known entity fields, to LDAP attribute names
  map: {
    // The name of the attribute that holds the relative distinguished name of
    // each entry. Defaults to "uid".
    rdn: string;
    // The name of the attribute that shall be used for the value of the
    // metadata.name field of the entity. Defaults to "uid".
    name: string;
    // The name of the attribute that shall be used for the value of the
    // metadata.description field of the entity.
    description?: string;
    // The name of the attribute that shall be used for the value of the
    // spec.profile.displayName field of the entity. Defaults to "cn".
    displayName: string;
    // The name of the attribute that shall be used for the value of the
    // spec.profile.email field of the entity. Defaults to "mail".
    email: string;
    // The name of the attribute that shall be used for the value of the
    // spec.profile.picture field of the entity.
    picture?: string;
    // The name of the attribute that shall be used for the values of the
    // spec.memberOf field of the entity. Defaults to "memberOf".
    memberOf: string;
  };
};

/**
 * The settings that govern the reading and interpretation of groups.
 *
 * @public
 */
export type GroupConfig = {
  // The DN under which groups are stored.
  dn: string;
  // The search options to use.
  // Only the scope, filter, attributes, and paged fields are supported.
  options: SearchOptions;
  // JSON paths (on a.b.c form) and hard coded values to set on those paths
  set?: { [path: string]: JsonValue };
  // Mappings from well known entity fields, to LDAP attribute names
  map: {
    // The name of the attribute that holds the relative distinguished name of
    // each entry. Defaults to "cn".
    rdn: string;
    // The name of the attribute that shall be used for the value of the
    // metadata.name field of the entity. Defaults to "cn".
    name: string;
    // The name of the attribute that shall be used for the value of the
    // metadata.description field of the entity. Defaults to "description".
    description: string;
    // The name of the attribute that shall be used for the value of the
    // spec.type field of the entity. Defaults to "groupType".
    type: string;
    // The name of the attribute that shall be used for the value of the
    // spec.profile.displayName field of the entity. Defaults to "cn".
    displayName: string;
    // The name of the attribute that shall be used for the value of the
    // spec.profile.email field of the entity.
    email?: string;
    // The name of the attribute that shall be used for the value of the
    // spec.profile.picture field of the entity.
    picture?: string;
    // The name of the attribute that shall be used for the values of the
    // spec.parent field of the entity. Defaults to "memberOf".
    memberOf: string;
    // The name of the attribute that shall be used for the values of the
    // spec.children field of the entity. Defaults to "member".
    members: string;
  };
};

/**
 * Configuration for LDAP vendor-specific attributes.
 *
 * Allows custom attribute names for distinguished names (DN) and
 * universally unique identifiers (UUID) in LDAP directories.
 *
 * @public
 */
export type VendorConfig = {
  /**
   * Attribute name for the distinguished name (DN) of an entry,
   */
  dnAttributeName?: string;

  /**
   * Attribute name for the unique identifier (UUID) of an entry,
   */
  uuidAttributeName?: string;

  /**
   * Attribute to determine if we need to force the DN and members/memberOf values to be forced to same case.
   * Some providers may provide lowercase members but multicase DN names which causes the group filtering to break.
   * The default is off, but turning this on forces the inbound DN values and all member values to lowercase.
   */
  dnCaseSensitive?: boolean;
};

const defaultUserConfig = {
  options: {
    scope: 'one',
    attributes: ['*', '+'],
  },
  map: {
    rdn: 'uid',
    name: 'uid',
    displayName: 'cn',
    email: 'mail',
    memberOf: 'memberOf',
  },
};

const defaultGroupConfig = {
  options: {
    scope: 'one',
    attributes: ['*', '+'],
  },
  map: {
    rdn: 'cn',
    name: 'cn',
    description: 'description',
    displayName: 'cn',
    type: 'groupType',
    memberOf: 'memberOf',
    members: 'member',
  },
};

function freeze<T>(data: T): T {
  return JSON.parse(JSON.stringify(data), (_key, value) => {
    if (typeof value === 'object' && value !== null) {
      Object.freeze(value);
    }
    return value;
  });
}

function readTlsConfig(
  c: Config | undefined,
): LdapProviderConfig['tls'] | undefined {
  if (!c) {
    return undefined;
  }
  return {
    rejectUnauthorized: c.getOptionalBoolean('rejectUnauthorized'),
    keys: c.getOptionalString('keys'),
    certs: c.getOptionalString('certs'),
  };
}

function readBindConfig(
  c: Config | undefined,
): LdapProviderConfig['bind'] | undefined {
  if (!c) {
    return undefined;
  }
  return {
    dn: c.getString('dn'),
    secret: c.getString('secret'),
  };
}

function readVendorConfig(
  c: Config | undefined,
): LdapProviderConfig['vendor'] | undefined {
  if (!c) {
    return undefined;
  }
  return {
    dnAttributeName: c.getOptionalString('dnAttributeName'),
    uuidAttributeName: c.getOptionalString('uuidAttributeName'),
    dnCaseSensitive: c.getOptionalBoolean('dnCaseSensitive'),
  };
}

function readOptionsConfig(c: Config | undefined): SearchOptions {
  if (!c) {
    return {};
  }

  const paged = readOptionsPagedConfig(c);

  return {
    scope: c.getOptionalString('scope') as SearchOptions['scope'],
    filter: formatFilter(c.getOptionalString('filter')),
    attributes: c.getOptionalStringArray('attributes'),
    sizeLimit: c.getOptionalNumber('sizeLimit'),
    timeLimit: c.getOptionalNumber('timeLimit'),
    derefAliases: c.getOptionalNumber('derefAliases'),
    typesOnly: c.getOptionalBoolean('typesOnly'),
    ...(paged !== undefined ? { paged } : undefined),
  };
}

function readOptionsPagedConfig(c: Config): SearchOptions['paged'] {
  const pagedConfig = c.getOptional('paged');
  if (pagedConfig === undefined) {
    return undefined;
  }

  if (pagedConfig === true || pagedConfig === false) {
    return pagedConfig;
  }

  const pageSize = c.getOptionalNumber('paged.pageSize');
  const pagePause = c.getOptionalBoolean('paged.pagePause');
  return {
    ...(pageSize !== undefined ? { pageSize } : undefined),
    ...(pagePause !== undefined ? { pagePause } : undefined),
  };
}

function readSetConfig(
  c: Config | undefined,
): { [path: string]: JsonValue } | undefined {
  if (!c) {
    return undefined;
  }
  return c.get();
}

function readUserMapConfig(c: Config | undefined): Partial<UserConfig['map']> {
  if (!c) {
    return {};
  }

  return {
    rdn: c.getOptionalString('rdn'),
    name: c.getOptionalString('name'),
    description: c.getOptionalString('description'),
    displayName: c.getOptionalString('displayName'),
    email: c.getOptionalString('email'),
    picture: c.getOptionalString('picture'),
    memberOf: c.getOptionalString('memberOf'),
  };
}

function readGroupMapConfig(
  c: Config | undefined,
): Partial<GroupConfig['map']> {
  if (!c) {
    return {};
  }

  return {
    rdn: c.getOptionalString('rdn'),
    name: c.getOptionalString('name'),
    description: c.getOptionalString('description'),
    type: c.getOptionalString('type'),
    displayName: c.getOptionalString('displayName'),
    email: c.getOptionalString('email'),
    picture: c.getOptionalString('picture'),
    memberOf: c.getOptionalString('memberOf'),
    members: c.getOptionalString('members'),
  };
}

function readUserConfig(
  c: Config | Config[] | undefined,
): RecursivePartial<LdapProviderConfig['users']> {
  if (!c) {
    return [];
  }
  if (Array.isArray(c)) {
    return c.map(it => readSingleUserConfig(it));
  }
  return [readSingleUserConfig(c)];
}

function readSingleUserConfig(c: Config): RecursivePartial<UserConfig> {
  return {
    dn: c.getString('dn'),
    options: readOptionsConfig(c.getOptionalConfig('options')),
    set: readSetConfig(c.getOptionalConfig('set')),
    map: readUserMapConfig(c.getOptionalConfig('map')),
  };
}

function readGroupConfig(
  c: Config | Config[] | undefined,
): RecursivePartial<LdapProviderConfig['groups']> {
  if (!c) {
    return [];
  }
  if (Array.isArray(c)) {
    return c.map(it => readSingleGroupConfig(it));
  }
  return [readSingleGroupConfig(c)];
}

function readSingleGroupConfig(c: Config): RecursivePartial<GroupConfig> {
  return {
    dn: c.getString('dn'),
    options: readOptionsConfig(c.getOptionalConfig('options')),
    set: readSetConfig(c.getOptionalConfig('set')),
    map: readGroupMapConfig(c.getOptionalConfig('map')),
  };
}

function formatFilter(filter?: string): string | undefined {
  // Remove extra whitespace between blocks to support multiline filters from the configuration
  return filter?.replace(/\s*(\(|\))/g, '$1')?.trim();
}

/**
 * Parses configuration.
 *
 * @param config - The root of the LDAP config hierarchy
 *
 * @public
 * @deprecated This exists for backwards compatibility only and will be removed in the future.
 */
export function readLdapLegacyConfig(config: Config): LdapProviderConfig[] {
  const providerConfigs = config.getOptionalConfigArray('providers') ?? [];
  return providerConfigs.map(c => {
    const newConfig = {
      target: trimEnd(c.getString('target'), '/'),
      tls: readTlsConfig(c.getOptionalConfig('tls')),
      bind: readBindConfig(c.getOptionalConfig('bind')),
      users: readUserConfig(c.getConfig('users')).map(it => {
        return mergeWith({}, defaultUserConfig, it, replaceArraysIfPresent);
      }),
      groups: readGroupConfig(c.getConfig('groups')).map(it => {
        return mergeWith({}, defaultGroupConfig, it, replaceArraysIfPresent);
      }),
      vendor: readVendorConfig(c.getOptionalConfig('vendor')),
    };

    return freeze(newConfig) as LdapProviderConfig;
  });
}

/**
 * Parses all configured providers.
 *
 * @param config - The root of the LDAP config hierarchy
 *
 * @public
 */
export function readProviderConfigs(config: Config): LdapProviderConfig[] {
  const providersConfig = config.getOptionalConfig('catalog.providers.ldapOrg');
  if (!providersConfig) {
    return [];
  }

  return providersConfig.keys().map(id => {
    const c = providersConfig.getConfig(id);
    const schedule = c.has('schedule')
      ? readSchedulerServiceTaskScheduleDefinitionFromConfig(
          c.getConfig('schedule'),
        )
      : undefined;

    const isUserList = Array.isArray(c.getOptional('users'));
    const isGroupList = Array.isArray(c.getOptional('groups'));

    const newConfig = {
      id,
      target: trimEnd(c.getString('target'), '/'),
      tls: readTlsConfig(c.getOptionalConfig('tls')),
      bind: readBindConfig(c.getOptionalConfig('bind')),
      users: readUserConfig(
        isUserList
          ? c.getOptionalConfigArray('users')
          : c.getOptionalConfig('users'),
      ).map(it => {
        return mergeWith({}, defaultUserConfig, it, replaceArraysIfPresent);
      }),
      groups: readGroupConfig(
        isGroupList
          ? c.getOptionalConfigArray('groups')
          : c.getOptionalConfig('groups'),
      ).map(it => {
        return mergeWith({}, defaultGroupConfig, it, replaceArraysIfPresent);
      }),
      schedule,
      vendor: readVendorConfig(c.getOptionalConfig('vendor')),
    };

    return freeze(newConfig) as LdapProviderConfig;
  });
}

function replaceArraysIfPresent(_into: any, from: any) {
  // Replace arrays instead of merging, otherwise default behavior
  return Array.isArray(from) ? from : undefined;
}
