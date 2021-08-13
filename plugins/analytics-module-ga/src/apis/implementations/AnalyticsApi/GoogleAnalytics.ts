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
  AnalyticsDomainValue,
  AnalyticsEventContext,
  DomainDecoratedAnalyticsEvent,
} from '@backstage/core-plugin-api';
import { Config } from '@backstage/config';

type CDM = {
  type: 'dimension' | 'metric';
  index: number;
  source: 'domain' | 'context';
  attribute: string;
};

/**
 * Type guard for emptiness check in array filter.
 */
function notEmpty<T>(value: T | undefined): value is T {
  return value !== undefined;
}

/**
 * Google Analytics API provider for the Backstage Analytics API.
 */
export class GoogleAnalytics implements AnalyticsApi {
  private readonly cdmConfig: CDM[];

  /**
   * Instantiate the implementation and initialize ReactGA.
   */
  private constructor({
    cdmConfig,
    trackingId,
    testMode,
    debug,
  }: {
    cdmConfig: CDM[];
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
    const debug = !!config.getOptionalBoolean('app.analytics.ga.debug');
    const testMode = !!config.getOptionalBoolean('app.analytics.ga.testMode');
    const cdmConfig =
      config
        .getOptionalConfigArray('app.analytics.ga.customDimensionsMetrics')
        ?.map(c => {
          return {
            type: c.getString('type') as CDM['type'],
            index: c.getNumber('index'),
            source: c.getString('source') as CDM['source'],
            attribute: c.getString('attribute'),
          };
        }) || [];

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
    domain,
    verb,
    noun,
    value,
    context,
  }: DomainDecoratedAnalyticsEvent) {
    const customMetadata = this.getCustomDimensionMetrics(domain, context);

    if (verb === 'navigate' && domain?.componentName === 'App') {
      // Set any/all custom dimensions.
      if (Object.keys(customMetadata).length) {
        ReactGA.set(customMetadata);
      }

      ReactGA.pageview(noun);
      return;
    }

    ReactGA.event({
      category: domain.componentName || 'App',
      action: verb,
      label: noun,
      value,
      ...customMetadata,
    });
  }

  /**
   * Returns an object of dimensions/metrics given an Analytics Domain and an
   * Event Context, e.g. { dimension1: "some value", metric8: 42 }
   */
  private getCustomDimensionMetrics(
    domain: AnalyticsDomainValue,
    context: AnalyticsEventContext = {},
  ) {
    const dataArray = this.cdmConfig
      .map(cdm => {
        const value =
          cdm.source === 'domain'
            ? domain[cdm.attribute]
            : context[cdm.attribute];

        // Never pass a non-numeric value on a metric.
        if (cdm.type === 'metric' && typeof value !== 'number') {
          return undefined;
        }

        return value !== undefined
          ? {
              [`${cdm.type}${cdm.index}`]: value,
            }
          : undefined;
      })
      .filter(notEmpty);

    return dataArray.length
      ? dataArray.reduce((result, cd) => {
          return Object.assign(result, cd);
        })
      : {};
  }
}
