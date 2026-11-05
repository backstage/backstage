/*
 * Copyright 2026 The Backstage Authors
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

const mockResolveAuth = jest.fn();
const mockFetchIdentity = jest.fn();
const mockGetOriginUrl = jest.fn();
const mockGetRepoPrefix = jest.fn();
const mockClient: jest.Mocked<CatalogReader> = {
  queryEntities: jest.fn(),
  getEntitiesByRefs: jest.fn(),
  getEntityByRef: jest.fn(),
};
jest.mock('./resolveAuth', () => ({
  resolveAuth: (...args: unknown[]) => mockResolveAuth(...args),
}));
jest.mock('./identity', () => ({
  fetchIdentity: (...args: unknown[]) => mockFetchIdentity(...args),
}));
jest.mock('./catalogClient', () => ({
  ...jest.requireActual('./catalogClient'),
  createCatalogClient: () => mockClient,
}));
jest.mock('./gitRemote', () => ({
  ...jest.requireActual('./gitRemote'),
  getOriginUrl: (...args: unknown[]) => mockGetOriginUrl(...args),
  getRepoPrefix: (...args: unknown[]) => mockGetRepoPrefix(...args),
}));

import type { Entity } from '@backstage/catalog-model';
import {
  buildSkillQuery,
  collectAncestorGroups,
  fetchDependencies,
  findComponent,
  readOwnerAndSystem,
  resolveSelection,
} from './resolveContext';
import { queryAllEntities, type CatalogReader } from './catalogClient';

const rel = (type: string, targetRef: string) => ({ type, targetRef });
const component = (
  name: string,
  relations: Entity['relations'] = [],
): Entity => ({
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: { name, namespace: 'default' },
  spec: {},
  relations,
});
const group = (name: string, parents: string[] = []): Entity => ({
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Group',
  metadata: { name, namespace: 'default' },
  spec: {},
  relations: parents.map(p => rel('childOf', p)),
});
const skill = (
  name: string,
  owner: string,
  dependsOn: string[] = [],
): Entity => ({
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'AiResource',
  metadata: {
    name,
    namespace: 'default',
    annotations: {
      'backstage.io/source-location': `url:https://github.com/acme/skills/tree/main/skills/${name}`,
    },
  },
  spec: { type: 'skill', lifecycle: 'production', owner },
  relations: [
    rel('ownedBy', owner),
    ...dependsOn.map(d => rel('dependsOn', d)),
  ],
});

// A `queryEntities` response with the fields the real client always returns.
const page = (items: Entity[], nextCursor?: string) => ({
  items,
  totalItems: items.length,
  pageInfo: nextCursor ? { nextCursor } : {},
});

// A `getEntitiesByRefs` implementation backed by an in-memory lookup.
const lookup =
  (entities: Record<string, Entity>) =>
  async ({ entityRefs }: { entityRefs: string[] }) => ({
    items: entityRefs.map(r => entities[r]),
  });

beforeEach(() => {
  jest.resetAllMocks();
});

describe('queryAllEntities', () => {
  it('follows cursors until the last page', async () => {
    mockClient.queryEntities
      .mockResolvedValueOnce(page([component('a')], 'c1'))
      .mockResolvedValueOnce(page([component('b')]));
    const items = await queryAllEntities(
      mockClient,
      { query: { kind: 'Component' } },
      'tok',
    );
    expect(items.map(i => i.metadata.name)).toEqual(['a', 'b']);
    expect(mockClient.queryEntities).toHaveBeenNthCalledWith(
      2,
      { cursor: 'c1' },
      { token: 'tok' },
    );
  });
});

describe('findComponent', () => {
  const repo = 'https://github.acme.com/acme/mono';
  // A component read from a catalog file (managed-by-location, set by the
  // catalog) that declares a source location (self-declared).
  const located = (
    name: string,
    locations: { managedBy?: string; source?: string },
  ): Entity => ({
    ...component(name),
    metadata: {
      ...component(name).metadata,
      annotations: {
        ...(locations.managedBy && {
          'backstage.io/managed-by-location': `url:${locations.managedBy}`,
        }),
        ...(locations.source && {
          'backstage.io/source-location': `url:${locations.source}`,
        }),
      },
    },
  });
  // Answers the managed-by-location and source-location queries separately,
  // like the catalog would for the given prefix filters.
  const catalog = (registered: Entity[], declared: Entity[]) =>
    mockClient.queryEntities.mockImplementation(async request =>
      page(
        JSON.stringify(request).includes('managed-by-location')
          ? registered
          : declared,
      ),
    );
  const find = (repoPrefix: string, warn = jest.fn()) =>
    findComponent({
      client: mockClient,
      token: 'tok',
      remoteUrl: 'git@github.acme.com:acme/mono.git',
      repoPrefix,
      warn,
    });

  it('picks the component whose catalog file is in the nearest ancestor folder, ignoring spoofed source locations', async () => {
    const root = located('root', {
      managedBy: `${repo}/blob/main/catalog-info.yaml`,
      source: `${repo}/tree/main/`,
    });
    const api = located('api', {
      managedBy: `${repo}/blob/main/services/api/catalog-info.yaml`,
    });
    const web = located('web', {
      managedBy: `${repo}/blob/main/services/web/catalog-info.yaml`,
    });
    // Claims a folder of this repository, but was read from another one.
    const spoofed = located('spoofed', {
      managedBy:
        'https://github.acme.com/evil/mono/blob/main/catalog-info.yaml',
      source: `${repo}/tree/main/services/api/src`,
    });
    catalog([root, api, web, component('no-location')], [root, spoofed]);
    const warn = jest.fn();

    expect((await find('services/api', warn)).metadata.name).toBe('api');
    expect((await find('services/api/src/deep', warn)).metadata.name).toBe(
      'api',
    );
    expect((await find('services/api/src', warn)).metadata.name).toBe('api');
    expect((await find('services/web', warn)).metadata.name).toBe('web');
    expect((await find('services', warn)).metadata.name).toBe('root');
    expect((await find('', warn)).metadata.name).toBe('root');
    expect(warn).not.toHaveBeenCalled();
    // Only the trusted annotation is queried when it matches.
    expect(mockClient.queryEntities).toHaveBeenCalledTimes(6);
    expect(mockClient.queryEntities).toHaveBeenCalledWith(
      {
        query: {
          $all: [
            { kind: 'Component' },
            {
              'metadata.annotations.backstage.io/managed-by-location': {
                $hasPrefix: `url:${repo}/`,
              },
            },
          ],
        },
      },
      { token: 'tok' },
    );
  });

  it('fails when several catalog files in the nearest folder define a component, pointing at --entity', async () => {
    catalog(
      [
        located('one', {
          managedBy: `${repo}/blob/main/svc/catalog-info.yaml`,
        }),
        located('two', {
          managedBy: `${repo}/blob/main/svc/catalog-info.yaml`,
        }),
        located('top', { managedBy: `${repo}/blob/main/catalog-info.yaml` }),
      ],
      [],
    );
    await expect(find('svc/src')).rejects.toThrow(
      /registered from a catalog file in .*mono\/svc: component:default\/one, component:default\/two.*--entity/,
    );
    expect(mockClient.queryEntities).toHaveBeenCalledTimes(1);
  });

  it('falls back to a single self-declared source location with a warning, as for a central catalog repository', async () => {
    // Registered from a central catalog repository, not from this one.
    const svc = located('svc', {
      managedBy: 'https://github.acme.com/acme/catalog/blob/main/svc.yaml',
      source: `${repo}/tree/main/services/svc`,
    });
    // A component of this repository whose folder is not an ancestor.
    const other = located('other', {
      managedBy: `${repo}/blob/main/other/catalog-info.yaml`,
      source: `${repo}/tree/main/other`,
    });
    catalog([other], [svc, other]);
    const warn = jest.fn();

    expect((await find('services/svc/src', warn)).metadata.name).toBe('svc');
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toMatch(
      /^Warning: no Component is registered from a catalog file at or above https:\/\/github.acme.com\/acme\/mono\/services\/svc\/src, so component:default\/svc was matched by its self-declared backstage.io\/source-location annotation.*--entity/,
    );
    expect(mockClient.queryEntities).toHaveBeenLastCalledWith(
      {
        query: {
          $all: [
            { kind: 'Component' },
            {
              'metadata.annotations.backstage.io/source-location': {
                $hasPrefix: `url:${repo}/`,
              },
            },
          ],
        },
      },
      { token: 'tok' },
    );
  });

  it('rejects the fallback when several components declare a source location at any depth, and fails when nothing matches', async () => {
    const legit = located('legit', {
      managedBy: 'https://github.acme.com/acme/catalog/blob/main/svc.yaml',
      source: `${repo}/tree/main/services/svc`,
    });
    // A spoof at a shallower folder still blocks the fallback.
    const spoofed = located('spoofed', {
      managedBy: 'https://github.acme.com/evil/x/blob/main/catalog-info.yaml',
      source: `${repo}/tree/main/`,
    });
    catalog([], [legit, spoofed]);
    const warn = jest.fn();
    await expect(find('services/svc', warn)).rejects.toThrow(
      /multiple Components declare a backstage.io\/source-location.*component:default\/legit, component:default\/spoofed.*--entity/,
    );
    expect(warn).not.toHaveBeenCalled();

    catalog([], []);
    await expect(find('svc')).rejects.toThrow(
      /at or above https:\/\/github.acme.com\/acme\/mono\/svc was.*--entity/,
    );
    await expect(find('')).rejects.toThrow(
      /at or above https:\/\/github.acme.com\/acme\/mono was.*--entity/,
    );
  });

  it('fetches an explicit --entity, defaulting kind and namespace', async () => {
    mockClient.getEntityByRef.mockResolvedValue(component('svc'));
    await findComponent({ client: mockClient, token: 'tok', entity: 'svc' });
    expect(mockClient.getEntityByRef).toHaveBeenCalledWith(
      'component:default/svc',
      { token: 'tok' },
    );
    mockClient.getEntityByRef.mockResolvedValue(undefined);
    await expect(
      findComponent({ client: mockClient, token: 'tok', entity: 'svc' }),
    ).rejects.toThrow(/component:default\/svc.*not found/);
  });
});

describe('readOwnerAndSystem', () => {
  it('uses ownedBy and only partOf targets of kind system', () => {
    expect(
      readOwnerAndSystem(
        component('svc', [
          rel('ownedBy', 'group:default/team-a'),
          rel('partOf', 'component:default/parent'),
          rel('partOf', 'system:default/payments'),
        ]),
      ),
    ).toEqual({
      owner: 'group:default/team-a',
      system: 'system:default/payments',
    });
    expect(readOwnerAndSystem(component('bare'))).toEqual({
      owner: undefined,
      system: undefined,
    });
  });
});

describe('collectAncestorGroups', () => {
  it('walks childOf to the root in batches, skips users, and stops on cycles', async () => {
    mockClient.getEntitiesByRefs.mockImplementation(
      lookup({
        'group:default/team-a': group('team-a', ['group:default/org-x']),
        'group:default/org-x': group('org-x', ['group:default/root']),
        'group:default/root': group('root', ['group:default/team-a']),
      }),
    );
    const result = await collectAncestorGroups(mockClient, 'tok', [
      'user:default/jane',
      'group:default/team-a',
    ]);
    expect(result).toEqual(['group:default/org-x', 'group:default/root']);
    // user refs are never fetched
    const requested = mockClient.getEntitiesByRefs.mock.calls.flatMap(
      ([request]) => request.entityRefs,
    );
    expect(requested).not.toContain('user:default/jane');
    expect(mockClient.getEntitiesByRefs).toHaveBeenCalledTimes(3);
  });
});

describe('buildSkillQuery', () => {
  it('matches system or owners, omits empty parts, and returns undefined without scope', () => {
    expect(
      buildSkillQuery({
        system: 'system:default/payments',
        owners: ['group:default/a', 'user:default/jane'],
      }),
    ).toEqual({
      $all: [
        { kind: 'AiResource' },
        { 'spec.type': 'skill' },
        {
          $any: [
            {
              relations: {
                $contains: {
                  type: 'partOf',
                  targetRef: 'system:default/payments',
                },
              },
            },
            {
              relations: {
                $contains: {
                  type: 'ownedBy',
                  targetRef: { $in: ['group:default/a', 'user:default/jane'] },
                },
              },
            },
          ],
        },
      ],
    });
    const noOwners = JSON.stringify(
      buildSkillQuery({ system: 'system:default/payments', owners: [] }),
    );
    expect(noOwners).not.toContain('$in');
    const noSystem = JSON.stringify(
      buildSkillQuery({ owners: ['group:default/a'] }),
    );
    expect(noSystem).not.toContain('partOf');
    expect(buildSkillQuery({ owners: [] })).toBeUndefined();
  });
});

describe('fetchDependencies', () => {
  it('follows dependsOn only from skills, not from other entities', async () => {
    const dependsOnComponent: Entity = {
      ...component('lib', [rel('dependsOn', 'airesource:default/hidden')]),
    };
    mockClient.getEntitiesByRefs.mockImplementation(
      lookup({
        'airesource:default/base': skill('base', 'group:default/a', [
          'airesource:default/nested',
          'component:default/lib',
        ]),
        'airesource:default/nested': skill('nested', 'group:default/a'),
        'component:default/lib': dependsOnComponent,
        'airesource:default/hidden': skill('hidden', 'group:default/a'),
      }),
    );
    const fetched = await fetchDependencies(mockClient, 'tok', [
      skill('mine', 'group:default/a', ['airesource:default/base']),
    ]);
    expect(fetched.map(e => e.metadata.name)).toEqual([
      'base',
      'nested',
      'lib',
    ]);
  });
});

describe('resolveSelection', () => {
  it('resolves identity, component, ancestors, candidates and dependencies end to end', async () => {
    mockResolveAuth.mockResolvedValue({
      baseUrl: 'https://b.example.com',
      accessToken: 'tok',
    });
    mockFetchIdentity.mockResolvedValue({
      sub: 'user:default/jane',
      ent: ['user:default/jane', 'group:default/team-a'],
    });
    mockGetOriginUrl.mockResolvedValue('git@github.com:acme/svc.git');
    mockGetRepoPrefix.mockResolvedValue('');
    const comp = {
      ...component('svc', [
        rel('ownedBy', 'group:default/team-a'),
        rel('partOf', 'system:default/payments'),
      ]),
      metadata: {
        name: 'svc',
        namespace: 'default',
        annotations: {
          'backstage.io/source-location':
            'url:https://github.com/acme/svc/tree/main/',
          'backstage.io/managed-by-location':
            'url:https://github.com/acme/svc/blob/main/catalog-info.yaml',
        },
      },
    };
    const dep = skill('base', 'group:default/elsewhere');
    let skillQuery: unknown;
    mockClient.queryEntities.mockImplementation(async request => {
      if (!JSON.stringify(request).includes('AiResource')) {
        return page([comp]);
      }
      skillQuery = request;
      return page([
        skill('mine', 'group:default/org-x', ['airesource:default/base']),
      ]);
    });
    mockClient.getEntitiesByRefs.mockImplementation(
      lookup({
        'group:default/team-a': group('team-a', ['group:default/org-x']),
        'group:default/org-x': group('org-x'),
        'airesource:default/base': dep,
      }),
    );

    const result = await resolveSelection({ agents: ['claude-code'] });

    expect(result.context).toMatchObject({
      user: 'user:default/jane',
      componentRef: 'component:default/svc',
      owner: 'group:default/team-a',
      system: 'system:default/payments',
      groupRefs: ['group:default/team-a'],
      ancestorGroupRefs: ['group:default/org-x'],
    });
    expect(result.decisions.map(d => [d.name, d.status, d.via])).toEqual([
      ['base', 'selected', 'dependency'],
      ['mine', 'selected', 'scope'],
    ]);
    // The skill query includes the ancestor group, not just the user's own groups.
    expect(JSON.stringify(skillQuery)).toContain('group:default/org-x');
    // Only skills are requested; selectSkills does not reject other AiResources.
    expect(JSON.stringify(skillQuery)).toContain('"spec.type":"skill"');
  });

  it('skips the candidate query when there is no scope at all', async () => {
    mockResolveAuth.mockResolvedValue({
      baseUrl: 'https://b.example.com',
      accessToken: 'tok',
    });
    mockFetchIdentity.mockResolvedValue({ sub: 'user:default/jane', ent: [] });
    mockClient.getEntityByRef.mockResolvedValue(component('bare'));
    const result = await resolveSelection({
      entity: 'bare',
      agents: ['codex'],
    });
    expect(result.decisions).toEqual([]);
    expect(result.context.owner).toBeUndefined();
    expect(mockClient.queryEntities).not.toHaveBeenCalled();
  });
});
