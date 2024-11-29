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

import React, {
  PropsWithChildren,
  ReactNode,
  Suspense,
  useEffect,
  lazy as reactLazy,
} from 'react';
import { AnalyticsContext, useAnalytics } from '@backstage/core-plugin-api';
import { ErrorBoundary } from './ErrorBoundary';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { routableExtensionRenderedEvent } from '../../../core-plugin-api/src/analytics/Tracker';
import { AppNode, useComponentRef } from '../apis';
import { coreComponentRefs } from './coreComponentRefs';
import { coreExtensionData } from '../wiring';

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
  node: AppNode;
  /**
   * This explicitly marks the extension as routable for the purpose of
   * capturing analytics events. If not provided, the extension boundary will be
   * marked as routable if it outputs a routePath.
   */
  routable?: boolean;
  children: ReactNode;
}

/** @public */
export function ExtensionBoundary(props: ExtensionBoundaryProps) {
  const { node, routable, children } = props;

  const doesOutputRoutePath = Boolean(
    node.instance?.getData(coreExtensionData.routePath),
  );

  const plugin = node.spec.source;
  const Progress = useComponentRef(coreComponentRefs.progress);
  const fallback = useComponentRef(coreComponentRefs.errorBoundaryFallback);

  // Skipping "routeRef" attribute in the new system, the extension "id" should provide more insight
  const attributes = {
    extensionId: node.spec.id,
    pluginId: node.spec.source?.id ?? 'app',
  };

  return (
    <Suspense fallback={<Progress />}>
      <ErrorBoundary plugin={plugin} Fallback={fallback}>
        <AnalyticsContext attributes={attributes}>
          <RouteTracker disableTracking={!(routable ?? doesOutputRoutePath)}>
            {children}
          </RouteTracker>
        </AnalyticsContext>
      </ErrorBoundary>
    </Suspense>
  );
}

/** @public */
export namespace ExtensionBoundary {
  export function lazy(
    appNode: AppNode,
    lazyElement: () => Promise<JSX.Element>,
  ): JSX.Element {
    const ExtensionComponent = reactLazy(() =>
      lazyElement().then(element => ({ default: () => element })),
    );
    return (
      <ExtensionBoundary node={appNode}>
        <ExtensionComponent />
      </ExtensionBoundary>
    );
  }
}
