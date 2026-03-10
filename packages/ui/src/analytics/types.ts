/*
 * Copyright 2026 The Backstage Authors
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

/**
 * Key-value metadata attached to analytics events.
 * @public
 */
export type AnalyticsEventAttributes = {
  [key: string]: string | boolean | number;
};

/**
 * A generic interface for capturing analytics events. Consumers provide
 * an implementation via `BUIProvider` — this allows `@backstage/ui`
 * to fire analytics events without depending on any specific analytics
 * system. The signature intentionally matches Backstage's own
 * `AnalyticsTracker` so it can be wired through directly.
 * @public
 */
export type AnalyticsTracker = {
  captureEvent: (
    action: string,
    subject: string,
    options?: {
      value?: number;
      attributes?: AnalyticsEventAttributes;
    },
  ) => void;
};

/**
 * A hook function that returns an AnalyticsTracker.
 * Provided via context by the consumer (e.g. a Backstage app).
 * @public
 */
export type UseAnalyticsFn = () => AnalyticsTracker;
