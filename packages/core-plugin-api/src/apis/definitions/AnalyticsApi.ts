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
import { Observable } from '../../types';
import { AnalyticsDomainValues } from '../../analytics/types';

/**
 * Represents an event worth tracking in an analytics system that could inform
 * how users of a Backstage instance are using its features.
 *
 * Note that attributes about the Backstage user or about the plugin tracking
 * the event are inferred and captured separately on the Analytics Domain and
 * do not need to be passed on the event itself.
 */
export type AnalyticsEvent = {
  /**
   * A string that identifies the event being tracked by the type of action the
   * event represents. Examples include:
   *
   * - view
   * - click
   * - filter
   * - search
   * - hover
   * - scroll
   */
  verb: string;

  /**
   * A string that uniquely identifies the object that the verb or action is
   * being taken on. Examples include:
   *
   * - The path of the page viewed
   * - The url of the link clicked
   * - The value that was filtered by
   * - The text that was searched for
   */
  noun: string;

  /**
   * An optional numeric value relevant to the event that could be aggregated
   * by analytics tools. Examples include,
   *
   * - The index or position of the clicked element in an ordered list
   * - The percentage of an element that has been scrolled through
   * - The amount of time that has elapsed since a fixed point
   */
  value?: number;

  /**
   * Optional context with any additional dimensions or metrics that could be
   * forwarded on to analytics systems.
   */
  context?: AnalyticsEventContext;
};

/**
 * An analytics event combined with domain attributes.
 */
export type DomainDecoratedAnalyticsEvent = AnalyticsEvent & {
  /**
   * Domain metadata relating to where the event was captured and by whom. This
   * could include information about the route, plugin, or component in which
   * an event was captured.
   */
  domain: AnalyticsDomainValues;
};

type ExtraDimensions = Record<string, string | boolean>;
type ExtraMetrics = Record<string, number>;

/**
 * A structure allowing other arbitrary metadata to be provided by analytics
 * event emitters.
 */
export type AnalyticsEventContext = ExtraDimensions & ExtraMetrics;

/**
 * Represents a tracker with methods that can be called to track events in a
 * configured analytics service.
 */
export type AnalyticsTracker = {
  captureEvent: (
    verb: string,
    noun: string,
    value?: number,
    context?: AnalyticsEventContext,
  ) => void;
};

/**
 * The Analytics API is used to track user behavior in Backstage.
 *
 * To instrument your App or Plugin, retrieve an analytics tracker using the
 * useAnalytics() hook. This will return a pre-configured AnalyticsTracker
 * with relevant methods for instrumentation.
 */
export type AnalyticsApi = {
  /**
   * Retrieves a tracker for the given analytics domain.
   */
  getTrackerForDomain(domain: AnalyticsDomainValues): AnalyticsTracker;

  /**
   * Observe domain-aware analytics events tracked throughout the application.
   */
  event$(): Observable<DomainDecoratedAnalyticsEvent>;
};

export const analyticsApiRef: ApiRef<AnalyticsApi> = createApiRef({
  id: 'core.analytics',
});
