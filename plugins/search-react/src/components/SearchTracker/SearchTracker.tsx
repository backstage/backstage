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

import React, { useEffect } from 'react';
import { useAnalytics } from '@backstage/core-plugin-api';
import { useSearch } from '../../context';
import usePrevious from 'react-use/lib/usePrevious';

/**
 * Capture search event on term change.
 */
export const TrackSearch = ({ children }: { children: React.ReactChild }) => {
  const useHasChanged = (value: any) => {
    const previousVal = usePrevious(value);
    return previousVal !== value;
  };

  const analytics = useAnalytics();
  const { term, result } = useSearch();

  const numberOfResults = result.value?.numberOfResults ?? undefined;

  // Stops the analtyics event from firing before the new search engine response is returned
  const hasStartedLoading = useHasChanged(result.loading);
  const hasFinishedLoading = hasStartedLoading && !result.loading;

  useEffect(() => {
    if (term && hasFinishedLoading) {
      // Capture analytics search event with search term and numberOfResults (provided as value)
      analytics.captureEvent('search', term, {
        value: numberOfResults,
      });
    }
  }, [analytics, term, numberOfResults, hasFinishedLoading]);

  return <>{children}</>;
};
