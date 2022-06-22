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
import { SearchEntry } from 'ldapjs';
import merge from 'lodash/merge';
import { LdapClient } from './client';
import { GroupConfig, UserConfig } from './config';
import {
  LDAP_DN_ANNOTATION,
  LDAP_RDN_ANNOTATION,
  LDAP_UUID_ANNOTATION,
} from './constants';
import {
  defaultGroupTransformer,
  defaultUserTransformer,
  readLdapGroups,
  readLdapUsers,
  resolveRelations,
} from './read';
import { RecursivePartial } from './util';
import { ActiveDirectoryVendor, DefaultLdapVendor } from './vendors';

function user(data: RecursivePartial<UserEntity>): UserEntity {
  return merge(
    {},
    {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: { name: 'name' },
      spec: { profile: {}, memberOf: [] },
    } as UserEntity,
    data,
  );
}

function group(data: RecursivePartial<GroupEntity>): GroupEntity {
  return merge(
    {},
    {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: { name: 'name' },
      spec: { type: 'type', children: [] },
    } as GroupEntity,
    data,
  );
}

function searchEntry(
  attributes: Record<string, string[] | Buffer[]>,
): SearchEntry {
  return {
    raw: Object.entries(attributes).reduce((obj, [key, values]) => {
      obj[key] = values;
      return obj;
    }, {} as any),
  } as any;
}

describe('readLdapUsers', () => {
  const client: jest.Mocked<LdapClient> = {
    searchStreaming: jest.fn(),
    getVendor: jest.fn(),
  } as any;

  afterEach(() => jest.resetAllMocks());

  it('transfers all attributes from a default ldap vendor', async () => {
    client.getVendor.mockResolvedValue(DefaultLdapVendor);
    client.searchStreaming.mockImplementation(async (_dn, _opts, fn) => {
      await fn(
        searchEntry({
          uid: ['uid-value'],
          description: ['description-value'],
          cn: ['cn-value'],
          mail: ['mail-value'],
          avatarUrl: ['avatarUrl-value'],
          memberOf: ['x', 'y', 'z'],
          entryDN: ['dn-value'],
          entryUUID: ['uuid-value'],
        }),
      );
    });
    const config: UserConfig = {
      dn: 'ddd',
      options: {},
      map: {
        rdn: 'uid',
        name: 'uid',
        description: 'description',
        displayName: 'cn',
        email: 'mail',
        picture: 'avatarUrl',
        memberOf: 'memberOf',
      },
    };
    const { users, userMemberOf } = await readLdapUsers(client, config);
    expect(users).toEqual([
      expect.objectContaining({
        metadata: {
          name: 'uid-value',
          description: 'description-value',
          annotations: {
            [LDAP_DN_ANNOTATION]: 'dn-value',
            [LDAP_RDN_ANNOTATION]: 'uid-value',
            [LDAP_UUID_ANNOTATION]: 'uuid-value',
          },
        },
        spec: {
          profile: {
            displayName: 'cn-value',
            email: 'mail-value',
            picture: 'avatarUrl-value',
          },
          memberOf: [],
        },
      }),
    ]);
    expect(userMemberOf).toEqual(
      new Map([['dn-value', new Set(['x', 'y', 'z'])]]),
    );
  });

  it('transfers all attributes from Microsoft Active Directory', async () => {
    client.getVendor.mockResolvedValue(ActiveDirectoryVendor);
    client.searchStreaming.mockImplementation(async (_dn, _opts, fn) => {
      await fn(
        searchEntry({
          uid: ['uid-value'],
          description: ['description-value'],
          cn: ['cn-value'],
          mail: ['mail-value'],
          avatarUrl: ['avatarUrl-value'],
          memberOf: ['x', 'y', 'z'],
          distinguishedName: ['dn-value'],
          objectGUID: [
            Buffer.from([
              68, 2, 125, 190, 209, 0, 94, 73, 133, 33, 230, 174, 234, 195, 160,
              152,
            ]),
          ],
        }),
      );
    });
    const config: UserConfig = {
      dn: 'ddd',
      options: {},
      map: {
        rdn: 'uid',
        name: 'uid',
        description: 'description',
        displayName: 'cn',
        email: 'mail',
        picture: 'avatarUrl',
        memberOf: 'memberOf',
      },
    };
    const { users, userMemberOf } = await readLdapUsers(client, config);
    expect(users).toEqual([
      expect.objectContaining({
        metadata: {
          name: 'uid-value',
          description: 'description-value',
          annotations: {
            [LDAP_DN_ANNOTATION]: 'dn-value',
            [LDAP_RDN_ANNOTATION]: 'uid-value',
            [LDAP_UUID_ANNOTATION]: 'be7d0244-00d1-495e-8521-e6aeeac3a098',
          },
        },
        spec: {
          profile: {
            displayName: 'cn-value',
            email: 'mail-value',
            picture: 'avatarUrl-value',
          },
          memberOf: [],
        },
      }),
    ]);
    expect(userMemberOf).toEqual(
      new Map([['dn-value', new Set(['x', 'y', 'z'])]]),
    );
  });
});

