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

import { GroupMember, MicrosoftGraphClient } from './client';
import {
  normalizeEntityName,
  readMicrosoftGraphGroups,
  readMicrosoftGraphOrganization,
  readMicrosoftGraphUsers,
} from './read';

describe('read microsoft graph', () => {
  const client: jest.Mocked<MicrosoftGraphClient> = {
    getUsers: jest.fn(),
    getGroups: jest.fn(),
    getGroupMembers: jest.fn(),
    getUserPhotoWithSizeLimit: jest.fn(),
    getOrganization: jest.fn(),
  } as any;

  afterEach(() => jest.resetAllMocks());

  describe('normalizeEntityName', () => {
    it('should normalize name to valid entity name', () => {
      expect(normalizeEntityName('User Name')).toBe('user_name');
    });

    it('should normalize e-mail to valid entity name', () => {
      expect(normalizeEntityName('user.name@example.com')).toBe(
        'user.name_example.com',
      );
    });
  });

  describe('readMicrosoftGraphUsers', () => {
    it('should read users', async () => {
      async function* getExampleUsers() {
        yield {
          id: 'userid',
          displayName: 'User Name',
          mail: 'user.name@example.com',
        };
      }

      client.getUsers.mockImplementation(getExampleUsers);
      client.getUserPhotoWithSizeLimit.mockResolvedValue(
        'data:image/jpeg;base64,...',
      );

      const { users } = await readMicrosoftGraphUsers(client, {
        userFilter: 'accountEnabled eq true',
      });

      expect(users).toStrictEqual([
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'User',
          metadata: {
            annotations: {
              'graph.microsoft.com/user-id': 'userid',
            },
            name: 'user.name_example.com',
          },
          spec: {
            memberOf: [],
            profile: {
              displayName: 'User Name',
              email: 'user.name@example.com',
              picture: 'data:image/jpeg;base64,...',
            },
          },
        },
      ]);

      expect(client.getUsers).toBeCalledTimes(1);
      expect(client.getUsers).toBeCalledWith({
        filter: 'accountEnabled eq true',
        select: ['id', 'displayName', 'mail'],
      });
      expect(client.getUserPhotoWithSizeLimit).toBeCalledTimes(1);
      expect(client.getUserPhotoWithSizeLimit).toBeCalledWith('userid', 120);
    });
  });

  describe('readMicrosoftGraphOrganization', () => {
    it('should read organization', async () => {
      client.getOrganization.mockResolvedValue({
        id: 'tenantid',
        displayName: 'Organization Name',
      });

      const { rootGroup } = await readMicrosoftGraphOrganization(
        client,
        'tenantid',
      );

      expect(rootGroup).toStrictEqual({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: {
          annotations: {
            'graph.microsoft.com/tenant-id': 'tenantid',
          },
          name: 'organization_name',
          description: 'Organization Name',
        },
        spec: {
          ancestors: [],
          children: [],
          descendants: [],
          type: 'root',
        },
      });

      expect(client.getOrganization).toBeCalledTimes(1);
      expect(client.getOrganization).toBeCalledWith('tenantid');
    });
  });

  describe('readMicrosoftGraphGroups', () => {
    it('should read groups', async () => {
      async function* getExampleGroups() {
        yield {
          id: 'groupid',
          displayName: 'Group Name',
        };
      }

      async function* getExampleGroupMembers(): AsyncIterable<GroupMember> {
        yield {
          '@odata.type': '#microsoft.graph.group',
          id: 'childgroupid',
        };
        yield {
          '@odata.type': '#microsoft.graph.user',
          id: 'userid',
        };
      }

      client.getGroups.mockImplementation(getExampleGroups);
      client.getGroupMembers.mockImplementation(getExampleGroupMembers);
      client.getOrganization.mockResolvedValue({
        id: 'tenantid',
        displayName: 'Organization Name',
      });

      const { groups, groupMember, rootGroup } = await readMicrosoftGraphGroups(
        client,
        'tenantid',
        {
          groupFilter: 'securityEnabled eq false',
        },
      );

      const expectedRootGroup = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: {
          annotations: {
            'graph.microsoft.com/tenant-id': 'tenantid',
          },
          name: 'organization_name',
          description: 'Organization Name',
        },
        spec: {
          ancestors: [],
          children: [],
          descendants: [],
          type: 'root',
        },
      };
      expect(groups).toStrictEqual([
        expectedRootGroup,
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Group',
          metadata: {
            annotations: {
              'graph.microsoft.com/group-id': 'groupid',
            },
            name: 'group_name',
            description: 'Group Name',
          },
          spec: {
            ancestors: [],
            children: [],
            descendants: [],
            type: 'team',
          },
        },
      ]);
      expect(rootGroup).toStrictEqual(expectedRootGroup);
      expect(groupMember.get('groupid')).toEqual(
        new Set(['childgroupid', 'userid']),
      );
      expect(groupMember.get('organization_name')).toEqual(new Set());

      expect(client.getGroups).toBeCalledTimes(1);
      expect(client.getGroups).toBeCalledWith({
        filter: 'securityEnabled eq false',
        select: ['id', 'displayName', 'mailNickname'],
      });
      expect(client.getGroupMembers).toBeCalledTimes(1);
      expect(client.getGroupMembers).toBeCalledWith('groupid');
    });
  });

  describe('resolveRelations', () => {
    // TODO: How much such we resolve? What kind of relations should be available?
    // What about users that aren't part of any group? Should they at least be part of root?
  });

  describe('readMicrosoftGraphOrg', () => {
    // TODO: Not sure if I want to test this
  });
});
