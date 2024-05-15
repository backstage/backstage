/*
 * Copyright 2021 The Backstage Authors
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
  mockServices,
  setupRequestMockHandlers,
} from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { readGitLabIntegrationConfig } from '@backstage/integration';
import { setupServer } from 'msw/node';
import { handlers } from '../__testUtils__/handlers';
import * as mock from '../__testUtils__/mocks';
import { GitLabClient, paginated } from './client';
import { GitLabGroup, GitLabUser } from './types';

const server = setupServer(...handlers);
setupRequestMockHandlers(server);

describe('GitLabClient', () => {
  describe('isSelfManaged', () => {
    it('returns true if self managed instance', () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader(mock.config_self_managed),
        ),
        logger: mockServices.logger.mock(),
      });
      expect(client.isSelfManaged()).toBeTruthy();
    });
    it('returns false if gitlab.com', () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(new ConfigReader(mock.config_saas)),
        logger: mockServices.logger.mock(),
      });
      expect(client.isSelfManaged()).toBeFalsy();
    });
  });

  describe('pagedRequest', () => {
    it('should provide immediate items within the page', async () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader(mock.config_self_managed),
        ),
        logger: mockServices.logger.mock(),
      });

      const { items } = await client.pagedRequest(mock.paged_endpoint);
      // fake page contains exactly one item
      expect(items).toHaveLength(1);
    });

    it('should request items for a given page number', async () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader(mock.config_self_managed),
        ),
        logger: mockServices.logger.mock(),
      });

      const requestedPage = 2;
      const { items, nextPage } = await client.pagedRequest(
        mock.paged_endpoint,
        {
          page: requestedPage,
        },
      );
      // should contain an item from a given page
      expect(items[0].someContentOfPage).toEqual(requestedPage);
      // should set the nextPage property to the next page
      expect(nextPage).toEqual(3);
    });

    it('should not have a next page if at the end', async () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader(mock.config_self_managed),
        ),
        logger: mockServices.logger.mock(),
      });

      const { items, nextPage } = await client.pagedRequest(
        mock.paged_endpoint,
        {
          page: 4,
        },
      );
      // should contain item of last page
      expect(items).toHaveLength(1);
      expect(nextPage).toBeNull();
    });

    it('should throw if response is not okay', async () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader(mock.config_self_managed),
        ),
        logger: mockServices.logger.mock(),
      });
      // non-200 status code should throw
      await expect(() =>
        client.pagedRequest(mock.unhealthy_endpoint),
      ).rejects.toThrow();
    });
  });

  // TODO: review this. Make it so that the number of projects don't match the results
  describe('listProjects', () => {
    it('should get projects for a given group', async () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader(mock.config_self_managed),
        ),
        logger: mockServices.logger.mock(),
      });

      const groupProjectsGen = paginated(
        options => client.listProjects(options),
        { group: 1 },
      );

      const expectedProjects = mock.all_projects_response.filter(project =>
        project.path_with_namespace!.includes('group1/'),
      );

      const allItems = [];
      for await (const item of groupProjectsGen) {
        allItems.push(item);
      }
      expect(allItems).toHaveLength(expectedProjects.length);
    });

    it('should get all projects for an instance', async () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader(mock.config_self_managed),
        ),
        logger: mockServices.logger.mock(),
      });

      const instanceProjects = paginated(
        options => client.listProjects(options),
        {},
      );
      const allProjects = [];
      for await (const project of instanceProjects) {
        allProjects.push(project);
      }
      expect(allProjects).toHaveLength(mock.all_projects_response.length);
    });
  });

  describe('listUsers', () => {
    it('listUsers gets all users in the instance', async () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader(mock.config_self_managed),
        ),
        logger: mockServices.logger.mock(),
      });

      const allUsers: GitLabUser[] = [];
      for await (const user of paginated(
        options => client.listUsers(options),
        {},
      )) {
        allUsers.push(user);
      }

      expect(allUsers).toMatchObject(mock.all_users_response);
    });
  });

  describe('listGroups', () => {
    it('listGroups gets all groups in the instance', async () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader(mock.config_self_managed),
        ),
        logger: mockServices.logger.mock(),
      });

      const allGroups: GitLabGroup[] = [];
      for await (const group of paginated(
        options => client.listGroups(options),
        {},
      )) {
        allGroups.push(group);
      }

      expect(allGroups).toMatchObject(mock.all_groups_response);
    });
  });

  describe('get gitlab.com users', () => {
    it('gets all users under group', async () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(new ConfigReader(mock.config_saas)),
        logger: mockServices.logger.mock(),
      });
      const saasMembers = (
        await client.getGroupMembers('saas-multi-user-group', [
          'DIRECT, DESCENDANTS',
        ])
      ).items;

      expect(saasMembers.length).toEqual(2);
      expect(saasMembers).toEqual(mock.expectedSaasMember);
    });
    it('gets all users with token without full permissions', async () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(new ConfigReader(mock.config_saas)),
        logger: mockServices.logger.mock(),
      });
      const saasMembers = (
        await client.getGroupMembers('', ['DIRECT, DESCENDANTS'])
      ).items;
      expect(saasMembers).toEqual([]);
    });
    it('rejects when GraphQL returns errors', async () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(new ConfigReader(mock.config_saas)),
        logger: mockServices.logger.mock(),
      });
      await expect(() =>
        client.getGroupMembers('error-group', ['DIRECT, DESCENDANTS']),
      ).rejects.toThrow(
        'GraphQL errors: [{"message":"Unexpected end of document","locations":[]}]',
      );
    });
    it('traverses multi-page results', async () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader(mock.config_self_managed),
        ),
        logger: mockServices.logger.mock(),
      });
      const saasMembers = (
        await client.getGroupMembers('multi-page-saas', ['DIRECT, DESCENDANTS'])
      ).items;

      expect(saasMembers.length).toEqual(2);
      expect(saasMembers[0]).toEqual(mock.expectedSaasMember[1]);
      expect(saasMembers[1]).toEqual(mock.expectedSaasMember[0]);
    });
  });

  describe('listDescendantGroups', () => {
    it('gets all groups under root', async () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader(mock.config_self_managed),
        ),
        logger: mockServices.logger.mock(),
      });

      const allGroups = (await client.listDescendantGroups('group-with-parent'))
        .items;

      expect(allGroups.length).toEqual(1);
      expect(allGroups).toEqual(mock.group_with_parent);
    });

    it('gets all descendant groups with token without full permissions', async () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader(mock.config_self_managed),
        ),
        logger: mockServices.logger.mock(),
      });

      const allGroups = (
        await client.listDescendantGroups('non-existing-group')
      ).items;

      expect(allGroups).toEqual([]);
    });

    it('rejects when GraphQL returns errors', async () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader(mock.config_self_managed),
        ),
        logger: mockServices.logger.mock(),
      });

      await expect(() =>
        client.listDescendantGroups('error-group'),
      ).rejects.toThrow(
        'GraphQL errors: [{"message":"Unexpected end of document","locations":[]}]',
      );
    });
    it('traverses multi-page results', async () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader(mock.config_self_managed),
        ),
        logger: mockServices.logger.mock(),
      });

      const saasGroups = (await client.listDescendantGroups('root')).items;

      expect(saasGroups.length).toEqual(2);
      expect(saasGroups[0]).toEqual(mock.expectedSaasGroup[1]);
      expect(saasGroups[1]).toEqual(mock.expectedSaasGroup[0]);
    });
  });

  describe('getGroupMembers', () => {
    it('gets member IDs', async () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader(mock.config_self_managed),
        ),
        logger: mockServices.logger.mock(),
      });

      const members = await client.getGroupMembers('group1', ['DIRECT']);

      const user = {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        name: 'user1',
        state: 'active',
        web_url: 'user1.com',
        avatar_url: 'user1',
      };

      expect(members.items).toEqual([user]);
    });

    it('gets member IDs with token without full permissions', async () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader(mock.config_self_managed),
        ),
        logger: mockServices.logger.mock(),
      });

      const members = await client.getGroupMembers('non-existing-group', [
        'DIRECT',
      ]);

      expect(members.items).toEqual([]);
    });

    // TODO: is this one really necessary?
    it('rejects when GraphQL returns errors', async () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader(mock.config_self_managed),
        ),
        logger: mockServices.logger.mock(),
      });

      await expect(() =>
        client.getGroupMembers('error-group', ['DIRECT']),
      ).rejects.toThrow(
        'GraphQL errors: [{"message":"Unexpected end of document","locations":[]}]',
      );
    });

    it('traverses multi-page results', async () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader(mock.config_self_managed),
        ),
        logger: mockServices.logger.mock(),
      });

      const members = await client.getGroupMembers('multi-page', ['DIRECT']);

      expect(members.items[0].id).toEqual(1);
      expect(members.items[1].id).toEqual(2);
    });
  });

  describe('getGroupById', () => {
    it('should return group details by ID', async () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader(mock.config_self_managed),
        ),
        logger: mockServices.logger.mock(),
      });

      const group = await client.getGroupById(1);
      expect(group).toMatchObject(mock.all_groups_response[0]);
    });

    it('should handle errors when fetching group details by ID', async () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader(mock.config_self_managed),
        ),
        logger: mockServices.logger.mock(),
      });

      await expect(() => client.getGroupById(42)).rejects.toThrow(
        'Internal Server Error',
      );
    });
  });

  describe('getProjectById', () => {
    it('should return project details by ID', async () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader(mock.config_self_managed),
        ),
        logger: mockServices.logger.mock(),
      });

      const project = await client.getProjectById(1);
      expect(project).toMatchObject(mock.all_projects_response[0]);
    });

    it('should handle errors when fetching project details by ID', async () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader(mock.config_self_managed),
        ),
        logger: mockServices.logger.mock(),
      });

      await expect(() => client.getProjectById(42)).rejects.toThrow(
        'Internal Server Error',
      );
    });
  });

  describe('getUserById', () => {
    it('should return user details by ID', async () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader(mock.config_self_managed),
        ),
        logger: mockServices.logger.mock(),
      });

      const user = await client.getUserById(1);
      expect(user).toMatchObject(mock.all_users_response[0]);
    });

    it('should handle errors when fetching user details by ID', async () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader(mock.config_self_managed),
        ),
        logger: mockServices.logger.mock(),
      });

      await expect(() => client.getUserById(42)).rejects.toThrow(
        'Internal Server Error',
      );
    });
  });
});

describe('paginated', () => {
  it('should iterate through the pages until exhausted', async () => {
    const client = new GitLabClient({
      config: readGitLabIntegrationConfig(
        new ConfigReader(mock.config_self_managed),
      ),
      logger: mockServices.logger.mock(),
    });

    const paginatedItems = paginated(
      options => client.pagedRequest(mock.paged_endpoint, options),
      {},
    );
    const allItems = [];
    for await (const item of paginatedItems) {
      allItems.push(item);
    }

    expect(allItems).toHaveLength(4);
  });
});

describe('hasFile', () => {
  let client: GitLabClient;

  beforeEach(() => {
    client = new GitLabClient({
      config: readGitLabIntegrationConfig(
        new ConfigReader(mock.config_self_managed),
      ),
      logger: mockServices.logger.mock(),
    });
  });

  it('should find catalog file', async () => {
    const hasFile = await client.hasFile(
      'group1/test-repo1',
      'main',
      'catalog-info.yaml',
    );
    expect(hasFile).toBe(true);
  });

  it('should not find catalog file', async () => {
    const hasFile = await client.hasFile(
      'group1/test-repo1',
      'unknown',
      'catalog-info.yaml',
    );
    expect(hasFile).toBe(false);
  });
});

describe('pagedRequest search params', () => {
  it('no search params provided', async () => {
    const client = new GitLabClient({
      config: readGitLabIntegrationConfig(
        new ConfigReader(mock.config_self_managed),
      ),
      logger: mockServices.logger.mock(),
    });

    const { items } = await client.pagedRequest<{ endpoint: string }>(
      mock.some_endpoint,
    );
    // fake page contains exactly one item
    expect(items).toHaveLength(1);
    expect(items).toEqual([
      { endpoint: 'https://example.com/api/v4/some-endpoint' },
    ]);
  });

  it('defined numeric search params', async () => {
    const client = new GitLabClient({
      config: readGitLabIntegrationConfig(
        new ConfigReader(mock.config_self_managed),
      ),
      logger: mockServices.logger.mock(),
    });

    const { items } = await client.pagedRequest<{ endpoint: string }>(
      mock.some_endpoint,
      { page: 1, per_page: 50 },
    );
    // fake page contains exactly one item
    expect(items).toHaveLength(1);
    expect(items).toEqual([
      {
        endpoint: 'https://example.com/api/v4/some-endpoint?page=1&per_page=50',
      },
    ]);
  });

  it('defined string search params', async () => {
    const client = new GitLabClient({
      config: readGitLabIntegrationConfig(
        new ConfigReader(mock.config_self_managed),
      ),
      logger: mockServices.logger.mock(),
    });

    const { items } = await client.pagedRequest<{ endpoint: string }>(
      mock.some_endpoint,
      { test: 'value', empty: '' },
    );
    // fake page contains exactly one item
    expect(items).toHaveLength(1);
    expect(items).toEqual([
      {
        endpoint: 'https://example.com/api/v4/some-endpoint?test=value',
      },
    ]);
  });

  it('defined boolean search params', async () => {
    const client = new GitLabClient({
      config: readGitLabIntegrationConfig(
        new ConfigReader(mock.config_self_managed),
      ),
      logger: mockServices.logger.mock(),
    });

    const { items } = await client.pagedRequest<{ endpoint: string }>(
      mock.some_endpoint,
      { active: true, archived: false },
    );
    // fake page contains exactly one item
    expect(items).toHaveLength(1);
    expect(items).toEqual([
      {
        endpoint:
          'https://example.com/api/v4/some-endpoint?active=true&archived=false',
      },
    ]);
  });
});