describe('readLdapGroups', () => {
  const client: jest.Mocked<LdapClient> = {
    searchStreaming: jest.fn(),
    getVendor: jest.fn(),
  } as any;

  afterEach(() => jest.resetAllMocks());

  it('transfers all attributes from a default ldap vendor', async () => {
    client.getVendor.mockResolvedValue(DefaultLdapVendor);
    client.searchStreaming.mockImplementation(async (_dn, _opts, fn) => {
      await fn(
        searchEntry({
          cn: ['cn-value'],
          description: ['description-value'],
          tt: ['type-value'],
          mail: ['mail-value'],
          avatarUrl: ['avatarUrl-value'],
          memberOf: ['x', 'y', 'z'],
          member: ['e', 'f', 'g'],
          entryDN: ['dn-value'],
          entryUUID: ['uuid-value'],
        }),
      );
    });
    const config: GroupConfig = {
      dn: 'ddd',
      options: {},
      map: {
        rdn: 'cn',
        name: 'cn',
        description: 'description',
        displayName: 'cn',
        email: 'mail',
        picture: 'avatarUrl',
        type: 'tt',
        memberOf: 'memberOf',
        members: 'member',
      },
    };
    const { groups, groupMember, groupMemberOf } = await readLdapGroups(
      client,
      config,
    );
    expect(groups).toEqual([
      expect.objectContaining({
        metadata: {
          name: 'cn-value',
          description: 'description-value',
          annotations: {
            [LDAP_DN_ANNOTATION]: 'dn-value',
            [LDAP_RDN_ANNOTATION]: 'cn-value',
            [LDAP_UUID_ANNOTATION]: 'uuid-value',
          },
        },
        spec: {
          type: 'type-value',
          profile: {
            displayName: 'cn-value',
            email: 'mail-value',
            picture: 'avatarUrl-value',
          },
          children: [],
        },
      }),
    ]);
    expect(groupMember).toEqual(
      new Map([['dn-value', new Set(['e', 'f', 'g'])]]),
    );
    expect(groupMemberOf).toEqual(
      new Map([['dn-value', new Set(['x', 'y', 'z'])]]),
    );
  });

  it('transfers all attributes from Microsoft Active Directory', async () => {
    client.getVendor.mockResolvedValue(ActiveDirectoryVendor);
    client.searchStreaming.mockImplementation(async (_dn, _opts, fn) => {
      await fn(
        searchEntry({
          cn: ['cn-value'],
          description: ['description-value'],
          tt: ['type-value'],
          mail: ['mail-value'],
          avatarUrl: ['avatarUrl-value'],
          memberOf: ['x', 'y', 'z'],
          member: ['e', 'f', 'g'],
          distinguishedName: ['dn-value'],
          objectGUID: [
            Buffer.from([
              68, 2, 125, 190, 209, 0, 94, 73, 133, 33, 230, 174, 234, 195, 160,
              152,
            ]),
          ],
        }),
      );
    });
    const config: GroupConfig = {
      dn: 'ddd',
      options: {},
      map: {
        rdn: 'cn',
        name: 'cn',
        description: 'description',
        displayName: 'cn',
        email: 'mail',
        picture: 'avatarUrl',
        type: 'tt',
        memberOf: 'memberOf',
        members: 'member',
      },
    };
    const { groups, groupMember, groupMemberOf } = await readLdapGroups(
      client,
      config,
    );
    expect(groups).toEqual([
      expect.objectContaining({
        metadata: {
          name: 'cn-value',
          description: 'description-value',
          annotations: {
            [LDAP_DN_ANNOTATION]: 'dn-value',
            [LDAP_RDN_ANNOTATION]: 'cn-value',
            [LDAP_UUID_ANNOTATION]: 'be7d0244-00d1-495e-8521-e6aeeac3a098',
          },
        },
        spec: {
          type: 'type-value',
          profile: {
            displayName: 'cn-value',
            email: 'mail-value',
            picture: 'avatarUrl-value',
          },
          children: [],
        },
      }),
    ]);
    expect(groupMember).toEqual(
      new Map([['dn-value', new Set(['e', 'f', 'g'])]]),
    );
    expect(groupMemberOf).toEqual(
      new Map([['dn-value', new Set(['x', 'y', 'z'])]]),
    );
  });
});

