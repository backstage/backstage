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

import { getVoidLogger } from '@backstage/backend-common';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { rest } from 'msw';
import { setupServer, SetupServerApi } from 'msw/node';
import { GitLabClient } from './client';
import {
  GroupAdjacency,
  GroupNode,
  populateChildrenMembers,
  readGroups,
} from './groups';

const server = setupServer();
setupRequestMockHandlers(server);

const API_BASE_URL = 'https://example.com/api/v4';
const MOCK_CONFIG = new ConfigReader({
  integrations: {
    gitlab: [
      {
        host: 'example.com',
        token: 'test-token',
        apiBaseUrl: API_BASE_URL,
      },
    ],
  },
});

const GROUP_ONE = {
  id: 1,
  web_url: 'https://example.com/groups/alpha',
  name: 'Alpha',
  path: 'alpha',
  description: 'Alpha Description',
  visibility: 'internal',
  full_name: 'Alpha',
  full_path: 'alpha',
  created_at: '2021-12-01T10:00:00.000Z',
  parent_id: null,
};

const GROUP_TWO = {
  id: 2,
  web_url: 'https://example.com/groups/alpha/one',
  name: 'Alpha Child One',
  path: 'one',
  description: '',
  visibility: 'internal',
  full_name: 'Alpha / Alpha Child One',
  full_path: 'alpha/one',
  created_at: '2021-12-01T10:00:00.000Z',
  parent_id: 1,
};

const GROUP_THREE = {
  id: 3,
  web_url: 'https://example.com/groups/beta',
  name: 'Beta',
  path: 'beta',
  description: '',
  visibility: 'internal',
  full_name: 'Beta',
  full_path: 'beta',
  created_at: '2021-12-01T10:00:00.000Z',
  parent_id: null,
};

function setupFakeInstanceGroups(srv: SetupServerApi) {
  srv.use(
    rest.get(`${API_BASE_URL}/groups`, (_, res, ctx) => {
      return res(
        ctx.set('x-next-page', ''),
        ctx.json([GROUP_ONE, GROUP_TWO, GROUP_THREE]),
      );
    }),
    rest.get(`${API_BASE_URL}/groups/1/members`, (_, res, ctx) => {
      return res(
        ctx.set('x-next-page', ''),
        ctx.json([
          {
            id: 1,
            name: 'User One',
            username: 'user.one',
            state: 'active',
            avatar_url: 'https://example.com/avatar/1',
            web_url: 'https://example.com/user.one',
            access_level: 40,
            created_at: '2021-12-01T10:00:00.000Z',
            expires_at: null,
          },
        ]),
      );
    }),
    rest.get(`${API_BASE_URL}/groups/2/members`, (_, res, ctx) => {
      return res(ctx.set('x-next-page', ''), ctx.json([]));
    }),
    rest.get(`${API_BASE_URL}/groups/3/members`, (_, res, ctx) => {
      return res(
        ctx.set('x-next-page', ''),
        ctx.json([
          {
            id: 2,
            name: 'Inherited User',
            username: 'inherited.user.two',
            state: 'active',
            avatar_url: 'https://example.com/avatar/2',
            web_url: 'https://example.com/inherited.user.two',
            access_level: 50,
            created_at: '2021-12-02T11:00:00.000Z',
            expires_at: null,
          },
        ]),
      );
    }),
    // setup group detail
    rest.get(`${API_BASE_URL}/groups/1`, (_, res, ctx) => {
      return res(
        ctx.set('x-next-page', ''),
        ctx.json({
          ...GROUP_ONE,
          shared_with_groups: [
            {
              group_id: 3,
              group_name: 'Beta',
              group_full_path: 'beta',
              group_access_level: 50,
              expires_at: null,
            },
          ],
        }),
      );
    }),
    rest.get(`${API_BASE_URL}/groups/2`, (_, res, ctx) => {
      return res(
        ctx.set('x-next-page', ''),
        ctx.json({
          ...GROUP_TWO,
          shared_with_groups: [],
        }),
      );
    }),
    rest.get(`${API_BASE_URL}/groups/3`, (_, res, ctx) => {
      return res(
        ctx.set('x-next-page', ''),
        ctx.json({
          ...GROUP_THREE,
          shared_with_groups: [],
        }),
      );
    }),
  );
}

