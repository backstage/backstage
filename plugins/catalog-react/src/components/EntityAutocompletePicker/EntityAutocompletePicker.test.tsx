/*
 * Copyright 2021 The Backstage Authors
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

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  catalogApiMock,
  MockEntityListContextProvider,
} from '@backstage/plugin-catalog-react/testUtils';
import { EntityAutocompletePicker } from './EntityAutocompletePicker';
import { TestApiProvider } from '@backstage/test-utils';
import { catalogApiRef } from '../../api';
import { DefaultEntityFilters, useEntityList } from '../../hooks';
import { Entity } from '@backstage/catalog-model';
import { EntityFilter } from '../../types';
import { EntityKindFilter, EntityTypeFilter } from '../../filters';

interface EntityFilters extends DefaultEntityFilters {
  options?: EntityOptionFilter;
}

const defaultOptions = ['option1', 'option2', 'option3', 'option4'];

class EntityOptionFilter implements EntityFilter {
  readonly values: string[];

  constructor(values: string[]) {
    this.values = values;
  }

  filterEntity(entity: Entity): boolean {
    return this.values.every(v =>
      ((entity.spec?.options ?? []) as string[]).includes(v),
    );
  }

  toQueryValue(): string[] {
    return this.values;
  }
}

/**
 * Creates entities where the nth option is present on n entities, so that
 * the first option has a count of 1, the second a count of 2, and so on.
 */
function entitiesWithOptions(opts: string[]): Entity[] {
  return opts.map((_, index) => ({
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: { name: `component-${index}` },
    spec: { type: 'service', options: opts.slice(index) },
  }));
}