describe('resolveRelations', () => {
  describe('lookup', () => {
    it.each([LDAP_DN_ANNOTATION, LDAP_RDN_ANNOTATION, LDAP_UUID_ANNOTATION])(
      'matches by %s',
      annotation => {
        const parent = group({
          metadata: {
            name: 'parent',
            annotations: { [annotation]: 'pa' },
          },
        });
        const child = group({
          metadata: {
            name: 'child',
            annotations: { [annotation]: 'ca' },
          },
        });
        const groupMember = new Map<string, Set<string>>([
          ['pa', new Set(['ca'])],
        ]);
        resolveRelations(
          [parent, child],
          [],
          new Map(),
          new Map(),
          groupMember,
        );
        expect(parent.spec.children).toEqual(['group:default/child']);
        expect(child.spec.parent).toEqual('group:default/parent');
      },
    );
  });

  describe('userMemberOf', () => {
    it.each([LDAP_DN_ANNOTATION, LDAP_RDN_ANNOTATION, LDAP_UUID_ANNOTATION])(
      'populates relations by %s',
      annotation => {
        const host = group({
          metadata: { name: 'host', annotations: { [annotation]: 'ha' } },
        });
        const member = user({
          metadata: {
            name: 'member',
            annotations: { [annotation]: 'ma' },
          },
        });
        const userMemberOf = new Map<string, Set<string>>([
          ['ma', new Set(['ha'])],
        ]);
        resolveRelations([host], [member], userMemberOf, new Map(), new Map());
        expect(member.spec.memberOf).toEqual(['group:default/host']);
      },
    );
  });

  describe('groupMemberOf', () => {
    it.each([LDAP_DN_ANNOTATION, LDAP_RDN_ANNOTATION, LDAP_UUID_ANNOTATION])(
      'populates relations by %s',
      annotation => {
        const parent = group({
          metadata: {
            name: 'parent',
            annotations: { [annotation]: 'pa' },
          },
        });
        const child = group({
          metadata: {
            name: 'child',
            annotations: { [annotation]: 'ca' },
          },
        });
        const groupMemberOf = new Map<string, Set<string>>([
          ['ca', new Set(['pa'])],
        ]);
        resolveRelations(
          [parent, child],
          [],
          new Map(),
          groupMemberOf,
          new Map(),
        );
        expect(parent.spec.children).toEqual(['group:default/child']);
        expect(child.spec.parent).toEqual('group:default/parent');
      },
    );
  });

  describe('groupMember', () => {
    it.each([LDAP_DN_ANNOTATION, LDAP_RDN_ANNOTATION, LDAP_UUID_ANNOTATION])(
      'populates relations by %s',
      annotation => {
        const parent = group({
          metadata: {
            name: 'parent',
            annotations: { [annotation]: 'pa' },
          },
        });
        const child = group({
          metadata: {
            name: 'child',
            annotations: { [annotation]: 'ca' },
          },
        });
        const member = user({
          metadata: {
            name: 'member',
            annotations: { [annotation]: 'ma' },
          },
        });
        const groupMember = new Map<string, Set<string>>([
          ['pa', new Set(['ca', 'ma'])],
        ]);
        resolveRelations(
          [parent, child],
          [member],
          new Map(),
          new Map(),
          groupMember,
        );
        expect(parent.spec.children).toEqual(['group:default/child']);
        expect(child.spec.parent).toEqual('group:default/parent');
        expect(member.spec.memberOf).toEqual(['group:default/parent']);
      },
    );
  });
});

