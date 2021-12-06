/*
 * Copyright 2021 Spotify AB
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
import { Button } from '@material-ui/core';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import { wrapInTestApp } from '@backstage/test-utils';
import { SearchModal } from '../index';
import { useSearch, SearchContextProvider } from '../SearchContext';
import { searchApiRef } from '../../apis';
import { rootRouteRef } from '../../plugin';

const mockSearchApi = {
  query: () =>
    Promise.resolve({
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
    }),
};

const apiRegistry = () => ApiRegistry.from([[searchApiRef, mockSearchApi]]);

export default {
  title: 'Plugins/Search/SearchModal',
  component: SearchModal,
  decorators: [
    (Story: ComponentType<{}>) =>
      wrapInTestApp(
        <>
          <ApiProvider apis={apiRegistry()}>
            <SearchContextProvider>
              <Story />
            </SearchContextProvider>
          </ApiProvider>
        </>,
        { mountedRoutes: { '/search': rootRouteRef } },
      ),
  ],
};

export const Default = () => {
  const { open, toggleModal } = useSearch();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal open={open} toggleModal={toggleModal} />
    </>
  );
};
