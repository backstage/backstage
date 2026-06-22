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
import { toStreamRequest } from './toStreamRequest';
import {
  DefaultEntityFilters,
  EntityTextFilter,
  EntityOrderFilter,
} from '@backstage/plugin-catalog-react';

describe('toStreamRequest', () => {
  describe('with no filters', () => {
    it('returns undefined for empty filters object', () => {
      const filters: DefaultEntityFilters = {};
      const result = toStreamRequest(filters);

      expect(result).toBeUndefined();
    });

    it('does not crash when filters contain undefined values', () => {
      const filters: DefaultEntityFilters = {
        kind: undefined,
        type: undefined,
        text: undefined,
        order: undefined,
      };
      expect(() => toStreamRequest(filters)).not.toThrow();
      expect(toStreamRequest(filters)).toBeUndefined();
    });

    it('handles mix of undefined and valid filters', () => {
      const textFilter = new EntityTextFilter('search term');
      const filters: DefaultEntityFilters = {
        kind: undefined,
        text: textFilter,
        order: undefined,
      };
      const result = toStreamRequest(filters);
      expect(result).toEqual({
        fullTextFilter: {
          term: 'search term',
          fields: [
            'metadata.name',
            'metadata.title',
            'spec.profile.displayName',
            'spec.target',
            'spec.targets',
          ],
        },
      });
    });
  });

  describe('with backend filters', () => {
    it('extracts backend filters and returns StreamEntitiesRequest', () => {
      const mockFilter = {
        getCatalogFilters: () => ({
          kind: ['Component'],
        }),
      };

      const filters: DefaultEntityFilters = {
        kind: mockFilter as any,
      };

      const result = toStreamRequest(filters);

      expect(result).toEqual({
        filter: {
          kind: ['Component'],
        },
      });
    });

    it('merges multiple backend filters', () => {
      const mockKindFilter = {
        getCatalogFilters: () => ({
          kind: ['Component'],
        }),
      };

      const mockTypeFilter = {
        getCatalogFilters: () => ({
          type: 'service',
        }),
      };

      const filters: DefaultEntityFilters = {
        kind: mockKindFilter as any,
        type: mockTypeFilter as any,
      };

      const result = toStreamRequest(filters);

      expect(result).toEqual({
        filter: {
          kind: ['Component'],
          type: 'service',
        },
      });
    });

    it('handles array values from backend filters', () => {
      const mockFilter = {
        getCatalogFilters: () => ({
          kind: ['Component', 'API', 'Domain'],
        }),
      };

      const filters: DefaultEntityFilters = {
        kind: mockFilter as any,
      };

      const result = toStreamRequest(filters);

      expect(result).toEqual({
        filter: {
          kind: ['Component', 'API', 'Domain'],
        },
      });
    });

    it('ignores filters without getCatalogFilters method', () => {
      const backendFilter = {
        getCatalogFilters: () => ({
          kind: ['Component'],
        }),
      };

      const nonBackendFilter = {
        someOtherMethod: () => ({}),
      };

      const filters: DefaultEntityFilters = {
        kind: backendFilter as any,
        text: nonBackendFilter as any,
      };

      const result = toStreamRequest(filters);

      expect(result).toEqual({
        filter: {
          kind: ['Component'],
        },
      });
    });

    it('ignores filters that return null from getCatalogFilters', () => {
      const mockFilterWithNull = {
        getCatalogFilters: () => null,
      };

      const mockFilterWithValue = {
        getCatalogFilters: () => ({
          kind: ['Component'],
        }),
      };

      const filters: DefaultEntityFilters = {
        kind: mockFilterWithValue as any,
        owners: mockFilterWithNull as any,
      };

      const result = toStreamRequest(filters);

      expect(result).toEqual({
        filter: {
          kind: ['Component'],
        },
      });
    });

    it('excludes empty arrays from filter result', () => {
      const mockFilter = {
        getCatalogFilters: () => ({
          kind: [],
          type: 'service',
        }),
      };

      const filters: DefaultEntityFilters = {
        kind: mockFilter as any,
      };

      const result = toStreamRequest(filters);

      expect(result).toEqual({
        filter: {
          type: 'service',
        },
      });
    });

    it('excludes undefined and null values from filter result', () => {
      const mockFilter = {
        getCatalogFilters: () => ({
          kind: ['Component'],
          type: undefined,
          owner: null,
        }),
      };

      const filters: DefaultEntityFilters = {
        kind: mockFilter as any,
      };

      const result = toStreamRequest(filters);

      expect(result).toEqual({
        filter: {
          kind: ['Component'],
        },
      });
    });

    it('returns undefined when all filters have no backend equivalent', () => {
      const mockEmptyFilter = {
        getCatalogFilters: () => ({}),
      };

      const filters: DefaultEntityFilters = {
        kind: mockEmptyFilter as any,
        type: mockEmptyFilter as any,
      };

      const result = toStreamRequest(filters);

      expect(result).toBeUndefined();
    });

    it('handles complex filter types with special characters', () => {
      const mockFilter = {
        getCatalogFilters: () => ({
          'spec.type': 'my-service',
          'metadata.namespace': 'default',
        }),
      };

      const filters: DefaultEntityFilters = {
        type: mockFilter as any,
      };

      const result = toStreamRequest(filters);

      expect(result).toEqual({
        filter: {
          'spec.type': 'my-service',
          'metadata.namespace': 'default',
        },
      });
    });
  });

  describe('with text filters', () => {
    it('extracts full text filter and returns StreamEntitiesRequest', () => {
      const textFilter = new EntityTextFilter('search term');

      const filters: DefaultEntityFilters = {
        text: textFilter,
      };

      const result = toStreamRequest(filters);

      expect(result).toEqual({
        fullTextFilter: {
          term: 'search term',
          fields: [
            'metadata.name',
            'metadata.title',
            'spec.profile.displayName',
            'spec.target',
            'spec.targets',
          ],
        },
      });
    });
  });

  describe('with order filters', () => {
    it('extracts order fields and returns StreamEntitiesRequest', () => {
      const orderFilter = new EntityOrderFilter([['metadata.name', 'asc']]);

      const filters: DefaultEntityFilters = {
        order: orderFilter,
      };

      const result = toStreamRequest(filters);

      expect(result).toEqual({
        orderFields: [{ field: 'metadata.name', order: 'asc' }],
      });
    });

    it('handles multiple order fields', () => {
      const orderFilter = new EntityOrderFilter([
        ['metadata.name', 'asc'],
        ['spec.type', 'desc'],
      ]);

      const filters: DefaultEntityFilters = {
        order: orderFilter,
      };

      const result = toStreamRequest(filters);

      expect(result).toEqual({
        orderFields: [
          { field: 'metadata.name', order: 'asc' },
          { field: 'spec.type', order: 'desc' },
        ],
      });
    });
  });

  describe('with combined filters', () => {
    it('combines backend, text, and order filters', () => {
      const mockBackendFilter = {
        getCatalogFilters: () => ({
          kind: ['Component'],
        }),
      };

      const textFilter = new EntityTextFilter('search term');
      const orderFilter = new EntityOrderFilter([['metadata.name', 'asc']]);

      const filters: DefaultEntityFilters = {
        kind: mockBackendFilter as any,
        text: textFilter,
        order: orderFilter,
      };

      const result = toStreamRequest(filters);

      expect(result).toEqual({
        filter: {
          kind: ['Component'],
        },
        fullTextFilter: {
          term: 'search term',
          fields: [
            'metadata.name',
            'metadata.title',
            'spec.profile.displayName',
            'spec.target',
            'spec.targets',
          ],
        },
        orderFields: [{ field: 'metadata.name', order: 'asc' }],
      });
    });
  });
});
