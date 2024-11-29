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

import { configApiRef } from '@backstage/core-plugin-api';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {
  SearchContextProvider,
  searchApiRef,
} from '@backstage/plugin-search-react';
import { SearchType } from './SearchType';
import { mockApis, TestApiProvider } from '@backstage/test-utils';

describe('SearchType', () => {
  const initialState = {
    term: '',
    filters: {},
    types: [],
  };

  const name = 'field';
  const values = ['value1', 'value2'];
  const typeValues = ['preselected'];

  const configApiMock = mockApis.config({
    data: {
      search: {
        query: {
          pagelimit: 10,
        },
      },
    },
  });

  const searchApiMock = { query: jest.fn().mockResolvedValue({ results: [] }) };

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe('Type Filter', () => {
    it('Renders field name and values when provided as props', async () => {
      render(
        <TestApiProvider
          apis={[
            [configApiRef, configApiMock],
            [searchApiRef, searchApiMock],
          ]}
        >
          <SearchContextProvider initialState={initialState}>
            <SearchType name={name} values={values} />
          </SearchContextProvider>
        </TestApiProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText(name)).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      expect(
        screen.getByRole('option', { name: values[0] }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: values[1] }),
      ).toBeInTheDocument();
    });

    it('Renders correctly based on type filter state', async () => {
      render(
        <TestApiProvider
          apis={[
            [configApiRef, configApiMock],
            [searchApiRef, searchApiMock],
          ]}
        >
          <SearchContextProvider
            initialState={{
              ...initialState,
              types: [values[0]],
            }}
          >
            <SearchType name={name} values={values} />
          </SearchContextProvider>
        </TestApiProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText(name)).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      expect(screen.getByRole('option', { name: values[0] })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(
        screen.getByRole('option', { name: values[1] }),
      ).not.toHaveAttribute('aria-selected');
    });

    it('Renders correctly based on type filter defaultValue', async () => {
      render(
        <TestApiProvider
          apis={[
            [configApiRef, configApiMock],
            [searchApiRef, searchApiMock],
          ]}
        >
          <SearchContextProvider initialState={initialState}>
            <SearchType name={name} values={values} defaultValue={values[0]} />
          </SearchContextProvider>
        </TestApiProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText(name)).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      expect(screen.getByRole('option', { name: values[0] })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(
        screen.getByRole('option', { name: values[1] }),
      ).not.toHaveAttribute('aria-selected');
    });

    it('Selecting a value sets type filter state', async () => {
      render(
        <TestApiProvider
          apis={[
            [configApiRef, configApiMock],
            [searchApiRef, searchApiMock],
          ]}
        >
          <SearchContextProvider initialState={initialState}>
            <SearchType name={name} values={values} />
          </SearchContextProvider>
        </TestApiProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText(name)).toBeInTheDocument();
      });

      const button = screen.getByRole('button');

      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole('option', { name: values[0] }));

      await waitFor(() => {
        expect(searchApiMock.query).toHaveBeenLastCalledWith(
          expect.objectContaining({
            types: [values[0]],
          }),
        );
      });

      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('Selecting none defaults to empty state', async () => {
      render(
        <TestApiProvider
          apis={[
            [configApiRef, configApiMock],
            [searchApiRef, searchApiMock],
          ]}
        >
          <SearchContextProvider
            initialState={{
              ...initialState,
              types: typeValues,
            }}
          >
            <SearchType name={name} values={values} />
          </SearchContextProvider>
        </TestApiProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText(name)).toBeInTheDocument();
      });

      const button = screen.getByRole('button');

      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole('option', { name: values[0] }));

      await waitFor(() => {
        expect(searchApiMock.query).toHaveBeenLastCalledWith(
          expect.objectContaining({
            types: [...typeValues, values[0]],
          }),
        );
      });

      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole('option', { name: values[0] }));

      await waitFor(() => {
        expect(searchApiMock.query).toHaveBeenLastCalledWith(
          expect.objectContaining([]),
        );
      });
    });
  });
});
