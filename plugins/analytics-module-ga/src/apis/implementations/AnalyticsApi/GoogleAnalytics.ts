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

import ReactGA from 'react-ga';
import {
  AnalyticsApi,
  AnalyticsContextValue,
  AnalyticsEventAttributes,
  AnalyticsEvent,
} from '@backstage/core-plugin-api';
import { Config } from '@backstage/config';

type CustomDimensionOrMetricConfig = {
  type: 'dimension' | 'metric';
  index: number;
  source: 'context' | 'attributes';
  key: string;
};

/**
 * Google Analytics API provider for the Backstage Analytics API.
 */
export class GoogleAnalytics implements AnalyticsApi {
  private readonly cdmConfig: CustomDimensionOrMetricConfig[];

  /**
   * Instantiate the implementation and initialize ReactGA.
   */
  private constructor({
    cdmConfig,
    trackingId,
    testMode,
    debug,
  }: {
    cdmConfig: CustomDimensionOrMetricConfig[];
    trackingId: string;
    testMode: boolean;
    debug: boolean;
  }) {
    this.cdmConfig = cdmConfig;

    // Initialize Google Analytics.
    ReactGA.initialize(trackingId, { testMode, debug, titleCase: false });
  }

  /**
   * Instantiate a fully configured GA Analytics API implementation.
   */
  static fromConfig(config: Config) {
    // Get all necessary configuration.
    const trackingId = config.getString('app.analytics.ga.trackingId');
    const debug = config.getOptionalBoolean('app.analytics.ga.debug') ?? false;
    const testMode =
      config.getOptionalBoolean('app.analytics.ga.testMode') ?? false;
    const cdmConfig =
      config
        .getOptionalConfigArray('app.analytics.ga.customDimensionsMetrics')
        ?.map(c => {
          return {
            type: c.getString('type') as CustomDimensionOrMetricConfig['type'],
            index: c.getNumber('index'),
            source: c.getString(
              'source',
            ) as CustomDimensionOrMetricConfig['source'],
            key: c.getString('key'),
          };
        }) ?? [];

    // Return an implementation instance.
    return new GoogleAnalytics({
      trackingId,
      cdmConfig,
      testMode,
      debug,
    });
  }

  /**
   * Primary event capture implementation. Handles core navigate event as a
   * pageview and the rest as custom events. All custom dimensions/metrics are
   * applied as they should be (set on pageview, merged object on events).
   */
  captureEvent({
    context,
    action,
    subject,
    value,
    attributes,
  }: AnalyticsEvent) {
    const customMetadata = this.getCustomDimensionMetrics(context, attributes);

    if (action === 'navigate' && context.extension === 'App') {
      // Set any/all custom dimensions.
      if (Object.keys(customMetadata).length) {
        ReactGA.set(customMetadata);
      }

      ReactGA.pageview(subject);
      return;
    }

    ReactGA.event({
      category: context.extension || 'App',
      action,
      label: subject,
      value,
      ...customMetadata,
    });
  }

  /**
   * Returns an object of dimensions/metrics given an Analytics Context and an
   * Event Attributes, e.g. { dimension1: "some value", metric8: 42 }
   */
  private getCustomDimensionMetrics(
    context: AnalyticsContextValue,
    attributes: AnalyticsEventAttributes = {},
  ) {
    const customDimensionsMetrics: { [x: string]: string | number | boolean } =
      {};

    this.cdmConfig.forEach(config => {
      const value =
        config.source === 'context'
          ? context[config.key]
          : attributes[config.key];

      // Never pass a non-numeric value on a metric.
      if (config.type === 'metric' && typeof value !== 'number') {
        return;
      }

      // Only set defined values.
      if (value !== undefined) {
        customDimensionsMetrics[`${config.type}${config.index}`] = value;
      }
    });

    return customDimensionsMetrics;
  }
}
