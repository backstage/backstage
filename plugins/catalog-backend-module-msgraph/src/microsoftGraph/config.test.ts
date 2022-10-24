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
import { Duration } from 'luxon';
import { readMicrosoftGraphConfig, readProviderConfigs } from './config';

describe('readMicrosoftGraphConfig', () => {
  it('applies all of the defaults', () => {
    const config = {
      providers: [
        {
          id: 'target',
          target: 'target',
          tenantId: 'tenantId',
        },
      ],
    };
    const actual = readMicrosoftGraphConfig(new ConfigReader(config));
    const expected = [
      {
        id: 'target',
        target: 'target',
        tenantId: 'tenantId',
      },
    ];
    expect(actual).toEqual(expected);
  });

  it('reads all the values', () => {
    const config = {
      providers: [
        {
          id: 'target',
          target: 'target',
          tenantId: 'tenantId',
          clientId: 'clientId',
          clientSecret: 'clientSecret',
          authority: 'https://login.example.com/',
          userExpand: 'manager',
          userFilter: 'accountEnabled eq true',
          groupExpand: 'member',
          groupSelect: ['id', 'displayName', 'description'],
          groupFilter: 'securityEnabled eq false',
        },
      ],
    };
    const actual = readMicrosoftGraphConfig(new ConfigReader(config));
    const expected = [
      {
        id: 'target',
        target: 'target',
        tenantId: 'tenantId',
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        authority: 'https://login.example.com/',
        userExpand: 'manager',
        userFilter: 'accountEnabled eq true',
        groupExpand: 'member',
        groupSelect: ['id', 'displayName', 'description'],
        groupFilter: 'securityEnabled eq false',
      },
    ];
    expect(actual).toEqual(expected);
  });

  it('should fail if both userFilter and userGroupMemberFilter are set', () => {
    const config = {
      providers: [
        {
          tenantId: 'tenantId',
          userFilter: 'accountEnabled eq true',
          userGroupMemberFilter: 'any',
        },
      ],
    };
    expect(() => readMicrosoftGraphConfig(new ConfigReader(config))).toThrow();
  });

  it('should fail if both userFilter and userGroupMemberSearch are set', () => {
    const config = {
      providers: [
        {
          tenantId: 'tenantId',
          userFilter: 'accountEnabled eq true',
          userGroupMemberSearch: 'any',
        },
      ],
    };
    expect(() => readMicrosoftGraphConfig(new ConfigReader(config))).toThrow();
  });

  it('should fail if clientId is set without clientSecret', () => {
    const config = {
      providers: [
        {
          tenantId: 'tenantId',
          clientId: 'clientId',
        },
      ],
    };
    expect(() => readMicrosoftGraphConfig(new ConfigReader(config))).toThrow();
  });

  it('should fail if clientSecret is set without clientId', () => {
    const config = {
      providers: [
        {
          tenantId: 'tenantId',
          clientSecret: 'clientId',
        },
      ],
    };
    expect(() => readMicrosoftGraphConfig(new ConfigReader(config))).toThrow();
  });
});

describe('readProviderConfigs', () => {
  it('applies all of the defaults', () => {
    const config = {
      catalog: {
        providers: {
          microsoftGraphOrg: {
            customProviderId: {
              tenantId: 'tenantId',
            },
          },
        },
      },
    };
    const actual = readProviderConfigs(new ConfigReader(config));
    const expected = [
      {
        id: 'customProviderId',
        target: 'https://graph.microsoft.com/v1.0',
        tenantId: 'tenantId',
      },
    ];
    expect(actual).toEqual(expected);
  });

  it('reads all the values', () => {
    const config = {
      catalog: {
        providers: {
          microsoftGraphOrg: {
            customProviderId: {
              target: 'target',
              tenantId: 'tenantId',
              clientId: 'clientId',
              clientSecret: 'clientSecret',
              authority: 'https://login.example.com/',
              queryMode: 'advanced',
              user: {
                expand: 'manager',
                filter: 'accountEnabled eq true',
              },
              group: {
                expand: 'member',
                filter: 'securityEnabled eq false',
                select: ['id', 'displayName', 'description'],
              },
              schedule: {
                frequency: 'PT30M',
                timeout: {
                  minutes: 3,
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
        id: 'customProviderId',
        target: 'target',
        tenantId: 'tenantId',
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        authority: 'https://login.example.com/',
        queryMode: 'advanced',
        userExpand: 'manager',
        userFilter: 'accountEnabled eq true',
        groupExpand: 'member',
        groupSelect: ['id', 'displayName', 'description'],
        groupFilter: 'securityEnabled eq false',
        schedule: {
          frequency: Duration.fromISO('PT30M'),
          timeout: {
            minutes: 3,
          },
        },
      },
    ];
    expect(actual).toEqual(expected);
  });

  it('should fail if both userFilter and userGroupMemberFilter are set', () => {
    const config = {
      catalog: {
        providers: {
          microsoftGraphOrg: {
            customProviderId: {
              tenantId: 'tenantId',
              user: {
                filter: 'accountEnabled eq true',
              },
              userGroupMember: {
                filter: 'any',
              },
            },
          },
        },
      },
    };
    expect(() => readProviderConfigs(new ConfigReader(config))).toThrow();
  });

  it('should fail if both userFilter and userGroupMemberSearch are set', () => {
    const config = {
      catalog: {
        providers: {
          microsoftGraphOrg: {
            customProviderId: {
              tenantId: 'tenantId',
              user: {
                filter: 'accountEnabled eq true',
              },
              userGroupMember: {
                search: 'any',
              },
            },
          },
        },
      },
    };
    expect(() => readProviderConfigs(new ConfigReader(config))).toThrow();
  });

  it('should fail if clientId is set without clientSecret', () => {
    const config = {
      catalog: {
        providers: {
          microsoftGraphOrg: {
            customProviderId: {
              tenantId: 'tenantId',
              clientId: 'id',
            },
          },
        },
      },
    };
    expect(() => readProviderConfigs(new ConfigReader(config))).toThrow();
  });

  it('should fail if clientSecret is set without clientId', () => {
    const config = {
      catalog: {
        providers: {
          microsoftGraphOrg: {
            customProviderId: {
              tenantId: 'tenantId',
              clientSecret: 'clientSecret',
            },
          },
        },
      },
    };
    expect(() => readProviderConfigs(new ConfigReader(config))).toThrow();
  });
});
