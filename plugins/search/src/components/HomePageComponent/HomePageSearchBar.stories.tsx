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

import { rootRouteRef, HomePageSearchBar } from '../../plugin';
import { searchApiRef } from '@backstage/plugin-search-react';
import { wrapInTestApp, TestApiProvider } from '@backstage/test-utils';
import { ComponentType, PropsWithChildren } from 'react';

export default {
  title: 'Plugins/Home/Components/SearchBar',
  decorators: [
    (Story: ComponentType<PropsWithChildren<{}>>) =>
      wrapInTestApp(
        <>
          <TestApiProvider
            apis={[
              [searchApiRef, { query: () => Promise.resolve({ results: [] }) }],
            ]}
          >
            <Story />
          </TestApiProvider>
        </>,
        {
          mountedRoutes: { '/hello-search': rootRouteRef },
        },
      ),
  ],
  tags: ['!manifest'],
};

export const Default = () => {
  return (
    <div className="grid place-items-center gap-6">
      <div className="flex w-full items-center">
        <HomePageSearchBar placeholder="Search" />
      </div>
    </div>
  );
};

export const CustomStyles = () => {
  return (
    <div className="grid place-items-center gap-6">
      <div className="flex w-full items-center">
        <HomePageSearchBar
          className="flex max-w-[60vw] bg-[var(--background)] shadow-sm py-2 rounded-full mx-auto border-none"
          placeholder="Search"
        />
      </div>
    </div>
  );
};
