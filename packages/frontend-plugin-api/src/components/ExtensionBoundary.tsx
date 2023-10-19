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

import React, { PropsWithChildren, ReactNode, useEffect } from 'react';
import { AnalyticsContext, useAnalytics } from '@backstage/core-plugin-api';
import { BackstagePlugin } from '../wiring';
import { ErrorBoundary } from './ErrorBoundary';
import { ExtensionSuspense } from './ExtensionSuspense';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { routableExtensionRenderedEvent } from '../../../core-plugin-api/src/analytics/Tracker';

type RouteTrackerProps = PropsWithChildren<{
  disableTracking?: boolean;
}>;

const RouteTracker = (props: RouteTrackerProps) => {
  const { disableTracking, children } = props;
  const analytics = useAnalytics();

  // This event, never exposed to end-users of the analytics API,
  // helps inform which extension metadata gets associated with a
  // navigation event when the route navigated to is a gathered
  // mountpoint.
  useEffect(() => {
    if (disableTracking) return;
    analytics.captureEvent(routableExtensionRenderedEvent, '');
  }, [analytics, disableTracking]);

  return <>{children}</>;
};

/** @public */
export interface ExtensionBoundaryProps {
  id: string;
  source?: BackstagePlugin;
  routable?: boolean;
  children: ReactNode;
}

/** @public */
export function ExtensionBoundary(props: ExtensionBoundaryProps) {
  const { id, source, routable, children } = props;

  // Skipping "routeRef" attribute in the new system, the extension "id" should provide more insight
  const attributes = {
    extension: id,
    pluginId: source?.id,
  };

  return (
    <ExtensionSuspense>
      <ErrorBoundary plugin={source}>
        <AnalyticsContext attributes={attributes}>
          <RouteTracker disableTracking={!routable}>{children}</RouteTracker>
        </AnalyticsContext>
      </ErrorBoundary>
    </ExtensionSuspense>
  );
}
