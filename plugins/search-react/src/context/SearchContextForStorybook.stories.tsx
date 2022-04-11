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
import { ApiProvider } from '@backstage/core-app-api';
import { SearchResultSet } from '@backstage/plugin-search-common';
import { TestApiRegistry } from '@backstage/test-utils';
import React, { ComponentProps, PropsWithChildren } from 'react';
import { searchApiRef } from '../api';
import { SearchContextProvider as RealSearchContextProvider } from './SearchContext';

type QueryResultProps = {
  mockedResults?: SearchResultSet;
};

/**
 * Utility context provider only for use in Storybook stories. You should use
 * the real `<SearchContextProvider>` exported by `@backstage/plugin-search-react` in
 * your app instead of this! In some cases (like the search page) it may
 * already be provided on your behalf.
 */
export const SearchContextProvider = (
  props: ComponentProps<typeof RealSearchContextProvider> & QueryResultProps,
) => {
  return (
    <SearchApiProvider {...props}>
      <RealSearchContextProvider children={props.children} />
    </SearchApiProvider>
  );
};

/**
 * Utility api provider only for use in Storybook stories.
 *
 */
export function SearchApiProvider(props: PropsWithChildren<QueryResultProps>) {
  const { mockedResults, children } = props;
  const query: any = () => Promise.resolve(mockedResults || {});
  const apiRegistry = TestApiRegistry.from([searchApiRef, { query }]);
  return <ApiProvider apis={apiRegistry} children={children} />;
}
