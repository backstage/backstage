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
import {
  DefaultResultListItem,
  MockSearchApi,
  searchApiRef,
  SearchBar,
  SearchContextProvider,
  SearchResult,
  SearchResultPager,
} from '@backstage/plugin-search-react';
import { TestApiProvider, wrapInTestApp } from '@backstage/test-utils';
import { ShadcnButton as Button } from '@backstage/core-components';
import { X } from 'lucide-react';
import { ComponentType, PropsWithChildren } from 'react';
import { rootRouteRef } from '../../plugin';
import { SearchType } from '../SearchType';
import { SearchModal } from './SearchModal';
import { useSearchModal } from './useSearchModal';

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
  title: 'Plugins/Search/SearchModal',
  component: SearchModal,
  decorators: [
    (Story: ComponentType<PropsWithChildren<{}>>) =>
      wrapInTestApp(
        <TestApiProvider
          apis={[[searchApiRef, new MockSearchApi(mockResults)]]}
        >
          <SearchContextProvider>
            <Story />
          </SearchContextProvider>
        </TestApiProvider>,

        { mountedRoutes: { '/search': rootRouteRef } },
      ),
  ],
  tags: ['!manifest'],
};

export const Default = () => {
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button onClick={toggleModal}>Toggle Search Modal</Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>
  );
};

export const CustomModal = () => {
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button onClick={toggleModal}>Toggle Custom Search Modal</Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => (
          <>
            <div className="grid items-center grid-cols-[1fr_auto] gap-2 p-6 pb-0">
              <SearchBar className="flex-1" />
              <Button
                variant="ghost"
                size="icon"
                aria-label="close"
                onClick={toggleModal}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-6">
              <div className="flex flex-col gap-4">
                <div>
                  <SearchType.Tabs
                    defaultValue=""
                    types={[
                      {
                        value: 'custom-result-item',
                        name: 'Custom Item',
                      },
                      {
                        value: 'no-custom-result-item',
                        name: 'No Custom Item',
                      },
                    ]}
                  />
                </div>
                <div>
                  <SearchResult>
                    {({ results }) => (
                      <ul className="divide-y divide-border">
                        {results.map(({ document }) => (
                          <div
                            role="button"
                            tabIndex={0}
                            key={`${document.location}-btn`}
                            onClick={toggleModal}
                            onKeyPress={toggleModal}
                          >
                            <DefaultResultListItem
                              key={document.location}
                              result={document}
                            />
                          </div>
                        ))}
                      </ul>
                    )}
                  </SearchResult>
                </div>
              </div>
            </div>
            <div className="px-6 py-2">
              <div className="w-full">
                <SearchResultPager />
              </div>
            </div>
          </>
        )}
      </SearchModal>
    </>
  );
};
