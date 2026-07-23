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

import {
  parseOutputFlag,
  extractEntities,
  formatEntityTable,
  formatSearchResults,
} from './intentFormat';

describe('intentFormat', () => {
  describe('parseOutputFlag', () => {
    it('returns json when output=json', () => {
      expect(parseOutputFlag({ output: 'json' })).toBe('json');
    });

    it('returns human by default', () => {
      expect(parseOutputFlag({})).toBe('human');
      expect(parseOutputFlag({ output: undefined })).toBe('human');
      expect(parseOutputFlag({ output: 'table' })).toBe('human');
    });
  });

  describe('extractEntities', () => {
    it('returns array as-is', () => {
      const arr = [{ kind: 'Component' }];
      expect(extractEntities(arr)).toBe(arr);
    });

    it('extracts items from { items: [...] }', () => {
      const items = [{ kind: 'Component' }];
      expect(extractEntities({ items })).toBe(items);
    });

    it('extracts entities from { entities: [...] }', () => {
      const entities = [{ kind: 'API' }];
      expect(extractEntities({ entities })).toBe(entities);
    });

    it('prefers items over entities', () => {
      const items = [{ kind: 'Component' }];
      const entities = [{ kind: 'API' }];
      expect(extractEntities({ items, entities })).toBe(items);
    });

    it('returns empty array when no recognized shape', () => {
      expect(extractEntities({ foo: 'bar' })).toEqual([]);
      expect(extractEntities(null)).toEqual([]);
    });
  });

  describe('formatEntityTable', () => {
    it('shows "No entities found" for empty array', () => {
      expect(formatEntityTable([])).toContain('No entities found');
    });

    it('includes header row', () => {
      const output = formatEntityTable([
        {
          kind: 'Component',
          metadata: { name: 'svc', namespace: 'default' },
          spec: { type: 'service' },
        },
      ]);
      expect(output).toContain('NAME');
      expect(output).toContain('KIND');
      expect(output).toContain('NAMESPACE');
      expect(output).toContain('TYPE');
    });

    it('renders entity fields from metadata/spec', () => {
      const output = formatEntityTable([
        {
          kind: 'API',
          metadata: { name: 'my-api', namespace: 'prod' },
          spec: { type: 'openapi' },
        },
      ]);
      expect(output).toContain('my-api');
      expect(output).toContain('API');
      expect(output).toContain('prod');
      expect(output).toContain('openapi');
    });

    it('handles flat entity objects (e.g. techdocs-mcp-extras response)', () => {
      const output = formatEntityTable([
        {
          kind: 'Component',
          name: 'flat-svc',
          namespace: 'default',
          type: 'service',
        },
      ]);
      expect(output).toContain('flat-svc');
      expect(output).toContain('Component');
    });
  });

  describe('formatSearchResults', () => {
    it('shows "No results found" for empty array', () => {
      expect(formatSearchResults([])).toContain('No results found');
    });

    it('renders title, location, and text snippet', () => {
      const output = formatSearchResults([
        {
          document: {
            title: 'My Service',
            location: '/catalog/default/component/my-svc',
            text: 'A great service for doing things',
          },
        },
      ]);
      expect(output).toContain('My Service');
      expect(output).toContain('/catalog/default/component/my-svc');
      expect(output).toContain('A great service');
    });

    it('truncates text longer than 120 chars', () => {
      const longText = 'a'.repeat(200);
      const output = formatSearchResults([
        { document: { title: 'T', text: longText } },
      ]);
      expect(output).toContain('...');
      expect(output).not.toContain(longText);
    });
  });
});
