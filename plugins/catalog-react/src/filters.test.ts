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

import { AlphaEntity } from '@backstage/catalog-model/alpha';
import { Entity, RELATION_OWNED_BY } from '@backstage/catalog-model';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { filterPredicateToFilterFunction } from '@backstage/filter-predicates';
import {
  EntityErrorFilter,
  EntityKindFilter,
  EntityLifecycleFilter,
  EntityNamespaceFilter,
  EntityOrphanFilter,
  EntityOwnerFilter,
  EntityTagFilter,
  EntityTextFilter,
  EntityTypeFilter,
  EntityUserFilter,
} from './filters';

const entities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'react-app',
      tags: ['react', 'experimental'],
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'gRPC service',
      tags: ['gRPC', 'java'],
    },
  },
];

const templates: TemplateEntityV1beta3[] = [
  {
    apiVersion: 'scaffolder.backstage.io/v1beta3',
    kind: 'Template',
    metadata: {
      name: 'react-app',
      title: 'Create React App Template',
      tags: ['react', 'experimental'],
    },
    spec: {
      type: '',
      steps: [],
    },
  },
  {
    apiVersion: 'scaffolder.backstage.io/v1beta3',
    kind: 'Template',
    metadata: {
      name: 'gRPC service',
      title: 'Spring Boot gRPC Service',
      tags: ['gRPC', 'java'],
    },
    spec: {
      type: '',
      steps: [],
    },
  },
];

const users: Entity[] = [
  {
    apiVersion: '1',
    kind: 'User',
    metadata: {
      name: 'jd1234',
    },
    spec: {
      profile: {
        displayName: 'DOE, JOHN',
      },
    },
  },
  {
    apiVersion: '1',
    kind: 'User',
    metadata: {
      name: 'fb3456',
    },
    spec: {
      profile: {
        displayName: 'BAR, FOO',
      },
    },
  },
];

describe('EntityTextFilter', () => {
  it('should search name', () => {
    const filter = new EntityTextFilter('app');
    expect(filter.filterEntity(entities[0])).toBeTruthy();
    expect(filter.filterEntity(entities[1])).toBeFalsy();
  });

  it('should search template title', () => {
    const filter = new EntityTextFilter('spring');
    expect(filter.filterEntity(templates[0])).toBeFalsy();
    expect(filter.filterEntity(templates[1])).toBeTruthy();
  });

  it('should search tags', () => {
    const filter = new EntityTextFilter('java');
    expect(filter.filterEntity(entities[0])).toBeFalsy();
    expect(filter.filterEntity(entities[1])).toBeTruthy();
  });

  it('should be case insensitive', () => {
    const filter = new EntityTextFilter('JaVa');
    expect(filter.filterEntity(entities[0])).toBeFalsy();
    expect(filter.filterEntity(entities[1])).toBeTruthy();
  });

  it('should search display name', () => {
    const filter = new EntityTextFilter('doe');
    expect(filter.filterEntity(users[0])).toBeTruthy();
    expect(filter.filterEntity(users[1])).toBeFalsy();
  });

  it('should search spec.target and spec.targets', () => {
    const location: Entity = {
      apiVersion: '1',
      kind: 'Location',
      metadata: { name: 'my-location' },
      spec: {
        target:
          'https://github.com/backstage/backstage/blob/main/catalog-info.yaml',
      },
    };
    const locationWithTargets: Entity = {
      apiVersion: '1',
      kind: 'Location',
      metadata: { name: 'multi-location' },
      spec: {
        targets: [
          'https://github.com/backstage/backstage/blob/main/one.yaml',
          'https://github.com/backstage/backstage/blob/main/two.yaml',
        ],
      },
    };

    expect(
      new EntityTextFilter('catalog-info').filterEntity(location),
    ).toBeTruthy();
    expect(
      new EntityTextFilter('two.yaml').filterEntity(locationWithTargets),
    ).toBeTruthy();
    expect(
      new EntityTextFilter('nonexistent').filterEntity(location),
    ).toBeFalsy();
  });
});

describe('EntityOrphanFilter', () => {
  const orphanAnnotation: Record<string, string> = {};
  orphanAnnotation['backstage.io/orphan'] = 'true';

  const orphan: Entity = {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'orphaned-service',
      annotations: orphanAnnotation,
    },
  };

  it('should find orphans', () => {
    const filter = new EntityOrphanFilter(true);
    expect(filter.filterEntity(orphan)).toBeTruthy();
    expect(filter.filterEntity(entities[1])).toBeFalsy();
  });
});

describe('EntityErrorFilter', () => {
  const error: AlphaEntity = {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'service-with-error',
      tags: ['Invalid Tag'],
    },
    status: {
      items: [
        {
          type: 'invalid-tag',
          level: 'error',
          message: 'Tag is not valid',
          error: undefined,
        },
      ],
    },
  };

  it('should find errors', () => {
    const filter = new EntityErrorFilter(true);
    expect(filter.filterEntity(error)).toBeTruthy();
    expect(filter.filterEntity(entities[1])).toBeFalsy();
  });
});

