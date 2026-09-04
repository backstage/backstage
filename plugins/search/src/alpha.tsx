/*
 * Copyright 2023 The Backstage Authors
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

import SearchIcon from '@material-ui/icons/Search';
import { z } from 'zod/v4';

import { discoveryApiRef, fetchApiRef } from '@backstage/core-plugin-api';

import {
  createFrontendPlugin,
  ApiBlueprint,
  createExtensionInput,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';

import { searchApiRef } from '@backstage/plugin-search-react';
import {
  SearchResultListItemBlueprint,
  SearchFilterResultTypeBlueprint,
  SearchFilterBlueprint,
} from '@backstage/plugin-search-react/alpha';
import { HomePageWidgetBlueprint } from '@backstage/plugin-home-react/alpha';

import { rootRouteRef } from './plugin';
import { SearchClient } from './apis';

/** @alpha */
export const searchApi = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: searchApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) =>
        new SearchClient({ discoveryApi, fetchApi }),
    }),
});

/** @alpha */
export const searchPage = PageBlueprint.makeWithOverrides({
  configSchema: {
    noTrack: z.boolean().default(false),
  },
  inputs: {
    items: createExtensionInput([SearchResultListItemBlueprint.dataRefs.item]),
    resultTypes: createExtensionInput([
      SearchFilterResultTypeBlueprint.dataRefs.resultType,
    ]),
    searchFilters: createExtensionInput([
      SearchFilterBlueprint.dataRefs.searchFilters,
    ]),
  },
  factory(originalFactory, { config, inputs }) {
    return originalFactory({
      path: '/search',
      routeRef: rootRouteRef,
      title: 'Search',
      icon: <SearchIcon fontSize="inherit" />,
      loader: async () => {
        const { SearchPage } = await import('./alpha/SearchPage');
        const items = inputs.items.map(item =>
          item.get(SearchResultListItemBlueprint.dataRefs.item),
        );
        const resultTypes = inputs.resultTypes.map(item =>
          item.get(SearchFilterResultTypeBlueprint.dataRefs.resultType),
        );
        const searchFilters = inputs.searchFilters.map(
          item =>
            item.get(SearchFilterBlueprint.dataRefs.searchFilters).component,
        );
        return (
          <SearchPage
            noTrack={config.noTrack}
            items={items}
            resultTypes={resultTypes}
            searchFilters={searchFilters}
          />
        );
      },
    });
  },
});

const homePageSearchBarWidget = HomePageWidgetBlueprint.make({
  name: 'search-bar',
  params: {
    name: 'HomePageSearchBar',
    title: 'Search',
    description: 'A search bar that navigates to the search page on submit',
    components: () =>
      import('./components/HomePageComponent').then(m => ({
        Content: m.HomePageSearchBar,
      })),
    componentProps: {
      Renderer: ({
        Content: SearchContent,
      }: {
        Content: () => JSX.Element;
      }) => <SearchContent />,
    },
  },
});

/** @alpha */
export default createFrontendPlugin({
  pluginId: 'search',
  title: 'Search',
  icon: <SearchIcon fontSize="inherit" />,
  info: { packageJson: () => import('../package.json') },
  extensions: [searchApi, searchPage, homePageSearchBarWidget],
  routes: {
    root: rootRouteRef,
  },
});

import { searchTranslationRef as _searchTranslationRef } from './translation';

/**
 * @alpha
 * @deprecated Import from `@backstage/plugin-search` instead.
 */
export const searchTranslationRef = _searchTranslationRef;
