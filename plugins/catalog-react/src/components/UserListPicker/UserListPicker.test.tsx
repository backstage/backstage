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

import { fireEvent, waitFor, screen } from '@testing-library/react';
import { Entity } from '@backstage/catalog-model';
import { UserListPicker, UserListPickerProps } from './UserListPicker';
import {
  MockEntityListContextProvider,
  catalogApiMock,
} from '@backstage/plugin-catalog-react/testUtils';
import {
  EntityKindFilter,
  EntityNamespaceFilter,
  EntityTagFilter,
  EntityUserFilter,
} from '../../filters';
import {
  CatalogApi,
  QueryEntitiesInitialRequest,
  QueryEntitiesRequest,
} from '@backstage/catalog-client';
import { catalogApiRef } from '../../api';
import {
  TestApiProvider,
  mockApis,
  renderInTestApp,
} from '@backstage/test-utils';
import {
  configApiRef,
  identityApiRef,
  storageApiRef,
} from '@backstage/core-plugin-api';
import { MockStarredEntitiesApi, starredEntitiesApiRef } from '../../apis';
import { DefaultEntityFilters } from '../../hooks';
import { NewEntityListContext } from '../../hooks/useEntityListProvider';
import { createVersionedValueMap } from '@backstage/version-bridge';

const ownershipEntityRefs = ['user:default/testuser'];

function entity(options: {
  kind?: string;
  name: string;
  namespace?: string;
  owned?: boolean;
  tags?: string[];
}): Entity {
  return {
    apiVersion: 'backstage.io/v1alpha1',
    kind: options.kind ?? 'Component',
    metadata: {
      name: options.name,
      namespace: options.namespace ?? 'default',
      tags: options.tags,
    },
    relations: [
      {
        type: 'ownedBy',
        targetRef: options.owned
          ? 'user:default/testuser'
          : 'group:default/someone-else',
      },
    ],
  };
}

// The starred entities are e-1 and e-2. The counts that each filter in these
// tests should produce are noted on the filters where they are used.
const entities = [
  entity({ name: 'e-1', owned: true, tags: ['tag1'] }),
  entity({ name: 'e-2', tags: ['tag1', 'starred-only'] }),
  entity({ name: 'o-1', owned: true, tags: ['tag1'] }),
  entity({ name: 'o-2', owned: true, tags: ['owned-only'] }),
  entity({ name: 'x-1' }),
  entity({ kind: 'API', name: 'api-1', owned: true, tags: ['tag1'] }),
  entity({ name: 'ns-1', namespace: 'other', owned: true, tags: ['tag1'] }),
  entity({ kind: 'User', name: 'testuser' }),
];

function createApis(catalogApi: CatalogApi) {
  const starredEntitiesApi = new MockStarredEntitiesApi();
  starredEntitiesApi.toggleStarred('component:default/e-1');
  starredEntitiesApi.toggleStarred('component:default/e-2');

  return [
    [
      configApiRef,
      mockApis.config({ data: { organization: { name: 'Test Company' } } }),
    ],
    [catalogApiRef, catalogApi],
    [
      identityApiRef,
      mockApis.identity({
        userEntityRef: ownershipEntityRefs[0],
        ownershipEntityRefs,
      }),
    ],
    [storageApiRef, mockApis.storage()],
    [starredEntitiesApiRef, starredEntitiesApi],
  ] as const;
}

function queryOf(request?: QueryEntitiesRequest): string {
  return JSON.stringify(
    (request as QueryEntitiesInitialRequest | undefined)?.query ?? {},
  );
}

function isOwnedRequest(request?: QueryEntitiesRequest): boolean {
  return queryOf(request).includes('ownedBy');
}

function isStarredRequest(request?: QueryEntitiesRequest): boolean {
  return queryOf(request).includes('$any');
}

/**
 * Makes the matching requests hang forever, while the others are served by
 * the fake catalog.
 */
function hangRequestsWhere(
  catalogApi: CatalogApi,
  predicate: (request?: QueryEntitiesRequest) => boolean,
) {
  const queryEntities = catalogApi.queryEntities.bind(catalogApi);
  return jest
    .spyOn(catalogApi, 'queryEntities')
    .mockImplementation(request =>
      predicate(request) ? new Promise(() => {}) : queryEntities(request),
    );
}

function menuItemTexts() {
  return screen.getAllByRole('menuitem').map(({ textContent }) => textContent);
}

