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

import { ConfigReader } from '@backstage/config';
import { readProviderConfigs } from './config';

describe('readLdapConfig', () => {
  it('applies all of the defaults', () => {
    const config = {
      catalog: {
        providers: {
          ldapOrg: {
            default: {
              target: 'target',
              users: {
                dn: 'udn',
              },
              groups: {
                dn: 'gdn',
              },
            },
          },
        },
      },
    };
    const actual = readProviderConfigs(new ConfigReader(config));
    const expected = [
      {
        id: 'default',
        target: 'target',
        bind: undefined,
        users: [
          {
            dn: 'udn',
            options: {
              scope: 'one',
              attributes: [
                'dn',
                'entryDN',
                'distinguishedName',
                'entryUUID',
                'objectGUID',
                'ipaUniqueID',
                'uid',
                'cn',
                'mail',
                'memberOf',
              ],
            },
            set: undefined,
            map: {
              rdn: 'uid',
              name: 'uid',
              displayName: 'cn',
              email: 'mail',
              memberOf: 'memberOf',
            },
          },
        ],
        groups: [
          {
            dn: 'gdn',
            options: {
              scope: 'one',
              attributes: [
                'dn',
                'entryDN',
                'distinguishedName',
                'entryUUID',
                'objectGUID',
                'ipaUniqueID',
                'cn',
                'description',
                'groupType',
                'memberOf',
                'member',
              ],
            },
            set: undefined,
            map: {
              rdn: 'cn',
              name: 'cn',
              description: 'description',
              type: 'groupType',
              displayName: 'cn',
              memberOf: 'memberOf',
              members: 'member',
            },
          },
        ],
      },
    ];
    expect(actual).toEqual(expected);
  });

  it('reads schedules well', () => {
    const config = {
      catalog: {
        providers: {
          ldapOrg: {
            default: {
              schedule: {
                frequency: 'PT3M', // should work for ISO durations
                timeout: { minutes: 1 },
              },
              target: 'target',
              users: {
                dn: 'udn',
              },
              groups: {
                dn: 'gdn',
              },
            },
          },
        },
      },
    };
    const actual = readProviderConfigs(new ConfigReader(config));
    const expected = [
      {
        id: 'default',
        target: 'target',
        bind: undefined,
        schedule: {
          frequency: { minutes: 3 },
          timeout: { minutes: 1 },
        },
        users: [
          {
            dn: 'udn',
            options: {
              scope: 'one',
              attributes: [
                'dn',
                'entryDN',
                'distinguishedName',
                'entryUUID',
                'objectGUID',
                'ipaUniqueID',
                'uid',
                'cn',
                'mail',
                'memberOf',
              ],
            },
            set: undefined,
            map: {
              rdn: 'uid',
              name: 'uid',
              displayName: 'cn',
              email: 'mail',
              memberOf: 'memberOf',
            },
          },
        ],
        groups: [
          {
            dn: 'gdn',
            options: {
              scope: 'one',
              attributes: [
                'dn',
                'entryDN',
                'distinguishedName',
                'entryUUID',
                'objectGUID',
                'ipaUniqueID',
                'cn',
                'description',
                'groupType',
                'memberOf',
                'member',
              ],
            },
            set: undefined,
            map: {
              rdn: 'cn',
              name: 'cn',
              description: 'description',
              type: 'groupType',
              displayName: 'cn',
              memberOf: 'memberOf',
              members: 'member',
            },
          },
        ],
      },
    ];
    expect(actual).toEqual(expected);
  });

  it('reads all the values', () => {
    const config = {
      catalog: {
        providers: {
          ldapOrg: {
            default: {
              target: 'target',
              bind: { dn: 'bdn', secret: 's' },
              tls: {
                rejectUnauthorized: false,
                keys: '/tmp/keys.pem',
                certs: '/tmp/certs.pem',
              },
              users: {
                dn: 'udn',
                options: {
                  scope: 'base',
                  attributes: ['*'],
                  filter: 'f',
                  paged: true,
                  timeLimit: 42,
                  sizeLimit: 100,
                  derefAliases: 0,
                  attributeValues: true,
                },
                set: { p: 'v' },
                map: {
                  rdn: 'u',
                  name: 'v',
                  description: 'd',
                  displayName: 'c',
                  email: 'm',
                  picture: 'p',
                  memberOf: 'm',
                },
              },
              groups: {
                dn: 'gdn',
                options: {
                  scope: 'base',
                  attributes: ['*'],
                  filter: 'f',
                  paged: {
                    pageSize: 7,
                    pagePause: true,
                  },
                  timeLimit: 42,
                  sizeLimit: 100,
                  derefAliases: 1,
                  attributeValues: false,
                },
                set: { p: 'v' },
                map: {
                  rdn: 'u',
                  name: 'v',
                  description: 'd',
                  type: 't',
                  displayName: 'c',
                  email: 'm',
                  picture: 'p',
                  memberOf: 'm',
                  members: 'n',
                },
              },
            },
          },
        },
      },
    };
    const actual = readProviderConfigs(new ConfigReader(config));
    const expected = [
      {
        id: 'default',
        target: 'target',
        bind: { dn: 'bdn', secret: 's' },
        tls: {
          rejectUnauthorized: false,
          keys: '/tmp/keys.pem',
          certs: '/tmp/certs.pem',
        },
        users: [
          {
            dn: 'udn',
            options: {
              scope: 'base',
              attributes: ['*', 'u', 'v', 'c', 'm', 'd', 'p'],
              filter: 'f',
              paged: true,
              timeLimit: 42,
              sizeLimit: 100,
              derefAliases: 0,
              returnAttributeValues: true,
            },
            set: { p: 'v' },
            map: {
              rdn: 'u',
              name: 'v',
              description: 'd',
              displayName: 'c',
              email: 'm',
              picture: 'p',
              memberOf: 'm',
            },
          },
        ],
        groups: [
          {
            dn: 'gdn',
            options: {
              scope: 'base',
              attributes: ['*', 'u', 'v', 'd', 'c', 't', 'm', 'n', 'p'],
              filter: 'f',
              paged: {
                pageSize: 7,
                pagePause: true,
              },
              timeLimit: 42,
              sizeLimit: 100,
              derefAliases: 1,
              returnAttributeValues: false,
            },
            set: { p: 'v' },
            map: {
              rdn: 'u',
              name: 'v',
              description: 'd',
              type: 't',
              displayName: 'c',
              email: 'm',
              picture: 'p',
              memberOf: 'm',
              members: 'n',
            },
          },
        ],
      },
    ];
    expect(actual).toEqual(expected);
  });

  it('supports multiline ldap query filter', () => {
    const config = {
      catalog: {
        providers: {
          ldapOrg: {
            default: {
              target: 'target',
              users: {
                dn: 'udn',
                options: {
                  filter: `
                  (|
                    (cn=foo bar)
                    (cn=bar)
                  )
                  `,
                },
              },
              groups: {
                dn: 'gdn',
                options: {
                  filter: 'f',
                },
              },
            },
          },
        },
      },
    };
    const actual = readProviderConfigs(new ConfigReader(config));

    const expected = '(|(cn=foo bar)(cn=bar))';
    expect(actual[0].users[0].options.filter).toEqual(expected);
  });

  it('supports a dot nested set structure', () => {
    const config = {
      catalog: {
        providers: {
          ldapOrg: {
            default: {
              target: 'target',
              users: {
                dn: 'udn',
                options: {
                  filter: 'f',
                },
                set: {
                  'metadata.annotations': {
                    a: 'b',
                  },
                },
              },
              groups: {
                dn: 'gdn',
                options: {
                  filter: 'f',
                },
                set: {
                  x: { a: 'b' },
                },
              },
            },
          },
        },
      },
    };
    const actual = readProviderConfigs(new ConfigReader(config));

    expect(actual[0].users[0].set).toEqual({
      'metadata.annotations': { a: 'b' },
    });
  });

  it('throws on attempts to modify the set structure', () => {
    const config = {
      catalog: {
        providers: {
          ldapOrg: {
            default: {
              target: 'target',
              users: {
                dn: 'udn',
                options: {
                  filter: 'f',
                },
                set: {
                  x: { a: 'b' },
                },
              },
              groups: {
                dn: 'gdn',
                options: {
                  filter: 'f',
                },
                set: {
                  x: { a: 'b' },
                },
              },
            },
          },
        },
      },
    };
    const actual = readProviderConfigs(new ConfigReader(config));

    expect(() => {
      (actual[0].users[0].set as any).y = 2;
    }).toThrowErrorMatchingInlineSnapshot(
      `"Cannot add property y, object is not extensible"`,
    );
    expect(() => {
      (actual[0].users[0].set as any).x.b = 2;
    }).toThrowErrorMatchingInlineSnapshot(
      `"Cannot add property b, object is not extensible"`,
    );

    expect(() => {
      (actual[0].groups[0].set as any).y = 2;
    }).toThrowErrorMatchingInlineSnapshot(
      `"Cannot add property y, object is not extensible"`,
    );
    expect(() => {
      (actual[0].groups[0].set as any).x.b = 2;
    }).toThrowErrorMatchingInlineSnapshot(
      `"Cannot add property b, object is not extensible"`,
    );
  });

  it('supports users/groups config as list', () => {
    const config = {
      catalog: {
        providers: {
          ldapOrg: {
            default: {
              target: 'target',
              users: [
                {
                  dn: 'udn1',
                },
                {
                  dn: 'udn2',
                },
              ],
              groups: [
                {
                  dn: 'gdn1',
                },
                {
                  dn: 'gdn2',
                },
              ],
            },
          },
        },
      },
    };
    const actual = readProviderConfigs(new ConfigReader(config));

    expect(actual[0].users).toHaveLength(2);
    expect(actual[0].groups).toHaveLength(2);
  });

  it('supports users/groups config as undefined', () => {
    const config = {
      catalog: {
        providers: {
          ldapOrg: {
            default: {
              target: 'target',
            },
          },
        },
      },
    };
    const actual = readProviderConfigs(new ConfigReader(config));

    expect(actual[0].users).toHaveLength(0);
    expect(actual[0].groups).toHaveLength(0);
  });

  it('merges vendor and map attributes into effective search attributes', () => {
    const config = {
      catalog: {
        providers: {
          ldapOrg: {
            default: {
              target: 'target',
              vendor: {
                dnAttributeName: 'customDN',
                uuidAttributeName: 'entryuuid',
              },
              users: {
                dn: 'udn',
                map: {
                  picture: 'thumbnailPhoto',
                },
              },
              groups: {
                dn: 'gdn',
                map: {
                  type: 'tt',
                },
              },
            },
          },
        },
      },
    };
    const actual = readProviderConfigs(new ConfigReader(config));

    expect(actual[0].users[0].options.attributes).toEqual(
      expect.arrayContaining(['customDN', 'entryuuid', 'thumbnailPhoto']),
    );
    expect(actual[0].groups[0].options.attributes).toEqual(
      expect.arrayContaining(['customDN', 'entryuuid', 'tt', 'member']),
    );
  });

  it('does not re-add member when an explicit attributes list omits it', () => {
    const config = {
      catalog: {
        providers: {
          ldapOrg: {
            default: {
              target: 'target',
              users: {
                dn: 'udn',
                options: {
                  attributes: [
                    'uid',
                    'cn',
                    'mail',
                    'memberOf',
                    'entryDN',
                    'entryUUID',
                  ],
                },
              },
              groups: {
                dn: 'gdn',
                options: {
                  attributes: [
                    'cn',
                    'description',
                    'groupType',
                    'entryDN',
                    'entryUUID',
                  ],
                },
              },
            },
          },
        },
      },
    };
    const actual = readProviderConfigs(new ConfigReader(config));

    expect(actual[0].groups[0].options.attributes).not.toEqual(
      expect.arrayContaining(['member']),
    );
    expect(actual[0].groups[0].map.members).toBe('member');
  });
});
