/*
 * Copyright 2023 The Backstage Authors
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

import ReactGA from 'react-ga4';
import {
  AnalyticsApi,
  AnalyticsContextValue,
  AnalyticsEventAttributes,
  AnalyticsEvent,
  IdentityApi,
} from '@backstage/core-plugin-api';
import {
  AnalyticsApi as NewAnalyticsApi,
  AnalyticsEvent as NewAnalyticsEvent,
  AnalyticsContextValue as NewAnalyticsContextValue,
} from '@backstage/frontend-plugin-api';
import { Config } from '@backstage/config';
import { DeferredCapture } from '../../../util/DeferredCapture';

/**
 * Google Analytics API provider for the Backstage Analytics API.
 * @public
 */
export class GoogleAnalytics4 implements AnalyticsApi, NewAnalyticsApi {
  private readonly customUserIdTransform?: (
    userEntityRef: string,
  ) => Promise<string>;
  private readonly capture: DeferredCapture;
  private readonly contentGroupBy?: string;
  private readonly allowedContexts?: string[];
  private readonly allowedAttributes?: string[];
  /**
   * Instantiate the implementation and initialize ReactGA.
   * @param options initializes Google Analytics module with the config
   */
  private constructor(options: {
    identityApi?: IdentityApi;
    userIdTransform?: 'sha-256' | ((userEntityRef: string) => Promise<string>);
    identity: string;
    measurementId: string;
    testMode: boolean;
    debug: boolean;
    enableSendPageView: boolean;
    contentGroupBy?: string;
    allowedContexts?: string[];
    allowedAttributes?: string[];
  }) {
    const {
      identity,
      measurementId,
      identityApi,
      userIdTransform = 'sha-256',
      testMode,
      debug,
      enableSendPageView,
      contentGroupBy,
      allowedContexts,
      allowedAttributes,
    } = options;
    // Initialize Google Analytics.
    ReactGA.initialize(measurementId, {
      testMode,
      gaOptions: {
        debug_mode: debug,
      },
      gtagOptions: {
        debug_mode: debug,
        send_page_view: enableSendPageView,
      },
    });

    this.contentGroupBy = contentGroupBy;
    this.allowedAttributes = allowedAttributes;
    this.allowedContexts = allowedContexts;
    // If identity is required, defer event capture until identity is known.
    this.capture = new DeferredCapture({ defer: identity === 'required' });

    // Allow custom userId transformation.
    this.customUserIdTransform =
      typeof userIdTransform === 'function' ? userIdTransform : undefined;

    // Capture user only when explicitly enabled and provided.
    if (identity !== 'disabled') {
      if (identityApi) {
        this.setUserFrom(identityApi).then(() => {
          return;
        });
      }
    }
  }

  /**
   * Instantiate a fully configured GA Analytics API implementation.
   * @param config - Config object from app config
   * @param options - options with identityApi and userIdTransform config
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
    const measurementId = config.getString('app.analytics.ga4.measurementId');
    const identity =
      config.getOptionalString('app.analytics.ga4.identity') || 'disabled';
    const debug = config.getOptionalBoolean('app.analytics.ga4.debug') ?? false;
    const enableSendPageView =
      config.getOptionalBoolean('app.analytics.ga4.enableSendPageView') ??
      false;
    const testMode =
      config.getOptionalBoolean('app.analytics.ga4.testMode') ?? false;

    const contentGroupBy = config.getOptionalString(
      'app.analytics.ga4.contentGrouping',
    );
    const allowedContexts = config.getOptionalStringArray(
      'app.analytics.ga4.allowedContexts',
    );
    const allowedAttributes = config.getOptionalStringArray(
      'app.analytics.ga4.allowedAttributes',
    );

    if (identity === 'required' && !options.identityApi) {
      throw new Error(
        'Invalid config: identity API must be provided to deps when ga4.identity is required',
      );
    }

    // Return an implementation instance.
    return new GoogleAnalytics4({
      ...options,
      identity,
      measurementId: measurementId,
      testMode,
      debug,
      enableSendPageView,
      contentGroupBy,
      allowedContexts,
      allowedAttributes,
    });
  }

  /**
   * Primary event capture implementation. Handles core navigate event as a
   * pageview and the rest as custom events. All custom dimensions/metrics are
   * applied as they should be (set on pageview, merged object on events).
   * @param event - AnalyticsEvent type captured
   */
  captureEvent(event: AnalyticsEvent | NewAnalyticsEvent) {
    const { context, action, subject, value, attributes } = event;
    const customEventData = this.setEventParameters(context, attributes);
    if (this.contentGroupBy) {
      customEventData.content_group = context[this.contentGroupBy]!;
    }

    const extensionId = context.extensionId || context.extension;
    const category = extensionId ? String(extensionId) : 'App';

    // The legacy default extension was 'App' and the new one is 'app'
    if (
      action === 'navigate' &&
      category.toLocaleLowerCase('en-US').startsWith('app')
    ) {
      this.capture.event(
        {
          category,
          action: 'page_view',
          label: subject,
          value,
        },
        customEventData,
      );
      return;
    }

    if (action === 'search') {
      customEventData.search_term = subject;
    }

    this.capture.event(
      {
        category,
        action,
        label: subject,
        value,
      },
      customEventData,
    );
  }

  /**
   * Returns an object of dimensions/metrics given an Analytics Context and an
   * Event Attributes, e.g. { c_pluginId: "some value", a_attribute1: 42 }
   * @param context analytics context object
   * @param attributes additional analytics event attributes
   */
  private setEventParameters(
    context: AnalyticsContextValue | NewAnalyticsContextValue,
    attributes: AnalyticsEventAttributes = {},
  ) {
    const customEventParameters: {
      [x: string]: string | number | boolean | undefined;
    } = {};

    const contextKeys =
      this.allowedContexts?.join('') === '*'
        ? Object.keys(context)
        : this.allowedContexts;

    contextKeys?.forEach(ctx => {
      if (context[ctx]) {
        customEventParameters[`c_${ctx}`] = context[ctx];
      }
    });

    const attrKeys =
      this.allowedAttributes?.join('') === '*'
        ? Object.keys(attributes)
        : this.allowedAttributes;
    attrKeys?.forEach(attr => {
      if (attributes[attr]) {
        customEventParameters[`a_${attr}`] = attributes[attr];
      }
    });

    return customEventParameters;
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
   * @param identityApi IdentityApi object
   */
  private async setUserFrom(identityApi: IdentityApi) {
    const { userEntityRef } = await identityApi.getBackstageIdentity();

    // Prevent PII from being passed to Google Analytics.
    const userId = await this.getPrivateUserId(userEntityRef);

    // Set the user ID.
    ReactGA.set({ user_id: userId });

    // Notify the deferred capture mechanism that it may proceed.
    this.capture.setReady();
  }

  /**
   * Returns a PII-free (according to Google's terms of service) user ID for
   * use in Google Analytics.
   * @param userEntityRef user entity as string
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
   * @param value value to be hashed
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
