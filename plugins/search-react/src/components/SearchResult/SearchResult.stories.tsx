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

import React, { ComponentType, PropsWithChildren } from 'react';

import { List, ListItem } from '@material-ui/core';
import DefaultIcon from '@material-ui/icons/InsertDriveFile';
import CustomIcon from '@material-ui/icons/NoteAdd';

import { Link } from '@backstage/core-components';
import { TestApiProvider, wrapInTestApp } from '@backstage/test-utils';
import { createPlugin } from '@backstage/core-plugin-api';
import { SearchDocument } from '@backstage/plugin-search-common';

import { SearchContextProvider } from '../../context';
import { searchApiRef, MockSearchApi } from '../../api';
import { createSearchResultListItemExtension } from '../../extensions';

import { SearchResultListLayout } from '../SearchResultList';
import { SearchResultGroupLayout } from '../SearchResultGroup';
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

const searchApiMock = new MockSearchApi(mockResults);

export default {
  title: 'Plugins/Search/SearchResult',
  component: SearchResult,
  decorators: [
    (Story: ComponentType<PropsWithChildren<{}>>) =>
      wrapInTestApp(
        <TestApiProvider apis={[[searchApiRef, searchApiMock]]}>
          <SearchContextProvider>
            <Story />
          </SearchContextProvider>
        </TestApiProvider>,
      ),
  ],
};

const CustomResultListItem = (props: { result: SearchDocument }) => {
  const { result } = props;
  return (
    <ListItem>
      <Link to={result.location}>
        {result.title} - {result.text}
      </Link>
    </ListItem>
  );
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
                  <CustomResultListItem
                    key={document.location}
                    result={document}
                  />
                );
              default:
                return (
                  <DefaultResultListItem
                    key={document.location}
                    result={document}
                  />
                );
            }
          })}
        </List>
      )}
    </SearchResult>
  );
};

export const WithQuery = () => {
  const query = {
    term: 'documentation',
  };

  return (
    <SearchResult query={query}>
      {({ results }) => (
        <List>
          {results.map(({ type, document }) => {
            switch (type) {
              case 'custom-result-item':
                return (
                  <CustomResultListItem
                    key={document.location}
                    result={document}
                  />
                );
              default:
                return (
                  <DefaultResultListItem
                    key={document.location}
                    result={document}
                  />
                );
            }
          })}
        </List>
      )}
    </SearchResult>
  );
};

export const ListLayout = () => {
  return (
    <SearchResult>
      {({ results }) => (
        <SearchResultListLayout
          resultItems={results}
          renderResultItem={({ type, document }) => {
            switch (type) {
              case 'custom-result-item':
                return (
                  <CustomResultListItem
                    key={document.location}
                    result={document}
                  />
                );
              default:
                return (
                  <DefaultResultListItem
                    key={document.location}
                    result={document}
                  />
                );
            }
          }}
        />
      )}
    </SearchResult>
  );
};

export const GroupLayout = () => {
  return (
    <SearchResult>
      {({ results }) => (
        <>
          <SearchResultGroupLayout
            icon={<CustomIcon />}
            title="Custom"
            link="See all custom results"
            resultItems={results.filter(
              ({ type }) => type === 'custom-result-item',
            )}
            renderResultItem={({ document }) => (
              <CustomResultListItem key={document.location} result={document} />
            )}
          />
          <SearchResultGroupLayout
            icon={<DefaultIcon />}
            title="Default"
            resultItems={results.filter(
              ({ type }) => type !== 'custom-result-item',
            )}
            renderResultItem={({ document }) => (
              <DefaultResultListItem
                key={document.location}
                result={document}
              />
            )}
          />
        </>
      )}
    </SearchResult>
  );
};

export const WithCustomNoResultsComponent = () => {
  return (
    <SearchResult noResultsComponent={<>No results were found</>}>
      {({ results }) => (
        <List>
          {results.map(({ type, document }) => {
            switch (type) {
              case 'custom-result-item':
                return (
                  <CustomResultListItem
                    key={document.location}
                    result={document}
                  />
                );
              default:
                return (
                  <DefaultResultListItem
                    key={document.location}
                    result={document}
                  />
                );
            }
          })}
        </List>
      )}
    </SearchResult>
  );
};

export const UsingSearchResultItemExtensions = () => {
  const plugin = createPlugin({ id: 'plugin' });
  const DefaultResultItem = plugin.provide(
    createSearchResultListItemExtension({
      name: 'DefaultResultListItem',
      component: async () => DefaultResultListItem,
    }),
  );
  return (
    <SearchResult>
      <DefaultResultItem />
    </SearchResult>
  );
};
