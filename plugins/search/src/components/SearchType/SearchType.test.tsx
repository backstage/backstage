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
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  SearchContextProvider,
  searchApiRef,
} from '@backstage/plugin-search-react';
import { SearchType } from './SearchType';
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';

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

  /**
   * Helper to locate the shadcn Popover content element in the DOM.
   * The Radix Popover portal renders outside the component tree,
   * so we find it via the data-slot attribute set by the shadcn PopoverContent wrapper.
   */
  function findPopoverContent(): HTMLElement {
    const el = document.querySelector('[data-slot="popover-content"]');
    if (!el) {
      throw new Error('Popover content not found in DOM');
    }
    return el as HTMLElement;
  }

  describe('Type Filter', () => {
    it('Renders field name and values when provided as props', async () => {
      await renderInTestApp(
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

      // Open the multi-select popover via the combobox trigger
      await userEvent.click(screen.getByRole('combobox'));

      // Wait for the Radix Popover content to appear in the DOM
      await waitFor(() => {
        expect(findPopoverContent()).toBeInTheDocument();
      });

      const popover = findPopoverContent();
      expect(within(popover).getByText(values[0])).toBeInTheDocument();
      expect(within(popover).getByText(values[1])).toBeInTheDocument();
    });

    it('Renders correctly based on type filter state', async () => {
      await renderInTestApp(
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

      // Open the multi-select popover via the combobox trigger
      await userEvent.click(screen.getByRole('combobox'));

      // Wait for the Radix Popover content to appear
      await waitFor(() => {
        expect(findPopoverContent()).toBeInTheDocument();
      });

      // Checkboxes inside the popover reflect type filter state:
      // values[0] is in the types array → its checkbox should be checked
      // values[1] is NOT in the types array → its checkbox should NOT be checked
      const popover = findPopoverContent();
      const checkboxes = within(popover).getAllByRole('checkbox');
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
    });

    it('Renders correctly based on type filter defaultValue', async () => {
      await renderInTestApp(
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

      // Open the multi-select popover via the combobox trigger
      await userEvent.click(screen.getByRole('combobox'));

      // Wait for the Radix Popover content to appear
      await waitFor(() => {
        expect(findPopoverContent()).toBeInTheDocument();
      });

      // defaultValue seeds values[0] into the types state, so its checkbox
      // should be checked; values[1] should NOT be checked
      const popover = findPopoverContent();
      const checkboxes = within(popover).getAllByRole('checkbox');
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
    });

    it('Selecting a value sets type filter state', async () => {
      await renderInTestApp(
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

      // Open the multi-select popover via the combobox trigger
      await userEvent.click(screen.getByRole('combobox'));

      // Wait for the Radix Popover content to appear
      await waitFor(() => {
        expect(findPopoverContent()).toBeInTheDocument();
      });

      // Click the first value to select it — the Popover stays open
      // (shadcn Popover does not auto-close on item interaction)
      const popover = findPopoverContent();
      await userEvent.click(within(popover).getByText(values[0]));

      await waitFor(() => {
        expect(searchApiMock.query).toHaveBeenLastCalledWith(
          expect.objectContaining({
            types: [values[0]],
          }),
          {
            signal: expect.any(AbortSignal),
          },
        );
      });

      // Verify the popover is still open after selection (Radix Popover stays open)
      await waitFor(() => {
        expect(findPopoverContent()).toBeInTheDocument();
      });
    });

    it('Selecting none defaults to empty state', async () => {
      await renderInTestApp(
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

      // Open the multi-select popover via the combobox trigger
      await userEvent.click(screen.getByRole('combobox'));

      // Wait for the Radix Popover content to appear
      await waitFor(() => {
        expect(findPopoverContent()).toBeInTheDocument();
      });

      // Click values[0] to add it to the existing typeValues selection
      let popover = findPopoverContent();
      await userEvent.click(within(popover).getByText(values[0]));

      await waitFor(() => {
        expect(searchApiMock.query).toHaveBeenLastCalledWith(
          expect.objectContaining({
            types: [...typeValues, values[0]],
          }),
          {
            signal: expect.any(AbortSignal),
          },
        );
      });

      // Popover stays open in Radix — click values[0] again to toggle it off
      popover = findPopoverContent();
      await userEvent.click(within(popover).getByText(values[0]));

      await waitFor(() => {
        expect(searchApiMock.query).toHaveBeenLastCalledWith(
          expect.objectContaining({
            types: typeValues,
          }),
          {
            signal: expect.any(AbortSignal),
          },
        );
      });
    });
  });
});
