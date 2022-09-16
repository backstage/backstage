/*
 * Copyright 2022 The Backstage Authors
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
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useApi } from '@backstage/core-plugin-api';

import { SearchContextProvider } from '../../context';
import { SearchFilter } from './SearchFilter';

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: jest.fn().mockReturnValue({}),
}));

describe('SearchFilter', () => {
  const initialState = {
    term: '',
    filters: {},
    types: [],
  };

  const label = 'Field';
  const name = 'field';
  const values = ['value1', 'value2'];
  const filters = { unrelated: 'unrelated' };

  const query = jest.fn().mockResolvedValue({});
  (useApi as jest.Mock).mockReturnValue({ query: query });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('Check that element was rendered and received props', async () => {
    const CustomFilter = (props: { name: string }) => <h6>{props.name}</h6>;

    render(<SearchFilter name={name} component={CustomFilter} />);

    expect(screen.getByRole('heading', { name })).toBeInTheDocument();
  });

  describe('Checkbox', () => {
    it('Renders field name and values when provided as props', async () => {
      render(
        <SearchContextProvider initialState={initialState}>
          <SearchFilter.Checkbox label={label} name={name} values={values} />
        </SearchContextProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });

      expect(
        screen.getByRole('checkbox', { name: values[0] }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('checkbox', { name: values[1] }),
      ).toBeInTheDocument();
    });

    it('Renders correctly based on filter state', async () => {
      render(
        <SearchContextProvider
          initialState={{
            ...initialState,
            filters: {
              [name]: [values[1]],
            },
          }}
        >
          <SearchFilter.Checkbox label={label} name={name} values={values} />
        </SearchContextProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });

      expect(
        screen.getByRole('checkbox', { name: values[0] }),
      ).not.toBeChecked();
      expect(screen.getByRole('checkbox', { name: values[1] })).toBeChecked();
    });

    it('Renders correctly based on defaultValue', async () => {
      render(
        <SearchContextProvider initialState={initialState}>
          <SearchFilter.Checkbox
            label={label}
            name={name}
            values={values}
            defaultValue={[values[0]]}
          />
        </SearchContextProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });

      expect(screen.getByRole('checkbox', { name: values[0] })).toBeChecked();
      expect(
        screen.getByRole('checkbox', { name: values[1] }),
      ).not.toBeChecked();
    });

    it('Checking / unchecking a value sets filter state', async () => {
      render(
        <SearchContextProvider initialState={initialState}>
          <SearchFilter.Checkbox label={label} name={name} values={values} />
        </SearchContextProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });

      const checkBox = screen.getByRole('checkbox', { name: values[0] });

      // Check the box.
      await userEvent.click(checkBox);
      await waitFor(() => {
        expect(query).toHaveBeenLastCalledWith(
          expect.objectContaining({ filters: { field: [values[0]] } }),
        );
      });

      // Uncheck the box.
      await userEvent.click(checkBox);
      await waitFor(() => {
        expect(query).toHaveBeenLastCalledWith(
          expect.objectContaining({ filters: {} }),
        );
      });
    });

    it('Checking / unchecking a value maintains unrelated filter state', async () => {
      render(
        <SearchContextProvider initialState={{ ...initialState, filters }}>
          <SearchFilter.Checkbox label={label} name={name} values={values} />
        </SearchContextProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });

      const checkBox = screen.getByRole('checkbox', { name: values[0] });

      // Check the box.
      await userEvent.click(checkBox);
      await waitFor(() => {
        expect(query).toHaveBeenLastCalledWith(
          expect.objectContaining({
            filters: { ...filters, field: [values[0]] },
          }),
        );
      });

      // Uncheck the box.
      await userEvent.click(checkBox);
      await waitFor(() => {
        expect(query).toHaveBeenLastCalledWith(
          expect.objectContaining({ filters }),
        );
      });
    });
  });

  describe('Select', () => {
    it('Renders field name and values when provided as props', async () => {
      render(
        <SearchContextProvider initialState={initialState}>
          <SearchFilter.Select label={label} name={name} values={values} />
        </SearchContextProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText(label)).toBeInTheDocument();
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

    it('Renders values when provided asynchronously', async () => {
      render(
        <SearchContextProvider initialState={initialState}>
          <SearchFilter.Select
            label={label}
            name={name}
            values={async () => values}
          />
        </SearchContextProvider>,
      );

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(
          screen.getByRole('button').getAttribute('aria-disabled'),
        ).not.toBe('true');
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

    it('Renders correctly based on filter state', async () => {
      render(
        <SearchContextProvider
          initialState={{
            ...initialState,
            filters: {
              [name]: values[0],
            },
          }}
        >
          <SearchFilter.Select label={label} name={name} values={values} />
        </SearchContextProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText(label)).toBeInTheDocument();
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
      expect(screen.getByRole('option', { name: 'All' })).not.toHaveAttribute(
        'aria-selected',
      );
    });

    it('Renders correctly based on defaultValue', async () => {
      render(
        <SearchContextProvider initialState={initialState}>
          <SearchFilter.Select
            name={name}
            label={label}
            values={values}
            defaultValue={values[0]}
          />
        </SearchContextProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText(label)).toBeInTheDocument();
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
      expect(screen.getByRole('option', { name: 'All' })).not.toHaveAttribute(
        'aria-selected',
      );
    });

    it('Selecting a value sets filter state', async () => {
      render(
        <SearchContextProvider initialState={initialState}>
          <SearchFilter.Select label={label} name={name} values={values} />
        </SearchContextProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });

      const button = screen.getByRole('button');

      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole('option', { name: values[0] }));

      await waitFor(() => {
        expect(query).toHaveBeenLastCalledWith(
          expect.objectContaining({
            filters: { [name]: values[0] },
          }),
        );
      });

      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole('option', { name: 'All' }));

      await waitFor(() => {
        expect(query).toHaveBeenLastCalledWith(
          expect.objectContaining({
            filters: {},
          }),
        );
      });
    });

    it('Selecting a value maintains unrelated filter state', async () => {
      render(
        <SearchContextProvider
          initialState={{
            ...initialState,
            filters,
          }}
        >
          <SearchFilter.Select label={label} name={name} values={values} />
        </SearchContextProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });

      const button = screen.getByRole('button');

      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole('option', { name: values[0] }));

      await waitFor(() => {
        expect(query).toHaveBeenLastCalledWith(
          expect.objectContaining({
            filters: { ...filters, [name]: values[0] },
          }),
        );
      });

      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole('option', { name: 'All' }));

      await waitFor(() => {
        expect(query).toHaveBeenLastCalledWith(
          expect.objectContaining({ filters }),
        );
      });
    });
  });
});
