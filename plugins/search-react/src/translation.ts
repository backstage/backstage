/*
 * Copyright 2025 The Backstage Authors
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

import { createTranslationRef } from '@backstage/core-plugin-api/alpha';

/**
 * @alpha
 */
export const searchReactTranslationRef = createTranslationRef({
  id: 'search-react',
  messages: {
    searchBar: {
      title: 'Search',
      placeholder: 'Search in {{org}}',
      clearButtonTitle: 'Clear',
    },
    searchFilter: {
      allOptionTitle: 'All',
    },
    searchPagination: {
      limitLabel: 'Results per page:',
      limitText: 'of {{num}}',
    },
    noResultsDescription: 'Sorry, no results were found',
    searchResultGroup: {
      linkTitle: 'See All',
      addFilterButtonTitle: 'Add filter',
    },
    searchResultPager: {
      previous: 'Previous',
      next: 'Next',
    },
  },
});
