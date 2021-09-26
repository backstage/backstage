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

import {
  AnalyticsApi,
  AnalyticsEventAttributes,
  AnalyticsTracker,
} from '../apis';
import { AnalyticsContextValue } from './';

export class Tracker implements AnalyticsTracker {
  constructor(
    private readonly analyticsApi: AnalyticsApi,
    private context: AnalyticsContextValue = {
      routeRef: 'unknown',
      pluginId: 'root',
      extension: 'App',
    },
  ) {}

  setContext(context: AnalyticsContextValue) {
    this.context = context;
  }

  captureEvent(
    action: string,
    subject: string,
    {
      value,
      attributes,
    }: { value?: number; attributes?: AnalyticsEventAttributes } = {},
  ) {
    try {
      this.analyticsApi.captureEvent({
        action,
        subject,
        value,
        attributes,
        context: this.context,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Error during analytics event capture. %o', e);
    }
  }
}