describe('defaultUserTransformer', () => {
  it('can set things safely', async () => {
    const config: UserConfig = {
      dn: 'ddd',
      options: {},
      map: {
        rdn: 'uid',
        name: 'uid',
        displayName: 'cn',
        email: 'mail',
        memberOf: 'memberOf',
      },
      set: {
        'metadata.annotations.a': 1,
        'metadata.annotations': { a: 2, b: 3 },
      },
    };

    const entry = searchEntry({
      uid: ['uid-value'],
      description: ['description-value'],
      cn: ['cn-value'],
      mail: ['mail-value'],
      avatarUrl: ['avatarUrl-value'],
      memberOf: ['x', 'y', 'z'],
      entryDN: ['dn-value'],
      entryUUID: ['uuid-value'],
    });

    let output = await defaultUserTransformer(DefaultLdapVendor, config, entry);
    expect(output).toEqual({
      apiVersion: 'backstage.io/v1beta1',
      kind: 'User',
      metadata: {
        annotations: {
          'backstage.io/ldap-dn': 'dn-value',
          'backstage.io/ldap-rdn': 'uid-value',
          'backstage.io/ldap-uuid': 'uuid-value',
          a: 2,
          b: 3,
        },
        name: 'uid-value',
      },
      spec: {
        memberOf: [],
        profile: { displayName: 'cn-value', email: 'mail-value' },
      },
    });

    (output!.metadata.annotations as any).c = 7;

    // exact same inputs again
    output = await defaultUserTransformer(DefaultLdapVendor, config, entry);
    expect(output).toEqual({
      apiVersion: 'backstage.io/v1beta1',
      kind: 'User',
      metadata: {
        annotations: {
          'backstage.io/ldap-dn': 'dn-value',
          'backstage.io/ldap-rdn': 'uid-value',
          'backstage.io/ldap-uuid': 'uuid-value',
          a: 2,
          b: 3,
        },
        name: 'uid-value',
      },
      spec: {
        memberOf: [],
        profile: { displayName: 'cn-value', email: 'mail-value' },
      },
    });
  });
});

describe('defaultGroupTransformer', () => {
  it('can set things safely', async () => {
    const config: GroupConfig = {
      dn: 'ddd',
      options: {},
      map: {
        rdn: 'uid',
        name: 'uid',
        displayName: 'cn',
        email: 'mail',
        description: 'description',
        type: 'type',
        members: 'members',
        memberOf: 'memberOf',
      },
      set: {
        'metadata.annotations.a': 1,
        'metadata.annotations': { a: 2, b: 3 },
      },
    };

    const entry = searchEntry({
      uid: ['uid-value'],
      description: ['description-value'],
      cn: ['cn-value'],
      mail: ['mail-value'],
      avatarUrl: ['avatarUrl-value'],
      memberOf: ['x', 'y', 'z'],
      entryDN: ['dn-value'],
      entryUUID: ['uuid-value'],
    });

    let output = await defaultGroupTransformer(
      DefaultLdapVendor,
      config,
      entry,
    );
    expect(output).toEqual({
      apiVersion: 'backstage.io/v1beta1',
      kind: 'Group',
      metadata: {
        annotations: {
          'backstage.io/ldap-dn': 'dn-value',
          'backstage.io/ldap-rdn': 'uid-value',
          'backstage.io/ldap-uuid': 'uuid-value',
          a: 2,
          b: 3,
        },
        description: 'description-value',
        name: 'uid-value',
      },
      spec: {
        type: 'unknown',
        children: [],
        profile: { displayName: 'cn-value', email: 'mail-value' },
      },
    });

    (output!.metadata.annotations as any).c = 7;

    // exact same inputs again
    output = await defaultGroupTransformer(DefaultLdapVendor, config, entry);
    expect(output).toEqual({
      apiVersion: 'backstage.io/v1beta1',
      kind: 'Group',
      metadata: {
        annotations: {
          'backstage.io/ldap-dn': 'dn-value',
          'backstage.io/ldap-rdn': 'uid-value',
          'backstage.io/ldap-uuid': 'uuid-value',
          a: 2,
          b: 3,
        },
        description: 'description-value',
        name: 'uid-value',
      },
      spec: {
        type: 'unknown',
        children: [],
        profile: { displayName: 'cn-value', email: 'mail-value' },
      },
    });
  });
});
