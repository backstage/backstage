/*
 * Copyright 2022 The Backstage Authors
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
import { Config } from '@backstage/config';
import { AnalyticsApi, AnalyticsEvent } from '@backstage/core-plugin-api';
import { AnalyticsBrowser } from '@segment/analytics-next';

/**
 * Segment provider for the Backstage Analytics API.
 * @public
 */
export class SegmentAnalytics implements AnalyticsApi {
  private readonly analytics: AnalyticsBrowser;
  private readonly testMode: boolean;

  /**
   * Instantiate the implementation and initialize Segment client.
   */
  private constructor(options: { writeKey: string; testMode: boolean }) {
    const { writeKey, testMode } = options;

    this.testMode = !!testMode;
    this.analytics = AnalyticsBrowser.load({ writeKey: writeKey });
  }

  /**
   * Instantiate a fully configured Segment API implementation.
   */
  static fromConfig(config: Config) {
    const writeKey = config.getString('app.analytics.segment.writeKey');
    const testMode =
      config.getOptionalBoolean('app.analytics.segment.testMode') ?? false;

    return new SegmentAnalytics({
      writeKey,
      testMode,
    });
  }

  async captureEvent(event: AnalyticsEvent) {
    // Don't capture events in test mode.
    if (this.testMode) {
      return;
    }

    const { action, subject, value, context, attributes } = event;
    const { routeRef, pluginId, extension, ...additionalContext } = context;

    // Identify users.
    if (action === 'identify') {
      await this.analytics.identify(subject, {
        email: attributes?.email,
        name: attributes?.name,
      });
      return;
    }

    // Track page views.
    if (action === 'navigate') {
      await this.analytics.page();
      return;
    }

    // Track other events.
    await this.analytics.track('Event', {
      action: action,
      subject: subject,
      value: value,
      route_ref: routeRef,
      plugin_id: pluginId,
      extension: extension,
      additional_context:
        additionalContext && JSON.stringify(additionalContext),
      attributes: attributes && JSON.stringify(attributes),
    });
  }
}
