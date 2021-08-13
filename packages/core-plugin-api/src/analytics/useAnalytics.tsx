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

import { useAnalyticsDomain } from './AnalyticsDomain';
import {
  analyticsApiRef,
  AnalyticsTracker,
} from '../apis/definitions/AnalyticsApi';
import { useApi } from '../apis';

function useTracker(): AnalyticsTracker {
  const analyticsApi = useApi(analyticsApiRef);
  const domain = useAnalyticsDomain();
  return {
    captureEvent: (verb, noun, value, context) => {
      try {
        analyticsApi.captureEvent({
          verb,
          noun,
          value,
          context,
          domain,
        });
      } catch {
        // Just don't throw on an instrumentation problem.
      }
    },
  };
}

/**
 * Get a pre-configured analytics tracker.
 */
export function useAnalytics(): AnalyticsTracker {
  // Return a no-op tracker if no implementation for the Analytics API is
  // available. Having no default Analytics API implementation enables simple
  // provider installation via plugin instantiation.
  try {
    return useTracker();
  } catch {
    return {
      captureEvent: () => {},
    };
  }
}