describe('<UserListPicker />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders filter groups', async () => {
    const catalogApi = catalogApiMock({ entities });
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');

    await renderInTestApp(
      <TestApiProvider apis={createApis(catalogApi)}>
        <MockEntityListContextProvider value={{}}>
          <UserListPicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() => expect(queryEntities).toHaveBeenCalled());
    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.getByText('Test Company')).toBeInTheDocument();
  });

  it('renders filters', async () => {
    const catalogApi = catalogApiMock({ entities });

    await renderInTestApp(
      <TestApiProvider apis={createApis(catalogApi)}>
        <MockEntityListContextProvider
          value={{
            filters: { namespace: new EntityNamespaceFilter(['default']) },
          }}
        >
          <UserListPicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() =>
      expect(menuItemTexts()).toEqual(['Owned 4', 'Starred 2', 'All 7']),
    );
  });

  it('respects other frontend filters in counts', async () => {
    const catalogApi = catalogApiMock({ entities });

    await renderInTestApp(
      <TestApiProvider apis={createApis(catalogApi)}>
        <MockEntityListContextProvider
          value={{
            filters: { tags: new EntityTagFilter(['tag1']) },
          }}
        >
          <UserListPicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );

    await waitFor(() => {
      expect(menuItemTexts()).toEqual(['Owned 4', 'Starred 2', 'All 5']);
    });
  });

  it('respects the query parameter filter value', async () => {
    const catalogApi = catalogApiMock({ entities });

    const updateFilters = jest.fn();
    const queryParameters = { user: 'owned', kind: 'component' };
    await renderInTestApp(
      <TestApiProvider apis={createApis(catalogApi)}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters,
            filters: { kind: new EntityKindFilter('component', 'Component') },
          }}
        >
          <UserListPicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );

    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        user: EntityUserFilter.owned(ownershipEntityRefs),
      }),
    );
    await waitFor(() =>
      expect(menuItemTexts()).toEqual(['Owned 4', 'Starred 2', 'All 6']),
    );
  });

  it('updates user filter when a menuitem is selected', async () => {
    const catalogApi = catalogApiMock({ entities });

    const updateFilters = jest.fn();
    await renderInTestApp(
      <TestApiProvider apis={createApis(catalogApi)}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            filters: { kind: new EntityKindFilter('component', 'Component') },
          }}
        >
          <UserListPicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );

    fireEvent.click(screen.getByText('Starred'));

    // wait until the component has finished loading
    await waitFor(() =>
      expect(menuItemTexts()).toEqual(['Owned 4', 'Starred 2', 'All 6']),
    );

    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        user: EntityUserFilter.starred([
          'component:default/e-1',
          'component:default/e-2',
        ]),
      }),
    );
  });

  it('responds to external queryParameters changes', async () => {
    const catalogApi = catalogApiMock({ entities });
    const apis = createApis(catalogApi);

    const updateFilters = jest.fn();
    const rendered = await renderInTestApp(
      <TestApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters: { user: ['all'], kind: 'component' },
            filters: {
              kind: new EntityKindFilter('component', 'Component'),
              user: undefined,
            },
          }}
        >
          <UserListPicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );

    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        user: EntityUserFilter.all(),
      }),
    );

    rendered.rerender(
      <TestApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters: { user: ['owned'], kind: 'component' },
            filters: {
              kind: new EntityKindFilter('component', 'Component'),
              user: undefined,
            },
          }}
        >
          <UserListPicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      user: EntityUserFilter.owned(ownershipEntityRefs),
    });
  });

  describe('filter resetting', () => {
    const updateFilters = jest.fn();

    // e-2 is starred but not owned
    const noOwnedFilters = {
      kind: new EntityKindFilter('component', 'Component'),
      tags: new EntityTagFilter(['starred-only']),
    };
    // o-2 is owned but not starred
    const noStarredFilters = {
      kind: new EntityKindFilter('component', 'Component'),
      tags: new EntityTagFilter(['owned-only']),
    };

    const Picker = ({
      apis,
      filters,
      ...props
    }: UserListPickerProps & {
      apis: ReturnType<typeof createApis>;
      filters?: DefaultEntityFilters;
    }) => (
      <TestApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            filters: filters || {
              kind: new EntityKindFilter('component', 'Component'),
            },
          }}
        >
          <UserListPicker {...props} />
        </MockEntityListContextProvider>
      </TestApiProvider>
    );

    describe(`when there are no owned entities matching the filter`, () => {
      it('does not reset the filter while entities are loading', async () => {
        const catalogApi = catalogApiMock({ entities });
        const queryEntities = hangRequestsWhere(catalogApi, () => true);

        await renderInTestApp(
          <Picker apis={createApis(catalogApi)} initialFilter="owned" />,
        );

        await waitFor(() => expect(queryEntities).toHaveBeenCalled());

        await expect(() =>
          waitFor(() => expect(updateFilters).toHaveBeenCalled()),
        ).rejects.toThrow();
      });

      it('does not reset the filter while owned entities are loading', async () => {
        const catalogApi = catalogApiMock({ entities });
        const queryEntities = hangRequestsWhere(catalogApi, isOwnedRequest);

        await renderInTestApp(
          <Picker apis={createApis(catalogApi)} initialFilter="owned" />,
        );

        await waitFor(() => expect(queryEntities).toHaveBeenCalledTimes(3));
        expect(updateFilters).not.toHaveBeenCalledWith({
          user: expect.any(Object),
        });
      });

      it('does not reset the filter when request is empty', async () => {
        const catalogApi = catalogApiMock({ entities });
        const queryEntities = jest.spyOn(catalogApi, 'queryEntities');

        await renderInTestApp(
          <Picker
            apis={createApis(catalogApi)}
            initialFilter="owned"
            filters={{}}
          />,
        );

        await waitFor(() => {
          // only the starred count can be computed without other filters
          expect(queryEntities).toHaveBeenCalledTimes(1);
          expect(isStarredRequest(queryEntities.mock.calls[0][0])).toBe(true);
        });
        expect(updateFilters).not.toHaveBeenCalledWith({
          user: expect.any(Object),
        });
      });

      it('resets the filter to "all" when entities are loaded', async () => {
        const catalogApi = catalogApiMock({ entities });

        await renderInTestApp(
          <Picker
            apis={createApis(catalogApi)}
            initialFilter="owned"
            filters={noOwnedFilters}
          />,
        );

        await waitFor(() =>
          expect(updateFilters).toHaveBeenLastCalledWith({
            user: EntityUserFilter.all(),
          }),
        );
      });
    });

    describe(`when there are no starred entities match the filter`, () => {
      it('does not reset the filter while entities are loading', async () => {
        const catalogApi = catalogApiMock({ entities });
        const queryEntities = hangRequestsWhere(catalogApi, () => true);

        await renderInTestApp(
          <Picker apis={createApis(catalogApi)} initialFilter="starred" />,
        );

        await waitFor(() => expect(queryEntities).toHaveBeenCalled());
        expect(updateFilters).not.toHaveBeenCalled();
      });

      it('does not reset the filter while starred entities are loading', async () => {
        const catalogApi = catalogApiMock({ entities });
        const queryEntities = hangRequestsWhere(catalogApi, isStarredRequest);

        await renderInTestApp(
          <Picker apis={createApis(catalogApi)} initialFilter="starred" />,
        );

        await waitFor(() => expect(queryEntities).toHaveBeenCalledTimes(3));
        expect(updateFilters).not.toHaveBeenCalledWith({
          user: expect.any(Object),
        });
      });

      it('resets the filter to "all" when entities are loaded', async () => {
        const catalogApi = catalogApiMock({ entities });

        await renderInTestApp(
          <Picker
            apis={createApis(catalogApi)}
            initialFilter="starred"
            filters={noStarredFilters}
          />,
        );

        await waitFor(() =>
          expect(updateFilters).toHaveBeenLastCalledWith({
            user: EntityUserFilter.all(),
          }),
        );
      });
    });

    it('doesn\nt reset the filter to "all" when entities are loaded and alwaysKeepFilters is set to true', async () => {
      const catalogApi = catalogApiMock({ entities });

      await renderInTestApp(
        <Picker
          apis={createApis(catalogApi)}
          initialFilter="starred"
          filters={noStarredFilters}
          alwaysKeepFilters
        />,
      );

      await waitFor(() =>
        expect(updateFilters).toHaveBeenLastCalledWith({
          user: EntityUserFilter.starred([
            'component:default/e-1',
            'component:default/e-2',
          ]),
        }),
      );
    });

    describe(`when there are some owned entities present`, () => {
      it('does not reset the filter while entities are loading', async () => {
        const catalogApi = catalogApiMock({ entities });
        const queryEntities = hangRequestsWhere(catalogApi, isOwnedRequest);

        await renderInTestApp(
          <Picker apis={createApis(catalogApi)} initialFilter="owned" />,
        );

        await waitFor(() => expect(queryEntities).toHaveBeenCalledTimes(3));
        expect(updateFilters).not.toHaveBeenCalledWith({
          user: EntityUserFilter.all(),
        });
      });

      it('does not reset the filter when entities are loaded', async () => {
        const catalogApi = catalogApiMock({ entities });
        const queryEntities = jest.spyOn(catalogApi, 'queryEntities');

        await renderInTestApp(
          <Picker apis={createApis(catalogApi)} initialFilter="owned" />,
        );

        await waitFor(() => expect(queryEntities).toHaveBeenCalledTimes(3));

        await waitFor(() =>
          expect(updateFilters).toHaveBeenLastCalledWith({
            user: EntityUserFilter.owned(expect.any(Array)),
          }),
        );
      });

      it('does not reset the filter when request is empty', async () => {
        const catalogApi = catalogApiMock({ entities });
        const queryEntities = jest.spyOn(catalogApi, 'queryEntities');

        await renderInTestApp(
          <Picker
            apis={createApis(catalogApi)}
            initialFilter="owned"
            filters={{}}
          />,
        );

        await waitFor(() => {
          // only the starred count can be computed without other filters
          expect(queryEntities).toHaveBeenCalledTimes(1);
          expect(isStarredRequest(queryEntities.mock.calls[0][0])).toBe(true);
        });
        expect(updateFilters).not.toHaveBeenCalledWith({
          user: expect.any(Object),
        });
      });
    });

    describe(`when there are some starred entities present`, () => {
      it('does not reset the filter while entities are loading', async () => {
        const catalogApi = catalogApiMock({ entities });
        const queryEntities = hangRequestsWhere(catalogApi, isStarredRequest);

        await renderInTestApp(
          <Picker apis={createApis(catalogApi)} initialFilter="starred" />,
        );

        await waitFor(() => expect(queryEntities).toHaveBeenCalledTimes(3));
        expect(updateFilters).not.toHaveBeenCalledWith({
          user: EntityUserFilter.all(),
        });
      });

      it('does not reset the filter when entities are loaded', async () => {
        const catalogApi = catalogApiMock({ entities });
        const queryEntities = jest.spyOn(catalogApi, 'queryEntities');

        await renderInTestApp(
          <Picker apis={createApis(catalogApi)} initialFilter="starred" />,
        );

        await waitFor(() => expect(queryEntities).toHaveBeenCalledTimes(3));

        await waitFor(() =>
          expect(updateFilters).toHaveBeenLastCalledWith({
            user: EntityUserFilter.starred([
              'component:default/e-1',
              'component:default/e-2',
            ]),
          }),
        );
      });

      it("doesn't render when hidden", async () => {
        const catalogApi = catalogApiMock({ entities });
        const queryEntities = jest.spyOn(catalogApi, 'queryEntities');

        await renderInTestApp(
          <TestApiProvider apis={createApis(catalogApi)}>
            <MockEntityListContextProvider value={{}}>
              <UserListPicker hidden />
            </MockEntityListContextProvider>
          </TestApiProvider>,
        );
        await waitFor(() => expect(queryEntities).toHaveBeenCalled());
        expect(screen.queryByText('Personal')).toBeNull();
        expect(screen.queryByText('Test Company')).toBeNull();
      });
    });
  });
  describe('when initialFilter is not provided', () => {
    it('updates filter options automatically when the kind changes', async () => {
      const catalogApi = catalogApiMock({ entities });

      let setFilters: (f: any) => void = () => {};

      const TestProvider = ({ children }: { children?: React.ReactNode }) => {
        const [filtersState, _setFiltersState] = require('react').useState({
          kind: new EntityKindFilter('component', 'Component'),
        } as any);
        setFilters = _setFiltersState;

        const updateFilters = (update: any) =>
          _setFiltersState((prev: any) =>
            typeof update === 'function'
              ? update(prev)
              : { ...prev, ...update },
          );

        const value = {
          entities: [],
          backendEntities: [],
          updateFilters,
          filters: filtersState,
          loading: false,
          queryParameters: {},
          error: undefined,
          totalItems: 0,
          limit: 20,
          offset: 0,
          setLimit: () => {},
          setOffset: () => {},
          paginationMode: 'none',
        } as any;

        return (
          <NewEntityListContext.Provider
            value={createVersionedValueMap({ 1: value })}
          >
            {children}
          </NewEntityListContext.Provider>
        );
      };

      await renderInTestApp(
        <TestApiProvider apis={createApis(catalogApi)}>
          <TestProvider>
            <UserListPicker />
          </TestProvider>
        </TestApiProvider>,
      );

      await waitFor(() =>
        expect(menuItemTexts()).toEqual(['Owned 4', 'Starred 2', 'All 6']),
      );

      require('react').act(() =>
        setFilters({ kind: new EntityKindFilter('user', 'User') } as any),
      );

      await waitFor(() =>
        // Only the testuser entity is a user, and none of the starred
        // entities are
        expect(menuItemTexts()).toEqual(['Starred 0', 'All 1']),
      );
    });
  });
});
