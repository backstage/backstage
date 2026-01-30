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
  resolveFieldPath,
  createCustomColumn,
  applyColumnConfig,
} from './columnConfig';
import { CatalogTableRow } from './types';
import { TableColumn } from '@backstage/core-components';

describe('resolveFieldPath', () => {
  const testEntity: Entity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'test-component',
      namespace: 'default',
      description: 'A test component',
      annotations: {
        'backstage.io/techdocs-ref': 'dir:.',
        'security/tier': 'high',
      },
      labels: {
        'cost-center': 'engineering',
        team: 'platform',
      },
      tags: ['typescript', 'react'],
    },
    spec: {
      type: 'service',
      lifecycle: 'production',
      owner: 'team-platform',
    },
  };

  it('should resolve simple dot notation paths', () => {
    expect(resolveFieldPath(testEntity, 'metadata.name')).toBe(
      'test-component',
    );
    expect(resolveFieldPath(testEntity, 'spec.type')).toBe('service');
    expect(resolveFieldPath(testEntity, 'kind')).toBe('Component');
  });

  it('should resolve bracket notation for annotations', () => {
    expect(
      resolveFieldPath(testEntity, "metadata.annotations['security/tier']"),
    ).toBe('high');
    expect(
      resolveFieldPath(
        testEntity,
        "metadata.annotations['backstage.io/techdocs-ref']",
      ),
    ).toBe('dir:.');
  });

  it('should resolve bracket notation for labels', () => {
    expect(resolveFieldPath(testEntity, "metadata.labels['cost-center']")).toBe(
      'engineering',
    );
    expect(resolveFieldPath(testEntity, "metadata.labels['team']")).toBe(
      'platform',
    );
  });

  it('should return undefined for non-existent paths', () => {
    expect(
      resolveFieldPath(testEntity, 'metadata.nonexistent'),
    ).toBeUndefined();
    expect(
      resolveFieldPath(testEntity, "metadata.annotations['nonexistent']"),
    ).toBeUndefined();
  });

  it('should handle arrays', () => {
    expect(resolveFieldPath(testEntity, 'metadata.tags')).toEqual([
      'typescript',
      'react',
    ]);
  });
});

describe('createCustomColumn', () => {
  it('should create a column with basic properties', () => {
    const column = createCustomColumn({
      title: 'Security Tier',
      field: "metadata.annotations['security/tier']",
    });

    expect(column.title).toBe('Security Tier');
    expect(column.sorting).toBe(true);
  });

  it('should create a column with custom width', () => {
    const column = createCustomColumn({
      title: 'Cost Center',
      field: "metadata.labels['cost-center']",
      width: 150,
    });

    expect(column.width).toBe('150px');
  });

  it('should create a column with sorting disabled', () => {
    const column = createCustomColumn({
      title: 'Test',
      field: 'metadata.name',
      sortable: false,
    });

    expect(column.sorting).toBe(false);
    expect(column.customSort).toBeUndefined();
  });

  it('should render column value correctly', () => {
    const column = createCustomColumn({
      title: 'Type',
      field: 'spec.type',
    });

    const testEntity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: { name: 'test' },
      spec: { type: 'service' },
    };

    const row: CatalogTableRow = {
      entity: testEntity,
      resolved: {
        name: 'test',
        entityRef: 'component:default/test',
        partOfSystemRelations: [],
        ownedByRelations: [],
      },
    };

    const rendered = column.render!(row, 'row');
    expect(rendered).toBe('service');
  });

  it('should render default value when field is empty', () => {
    const column = createCustomColumn({
      title: 'Missing',
      field: 'spec.nonexistent',
      defaultValue: 'N/A',
    });

    const testEntity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: { name: 'test' },
      spec: {},
    };

    const row: CatalogTableRow = {
      entity: testEntity,
      resolved: {
        name: 'test',
        entityRef: 'component:default/test',
        partOfSystemRelations: [],
        ownedByRelations: [],
      },
    };

    const rendered = column.render!(row, 'row');
    expect(rendered).toBe('N/A');
  });

  it('should filter by entity kind', () => {
    const column = createCustomColumn({
      title: 'Type',
      field: 'spec.type',
      kind: 'Component',
    });

    const componentEntity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: { name: 'test' },
      spec: { type: 'service' },
    };

    const apiEntity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: { name: 'test-api' },
      spec: { type: 'openapi' },
    };

    const componentRow: CatalogTableRow = {
      entity: componentEntity,
      resolved: {
        name: 'test',
        entityRef: 'component:default/test',
        partOfSystemRelations: [],
        ownedByRelations: [],
      },
    };

    const apiRow: CatalogTableRow = {
      entity: apiEntity,
      resolved: {
        name: 'test-api',
        entityRef: 'api:default/test-api',
        partOfSystemRelations: [],
        ownedByRelations: [],
      },
    };

    expect(column.render!(componentRow, 'row')).toBe('service');
    expect(column.render!(apiRow, 'row')).toBeNull();
  });
});

describe('applyColumnConfig', () => {
  const createMockColumn = (
    field: string,
    title: string,
  ): TableColumn<CatalogTableRow> => ({
    title,
    field,
  });

  const baseColumns: TableColumn<CatalogTableRow>[] = [
    createMockColumn('resolved.entityRef', 'Name'),
    createMockColumn('resolved.ownedByRelationsTitle', 'Owner'),
    createMockColumn('entity.spec.type', 'Type'),
    createMockColumn('entity.spec.lifecycle', 'Lifecycle'),
    createMockColumn('entity.metadata.description', 'Description'),
    createMockColumn('entity.metadata.tags', 'Tags'),
  ];

  it('should return original columns when no config provided', () => {
    expect(applyColumnConfig(baseColumns, undefined)).toEqual(baseColumns);
  });

  it('should filter columns by include list', () => {
    const result = applyColumnConfig(baseColumns, {
      include: ['name', 'owner', 'type'],
    });

    expect(result).toHaveLength(3);
    expect(result.map(c => c.title)).toEqual(['Name', 'Owner', 'Type']);
  });

  it('should filter columns by exclude list', () => {
    const result = applyColumnConfig(baseColumns, {
      exclude: ['tags', 'description'],
    });

    expect(result).toHaveLength(4);
    expect(result.map(c => c.title)).toEqual([
      'Name',
      'Owner',
      'Type',
      'Lifecycle',
    ]);
  });

  it('should add custom columns', () => {
    const result = applyColumnConfig(baseColumns, {
      custom: [
        {
          title: 'Security Tier',
          field: "metadata.annotations['security/tier']",
        },
      ],
    });

    expect(result).toHaveLength(7);
    expect(result[result.length - 1].title).toBe('Security Tier');
  });

  it('should handle case-insensitive column IDs', () => {
    const result = applyColumnConfig(baseColumns, {
      include: ['NAME', 'Owner', 'TYPE'],
    });

    expect(result).toHaveLength(3);
  });

  it('should combine include and custom columns', () => {
    const result = applyColumnConfig(baseColumns, {
      include: ['name', 'owner'],
      custom: [
        {
          title: 'Custom Field',
          field: 'spec.custom',
        },
      ],
    });

    expect(result).toHaveLength(3);
    expect(result.map(c => c.title)).toEqual(['Name', 'Owner', 'Custom Field']);
  });
});
