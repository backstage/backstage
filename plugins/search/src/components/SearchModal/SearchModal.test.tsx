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

import React from 'react';
import { screen } from '@testing-library/react';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import userEvent from '@testing-library/user-event';
import { configApiRef } from '@backstage/core-plugin-api';
import { ApiProvider, ConfigReader } from '@backstage/core-app-api';
import { rootRouteRef } from '../../plugin';
import {
  searchApiRef,
  SearchContextProvider,
} from '@backstage/plugin-search-react';

import { SearchModal } from './SearchModal';

describe('SearchModal', () => {
  const query = jest.fn().mockResolvedValue({ results: [] });

  const apiRegistry = TestApiRegistry.from(
    [configApiRef, new ConfigReader({ app: { title: 'Mock app' } })],
    [searchApiRef, { query }],
  );

  beforeEach(() => {
    query.mockClear();
  });

  const toggleModal = jest.fn();

  it('Should render the Modal correctly', async () => {
    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <SearchModal open hidden={false} toggleModal={toggleModal} />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/search': rootRouteRef,
        },
      },
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(query).toHaveBeenCalledTimes(1);
  });

  it('Should use parent search context if defined', async () => {
    const initialState = {
      term: 'term',
      filters: { filter: '' },
      types: ['type'],
      pageCursor: 'page cursor',
    };

    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <SearchContextProvider initialState={initialState}>
          <SearchModal open hidden={false} toggleModal={toggleModal} />
        </SearchContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/search': rootRouteRef,
        },
      },
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(query).toHaveBeenCalledWith(initialState);
  });

  it('Should create a local search context if a parent is not defined', async () => {
    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <SearchModal open hidden={false} toggleModal={toggleModal} />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/search': rootRouteRef,
        },
      },
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(query).toHaveBeenCalledWith({
      term: '',
      filters: {},
      types: [],
      pageCursor: undefined,
    });
  });

  it('Should render a custom Modal correctly', async () => {
    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <SearchModal open hidden={false} toggleModal={toggleModal}>
          {() => <div>Custom Search Modal</div>}
        </SearchModal>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/search': rootRouteRef,
        },
      },
    );

    expect(screen.getByText('Custom Search Modal')).toBeInTheDocument();
  });

  it('Calls toggleModal handler', async () => {
    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <SearchModal open toggleModal={toggleModal} />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/search': rootRouteRef,
        },
      },
    );

    expect(query).toHaveBeenCalledTimes(1);
    await userEvent.keyboard('{Escape}');
    expect(toggleModal).toHaveBeenCalledTimes(1);
  });

  it('should render SearchModal hiding its content', async () => {
    const { getByTestId } = await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <SearchModal open hidden toggleModal={toggleModal} />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/search': rootRouteRef,
        },
      },
    );

    expect(getByTestId('search-bar-next')).toBeInTheDocument();
    expect(getByTestId('search-bar-next')).not.toBeVisible();
  });
});
