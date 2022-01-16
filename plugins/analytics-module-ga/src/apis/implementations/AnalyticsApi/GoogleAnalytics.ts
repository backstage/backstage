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
import { EntityName, parseEntityRef } from '@backstage/catalog-model';
import {
  AnalyticsApi,
  AnalyticsContextValue,
  AnalyticsEventAttributes,
  AnalyticsEvent,
  IdentityApi,
} from '@backstage/core-plugin-api';
import { Config } from '@backstage/config';
import { DeferredCapture } from '../../../util';

type CustomDimensionOrMetricConfig = {
  type: 'dimension' | 'metric';
  index: number;
  source: 'context' | 'attributes';
  key: string;
};

/**
 * @public
 */
export type GoogleAnalyticsDependencies = {
  identity?: IdentityApi;
};

/**
 * Google Analytics API provider for the Backstage Analytics API.
 * @public
 */
export class GoogleAnalytics implements AnalyticsApi {
  private readonly cdmConfig: CustomDimensionOrMetricConfig[];
  private readonly capture: DeferredCapture;

  /**
   * Instantiate the implementation and initialize ReactGA.
   */
  private constructor(options: {
    identity?: IdentityApi;
    cdmConfig: CustomDimensionOrMetricConfig[];
    defer?: boolean;
    trackingId: string;
    scriptSrc?: string;
    testMode: boolean;
    debug: boolean;
  }) {
    const {
      cdmConfig,
      defer = false,
      trackingId,
      identity,
      scriptSrc,
      testMode,
      debug,
    } = options;

    this.cdmConfig = cdmConfig;
    this.capture = new DeferredCapture({ defer });

    // Initialize Google Analytics.
    ReactGA.initialize(trackingId, {
      testMode,
      debug,
      gaAddress: scriptSrc,
      titleCase: false,
    });

    // If IdentityApi was provided, set the user ID.
    if (identity) {
      this.setUserFrom(identity);
    }
  }

  /**
   * Instantiate a fully configured GA Analytics API implementation.
   */
  static fromConfig(config: Config, deps: GoogleAnalyticsDependencies = {}) {
    // Get all necessary configuration.
    const trackingId = config.getString('app.analytics.ga.trackingId');
    const scriptSrc = config.getOptionalString('app.analytics.ga.scriptSrc');
    const defer = config.getOptionalBoolean('app.analytics.ga.requireIdentity');
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

    if (defer && !deps.identity) {
      throw new Error(
        'Invalid config: identity API must be provided to deps when requireIdentity is set',
      );
    }

    // Return an implementation instance.
    return new GoogleAnalytics({
      ...deps,
      defer,
      trackingId,
      scriptSrc,
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
  captureEvent(event: AnalyticsEvent) {
    const { context, action, subject, value, attributes } = event;
    const customMetadata = this.getCustomDimensionMetrics(context, attributes);

    if (action === 'navigate' && context.extension === 'App') {
      this.capture.pageview(subject, customMetadata);
      return;
    }

    this.capture.event({
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

  /**
   * Sets the GA userId, based on the `userEntityRef` set on the backstage
   * identity loaded from a given Backstage Identity API instance. Because
   * Google forbids sending any PII (including on the userId field), we hash
   * the namespace and name of the `userEntityRef` on behalf of integrators:
   *
   * - With value `User:default/name`, userId becomes `sha256(default/name)`
   * - With `User:name`, userId is `sha256(name)`
   * - With `name`, userId is `sha256(name)`
   *
   * If an integrator wishes to use an alternative hashing mechanism or an
   * entirely different value, they may do so by passing a dummy Identity API
   * implementation which returns a `userEntityRef` whose kind is the literal
   * string `PrivateUser`:
   *
   * - With value `PrivateUser:a0n3b4n3`, userId becomes `a0n3b4n3`
   * - With `PrivateUser:default/a0n3b4n3`, userId is `default/a0n3b4n3`
   *
   * Note: this feature requires that an integrator has set up a Google
   * Analytics User ID view in the property used to track Backstage.
   */
  private async setUserFrom(identityApi: IdentityApi) {
    const { userEntityRef } = await identityApi.getBackstageIdentity();
    const entity = parseEntityRef(userEntityRef);

    // Prevent PII from being passed to Google Analytics.
    const userId = await this.getPrivateUserId(entity);

    // Set the user ID.
    ReactGA.set({ userId });

    // Notify the deferred capture mechanism that it may proceed.
    this.capture.setReady();
  }

  /**
   * Returns a PII-free user ID for use in Google Analytics.
   */
  private getPrivateUserId(entity: EntityName): Promise<string> {
    const userId = entity.namespace
      ? `${entity.namespace}/${entity.name}`
      : entity.name;

    // Mechanism allowing integrators to provide their own hashed values.
    if (entity.kind === 'PrivateUser') {
      return Promise.resolve(userId);
    }

    return this.hash(userId);
  }

  /**
   * Simple hash function; relies on web cryptography + the sha-256 algorithm.
   */
  private async hash(value: string): Promise<string> {
    const digest = await crypto.subtle.digest(
      'sha-256',
      new TextEncoder().encode(value),
    );
    const hashArray = Array.from(new Uint8Array(digest));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