describe('<EntityAutocompletePicker/>', () => {
  it('renders all options', async () => {
    const catalogApi = catalogApiMock({
      entities: entitiesWithOptions(defaultOptions),
    });
    jest.spyOn(catalogApi, 'getEntityFacets');
    render(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MockEntityListContextProvider value={{}}>
          <EntityAutocompletePicker<EntityFilters>
            label="Options"
            path="spec.options"
            name="options"
            Filter={EntityOptionFilter}
          />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() =>
      expect(screen.getByText('Options')).toBeInTheDocument(),
    );

    // should have called catalog backend without any filters applied
    expect(catalogApi.getEntityFacets).toHaveBeenCalledWith({
      facets: ['spec.options'],
    });

    fireEvent.click(screen.getByTestId('options-picker-expand'));
    defaultOptions.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('hides filter if there are no available options', async () => {
    const catalogApi = catalogApiMock({
      entities: entitiesWithOptions([]),
    });
    render(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MockEntityListContextProvider value={{}}>
          <EntityAutocompletePicker<EntityFilters>
            label="Options"
            path="spec.options"
            name="options"
            Filter={EntityOptionFilter}
          />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() => {
      expect(screen.queryByText('Options')).not.toBeInTheDocument();
    });
  });

  it('renders filter if there is one available option', async () => {
    const catalogApi = catalogApiMock({
      entities: entitiesWithOptions(['option1']),
    });
    render(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MockEntityListContextProvider value={{}}>
          <EntityAutocompletePicker<EntityFilters>
            label="Options"
            path="spec.options"
            name="options"
            Filter={EntityOptionFilter}
          />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() => {
      expect(screen.queryByText('Options')).toBeInTheDocument();
    });
  });

  it('renders unique options in alphabetical order', async () => {
    const catalogApi = catalogApiMock({
      entities: entitiesWithOptions(defaultOptions),
    });
    render(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MockEntityListContextProvider value={{}}>
          <EntityAutocompletePicker<EntityFilters>
            label="Options"
            path="spec.options"
            name="options"
            Filter={EntityOptionFilter}
          />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() =>
      expect(screen.getByText('Options')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId('options-picker-expand'));

    expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual([
      'option1',
      'option2',
      'option3',
      'option4',
    ]);
  });

  it('renders options with counts', async () => {
    const catalogApi = catalogApiMock({
      entities: entitiesWithOptions(defaultOptions),
    });
    render(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MockEntityListContextProvider value={{}}>
          <EntityAutocompletePicker<EntityFilters>
            label="Options"
            path="spec.options"
            name="options"
            Filter={EntityOptionFilter}
            showCounts
          />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() =>
      expect(screen.getByText('Options')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId('options-picker-expand'));

    expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual([
      'option1 (1)',
      'option2 (2)',
      'option3 (3)',
      'option4 (4)',
    ]);
  });

  it('respects the query parameter filter value', async () => {
    const catalogApi = catalogApiMock({
      entities: entitiesWithOptions(defaultOptions),
    });
    const updateFilters = jest.fn();
    const queryParameters = { options: ['option3'] };
    render(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MockEntityListContextProvider<EntityFilters>
          value={{
            updateFilters,
            queryParameters,
          }}
        >
          <EntityAutocompletePicker<EntityFilters>
            label="Options"
            path="spec.options"
            name="options"
            Filter={EntityOptionFilter}
          />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );

    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        options: new EntityOptionFilter(['option3']),
      }),
    );
  });

  it('adds options to filters', async () => {
    const catalogApi = catalogApiMock({
      entities: entitiesWithOptions(defaultOptions),
    });
    const updateFilters = jest.fn();
    render(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
          }}
        >
          <EntityAutocompletePicker<EntityFilters>
            label="Options"
            path="spec.options"
            name="options"
            Filter={EntityOptionFilter}
          />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() =>
      expect(screen.getByTestId('options-picker-expand')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId('options-picker-expand'));
    fireEvent.click(screen.getByText('option1'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      options: new EntityOptionFilter(['option1']),
    });
  });

  it('removes options from filters', async () => {
    const catalogApi = catalogApiMock({
      entities: entitiesWithOptions(defaultOptions),
    });
    const updateFilters = jest.fn();
    render(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MockEntityListContextProvider<EntityFilters>
          value={{
            updateFilters,
            filters: { options: new EntityOptionFilter(['option1']) },
          }}
        >
          <EntityAutocompletePicker<EntityFilters>
            label="Options"
            path="spec.options"
            name="options"
            Filter={EntityOptionFilter}
          />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        options: new EntityOptionFilter(['option1']),
      }),
    );
    fireEvent.click(screen.getByTestId('options-picker-expand'));
    expect(screen.getByLabelText('option1')).toBeChecked();

    fireEvent.click(screen.getByLabelText('option1'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      options: undefined,
    });
  });

  it('responds to external filter changes', async () => {
    const catalogApi = catalogApiMock({
      entities: entitiesWithOptions(defaultOptions),
    });
    const ChangeFilterButton = () => {
      const { updateFilters } = useEntityList<EntityFilters>();

      return (
        <button
          data-testid="external-filter-change-button"
          onClick={() =>
            updateFilters({ options: new EntityOptionFilter(['option3']) })
          }
        >
          Trigger external filter change
        </button>
      );
    };

    render(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MockEntityListContextProvider<EntityFilters>
          value={{
            filters: { options: new EntityOptionFilter(['option2']) },
          }}
        >
          <EntityAutocompletePicker<EntityFilters>
            label="Options"
            path="spec.options"
            name="options"
            Filter={EntityOptionFilter}
          />
          <ChangeFilterButton />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );

    await waitFor(() =>
      expect(screen.queryByText('Options')).toBeInTheDocument(),
    );
    expect(screen.queryByText('option2')).toBeInTheDocument();

    screen.getByTestId('external-filter-change-button').click();
    await waitFor(() =>
      expect(screen.queryByText('option3')).toBeInTheDocument(),
    );
    expect(screen.queryByText('option2')).not.toBeInTheDocument();
  });

  it('filters available values by kind as default', async () => {
    const catalogApi = catalogApiMock({
      entities: entitiesWithOptions(defaultOptions),
    });
    jest.spyOn(catalogApi, 'getEntityFacets');
    render(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MockEntityListContextProvider
          value={{
            filters: {
              kind: new EntityKindFilter('component', 'Component'),
              type: new EntityTypeFilter(['service']),
            },
          }}
        >
          <EntityAutocompletePicker<EntityFilters>
            label="Options"
            path="spec.options"
            name="options"
            Filter={EntityOptionFilter}
          />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );

    await waitFor(() =>
      expect(catalogApi.getEntityFacets).toHaveBeenCalledWith({
        facets: ['spec.options'],
        query: { kind: 'component' },
      }),
    );
  });

  it('can be supplied with filters for available values', async () => {
    const catalogApi = catalogApiMock({
      entities: entitiesWithOptions(defaultOptions),
    });
    jest.spyOn(catalogApi, 'getEntityFacets');
    render(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MockEntityListContextProvider
          value={{
            filters: {
              kind: new EntityKindFilter('component', 'Component'),
              type: new EntityTypeFilter(['service']),
            },
          }}
        >
          <EntityAutocompletePicker<EntityFilters>
            label="Options"
            path="spec.options"
            name="options"
            Filter={EntityOptionFilter}
            filtersForAvailableValues={['kind', 'type']}
          />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );

    await waitFor(() =>
      expect(catalogApi.getEntityFacets).toHaveBeenCalledWith({
        facets: ['spec.options'],
        query: {
          $all: [{ kind: 'component' }, { 'spec.type': 'service' }],
        },
      }),
    );
  });

  it("doesn't render when hidden", async () => {
    const catalogApi = catalogApiMock({
      entities: entitiesWithOptions(defaultOptions),
    });
    render(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MockEntityListContextProvider value={{}}>
          <EntityAutocompletePicker<EntityFilters>
            label="Options"
            path="spec.options"
            name="options"
            Filter={EntityOptionFilter}
            hidden
          />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() => expect(screen.queryByText('Options')).toBeNull());
  });
});
