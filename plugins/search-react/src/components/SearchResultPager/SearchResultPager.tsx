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

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ShadcnButton as Button } from '@backstage/core-components';

import { useSearch } from '../../context';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { searchReactTranslationRef } from '../../translation';

/**
 * @public
 */
export const SearchResultPager = () => {
  const { fetchNextPage, fetchPreviousPage } = useSearch();
  const { t } = useTranslationRef(searchReactTranslationRef);

  if (!fetchNextPage && !fetchPreviousPage) {
    return <></>;
  }

  return (
    <nav
      aria-label="pagination navigation"
      className="flex justify-between gap-4 my-4"
    >
      <Button
        variant="ghost"
        aria-label="previous page"
        disabled={!fetchPreviousPage}
        onClick={fetchPreviousPage}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        {t('searchResultPager.previous')}
      </Button>

      <Button
        variant="ghost"
        aria-label="next page"
        disabled={!fetchNextPage}
        onClick={fetchNextPage}
        className="ml-auto"
      >
        {t('searchResultPager.next')}
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </nav>
  );
};
