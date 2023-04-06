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

import { TestApiProvider } from '@backstage/test-utils';
import { screen, render, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { searchApiRef } from '../../api';
import { SearchContextProvider, useSearch } from '../../context';
import { SearchFilter } from './SearchFilter';

const SearchContextFilterSpy = ({ name }: { name: string }) => {
  const { filters } = useSearch();
  const value = filters[name];
  return (
    <span data-testid={`${name}-filter-spy`}>
      {Array.isArray(value) ? value.join(',') : value}
    </span>
  );
};

describe('SearchFilter.Autocomplete', () => {
  const query = jest.fn().mockResolvedValue({});
  const emptySearchContext = {
    term: '',
    types: [],
    filters: {},
  };

  const name = 'field';
  const values = ['value1', 'value2'];

  it('renders as expected', async () => {
    render(
      <TestApiProvider apis={[[searchApiRef, { query }]]}>
        <SearchContextProvider>
          <SearchFilter.Autocomplete name={name} values={values} />
        </SearchContextProvider>
      </TestApiProvider>,
    );

    const autocomplete = screen.getByRole('combobox');
    const input = within(autocomplete).getByRole('textbox');
    await userEvent.click(input);

    await waitFor(() => {
      screen.getByRole('listbox');
    });

    expect(screen.getByRole('option', { name: values[0] })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: values[1] })).toBeInTheDocument();
  });

  it('renders as expected with async values', async () => {
    render(
      <TestApiProvider apis={[[searchApiRef, { query }]]}>
        <SearchContextProvider>
          <SearchFilter.Autocomplete name={name} values={async () => values} />
        </SearchContextProvider>
      </TestApiProvider>,
    );

    const autocomplete = screen.getByRole('combobox');
    const input = within(autocomplete).getByRole('textbox');
    await userEvent.click(input);

    await waitFor(() => {
      screen.getByRole('listbox');
    });

    expect(screen.getByRole('option', { name: values[0] })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: values[1] })).toBeInTheDocument();
  });

  it('does not affect unrelated filter state', async () => {
    render(
      <TestApiProvider apis={[[searchApiRef, { query }]]}>
        <SearchContextProvider
          initialState={{
            ...emptySearchContext,
            ...{ filters: { unrelated: 'value' } },
          }}
        >
          <SearchFilter.Autocomplete name={name} values={values} />
          <SearchContextFilterSpy name={name} />
          <SearchContextFilterSpy name="unrelated" />
        </SearchContextProvider>
      </TestApiProvider>,
    );

    // The spy should show the initial value.
    expect(screen.getByTestId('unrelated-filter-spy')).toHaveTextContent(
      'value',
    );

    // Select a value from the autocomplete filter.
    const autocomplete = screen.getByRole('combobox');
    const input = within(autocomplete).getByRole('textbox');
    await userEvent.click(input);
    await waitFor(() => {
      screen.getByRole('listbox');
    });
    await userEvent.click(screen.getByRole('option', { name: values[1] }));

    // Wait for the autocomplete filter's value to change.
    await waitFor(() => {
      expect(screen.getByTestId(`${name}-filter-spy`)).toHaveTextContent(
        values[1],
      );
    });

    // Unrelated filter spy should maintain the same value.
    expect(screen.getByTestId('unrelated-filter-spy')).toHaveTextContent(
      'value',
    );
  });

  describe('single', () => {
    it('renders as expected with defaultValue', async () => {
      render(
        <TestApiProvider apis={[[searchApiRef, { query }]]}>
          <SearchContextProvider>
            <SearchFilter.Autocomplete
              name={name}
              values={values}
              defaultValue={values[1]}
            />
            <SearchContextFilterSpy name={name} />
          </SearchContextProvider>
        </TestApiProvider>,
      );

      const autocomplete = screen.getByRole('combobox');
      const input = within(autocomplete).getByRole('textbox');

      await waitFor(() => {
        expect(input).toHaveValue(values[1]);
        expect(screen.getByTestId(`${name}-filter-spy`)).toHaveTextContent(
          values[1],
        );
      });
    });

    it('renders as expected with initial context', async () => {
      render(
        <TestApiProvider apis={[[searchApiRef, { query }]]}>
          <SearchContextProvider
            initialState={{
              ...emptySearchContext,
              ...{ filters: { [name]: values[0] } },
            }}
          >
            <SearchFilter.Autocomplete name={name} values={values} />
            <SearchContextFilterSpy name={name} />
          </SearchContextProvider>
        </TestApiProvider>,
      );

      const autocomplete = screen.getByRole('combobox');
      const input = within(autocomplete).getByRole('textbox');

      await waitFor(() => {
        expect(input).toHaveValue(values[0]);
        expect(screen.getByTestId(`${name}-filter-spy`)).toHaveTextContent(
          values[0],
        );
      });
    });

    it('sets filter state when selecting a value', async () => {
      render(
        <TestApiProvider apis={[[searchApiRef, { query }]]}>
          <SearchContextProvider>
            <SearchFilter.Autocomplete name={name} values={values} />
            <SearchContextFilterSpy name={name} />
          </SearchContextProvider>
        </TestApiProvider>,
      );

      // Select the first option in the autocomplete.
      const autocomplete = screen.getByRole('combobox');
      const input = within(autocomplete).getByRole('textbox');
      await userEvent.click(input);
      await waitFor(() => {
        screen.getByRole('listbox');
      });
      await userEvent.click(screen.getByRole('option', { name: values[0] }));

      // The value should be present in the context.
      await waitFor(() => {
        expect(screen.getByTestId(`${name}-filter-spy`)).toHaveTextContent(
          values[0],
        );
      });

      // Click the "Clear" button to remove the value.
      const clearButton = within(autocomplete).getByLabelText('Clear');
      await userEvent.click(clearButton);

      // That value should have been unset from the context.
      await waitFor(() => {
        expect(screen.getByTestId(`${name}-filter-spy`)).toHaveTextContent('');
      });
    });
  });

  describe('multiple', () => {
    it('renders as expected with defaultValue', async () => {
      render(
        <TestApiProvider apis={[[searchApiRef, { query }]]}>
          <SearchContextProvider>
            <SearchFilter.Autocomplete
              multiple
              name={name}
              values={values}
              defaultValue={values}
            />
            <SearchContextFilterSpy name={name} />
          </SearchContextProvider>
        </TestApiProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText(values[0])).toBeInTheDocument();
        expect(screen.getByText(values[1])).toBeInTheDocument();
        expect(screen.getByTestId(`${name}-filter-spy`)).toHaveTextContent(
          values.join(','),
        );
      });
    });

    it('renders as expected with initial context', async () => {
      render(
        <TestApiProvider apis={[[searchApiRef, { query }]]}>
          <SearchContextProvider
            initialState={{
              ...emptySearchContext,
              ...{ filters: { [name]: values } },
            }}
          >
            <SearchFilter.Autocomplete multiple name={name} values={values} />
            <SearchContextFilterSpy name={name} />
          </SearchContextProvider>
        </TestApiProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText(values[0])).toBeInTheDocument();
        expect(screen.getByText(values[1])).toBeInTheDocument();
        expect(screen.getByTestId(`${name}-filter-spy`)).toHaveTextContent(
          values.join(','),
        );
      });
    });

    it('respects tag limit configuration', async () => {
      render(
        <TestApiProvider apis={[[searchApiRef, { query }]]}>
          <SearchContextProvider>
            <SearchFilter.Autocomplete
              multiple
              limitTags={1}
              name={name}
              values={values}
            />
          </SearchContextProvider>
        </TestApiProvider>,
      );

      const autocomplete = screen.getByRole('combobox');
      const input = within(autocomplete).getByRole('textbox');

      // Select the second value.
      await userEvent.click(input);
      await waitFor(() => {
        screen.getByRole('listbox');
      });
      await userEvent.click(screen.getByRole('option', { name: values[1] }));
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: values[1] }),
        ).toBeInTheDocument();
      });

      // Select the first value.
      await userEvent.click(input);
      await waitFor(() => {
        screen.getByRole('listbox');
      });
      await userEvent.click(screen.getByRole('option', { name: values[0] }));
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: values[0] }),
        ).toBeInTheDocument();
      });

      // Blur the field and only one tag should be shown with a +1.
      input.blur();
      expect(
        screen.queryByRole('button', { name: values[0] }),
      ).not.toBeInTheDocument();
      expect(screen.getByText('+1')).toBeInTheDocument();
    });

    it('sets filter state when selecting a value', async () => {
      render(
        <TestApiProvider apis={[[searchApiRef, { query }]]}>
          <SearchContextProvider>
            <SearchFilter.Autocomplete multiple name={name} values={values} />
            <SearchContextFilterSpy name={name} />
          </SearchContextProvider>
        </TestApiProvider>,
      );

      const autocomplete = screen.getByRole('combobox');

      // Select both values in the autocomplete.
      const input = within(autocomplete).getByRole('textbox');
      await userEvent.click(input);
      await waitFor(() => {
        screen.getByRole('listbox');
      });
      await userEvent.click(screen.getByRole('option', { name: values[0] }));
      await userEvent.click(input);
      await waitFor(() => {
        screen.getByRole('listbox');
      });
      await userEvent.click(screen.getByRole('option', { name: values[1] }));

      // Both options should be present in the context.
      await waitFor(() => {
        expect(screen.getByTestId(`${name}-filter-spy`)).toHaveTextContent(
          values.join(','),
        );
      });

      // Click the "Clear" button to remove the value.
      const clearButton = within(autocomplete).getByLabelText('Clear');
      await userEvent.click(clearButton);

      // There should be no content in the filter context.
      await waitFor(() => {
        expect(screen.getByTestId(`${name}-filter-spy`)).toHaveTextContent('');
      });
    });
  });
});
