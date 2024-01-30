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
  AnalyticsEvent,
  AnalyticsEventAttributes,
  IdentityApi,
} from '@backstage/core-plugin-api';
import {
  AnalyticsApi as NewAnalyticsApi,
  AnalyticsEvent as NewAnalyticsEvent,
  AnalyticsContextValue as NewAnalyticsContextValue,
} from '@backstage/frontend-plugin-api';
import { Config } from '@backstage/config';
import { DeferredCapture } from '../../../util';
import {
  parseVirtualSearchPageViewConfig,
  VirtualSearchPageViewConfig,
} from '../../../util/VirtualSearchPageView';

type CustomDimensionOrMetricConfig = {
  type: 'dimension' | 'metric';
  index: number;
  source: 'context' | 'attributes';
  key: string;
};

/**
 * Google Analytics API provider for the Backstage Analytics API.
 * @public
 */
export class GoogleAnalytics implements AnalyticsApi, NewAnalyticsApi {
  private readonly cdmConfig: CustomDimensionOrMetricConfig[];
  private customUserIdTransform?: (userEntityRef: string) => Promise<string>;
  private readonly capture: DeferredCapture;
  private readonly virtualSearchPageView: VirtualSearchPageViewConfig;

  /**
   * Instantiate the implementation and initialize ReactGA.
   */
  private constructor(options: {
    identityApi?: IdentityApi;
    userIdTransform?: 'sha-256' | ((userEntityRef: string) => Promise<string>);
    cdmConfig: CustomDimensionOrMetricConfig[];
    identity: string;
    trackingId: string;
    scriptSrc?: string;
    virtualSearchPageView: VirtualSearchPageViewConfig;
    testMode: boolean;
    debug: boolean;
  }) {
    const {
      cdmConfig,
      identity,
      trackingId,
      identityApi,
      userIdTransform = 'sha-256',
      scriptSrc,
      virtualSearchPageView,
      testMode,
      debug,
    } = options;

    this.cdmConfig = cdmConfig;
    this.virtualSearchPageView = virtualSearchPageView;

    // Initialize Google Analytics.
    ReactGA.initialize(trackingId, {
      testMode,
      debug,
      gaAddress: scriptSrc,
      titleCase: false,
    });

    // If identity is required, defer event capture until identity is known.
    this.capture = new DeferredCapture({ defer: identity === 'required' });

    // Allow custom userId transformation.
    this.customUserIdTransform =
      typeof userIdTransform === 'function' ? userIdTransform : undefined;

    // Capture user only when explicitly enabled and provided.
    if (identity !== 'disabled' && identityApi) {
      this.setUserFrom(identityApi);
    }
  }

  /**
   * Instantiate a fully configured GA Analytics API implementation.
   */
  static fromConfig(
    config: Config,
    options: {
      identityApi?: IdentityApi;
      userIdTransform?:
        | 'sha-256'
        | ((userEntityRef: string) => Promise<string>);
    } = {},
  ) {
    // Get all necessary configuration.
    const trackingId = config.getString('app.analytics.ga.trackingId');
    const scriptSrc = config.getOptionalString('app.analytics.ga.scriptSrc');
    const identity =
      config.getOptionalString('app.analytics.ga.identity') || 'disabled';
    const virtualSearchPageView = parseVirtualSearchPageViewConfig(
      config.getOptionalConfig('app.analytics.ga.virtualSearchPageView'),
    );
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

    if (identity === 'required' && !options.identityApi) {
      throw new Error(
        'Invalid config: identity API must be provided to deps when ga.identity is required',
      );
    }

    // Return an implementation instance.
    return new GoogleAnalytics({
      ...options,
      identity,
      trackingId,
      scriptSrc,
      virtualSearchPageView,
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
  captureEvent(event: AnalyticsEvent | NewAnalyticsEvent) {
    const { context, action, subject, value, attributes } = event;
    const customMetadata = this.getCustomDimensionMetrics(context, attributes);

    const extensionId = context.extensionId || context.extension;
    const category = extensionId ? String(extensionId) : 'App';

    // The legacy default extension was 'App' and the new one is 'app'
    if (
      action === 'navigate' &&
      category.toLocaleLowerCase('en-US').startsWith('app')
    ) {
      this.capture.pageview(subject, customMetadata);
      return;
    }

    if (this.virtualSearchPageView.mode !== 'disabled' && action === 'search') {
      const { mountPath, searchQuery, categoryQuery } =
        this.virtualSearchPageView;
      const params = new URLSearchParams();
      params.set(searchQuery, subject);
      if (categoryQuery) {
        params.set(categoryQuery, context.searchTypes?.toString() ?? '');
      }
      this.capture.pageview(
        `${mountPath}?${params.toString()}`,
        customMetadata,
      );
      if (this.virtualSearchPageView.mode === 'only') {
        return;
      }
    }

    this.capture.event({
      category,
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
    context: AnalyticsContextValue | NewAnalyticsContextValue,
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
   * the entire `userEntityRef` on behalf of integrators:
   *
   * - With value `User:default/name`, userId becomes `sha256(User:default/name)`
   *
   * If an integrator wishes to use an alternative hashing mechanism or an
   * entirely different value, they may do so by passing a `userIdTransform`
   * function alongside the `identityApi` to `GoogleAnalytics.fromConfig()`.
   * This function receives the `userEntityRef` as an argument and should
   * resolve to a hashed version of whatever identifier they choose.
   *
   * Note: this feature requires that an integrator has set up a Google
   * Analytics User ID view in the property used to track Backstage.
   */
  private async setUserFrom(identityApi: IdentityApi) {
    const { userEntityRef } = await identityApi.getBackstageIdentity();

    // Prevent PII from being passed to Google Analytics.
    const userId = await this.getPrivateUserId(userEntityRef);

    // Set the user ID.
    ReactGA.set({ userId });

    // Notify the deferred capture mechanism that it may proceed.
    this.capture.setReady();
  }

  /**
   * Returns a PII-free (according to Google's terms of service) user ID for
   * use in Google Analytics.
   */
  private getPrivateUserId(userEntityRef: string): Promise<string> {
    // Allow integrators to provide their own hashing transformer.
    if (this.customUserIdTransform) {
      return this.customUserIdTransform(userEntityRef);
    }

    return this.hash(userEntityRef);
  }

  /**
   * Simple hash function; relies on web cryptography + the sha-256 algorithm.
   */
  private async hash(value: string): Promise<string> {
    const digest = await window.crypto.subtle.digest(
      'sha-256',
      new TextEncoder().encode(value),
    );
    const hashArray = Array.from(new Uint8Array(digest));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
