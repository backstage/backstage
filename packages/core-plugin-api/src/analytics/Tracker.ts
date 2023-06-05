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

import { getOrCreateGlobalSingleton } from '@backstage/version-bridge';
import {
  AnalyticsApi,
  AnalyticsEventAttributes,
  AnalyticsTracker,
} from '../apis';
import { AnalyticsContextValue } from './';

type TempGlobalEvents = {
  /**
   * Stores the most recent "gathered" mountpoint navigation.
   */
  mostRecentGatheredNavigation?: {
    action: string;
    subject: string;
    value?: number;
    attributes?: AnalyticsEventAttributes;
    context: AnalyticsContextValue;
  };
  /**
   * Stores the most recent routable extension render.
   */
  mostRecentRoutableExtensionRender?: {
    context: AnalyticsContextValue;
  };
};

/**
 * Temporary global store for select event data. Used to make `navigate` events
 * more accurate when gathered mountpoints are used.
 */
const globalEvents = getOrCreateGlobalSingleton<TempGlobalEvents>(
  'core-plugin-api:analytics-tracker-events',
  () => ({
    mostRecentGatheredNavigation: undefined,
    mostRecentRoutableExtensionRender: undefined,
  }),
);

/**
 * Internal-only event representing when a routable extension is rendered.
 */
export const routableExtensionRenderedEvent = '_ROUTABLE-EXTENSION-RENDERED';

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
    // Never pass internal "_routeNodeType" context value.
    const { _routeNodeType, ...context } = this.context;

    // Never fire the special "_routable-extension-rendered" internal event.
    if (action === routableExtensionRenderedEvent) {
      // But keep track of it if we're delaying a `navigate` event for a
      // a gathered route node type.
      if (globalEvents.mostRecentGatheredNavigation) {
        globalEvents.mostRecentRoutableExtensionRender = {
          context: {
            ...context,
            extension: 'App',
          },
        };
      }
      return;
    }

    // If we are about to fire a real event, and we have an un-fired gathered
    // mountpoint navigation on the global store, we need to fire the navigate
    // event first, so this real event happens accurately after the navigation.
    if (globalEvents.mostRecentGatheredNavigation) {
      try {
        this.analyticsApi.captureEvent({
          ...globalEvents.mostRecentGatheredNavigation,
          ...globalEvents.mostRecentRoutableExtensionRender,
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Error during analytics event capture. %o', e);
      }

      // Clear the global stores.
      globalEvents.mostRecentGatheredNavigation = undefined;
      globalEvents.mostRecentRoutableExtensionRender = undefined;
    }

    // Never directly fire a navigation event on a gathered route with default
    // contextual details.
    if (
      action === 'navigate' &&
      _routeNodeType === 'gathered' &&
      context.pluginId === 'root'
    ) {
      // Instead, set it on the global store.
      globalEvents.mostRecentGatheredNavigation = {
        action,
        subject,
        value,
        attributes,
        context,
      };
      return;
    }

    try {
      this.analyticsApi.captureEvent({
        action,
        subject,
        value,
        attributes,
        context,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Error during analytics event capture. %o', e);
    }
  }
}
