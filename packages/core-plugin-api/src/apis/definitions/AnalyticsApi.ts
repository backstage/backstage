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

import { ApiRef, createApiRef } from '../system';
import { AnalyticsContextValue } from '../../analytics/types';

/**
 * Represents an event worth tracking in an analytics system that could inform
 * how users of a Backstage instance are using its features.
 * @public
 */
export type AnalyticsEvent = {
  /**
   * A string that identifies the event being tracked by the type of action the
   * event represents. Be careful not to encode extra metadata in this string
   * that should instead be placed in the Analytics Context or attributes.
   * Examples include:
   *
   * - view
   * - click
   * - filter
   * - search
   * - hover
   * - scroll
   */
  action: string;

  /**
   * A string that uniquely identifies the object that the action is being
   * taken on. Examples include:
   *
   * - The path of the page viewed
   * - The url of the link clicked
   * - The value that was filtered by
   * - The text that was searched for
   */
  subject: string;

  /**
   * An optional numeric value relevant to the event that could be aggregated
   * by analytics tools. Examples include:
   *
   * - The index or position of the clicked element in an ordered list
   * - The percentage of an element that has been scrolled through
   * - The amount of time that has elapsed since a fixed point
   * - A satisfaction score on a fixed scale
   */
  value?: number;

  /**
   * Optional, additional attributes (representing dimensions or metrics)
   * specific to the event that could be forwarded on to analytics systems.
   */
  attributes?: AnalyticsEventAttributes;

  /**
   * Contextual metadata relating to where the event was captured and by whom.
   * This could include information about the route, plugin, or extension in
   * which an event was captured.
   */
  context: AnalyticsContextValue;
};

/**
 * A structure allowing other arbitrary metadata to be provided by analytics
 * event emitters.
 * @public
 */
export type AnalyticsEventAttributes = {
  [attribute in string]: string | boolean | number;
};

/**
 * Represents a tracker with methods that can be called to track events in a
 * configured analytics service.
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
 * The Analytics API is used to track user behavior in a Backstage instance.
 *
 * To instrument your App or Plugin, retrieve an analytics tracker using the
 * useAnalytics() hook. This will return a pre-configured AnalyticsTracker
 * with relevant methods for instrumentation.
 * @public
 */
export type AnalyticsApi = {
  /**
   * Primary event handler responsible for compiling and forwarding events to
   * an analytics system.
   */
  captureEvent(event: AnalyticsEvent): void;
};

/**
 * Provides access to the AnalyticsApi.
 * @public
 */
export const analyticsApiRef: ApiRef<AnalyticsApi> = createApiRef({
  id: 'core.analytics',
});
