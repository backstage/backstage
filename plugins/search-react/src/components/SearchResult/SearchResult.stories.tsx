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

import React, { ComponentType } from 'react';
import { List, ListItem } from '@material-ui/core';
import { MemoryRouter } from 'react-router';

import { Link } from '@backstage/core-components';
import { TestApiProvider } from '@backstage/test-utils';

import { searchApiRef, MockSearchApi } from '../../api';
import { SearchContextProvider } from '../../context';
import { DefaultResultListItem } from '../DefaultResultListItem';
import { SearchResult } from './SearchResult';

const mockResults = {
  results: [
    {
      type: 'custom-result-item',
      document: {
        location: 'search/search-result-1',
        title: 'Search Result 1',
        text: 'some text from the search result',
      },
    },
    {
      type: 'no-custom-result-item',
      document: {
        location: 'search/search-result-2',
        title: 'Search Result 2',
        text: 'some text from the search result',
      },
    },
    {
      type: 'no-custom-result-item',
      document: {
        location: 'search/search-result-3',
        title: 'Search Result 3',
        text: 'some text from the search result',
      },
    },
  ],
};

export default {
  title: 'Plugins/Search/SearchResult',
  component: SearchResult,
  decorators: [
    (Story: ComponentType<{}>) => (
      <MemoryRouter>
        <TestApiProvider
          apis={[[searchApiRef, new MockSearchApi(mockResults)]]}
        >
          <SearchContextProvider>
            <Story />
          </SearchContextProvider>
        </TestApiProvider>
      </MemoryRouter>
    ),
  ],
};

export const Default = () => {
  return (
    <SearchResult>
      {({ results }) => (
        <List>
          {results.map(({ type, document }) => {
            switch (type) {
              case 'custom-result-item':
                return (
                  <DefaultResultListItem
                    key={document.location}
                    result={document}
                  />
                );
              default:
                return (
                  <ListItem>
                    <Link to={document.location}>
                      {document.title} - {document.text}
                    </Link>
                  </ListItem>
                );
            }
          })}
        </List>
      )}
    </SearchResult>
  );
};
