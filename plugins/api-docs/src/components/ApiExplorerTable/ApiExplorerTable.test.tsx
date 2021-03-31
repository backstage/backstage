/*
 * Copyright 2020 Spotify AB
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

import * as React from 'react';
import { Entity } from '@backstage/catalog-model';
import { ApiProvider, ApiRegistry, TableFilter } from '@backstage/core';
import { wrapInTestApp } from '@backstage/test-utils';
import { Chip } from '@material-ui/core';
import { render } from '@testing-library/react';
import { apiDocsConfigRef } from '../../config';
import { ApiExplorerTable } from './ApiExplorerTable';
import { Columns, EntityRow, Filters } from './types';
import { defaultColumns, defaultFilters } from './presets';

const entities: Entity[] = [
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'API',
    metadata: { name: 'api1' },
    spec: { type: 'openapi' },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'API',
    metadata: { name: 'api2' },
    spec: { type: 'openapi' },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'API',
    metadata: { name: 'api3' },
    spec: { type: 'grpc' },
  },
];

const apiRegistry = ApiRegistry.with(apiDocsConfigRef, {
  getApiDefinitionWidget: () => undefined,
});

describe('ApiCatalogTable component', () => {
  it('should render error message when error is passed in props', async () => {
    const rendered = render(
      wrapInTestApp(
        <ApiProvider apis={apiRegistry}>
          <ApiExplorerTable
            entities={[]}
            loading={false}
            error={{ code: 'error' }}
          />
        </ApiProvider>,
      ),
    );
    const errorMessage = await rendered.findByText(
      /Could not fetch catalog entities./,
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it('should display entity names when loading has finished and no error occurred', async () => {
    const rendered = render(
      wrapInTestApp(
        <ApiProvider apis={apiRegistry}>
          <ApiExplorerTable entities={entities} loading={false} />
        </ApiProvider>,
      ),
    );
    expect(rendered.getByText(/api1/)).toBeInTheDocument();
    expect(rendered.getByText(/api2/)).toBeInTheDocument();
    expect(rendered.getByText(/api3/)).toBeInTheDocument();
  });

  // TODO: Move to ApiExplorerBasePage test file
  it('should display the specified table columns', async () => {
    const entitiesWithCustomMetadata: Entity[] = entities.map((e, i) => {
      const { metadata } = e;
      const customMetadata = {
        ...metadata,
        foo: `foo${i}`,
        bar: ['baz', 'qux', 'quux'],
      };
      return { ...e, metadata: customMetadata };
    });
    const fooColumn = { title: 'Foo', field: 'entity.metadata.foo' };
    const barColumn = {
      title: 'Bar',
      field: 'entity.metadata.bar',
      render: ({ entity }: EntityRow) => (
        <>
          {entity.metadata.bar &&
            (entity.metadata.bar as string[]).map(t => (
              <Chip key={t} label={t} size="small" variant="outlined" />
          ))}
        </>
      ),
    };
    const barFilter = { column: 'Bar', type: 'select' } as TableFilter;
    const columns = {
      name: defaultColumns.name,
      description: defaultColumns.description,
      owner: defaultColumns.owner,
      type: defaultColumns.type,
      foo: fooColumn,
      bar: barColumn,
    } as Columns;
    const filters = {
      type: defaultFilters.type,
      lifecycle: defaultFilters.lifecycle,
      bar: barFilter,
    } as Filters;

    const rendered = render(
      wrapInTestApp(
        <ApiProvider apis={apiRegistry}>
          <ApiExplorerTable
            entities={entitiesWithCustomMetadata}
            loading={false}
            columns={columns}
            filters={filters}
          />
        </ApiProvider>,
      ),
    );

    expect(rendered.getByText('Name')).toBeInTheDocument();
    expect(rendered.getByText('Foo')).toBeInTheDocument();
    expect(rendered.getByText('Bar')).toBeInTheDocument();
  });
});