describe('EntityOwnerFilter', () => {
  it('should handle humanizedEntityRefs', () => {
    const filter = new EntityOwnerFilter(['my-user']);
    expect(
      filter.filterEntity({
        relations: [
          {
            type: RELATION_OWNED_BY,
            targetRef: 'group:default/my-user',
          },
        ],
      } as Entity),
    ).toBeTruthy();
    expect(filter.values).toStrictEqual(['group:default/my-user']);
  });

  it('should handle full entityRefs', () => {
    const filter = new EntityOwnerFilter(['group:default/my-user']);
    expect(
      filter.filterEntity({
        relations: [
          {
            type: RELATION_OWNED_BY,
            targetRef: 'group:default/my-user',
          },
        ],
      } as Entity),
    ).toBeTruthy();
    expect(filter.values).toStrictEqual(['group:default/my-user']);
  });

  it('should gracefully reject non-entity refs', () => {
    const filter = new EntityOwnerFilter(['group:default/my-user', '']);
    expect(
      filter.filterEntity({
        relations: [
          {
            type: RELATION_OWNED_BY,
            targetRef: 'group:default/my-user',
          },
        ],
      } as Entity),
    ).toBeTruthy();
    expect(filter.values).toStrictEqual(['group:default/my-user']);
  });

  it('should handle non group full entity refs', () => {
    const filter = new EntityOwnerFilter(['user:default/my-user', '']);
    expect(
      filter.filterEntity({
        relations: [
          {
            type: RELATION_OWNED_BY,
            targetRef: 'user:default/my-user',
          },
        ],
      } as Entity),
    ).toBeTruthy();
    expect(filter.values).toStrictEqual(['user:default/my-user']);
  });
});

describe('getCatalogQuery', () => {
  it('builds predicates for builtin filters', () => {
    expect(
      new EntityKindFilter('component', 'Component').getCatalogQuery(),
    ).toEqual({ kind: 'component' });
    expect(new EntityTypeFilter('service').getCatalogQuery()).toEqual({
      'spec.type': 'service',
    });
    expect(new EntityTagFilter([]).getCatalogQuery()).toBeUndefined();
    expect(new EntityTagFilter(['a', 'b']).getCatalogQuery()).toEqual({
      $all: [
        { 'metadata.tags': { $contains: 'a' } },
        { 'metadata.tags': { $contains: 'b' } },
      ],
    });
    expect(new EntityOwnerFilter(['team-a']).getCatalogQuery()).toEqual({
      relations: {
        $contains: { type: 'ownedBy', targetRef: 'group:default/team-a' },
      },
    });
    expect(new EntityLifecycleFilter(['prod']).getCatalogQuery()).toEqual({
      'spec.lifecycle': 'prod',
    });
    expect(new EntityNamespaceFilter(['ns']).getCatalogQuery()).toEqual({
      'metadata.namespace': 'ns',
    });
    expect(new EntityOrphanFilter(true).getCatalogQuery()).toEqual({
      'metadata.annotations.backstage.io/orphan': 'true',
    });
    expect(new EntityOrphanFilter(false).getCatalogQuery()).toBeUndefined();
  });

  it('builds predicates for EntityUserFilter', () => {
    expect(EntityUserFilter.all().getCatalogQuery()).toBeUndefined();
    expect(
      EntityUserFilter.owned(['group:default/a']).getCatalogQuery(),
    ).toEqual({
      relations: {
        $contains: { type: 'ownedBy', targetRef: 'group:default/a' },
      },
    });
    expect(
      EntityUserFilter.starred([
        'component:default/a',
        'api:other/b',
      ]).getCatalogQuery(),
    ).toEqual({
      $any: [
        {
          kind: 'component',
          'metadata.namespace': 'default',
          'metadata.name': 'a',
        },
        { kind: 'api', 'metadata.namespace': 'other', 'metadata.name': 'b' },
      ],
    });
  });
});

describe('getCatalogQuery evaluation', () => {
  const sample: Entity[] = [
    {
      apiVersion: '1',
      kind: 'Component',
      metadata: { name: 'a', namespace: 'default', tags: ['java', 'web'] },
      spec: { lifecycle: 'production' },
      relations: [{ type: RELATION_OWNED_BY, targetRef: 'group:default/x' }],
    },
    {
      apiVersion: '1',
      kind: 'Component',
      metadata: { name: 'b', namespace: 'default', tags: ['java'] },
      spec: { lifecycle: 'experimental' },
      relations: [{ type: RELATION_OWNED_BY, targetRef: 'group:default/y' }],
    },
    {
      apiVersion: '1',
      kind: 'Component',
      metadata: { name: 'c', namespace: 'default' },
    },
  ];

  it.each([
    ['single tag', new EntityTagFilter(['java'])],
    ['multiple tags', new EntityTagFilter(['java', 'web'])],
    ['one owner', new EntityOwnerFilter(['group:default/x'])],
    ['many owners', new EntityOwnerFilter(['x', 'y'])],
    ['lifecycle', new EntityLifecycleFilter(['production'])],
    ['owned', EntityUserFilter.owned(['group:default/y'])],
    ['owned by nobody', EntityUserFilter.owned([])],
    ['starred', EntityUserFilter.starred(['component:default/c'])],
  ])('agrees with filterEntity for %s', (_name, filter) => {
    const predicate = filter.getCatalogQuery();
    expect(predicate).toBeDefined();
    const matches = filterPredicateToFilterFunction<Entity>(predicate!);
    expect(sample.filter(matches).map(e => e.metadata.name)).toEqual(
      sample.filter(e => filter.filterEntity(e)).map(e => e.metadata.name),
    );
  });
});
