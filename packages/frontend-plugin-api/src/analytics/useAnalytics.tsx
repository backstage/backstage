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

import { useApi } from '@backstage/core-plugin-api';
import { useAnalyticsContext } from './AnalyticsContext';
import { analyticsApiRef, AnalyticsTracker, AnalyticsApi } from '../apis';
import { useRef } from 'react';
import { Tracker } from './Tracker';

function useAnalyticsApi(): AnalyticsApi {
  try {
    return useApi(analyticsApiRef);
  } catch (error) {
    if (error.name === 'NotImplementedError') {
      return { captureEvent: () => {} };
    }
    throw error;
  }
}

/**
 * Gets a pre-configured analytics tracker.
 *
 * @public
 */
export function useAnalytics(): AnalyticsTracker {
  const trackerRef = useRef<Tracker | null>(null);
  const context = useAnalyticsContext();
  // Our goal is to make this API truly optional for any/all consuming code
  // (including tests). This hook runs last to ensure hook order is, as much as
  // possible, maintained.
  const analyticsApi = useAnalyticsApi();

  function getTracker(): Tracker {
    if (trackerRef.current === null) {
      trackerRef.current = new Tracker(analyticsApi);
    }
    return trackerRef.current;
  }

  const tracker = getTracker();
  // this is not ideal, but it allows to memoize the tracker
  // without explicitly set the context as dependency.
  tracker.setContext(context);

  return tracker;
}
