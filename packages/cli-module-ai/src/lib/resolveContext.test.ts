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
const mockGetRepoRoot = jest.fn();
const mockGetMainRoot = jest.fn();
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
  getRepoRoot: (...args: unknown[]) => mockGetRepoRoot(...args),
  getMainCheckoutRoot: (...args: unknown[]) => mockGetMainRoot(...args),
}));

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
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
  // A component read from a catalog file, as the catalog records in the
  // managed-by-location annotation.
  const annotated = (
    name: string,
    annotations: Record<string, string>,
  ): Entity => ({
    ...component(name),
    metadata: { ...component(name).metadata, annotations },
  });
  const located = (name: string, managedBy: string) =>
    annotated(name, { 'backstage.io/managed-by-location': `url:${managedBy}` });
  const declared = (name: string, source: string, managedBy: string) =>
    annotated(name, {
      'backstage.io/source-location': `url:${source}`,
      'backstage.io/managed-by-location': `url:${managedBy}`,
    });
  const catalog = (registered: Entity[]) =>
    mockClient.queryEntities.mockImplementation(async () => page(registered));
  const find = (repoPrefix: string) =>
    findComponent({
      client: mockClient,
      token: 'tok',
      remoteUrl: 'git@github.acme.com:acme/mono.git',
      repoPrefix,
    });

  it('picks the component whose catalog file is in the nearest ancestor folder', async () => {
    const root = located('root', `${repo}/blob/main/catalog-info.yaml`);
    const api = located(
      'api',
      `${repo}/blob/main/services/api/catalog-info.yaml`,
    );
    const web = located(
      'web',
      `${repo}/blob/main/services/web/catalog-info.yaml`,
    );
    // Read from another repository, so it never matches.
    const elsewhere = located(
      'elsewhere',
      'https://github.acme.com/evil/mono/blob/main/services/api/catalog-info.yaml',
    );
    catalog([root, api, web, elsewhere, component('no-location')]);

    expect((await find('services/api')).metadata.name).toBe('api');
    expect((await find('services/api/src/deep')).metadata.name).toBe('api');
    expect((await find('services/api/src')).metadata.name).toBe('api');
    expect((await find('services/web')).metadata.name).toBe('web');
    expect((await find('services')).metadata.name).toBe('root');
    expect((await find('')).metadata.name).toBe('root');
    // Each lookup queries source locations first, then catalog file locations.
    expect(mockClient.queryEntities).toHaveBeenCalledTimes(12);
    for (const annotation of ['source-location', 'managed-by-location']) {
      expect(mockClient.queryEntities).toHaveBeenCalledWith(
        {
          query: {
            $all: [
              { kind: 'Component' },
              {
                [`metadata.annotations.backstage.io/${annotation}`]: {
                  $hasPrefix: `url:${repo}/`,
                },
              },
            ],
          },
        },
        { token: 'tok' },
      );
    }
  });

  it('prefers the source location over the catalog file location, nearest folder first', async () => {
    // Both are registered from a central catalog file in the same repository.
    const central = `${repo}/blob/main/catalog/all.yaml`;
    const api = declared('api', `${repo}/tree/main/services/api`, central);
    const web = declared('web', `${repo}/tree/main/services/web`, central);
    // Claims a folder here, but was registered from another repository.
    const hijack = declared(
      'hijack',
      `${repo}/tree/main/services/hijack`,
      'https://github.acme.com/acme/catalog/blob/main/all.yaml',
    );
    // Read from a catalog file in this repository, but not the source location.
    const root = located(
      'root',
      `${repo}/blob/main/services/catalog-info.yaml`,
    );
    catalog([api, web, root, hijack]);

    expect((await find('services/api/src')).metadata.name).toBe('api');
    expect((await find('services/web')).metadata.name).toBe('web');
    // Nothing declares this source location, so the catalog file is used.
    expect((await find('services/other')).metadata.name).toBe('root');
    // A source location without a managed-by location in this repo is ignored.
    expect((await find('services/hijack')).metadata.name).toBe('root');

    catalog([api, declared('api2', `${repo}/tree/main/services/api`, central)]);
    await expect(find('services/api')).rejects.toThrow(
      /Multiple Components have a backstage.io\/source-location in .*mono\/services\/api: component:default\/api, component:default\/api2.*--entity/,
    );
  });

  it('fails when several catalog files in the nearest folder define a component, pointing at --entity', async () => {
    catalog([
      located('one', `${repo}/blob/main/svc/catalog-info.yaml`),
      located('two', `${repo}/blob/main/svc/catalog-info.yaml`),
      located('top', `${repo}/blob/main/catalog-info.yaml`),
    ]);
    await expect(find('svc/src')).rejects.toThrow(
      /have a backstage.io\/managed-by-location in .*mono\/svc: component:default\/one, component:default\/two.*--entity/,
    );
    expect(mockClient.queryEntities).toHaveBeenCalledTimes(2);
  });

  it('fails pointing at --entity when no source location or catalog file matches', async () => {
    const registeredElsewhere = declared(
      'declared',
      `${repo}/tree/main/services/elsewhere`,
      'https://github.acme.com/acme/catalog/blob/main/svc.yaml',
    );
    catalog([
      registeredElsewhere,
      located('other', `${repo}/blob/main/other/c.yaml`),
    ]);
    await expect(find('services/svc/src')).rejects.toThrow(
      /No Component with a backstage.io\/source-location or backstage.io\/managed-by-location at or above https:\/\/github.acme.com\/acme\/mono\/services\/svc\/src was found.*--entity/,
    );
    await expect(find('')).rejects.toThrow(
      /at or above https:\/\/github.acme.com\/acme\/mono was found.*--entity/,
    );
  });

  it('matches catalog files registered as file: locations inside the checkout roots, by real path', async () => {
    const base = fs.realpathSync(
      fs.mkdtempSync(path.join(os.tmpdir(), 'cli-module-ai-')),
    );
    try {
      const main = path.join(base, 'main');
      const worktree = path.join(base, 'worktree');
      const link = path.join(base, 'link');
      fs.mkdirSync(path.join(main, 'svc'), { recursive: true });
      fs.mkdirSync(path.join(worktree, 'other'), { recursive: true });
      fs.symlinkSync(main, link);
      const file = (name: string, p: string) =>
        annotated(name, { 'backstage.io/managed-by-location': `file:${p}` });
      const findFile = (repoPrefix: string) =>
        findComponent({
          client: mockClient,
          token: 'tok',
          remoteUrl: 'git@github.acme.com:acme/mono.git',
          repoPrefix,
          fileRoots: [worktree, main],
        });

      const sourced = (name: string, source: string, managedBy: string) =>
        annotated(name, {
          'backstage.io/source-location': `file:${source}`,
          'backstage.io/managed-by-location': managedBy,
        });
      fs.mkdirSync(path.join(main, 'good'), { recursive: true });
      fs.mkdirSync(path.join(main, 'bad'), { recursive: true });
      fs.mkdirSync(path.join(main, 'bad2'), { recursive: true });
      catalog([
        sourced(
          'good',
          path.join(main, 'good'),
          `file:${path.join(main, 'good', 'catalog-info.yaml')}`,
        ),
        // Registered from a file outside of the checkout.
        sourced(
          'bad',
          path.join(main, 'bad'),
          `file:${path.join(base, 'outside', 'catalog-info.yaml')}`,
        ),
        // Registered from a URL in another repository.
        sourced(
          'bad2',
          path.join(main, 'bad2'),
          'url:https://github.acme.com/acme/other/blob/main/c.yaml',
        ),
        file('root', path.join(main, 'catalog-info.yaml')),
      ]);
      expect((await findFile('good/src')).metadata.name).toBe('good');
      expect((await findFile('bad')).metadata.name).toBe('root');
      expect((await findFile('bad2')).metadata.name).toBe('root');
      catalog([
        file('root', path.join(main, 'catalog-info.yaml')),
        file('svc', path.join(link, 'svc', 'catalog-info.yaml')),
        file('other', path.join(worktree, 'other', 'catalog-info.yaml')),
        file('outside', path.join(base, 'outside', 'catalog-info.yaml')),
        located('remote', `${repo}/blob/main/remote/catalog-info.yaml`),
      ]);

      expect((await findFile('svc/src')).metadata.name).toBe('svc');
      expect((await findFile('other')).metadata.name).toBe('other');
      expect((await findFile('remote/src')).metadata.name).toBe('remote');
      expect((await findFile('')).metadata.name).toBe('root');
      for (const annotation of ['source-location', 'managed-by-location']) {
        const key = `metadata.annotations.backstage.io/${annotation}`;
        expect(mockClient.queryEntities).toHaveBeenCalledWith(
          {
            query: {
              $all: [
                { kind: 'Component' },
                {
                  $any: [
                    { [key]: { $hasPrefix: `url:${repo}/` } },
                    { [key]: { $hasPrefix: 'file:' } },
                  ],
                },
              ],
            },
          },
          { token: 'tok' },
        );
      }
    } finally {
      fs.rmSync(base, { recursive: true, force: true });
    }
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
    mockGetRepoRoot.mockResolvedValue(undefined);
    mockGetMainRoot.mockResolvedValue(undefined);
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
