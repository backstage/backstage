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

import type {
  AsyncListSource,
  IdentifiedOption,
} from '../types/selectableCollection';
import {
  filterOptionSections,
  flattenOptions,
  getItemKeys,
  isAsyncListSource,
  normalizeOption,
  normalizeOptions,
  resolveCollectionSource,
} from './selectableCollection';

describe('selectable collection utilities', () => {
  describe('normalization', () => {
    it('preserves identified options unchanged', () => {
      const option: IdentifiedOption = {
        id: 'draft',
        label: 'Draft',
        description: 'Still being written',
        leadingIcon: 'document icon',
        disabled: true,
      };

      expect(normalizeOption(option)).toBe(option);
    });

    it('normalizes legacy options recursively inside sections', () => {
      expect(
        normalizeOptions([
          {
            title: 'States',
            options: [{ value: 'draft', label: 'Draft', disabled: true }],
          },
        ]),
      ).toEqual([
        {
          title: 'States',
          options: [{ id: 'draft', label: 'Draft', disabled: true }],
        },
      ]);
    });
  });

  describe('filterOptionSections', () => {
    it('filters with full normalized rows and removes empty sections', () => {
      const filter = jest.fn((option: IdentifiedOption, query: string) => {
        return (
          option.label.toLocaleLowerCase('en-US').includes(query) ||
          option.description?.toLocaleLowerCase('en-US').includes(query) ===
            true
        );
      });
      const options = normalizeOptions([
        {
          title: 'States',
          options: [
            { value: 'draft', label: 'Draft' },
            {
              id: 'published',
              label: 'Published',
              description: 'Visible to everyone',
            },
          ],
        },
        {
          title: 'Archived states',
          options: [{ value: 'deleted', label: 'Deleted' }],
        },
      ]);

      expect(filterOptionSections(options, 'visible', filter)).toEqual([
        {
          title: 'States',
          options: [
            {
              id: 'published',
              label: 'Published',
              description: 'Visible to everyone',
            },
          ],
        },
      ]);
      expect(filter).toHaveBeenCalledWith(
        { id: 'draft', label: 'Draft', disabled: undefined },
        'visible',
      );
    });
  });

  it('flattens options while preserving their order', () => {
    const options = normalizeOptions([
      { value: 'all', label: 'All' },
      {
        title: 'States',
        options: [
          { value: 'draft', label: 'Draft' },
          { id: 'published', label: 'Published' },
        ],
      },
    ]);

    expect(flattenOptions(options)).toEqual([
      { id: 'all', label: 'All', disabled: undefined },
      { id: 'draft', label: 'Draft', disabled: undefined },
      { id: 'published', label: 'Published' },
    ]);
  });

  it('extracts item keys from any iterable', () => {
    const items = new Set([{ id: 'draft' }, { id: 'published' }]);

    expect(getItemKeys(items)).toEqual(new Set(['draft', 'published']));
  });

  it('detects async list sources', () => {
    const source: AsyncListSource<{ id: string }> = {
      items: [{ id: 'draft' }],
      filterText: '',
      setFilterText: jest.fn(),
      loadingState: 'idle',
      loadMore: jest.fn(),
    };

    expect(isAsyncListSource(source)).toBe(true);
    expect(isAsyncListSource([{ id: 'draft' }])).toBe(false);
    expect(isAsyncListSource(new Set([{ id: 'draft' }]))).toBe(false);
  });

  it('resolves plain and rendered collection sources', () => {
    const options = [{ value: 'draft', label: 'Draft' }];
    const items = [{ id: 'ada', name: 'Ada Lovelace' }];

    expect(resolveCollectionSource({ options })).toEqual({
      options,
      flatOptions: [{ id: 'draft', label: 'Draft', disabled: undefined }],
      source: [{ id: 'draft', label: 'Draft', disabled: undefined }],
      rendersItems: false,
    });
    expect(resolveCollectionSource({ items })).toEqual({
      options: undefined,
      flatOptions: undefined,
      source: items,
      rendersItems: true,
    });
  });

  it('does not confuse iterable metadata with an async list source', () => {
    const rows = [{ id: 'draft' }];
    const iterable = {
      items: 'metadata',
      *[Symbol.iterator]() {
        yield* rows;
      },
    };

    expect(isAsyncListSource(iterable)).toBe(false);
  });
});
