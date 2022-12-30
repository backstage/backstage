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

import React, { useCallback } from 'react';

import { SearchContextProvider } from '@backstage/plugin-search-react';
import { useDrawer } from '@backstage/plugin-interactive-drawers';

import SearchIcon from '@material-ui/icons/Search';

import { TopItemFab } from '../../top-items/fab';

import { SearchPopOut } from './search-popout';

export function SearchFab() {
  const { showInteractiveDrawer } = useDrawer();

  const doSearch = useCallback(() => {
    showInteractiveDrawer({
      content: {
        component: () => (
          <SearchContextProvider>
            <SearchPopOut />
          </SearchContextProvider>
        ),
      },
      title: 'Search',
    });
  }, [showInteractiveDrawer]);

  return <TopItemFab icon={<SearchIcon />} title="Search" onClick={doSearch} />;
}
