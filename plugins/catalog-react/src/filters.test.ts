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
import {
  EntityErrorFilter,
  EntityOrphanFilter,
  EntityOwnerFilter,
  EntityTextFilter,
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
