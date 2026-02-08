/*
 * Copyright 2025 The Backstage Authors
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
  getEntityDataFromColumns,
  serializeEntitiesToCsv,
  serializeEntityToJsonRow,
  ExportColumn,
} from './serializeEntities';

describe('serializeEntities', () => {
  const testColumns: ExportColumn[] = [
    { entityFilterKey: 'metadata.name', title: 'Name' },
    { entityFilterKey: 'spec.type', title: 'Type' },
    { entityFilterKey: 'spec.owner', title: 'Owner' },
  ];

  const testEntity: Entity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'test-component',
      namespace: 'default',
    },
    spec: {
      type: 'service',
      owner: 'team-a',
      description: 'A test component',
    },
  };

  describe('getEntityDataFromColumns', () => {
    it('extracts entity data based on columns', () => {
      const result = getEntityDataFromColumns(testEntity, testColumns);

      expect(result).toEqual({
        Name: 'test-component',
        Type: 'service',
        Owner: 'team-a',
      });
    });

    it('handles missing nested properties', () => {
      const entityWithoutOwner = { ...testEntity, spec: { type: 'service' } };
      const result = getEntityDataFromColumns(entityWithoutOwner, testColumns);

      expect(result).toEqual({
        Name: 'test-component',
        Type: 'service',
        Owner: undefined,
      });
    });

    it('handles deeply nested paths', () => {
      const columns: ExportColumn[] = [
        { entityFilterKey: 'metadata.annotations.foo', title: 'FooAnnotation' },
      ];
      const entity = {
        ...testEntity,
        metadata: {
          ...testEntity.metadata,
          annotations: {
            foo: 'bar',
          },
        },
      };

      const result = getEntityDataFromColumns(entity, columns);
      expect(result).toEqual({ FooAnnotation: 'bar' });
    });
  });

  describe('serializeEntitiesToCsv', () => {
    it('serializes entities to CSV format with headers', () => {
      const entities = [testEntity];
      const csv = serializeEntitiesToCsv(entities, testColumns);

      expect(csv).toContain('Name');
      expect(csv).toContain('Type');
      expect(csv).toContain('Owner');
      expect(csv).toContain('test-component');
      expect(csv).toContain('service');
      expect(csv).toContain('team-a');
    });

    it('serializes entities to CSV format without headers when addHeader is false', () => {
      const entities = [testEntity];
      const csv = serializeEntitiesToCsv(entities, testColumns, false);

      // Should not contain column headers
      expect(csv).not.toContain('Name,Type,Owner');
      // But should contain data
      expect(csv).toContain('test-component');
      expect(csv).toContain('service');
      expect(csv).toContain('team-a');
    });

    it('handles multiple entities', () => {
      const entity2: Entity = {
        ...testEntity,
        metadata: { ...testEntity.metadata, name: 'another-component' },
        spec: { ...testEntity.spec, type: 'library' },
      };

      const csv = serializeEntitiesToCsv([testEntity, entity2], testColumns);

      expect(csv).toContain('test-component');
      expect(csv).toContain('another-component');
      expect(csv).toContain('service');
      expect(csv).toContain('library');
    });

    it('escapes newlines in CSV values', () => {
      const entity = {
        ...testEntity,
        spec: {
          ...testEntity.spec,
          description: 'Line 1\nLine 2\rLine 3\r\nLine 4',
        },
      };

      const columns: ExportColumn[] = [
        { entityFilterKey: 'spec.description', title: 'Description' },
      ];

      const csv = serializeEntitiesToCsv([entity], columns);

      // Newlines should be escaped
      expect(csv).toContain('Line 1\\nLine 2\\nLine 3\\nLine 4');
    });
  });

  describe('serializeEntitiesToJson', () => {
    it('serializes entities to JSON format', () => {
      const entities = [testEntity];
      const json = serializeEntityToJsonRow(entities[0], testColumns);

      const parsed = JSON.parse(json);
      expect(parsed).toEqual({
        Name: 'test-component',
        Type: 'service',
        Owner: 'team-a',
      });
    });

    it('formats JSON with proper indentation', () => {
      const json = serializeEntityToJsonRow(testEntity, testColumns);

      // Should have indentation (2 spaces)
      expect(json).toContain('  ');
      expect(json).toMatch(/{\n\s{2}"/);
    });
  });
});
