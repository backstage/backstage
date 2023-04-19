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
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import LabelIcon from '@material-ui/icons/Label';

import { configApiRef } from '@backstage/core-plugin-api';
import { ConfigReader } from '@backstage/core-app-api';
import { TestApiProvider, renderWithEffects } from '@backstage/test-utils';

import { searchApiRef } from '../../api';
import { SearchAutocomplete } from './SearchAutocomplete';
import { SearchAutocompleteDefaultOption } from './SearchAutocompleteDefaultOption';

const title = 'Backstage Test App';
const configApiMock = new ConfigReader({
  app: { title },
});

const query = jest.fn().mockResolvedValue({ results: [] });
const searchApiMock = { query };

describe('SearchAutocomplete', () => {
  const options = ['hello-world', 'petstore', 'spotify'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Renders without exploding', async () => {
    await renderWithEffects(
      <TestApiProvider
        apis={[
          [configApiRef, configApiMock],
          [searchApiRef, searchApiMock],
        ]}
      >
        <SearchAutocomplete options={options} />
      </TestApiProvider>,
    );

    expect(screen.getByTestId('search-autocomplete')).toBeInTheDocument();
  });

  it('Show all options by default when focused', async () => {
    await renderWithEffects(
      <TestApiProvider
        apis={[
          [configApiRef, configApiMock],
          [searchApiRef, searchApiMock],
        ]}
      >
        <SearchAutocomplete options={options} />
      </TestApiProvider>,
    );

    expect(screen.queryByText(options[0])).not.toBeInTheDocument();
    expect(screen.queryByText(options[1])).not.toBeInTheDocument();
    expect(screen.queryByText(options[2])).not.toBeInTheDocument();

    await userEvent.click(screen.getByPlaceholderText(`Search in ${title}`));

    await waitFor(() => {
      expect(screen.getByText(options[0])).toBeInTheDocument();
      expect(screen.getByText(options[1])).toBeInTheDocument();
      expect(screen.getByText(options[2])).toBeInTheDocument();
    });
  });

  it('Updates context with the initial value', async () => {
    await renderWithEffects(
      <TestApiProvider
        apis={[
          [configApiRef, configApiMock],
          [searchApiRef, searchApiMock],
        ]}
      >
        <SearchAutocomplete value={options[0]} options={options} />
      </TestApiProvider>,
    );

    await waitFor(() => {
      expect(query).toHaveBeenCalledWith({
        filters: {},
        pageCursor: undefined,
        term: options[0],
        types: [],
      });
    });
  });

  it('Updates context when value is cleared', async () => {
    await renderWithEffects(
      <TestApiProvider
        apis={[
          [configApiRef, configApiMock],
          [searchApiRef, searchApiMock],
        ]}
      >
        <SearchAutocomplete value={options[0]} options={options} />
      </TestApiProvider>,
    );

    await waitFor(() => {
      expect(query).toHaveBeenCalledWith({
        filters: {},
        pageCursor: undefined,
        term: options[0],
        types: [],
      });
    });

    await userEvent.click(screen.getByLabelText('Clear'));

    await waitFor(() => {
      expect(query).toHaveBeenCalledWith({
        filters: {},
        pageCursor: undefined,
        term: '',
        types: [],
      });
    });
  });

  it('Updates context when an option is select', async () => {
    await renderWithEffects(
      <TestApiProvider
        apis={[
          [configApiRef, configApiMock],
          [searchApiRef, searchApiMock],
        ]}
      >
        <SearchAutocomplete options={options} />
      </TestApiProvider>,
    );

    await userEvent.click(screen.getByPlaceholderText(`Search in ${title}`));

    await userEvent.click(screen.getByText(options[0]));

    await waitFor(() => {
      expect(query).toHaveBeenCalledWith({
        filters: {},
        pageCursor: undefined,
        term: options[0],
        types: [],
      });
    });
  });

  it('Shows a circular progress when loading options', async () => {
    await renderWithEffects(
      <TestApiProvider
        apis={[
          [configApiRef, configApiMock],
          [searchApiRef, searchApiMock],
        ]}
      >
        <SearchAutocomplete options={options} loading />
      </TestApiProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('search-autocomplete-progressbar'),
      ).toBeInTheDocument();
    });
  });

  it('Uses the default search autocomplete option component', async () => {
    await renderWithEffects(
      <TestApiProvider
        apis={[
          [configApiRef, configApiMock],
          [searchApiRef, searchApiMock],
        ]}
      >
        <SearchAutocomplete
          options={[
            {
              title: 'hello-world',
              text: 'Hello World example for gRPC',
            },
            {
              title: 'petstore',
              text: 'The petstore API',
            },
            {
              title: 'spotify',
              text: 'The Spotify web API',
            },
          ]}
          getOptionLabel={option => option.title}
          renderOption={option => (
            <SearchAutocompleteDefaultOption
              icon={<LabelIcon titleAccess="Option icon" />}
              primaryText={option.title}
              secondaryText={option.text}
            />
          )}
        />
      </TestApiProvider>,
    );

    await userEvent.click(screen.getByPlaceholderText(`Search in ${title}`));

    await waitFor(() => {
      expect(screen.getAllByTitle('Option icon')).toHaveLength(3);
      expect(screen.getByText('hello-world')).toBeInTheDocument();
      expect(
        screen.getByText('Hello World example for gRPC'),
      ).toBeInTheDocument();
    });
  });
});
