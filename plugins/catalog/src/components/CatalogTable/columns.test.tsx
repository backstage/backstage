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
import { Entity } from '@backstage/catalog-model';
import {
  EntityPresentationApi,
  EntityRefPresentationSnapshot,
} from '@backstage/plugin-catalog-react';
import { columnFactories } from './columns';
import { CatalogTableRow } from './types';

function makeRow(entity: Entity): CatalogTableRow {
  return {
    entity,
    resolved: {
      name: entity.metadata.name,
      entityRef: `${entity.kind}:${
        entity.metadata.namespace ?? 'default'
      }/${entity.metadata.name}`.toLowerCase(),
      partOfSystemRelations: [],
      ownedByRelations: [],
    },
  };
}

const entityA: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: { name: 'component-a' },
};

const entityB: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: { name: 'component-b', title: 'Zebra' },
};

const mockPresentationApi: EntityPresentationApi = {
  forEntity: entityOrRef => {
    const name =
      typeof entityOrRef === 'string' ? entityOrRef : entityOrRef.metadata.name;
    const snapshot: EntityRefPresentationSnapshot = {
      entityRef: `component:default/${name}`,
      primaryTitle: `PRESENTED ${name.toUpperCase()}`,
    };
    return { snapshot, promise: Promise.resolve(snapshot) };
  },
};

describe('columnFactories.createTitleColumn', () => {
  it('sorts by the entity title when present, falling back to the name', () => {
    const column = columnFactories.createTitleColumn();
    // 'component-a' vs 'Zebra' sorts alphabetically by presentation title
    expect(column.customSort!(makeRow(entityA), makeRow(entityB))).toBeLessThan(
      0,
    );
  });

  it('uses the entity presentation API for sorting when provided', () => {
    const column = columnFactories.createTitleColumn({
      entityPresentationApi: mockPresentationApi,
    });
    // Both presented titles are 'PRESENTED COMPONENT-X', so the name suffix decides
    expect(column.customSort!(makeRow(entityA), makeRow(entityB))).toBeLessThan(
      0,
    );
  });

  it('matches search against the presented title', () => {
    const column = columnFactories.createTitleColumn({
      entityPresentationApi: mockPresentationApi,
    });
    expect(
      column.customFilterAndSearch!('presented component-a', makeRow(entityA)),
    ).toBe(true);
    expect(column.customFilterAndSearch!('component-b', makeRow(entityA))).toBe(
      false,
    );
  });

  it('matches search against the entity name when no title is set', () => {
    const column = columnFactories.createTitleColumn();
    expect(column.customFilterAndSearch!('component-a', makeRow(entityA))).toBe(
      true,
    );
    expect(column.customFilterAndSearch!('zebra', makeRow(entityB))).toBe(true);
  });
});
