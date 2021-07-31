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
  AnalyticsTracker,
  AnalyticsDomainValue,
  AnalyticsEventContext,
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

export class GoogleAnalyticsImplementation implements AnalyticsApi {
  private readonly cdmConfig: CDM[];

  private constructor({ cdmConfig }: { cdmConfig: CDM[] }) {
    this.cdmConfig = cdmConfig;
  }

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

    // Initialize Google Analytics.
    ReactGA.initialize(trackingId, { testMode, debug });

    // Return an implementation instance.
    return new GoogleAnalyticsImplementation({
      cdmConfig,
    });
  }

  getDecoratedTracker({
    domain,
  }: {
    domain: AnalyticsDomainValue;
  }): AnalyticsTracker {
    return {
      captureEvent: (...args) => this.captureEvent(domain, ...args),
    };
  }

  private captureEvent(
    domain: AnalyticsDomainValue,
    verb: string,
    noun: string,
    value?: number,
    context?: AnalyticsEventContext,
  ) {
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
