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
import merge from 'lodash/merge';
import { GroupMember, MicrosoftGraphClient } from './client';
import {
  readMicrosoftGraphGroups,
  readMicrosoftGraphOrg,
  readMicrosoftGraphOrganization,
  readMicrosoftGraphUsers,
  readMicrosoftGraphUsersInGroups,
  resolveRelations,
} from './read';
import { getVoidLogger } from '@backstage/backend-common';

function user(data: Partial<UserEntity>): UserEntity {
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

function group(data: Partial<GroupEntity>): GroupEntity {
  return merge(
    {},
    {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: {
        name: 'name',
      },
      spec: {
        children: [],
        type: 'team',
      },
    } as GroupEntity,
    data,
  );
}

describe('read microsoft graph', () => {
  const client: jest.Mocked<MicrosoftGraphClient> = {
    getUsers: jest.fn(),
    getUserProfile: jest.fn(),
    getGroups: jest.fn(),
    getGroupMembers: jest.fn(),
    getUserPhotoWithSizeLimit: jest.fn(),
    getGroupPhotoWithSizeLimit: jest.fn(),
    getOrganization: jest.fn(),
  } as any;

  afterEach(() => jest.resetAllMocks());

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
        logger: getVoidLogger(),
      });

      expect(users).toEqual([
        user({
          metadata: {
            annotations: {
              'graph.microsoft.com/user-id': 'userid',
              'microsoft.com/email': 'user.name@example.com',
            },
            name: 'user.name_example.com',
          },
          spec: {
            profile: {
              displayName: 'User Name',
              email: 'user.name@example.com',
              picture: 'data:image/jpeg;base64,...',
            },
            memberOf: [],
          },
        }),
      ]);

      expect(client.getUsers).toBeCalledTimes(1);
      expect(client.getUsers).toBeCalledWith(
        {
          filter: 'accountEnabled eq true',
        },
        undefined,
      );
      expect(client.getUserPhotoWithSizeLimit).toBeCalledTimes(1);
      expect(client.getUserPhotoWithSizeLimit).toBeCalledWith('userid', 120);
    });

    it('should read users with advanced query mode', async () => {
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
        queryMode: 'advanced',
        userFilter: 'accountEnabled eq true',
        logger: getVoidLogger(),
      });

      expect(users).toEqual([
        user({
          metadata: {
            annotations: {
              'graph.microsoft.com/user-id': 'userid',
              'microsoft.com/email': 'user.name@example.com',
            },
            name: 'user.name_example.com',
          },
          spec: {
            profile: {
              displayName: 'User Name',
              email: 'user.name@example.com',
              picture: 'data:image/jpeg;base64,...',
            },
            memberOf: [],
          },
        }),
      ]);

      expect(client.getUsers).toBeCalledTimes(1);
      expect(client.getUsers).toBeCalledWith(
        {
          filter: 'accountEnabled eq true',
        },
        'advanced',
      );
      expect(client.getUserPhotoWithSizeLimit).toBeCalledTimes(1);
      expect(client.getUserPhotoWithSizeLimit).toBeCalledWith('userid', 120);
    });

    it('should read users with userExpand and custom transformer', async () => {
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
        userExpand: 'manager',
        userFilter: 'accountEnabled eq true',
        transformer: async () => ({
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'User',
          metadata: { name: 'x' },
          spec: { memberOf: [] },
        }),
        logger: getVoidLogger(),
      });

      expect(users).toEqual([
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'User',
          metadata: { name: 'x' },
          spec: { memberOf: [] },
        },
      ]);

      expect(client.getUsers).toBeCalledTimes(1);
      expect(client.getUsers).toBeCalledWith(
        {
          expand: 'manager',
          filter: 'accountEnabled eq true',
        },
        undefined,
      );
      expect(client.getUserPhotoWithSizeLimit).toBeCalledTimes(1);
      expect(client.getUserPhotoWithSizeLimit).toBeCalledWith('userid', 120);
    });
  });

  describe('readMicrosoftGraphUsersInGroups', () => {
    it('should read users from Groups', async () => {
      async function* getExampleGroups() {
        yield {
          id: 'groupid',
          displayName: 'Group Name',
          description: 'Group Description',
          mail: 'group@example.com',
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

      client.getUserProfile.mockResolvedValue({
        id: 'userid',
        displayName: 'User Name',
        mail: 'user.name@example.com',
      });
      client.getUserPhotoWithSizeLimit.mockResolvedValue(
        'data:image/jpeg;base64,...',
      );

      const { users } = await readMicrosoftGraphUsersInGroups(client, {
        userGroupMemberFilter: 'securityEnabled eq true',
        logger: getVoidLogger(),
      });

      expect(users).toEqual([
        user({
          metadata: {
            annotations: {
              'graph.microsoft.com/user-id': 'userid',
              'microsoft.com/email': 'user.name@example.com',
            },
            name: 'user.name_example.com',
          },
          spec: {
            profile: {
              displayName: 'User Name',
              email: 'user.name@example.com',
              picture: 'data:image/jpeg;base64,...',
            },
            memberOf: [],
          },
        }),
      ]);

      expect(client.getGroups).toBeCalledTimes(1);
      expect(client.getGroups).toBeCalledWith(
        {
          filter: 'securityEnabled eq true',
        },
        undefined,
      );
      expect(client.getGroupMembers).toBeCalledTimes(1);
      expect(client.getGroupMembers).toBeCalledWith('groupid');

      expect(client.getUserProfile).toBeCalledTimes(1);
      expect(client.getUserProfile).toBeCalledWith('userid', {
        expand: undefined,
      });
      expect(client.getUserPhotoWithSizeLimit).toBeCalledTimes(1);
      expect(client.getUserPhotoWithSizeLimit).toBeCalledWith('userid', 120);
    });

    it('should read users from Groups with advanced query mode', async () => {
      async function* getExampleGroups() {
        yield {
          id: 'groupid',
          displayName: 'Group Name',
          description: 'Group Description',
          mail: 'group@example.com',
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

      client.getUserProfile.mockResolvedValue({
        id: 'userid',
        displayName: 'User Name',
        mail: 'user.name@example.com',
      });
      client.getUserPhotoWithSizeLimit.mockResolvedValue(
        'data:image/jpeg;base64,...',
      );

      const { users } = await readMicrosoftGraphUsersInGroups(client, {
        queryMode: 'advanced',
        userGroupMemberFilter: 'securityEnabled eq true',
        logger: getVoidLogger(),
      });

      expect(users).toEqual([
        user({
          metadata: {
            annotations: {
              'graph.microsoft.com/user-id': 'userid',
              'microsoft.com/email': 'user.name@example.com',
            },
            name: 'user.name_example.com',
          },
          spec: {
            profile: {
              displayName: 'User Name',
              email: 'user.name@example.com',
              picture: 'data:image/jpeg;base64,...',
            },
            memberOf: [],
          },
        }),
      ]);

      expect(client.getGroups).toBeCalledTimes(1);
      expect(client.getGroups).toBeCalledWith(
        {
          filter: 'securityEnabled eq true',
        },
        'advanced',
      );
      expect(client.getGroupMembers).toBeCalledTimes(1);
      expect(client.getGroupMembers).toBeCalledWith('groupid');

      expect(client.getUserProfile).toBeCalledTimes(1);
      expect(client.getUserProfile).toBeCalledWith('userid', {
        expand: undefined,
      });
      expect(client.getUserPhotoWithSizeLimit).toBeCalledTimes(1);
      expect(client.getUserPhotoWithSizeLimit).toBeCalledWith('userid', 120);
    });

    it('should read users with userExpand, groupExpand and custom transformer', async () => {
      async function* getExampleGroups() {
        yield {
          id: 'groupid',
          displayName: 'Group Name',
          description: 'Group Description',
          mail: 'group@example.com',
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

      client.getUserProfile.mockResolvedValue({
        id: 'userid',
        displayName: 'User Name',
        mail: 'user.name@example.com',
      });
      client.getUserPhotoWithSizeLimit.mockResolvedValue(
        'data:image/jpeg;base64,...',
      );

      const { users } = await readMicrosoftGraphUsersInGroups(client, {
        userExpand: 'manager',
        userGroupMemberFilter: 'securityEnabled eq true',
        groupExpand: 'member',
        transformer: async () => ({
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'User',
          metadata: { name: 'x' },
          spec: { memberOf: [] },
        }),
        logger: getVoidLogger(),
      });

      expect(users).toEqual([
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'User',
          metadata: { name: 'x' },
          spec: { memberOf: [] },
        },
      ]);

      expect(client.getGroups).toBeCalledTimes(1);
      expect(client.getGroups).toBeCalledWith(
        {
          expand: 'member',
          filter: 'securityEnabled eq true',
        },
        undefined,
      );
      expect(client.getGroupMembers).toBeCalledTimes(1);
      expect(client.getGroupMembers).toBeCalledWith('groupid');

      expect(client.getUserProfile).toBeCalledTimes(1);
      expect(client.getUserProfile).toBeCalledWith('userid', {
        expand: 'manager',
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

      expect(rootGroup).toEqual(
        group({
          metadata: {
            annotations: {
              'graph.microsoft.com/tenant-id': 'tenantid',
            },
            name: 'organization_name',
            description: 'Organization Name',
          },
          spec: {
            type: 'root',
            profile: {
              displayName: 'Organization Name',
            },
            children: [],
          },
        }),
      );

      expect(client.getOrganization).toBeCalledTimes(1);
      expect(client.getOrganization).toBeCalledWith('tenantid');
    });

    it('should read organization with custom transformer', async () => {
      client.getOrganization.mockResolvedValue({
        id: 'tenantid',
        displayName: 'Organization Name',
      });

      const { rootGroup } = await readMicrosoftGraphOrganization(
        client,
        'tenantid',
        { transformer: async _ => undefined },
      );

      expect(rootGroup).toEqual(undefined);

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
          description: 'Group Description',
          mail: 'group@example.com',
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
      client.getGroupPhotoWithSizeLimit.mockResolvedValue(
        'data:image/jpeg;base64,...',
      );

      const { groups, groupMember, groupMemberOf, rootGroup } =
        await readMicrosoftGraphGroups(client, 'tenantid', {
          groupFilter: 'securityEnabled eq false',
        });

      const expectedRootGroup = group({
        metadata: {
          annotations: {
            'graph.microsoft.com/tenant-id': 'tenantid',
          },
          name: 'organization_name',
          description: 'Organization Name',
        },
        spec: {
          type: 'root',
          profile: {
            displayName: 'Organization Name',
          },
          children: [],
        },
      });
      expect(groups).toEqual([
        expectedRootGroup,
        group({
          metadata: {
            annotations: {
              'graph.microsoft.com/group-id': 'groupid',
            },
            name: 'group_name',
            description: 'Group Description',
          },
          spec: {
            type: 'team',
            profile: {
              displayName: 'Group Name',
              email: 'group@example.com',
              // TODO: Loading groups photos doesn't work right now as Microsoft
              // Graph doesn't allows this yet
              /* picture: 'data:image/jpeg;base64,...',*/
            },
            children: [],
          },
        }),
      ]);
      expect(rootGroup).toEqual(expectedRootGroup);
      expect(groupMember.get('groupid')).toEqual(new Set(['childgroupid']));
      expect(groupMemberOf.get('userid')).toEqual(new Set(['groupid']));
      expect(groupMember.get('organization_name')).toEqual(new Set());

      expect(client.getGroups).toBeCalledTimes(1);
      expect(client.getGroups).toBeCalledWith(
        {
          filter: 'securityEnabled eq false',
        },
        undefined,
      );
      expect(client.getGroupMembers).toBeCalledTimes(1);
      expect(client.getGroupMembers).toBeCalledWith('groupid');
      // TODO: Loading groups photos doesn't work right now as Microsoft Graph
      // doesn't allows this yet
      // expect(client.getGroupPhotoWithSizeLimit).toBeCalledTimes(1);
      // expect(client.getGroupPhotoWithSizeLimit).toBeCalledWith('groupid', 120);
    });

    it('should read groups with advanced query mode', async () => {
      async function* getExampleGroups() {
        yield {
          id: 'groupid',
          displayName: 'Group Name',
          description: 'Group Description',
          mail: 'group@example.com',
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
      client.getGroupPhotoWithSizeLimit.mockResolvedValue(
        'data:image/jpeg;base64,...',
      );

      const { groups, groupMember, groupMemberOf, rootGroup } =
        await readMicrosoftGraphGroups(client, 'tenantid', {
          queryMode: 'advanced',
          groupFilter: 'securityEnabled eq false',
        });

      const expectedRootGroup = group({
        metadata: {
          annotations: {
            'graph.microsoft.com/tenant-id': 'tenantid',
          },
          name: 'organization_name',
          description: 'Organization Name',
        },
        spec: {
          type: 'root',
          profile: {
            displayName: 'Organization Name',
          },
          children: [],
        },
      });
      expect(groups).toEqual([
        expectedRootGroup,
        group({
          metadata: {
            annotations: {
              'graph.microsoft.com/group-id': 'groupid',
            },
            name: 'group_name',
            description: 'Group Description',
          },
          spec: {
            type: 'team',
            profile: {
              displayName: 'Group Name',
              email: 'group@example.com',
              // TODO: Loading groups photos doesn't work right now as Microsoft
              // Graph doesn't allows this yet
              /* picture: 'data:image/jpeg;base64,...',*/
            },
            children: [],
          },
        }),
      ]);
      expect(rootGroup).toEqual(expectedRootGroup);
      expect(groupMember.get('groupid')).toEqual(new Set(['childgroupid']));
      expect(groupMemberOf.get('userid')).toEqual(new Set(['groupid']));
      expect(groupMember.get('organization_name')).toEqual(new Set());

      expect(client.getGroups).toBeCalledTimes(1);
      expect(client.getGroups).toBeCalledWith(
        {
          filter: 'securityEnabled eq false',
        },
        'advanced',
      );
      expect(client.getGroupMembers).toBeCalledTimes(1);
      expect(client.getGroupMembers).toBeCalledWith('groupid');
      // TODO: Loading groups photos doesn't work right now as Microsoft Graph
      // doesn't allows this yet
      // expect(client.getGroupPhotoWithSizeLimit).toBeCalledTimes(1);
      // expect(client.getGroupPhotoWithSizeLimit).toBeCalledWith('groupid', 120);
    });

    it('should read groups with groupExpand', async () => {
      async function* getExampleGroups() {
        yield {
          id: 'groupid',
          displayName: 'Group Name',
          description: 'Group Description',
          mail: 'group@example.com',
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
      client.getGroupPhotoWithSizeLimit.mockResolvedValue(
        'data:image/jpeg;base64,...',
      );

      const { groups, groupMember, groupMemberOf, rootGroup } =
        await readMicrosoftGraphGroups(client, 'tenantid', {
          groupExpand: 'member',
          groupFilter: 'securityEnabled eq false',
        });

      const expectedRootGroup = group({
        metadata: {
          annotations: {
            'graph.microsoft.com/tenant-id': 'tenantid',
          },
          name: 'organization_name',
          description: 'Organization Name',
        },
        spec: {
          type: 'root',
          profile: {
            displayName: 'Organization Name',
          },
          children: [],
        },
      });
      expect(groups).toEqual([
        expectedRootGroup,
        group({
          metadata: {
            annotations: {
              'graph.microsoft.com/group-id': 'groupid',
            },
            name: 'group_name',
            description: 'Group Description',
          },
          spec: {
            type: 'team',
            profile: {
              displayName: 'Group Name',
              email: 'group@example.com',
              // TODO: Loading groups photos doesn't work right now as Microsoft
              // Graph doesn't allows this yet
              /* picture: 'data:image/jpeg;base64,...',*/
            },
            children: [],
          },
        }),
      ]);
      expect(rootGroup).toEqual(expectedRootGroup);
      expect(groupMember.get('groupid')).toEqual(new Set(['childgroupid']));
      expect(groupMemberOf.get('userid')).toEqual(new Set(['groupid']));
      expect(groupMember.get('organization_name')).toEqual(new Set());

      expect(client.getGroups).toBeCalledTimes(1);
      expect(client.getGroups).toBeCalledWith(
        {
          expand: 'member',
          filter: 'securityEnabled eq false',
        },
        undefined,
      );
      expect(client.getGroupMembers).toBeCalledTimes(1);
      expect(client.getGroupMembers).toBeCalledWith('groupid');
      // TODO: Loading groups photos doesn't work right now as Microsoft Graph
      // doesn't allows this yet
      // expect(client.getGroupPhotoWithSizeLimit).toBeCalledTimes(1);
      // expect(client.getGroupPhotoWithSizeLimit).toBeCalledWith('groupid', 120);
    });

    it('should read security groups', async () => {
      async function* getExampleGroups() {
        yield {
          id: 'groupid',
          displayName: 'Group Name',
          description: 'Group Description',
          mail: 'group@example.com',
          mailNickname: 'df546d53-4f5f-4462-b371-d4a855787047',
          mailEnabled: false,
          securityEnabled: true,
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
      client.getGroupPhotoWithSizeLimit.mockResolvedValue(
        'data:image/jpeg;base64,...',
      );

      const { groups, rootGroup } = await readMicrosoftGraphGroups(
        client,
        'tenantid',
        {
          groupFilter: 'securityEnabled eq true',
        },
      );

      const expectedRootGroup = group({
        metadata: {
          annotations: {
            'graph.microsoft.com/tenant-id': 'tenantid',
          },
          name: 'organization_name',
          description: 'Organization Name',
        },
        spec: {
          type: 'root',
          profile: {
            displayName: 'Organization Name',
          },
          children: [],
        },
      });
      expect(groups).toEqual([
        expectedRootGroup,
        group({
          metadata: {
            annotations: {
              'graph.microsoft.com/group-id': 'groupid',
            },
            name: 'group_name',
            description: 'Group Description',
          },
          spec: {
            type: 'team',
            profile: {
              displayName: 'Group Name',
              email: 'group@example.com',
            },
            children: [],
          },
        }),
      ]);
      expect(rootGroup).toEqual(expectedRootGroup);
      expect(client.getGroups).toBeCalledWith(
        {
          filter: 'securityEnabled eq true',
        },
        undefined,
      );
      expect(client.getGroupMembers).toBeCalledTimes(1);
      expect(client.getGroupMembers).toBeCalledWith('groupid');
    });
  });

  describe('resolveRelations', () => {
    it('should resolve relations', async () => {
      const rootGroup = group({
        metadata: {
          annotations: {
            'graph.microsoft.com/tenant-id': 'tenant-id-root',
          },
          name: 'root',
        },
        spec: {
          type: 'root',
          children: [],
        },
      });
      const groupA = group({
        metadata: {
          annotations: {
            'graph.microsoft.com/group-id': 'group-id-a',
          },
          name: 'a',
        },
      });
      const groupB = group({
        metadata: {
          annotations: {
            'graph.microsoft.com/group-id': 'group-id-b',
          },
          name: 'b',
        },
      });
      const groupC = group({
        metadata: {
          annotations: {
            'graph.microsoft.com/group-id': 'group-id-c',
          },
          name: 'c',
        },
      });
      const user1 = user({
        metadata: {
          annotations: {
            'graph.microsoft.com/user-id': 'user-id-1',
          },
          name: 'user1',
        },
      });
      const user2 = user({
        metadata: {
          annotations: {
            'graph.microsoft.com/user-id': 'user-id-2',
          },
          name: 'user2',
        },
      });
      const groups = [rootGroup, groupA, groupB, groupC];
      const users = [user1, user2];
      const groupMember = new Map<string, Set<string>>();
      groupMember.set('group-id-b', new Set(['group-id-c']));
      const groupMemberOf = new Map<string, Set<string>>();
      groupMemberOf.set('user-id-1', new Set(['group-id-a']));
      groupMemberOf.set('user-id-2', new Set(['group-id-c']));

      // We have a root groups
      // We have three groups: a, b, c. c is child of b
      // we have two users: u1, u2. u1 is member of a, u2 is member of c
      resolveRelations(rootGroup, groups, users, groupMember, groupMemberOf);

      expect(rootGroup.spec.parent).toBeUndefined();
      expect(rootGroup.spec.children).toEqual(
        expect.arrayContaining(['group:default/a', 'group:default/b']),
      );

      expect(groupA.spec.parent).toEqual('group:default/root');
      expect(groupA.spec.children).toEqual(expect.arrayContaining([]));

      expect(groupB.spec.parent).toEqual('group:default/root');
      expect(groupB.spec.children).toEqual(
        expect.arrayContaining(['group:default/c']),
      );

      expect(groupC.spec.parent).toEqual('group:default/b');
      expect(groupC.spec.children).toEqual(expect.arrayContaining([]));

      expect(user1.spec.memberOf).toEqual(
        expect.arrayContaining(['group:default/a']),
      );
      expect(user2.spec.memberOf).toEqual(
        expect.arrayContaining(['group:default/c']),
      );
    });
  });

  describe('readMicrosoftGraphOrg', () => {
    async function* getExampleUsers() {
      yield {
        id: 'userid',
        displayName: 'User Name',
        mail: 'user.name@example.com',
      };
    }

    async function getExampleUserProfile(userId: string) {
      return {
        id: userId,
        displayName: 'User Name',
        mail: 'user.name@example.com',
      };
    }

    async function* getExampleGroups() {
      yield {
        id: 'groupid',
        displayName: 'Group Name',
        description: 'Group Description',
        mail: 'group@example.com',
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

    it('should read all users if no filter provided', async () => {
      client.getOrganization.mockResolvedValue({
        id: 'tenantid',
        displayName: 'Organization Name',
      });

      client.getUsers.mockImplementation(getExampleUsers);
      client.getUserPhotoWithSizeLimit.mockResolvedValue(
        'data:image/jpeg;base64,...',
      );

      client.getGroups.mockImplementation(getExampleGroups);
      client.getGroupMembers.mockImplementation(getExampleGroupMembers);
      client.getGroupPhotoWithSizeLimit.mockResolvedValue(
        'data:image/jpeg;base64,...',
      );

      await readMicrosoftGraphOrg(client, 'tenantid', {
        logger: getVoidLogger(),
        groupFilter: 'securityEnabled eq false',
      });

      expect(client.getUsers).toBeCalledTimes(1);
      expect(client.getUsers).toBeCalledWith(
        {
          filter: undefined,
        },
        undefined,
      );
      expect(client.getGroups).toBeCalledTimes(1);
      expect(client.getGroups).toBeCalledWith(
        {
          filter: 'securityEnabled eq false',
        },
        undefined,
      );
    });

    it('should read users using userExpand and userFilter', async () => {
      client.getOrganization.mockResolvedValue({
        id: 'tenantid',
        displayName: 'Organization Name',
      });

      client.getUsers.mockImplementation(getExampleUsers);
      client.getUserPhotoWithSizeLimit.mockResolvedValue(
        'data:image/jpeg;base64,...',
      );

      client.getGroups.mockImplementation(getExampleGroups);
      client.getGroupMembers.mockImplementation(getExampleGroupMembers);
      client.getGroupPhotoWithSizeLimit.mockResolvedValue(
        'data:image/jpeg;base64,...',
      );

      await readMicrosoftGraphOrg(client, 'tenantid', {
        logger: getVoidLogger(),
        userExpand: 'manager',
        userFilter: 'accountEnabled eq true',
        groupFilter: 'securityEnabled eq false',
      });

      expect(client.getUsers).toBeCalledTimes(1);
      expect(client.getUsers).toBeCalledWith(
        {
          expand: 'manager',
          filter: 'accountEnabled eq true',
        },
        undefined,
      );
      expect(client.getGroups).toBeCalledTimes(1);
      expect(client.getGroups).toBeCalledWith(
        {
          filter: 'securityEnabled eq false',
        },
        undefined,
      );
    });

    it('should read users using userExpand and userGroupMemberFilter', async () => {
      client.getOrganization.mockResolvedValue({
        id: 'tenantid',
        displayName: 'Organization Name',
      });

      client.getUsers.mockImplementation(getExampleUsers);
      client.getUserProfile.mockImplementation(getExampleUserProfile);
      client.getUserPhotoWithSizeLimit.mockResolvedValue(
        'data:image/jpeg;base64,...',
      );

      client.getGroups.mockImplementation(getExampleGroups);
      client.getGroupMembers.mockImplementation(getExampleGroupMembers);
      client.getGroupPhotoWithSizeLimit.mockResolvedValue(
        'data:image/jpeg;base64,...',
      );

      await readMicrosoftGraphOrg(client, 'tenantid', {
        logger: getVoidLogger(),
        userGroupMemberFilter: 'name eq backstage-group',
        groupFilter: 'securityEnabled eq false',
      });

      expect(client.getUsers).toBeCalledTimes(0);
      expect(client.getGroups).toBeCalledTimes(2);
      expect(client.getGroups).toBeCalledWith(
        {
          filter: 'name eq backstage-group',
        },
        undefined,
      );
      expect(client.getGroups).toBeCalledWith(
        {
          filter: 'securityEnabled eq false',
        },
        undefined,
      );
      expect(client.getUserProfile).toBeCalledTimes(1);
      expect(client.getUserPhotoWithSizeLimit).toBeCalledTimes(1);
    });
  });
});
