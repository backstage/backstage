/*
 * Copyright 2021 Spotify AB
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

import { TableFilter } from '@backstage/core';
import { toTableColumnsArray, toTableFiltersArray } from './utils';

describe('toTableColumnsArray', () => {
  it('returns the default table columns if none are specified', () => {
    expect(toTableColumnsArray([])).toMatchObject([
      {
        field: 'resolved.name',
        highlight: true,
        title: 'Name',
      },
      {
        field: 'resolved.partOfSystemRelationTitle',
        title: 'System',
      },
      {
        field: 'resolved.ownedByRelationsTitle',
        title: 'Owner',
      },
      {
        field: 'entity.spec.lifecycle',
        title: 'Lifecycle',
      },
      {
        field: 'entity.spec.type',
        title: 'Type',
      },
      {
        field: 'entity.metadata.description',
        title: 'Description',
      },
      {
        field: 'entity.metadata.tags',
        title: 'Tags',
      },
    ]);
  });

  it('converts a mixed list of column names and objects to TableColumn[]', () => {
    const customColumn = { title: 'foo', field: 'entity.metadata.foo' };
    const columns = ['Name', 'Description', 'Type', customColumn, 'Lifecycle'];

    expect(toTableColumnsArray(columns)).toMatchObject([
      {
        field: 'resolved.name',
        highlight: true,
        title: 'Name',
      },
      {
        field: 'entity.metadata.description',
        title: 'Description',
      },
      {
        field: 'entity.spec.type',
        title: 'Type',
      },
      {
        field: 'entity.metadata.foo',
        title: 'foo',
      },
      {
        field: 'entity.spec.lifecycle',
        title: 'Lifecycle',
      },
    ]);
  });
});

describe('toTableFiltersArray', () => {
  it('returns the default list of filters if none is specified', () => {
    expect(toTableFiltersArray([])).toMatchObject([
      {
        column: 'Owner',
        type: 'select',
      },
      {
        column: 'Type',
        type: 'multiple-select',
      },
      {
        column: 'Lifecycle',
        type: 'multiple-select',
      },
      {
        column: 'Tags',
        type: 'checkbox-tree',
      },
    ]);
  });

  it('converts a mixed list of filter names and objects to TableFilter[]', () => {
    const customFilter = { column: 'Foo', type: 'select' } as TableFilter;
    const filters = ['Owner', 'Lifecycle', customFilter];

    expect(toTableFiltersArray(filters)).toMatchObject([
      {
        column: 'Owner',
        type: 'select',
      },
      {
        column: 'Lifecycle',
        type: 'multiple-select',
      },
      {
        column: 'Foo',
        type: 'select',
      },
    ]);
  });
});