beforeEach(() => {
  setupFakeInstanceGroups(server);
});

describe('readGroups', () => {
  it('should map the group response to group entity, parent and children adjacency', async () => {
    const client = new GitLabClient({
      integrations: ScmIntegrations.fromConfig(MOCK_CONFIG),
      logger: getVoidLogger(),
    });

    const groupAdjacency = await readGroups(client, '', '.');
    expect(groupAdjacency.size).toEqual(3);
    expect(groupAdjacency.get(1)?.entity?.spec?.children).toHaveLength(1);
    expect(groupAdjacency.get(1)?.entity?.spec?.children).toContain(
      stringifyEntityRef({
        kind: 'group',
        name: 'alpha.one',
      }),
    );
  });

  it('should set the group entity values from the response', async () => {
    const client = new GitLabClient({
      integrations: ScmIntegrations.fromConfig(MOCK_CONFIG),
      logger: getVoidLogger(),
    });

    const groupAdjacency = await readGroups(client, '', '.');
    const groupEntity = groupAdjacency.get(1)?.entity;

    expect(groupEntity).toHaveProperty('metadata.name', 'alpha');
    expect(groupEntity).toHaveProperty(
      'metadata.description',
      'Alpha Description',
    );
    expect(groupEntity).toHaveProperty('spec.profile.displayName', 'Alpha');
  });

  it('should set the group name using the path delimiter', async () => {
    const client = new GitLabClient({
      integrations: ScmIntegrations.fromConfig(MOCK_CONFIG),
      logger: getVoidLogger(),
    });

    const groupAdjacencyPeriod = await readGroups(client, '', '.');
    expect(groupAdjacencyPeriod.get(2)?.entity).toHaveProperty(
      'metadata.name',
      'alpha.one',
    );

    const groupAdjacencyUnderscore = await readGroups(client, '', '_');
    expect(groupAdjacencyUnderscore.get(2)?.entity).toHaveProperty(
      'metadata.name',
      'alpha_one',
    );
  });
});

describe('populateChildren', () => {
  it('should add direct group members', async () => {
    const groupNode: GroupNode = {
      parent: null,
      children: [],
      entity: {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: {
          name: 'beta',
        },
        spec: {
          type: 'team',
          profile: {},
          children: [],
          members: [],
        },
      },
    };
    const adj: GroupAdjacency = new Map();
    adj.set(3, groupNode);

    const client = new GitLabClient({
      integrations: ScmIntegrations.fromConfig(MOCK_CONFIG),
      logger: getVoidLogger(),
    });

    await populateChildrenMembers(client, adj);
    expect(adj.get(3)?.entity?.spec?.members).toHaveLength(1);
    expect(adj.get(3)?.entity?.spec?.members).toContain(
      stringifyEntityRef({
        kind: 'user',
        name: 'inherited.user.two',
      }),
    );
  });

  it('should add direct members from shared group', async () => {
    const groupNode: GroupNode = {
      parent: null,
      children: [],
      entity: {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: {
          name: 'alpha',
        },
        spec: {
          type: 'team',
          profile: {},
          children: [],
          members: [],
        },
      },
    };
    const adj: GroupAdjacency = new Map();
    adj.set(1, groupNode);

    const client = new GitLabClient({
      integrations: ScmIntegrations.fromConfig(MOCK_CONFIG),
      logger: getVoidLogger(),
    });

    await populateChildrenMembers(client, adj);
    expect(adj.get(1)?.entity?.spec?.members).toHaveLength(2);
    expect(adj.get(1)?.entity?.spec?.members).toContain(
      stringifyEntityRef({
        kind: 'user',
        name: 'user.one',
      }),
    );
    expect(adj.get(1)?.entity?.spec?.members).toContain(
      stringifyEntityRef({
        kind: 'user',
        name: 'inherited.user.two',
      }),
    );
  });
});
