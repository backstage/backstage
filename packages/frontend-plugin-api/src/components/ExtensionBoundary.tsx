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

import {
  PropsWithChildren,
  ReactNode,
  Suspense,
  useEffect,
  useMemo,
  lazy as reactLazy,
} from 'react';
import { AnalyticsContext, useAnalytics } from '../analytics';
import { ErrorDisplayBoundary } from './ErrorDisplayBoundary';
import { ErrorApiBoundary } from './ErrorApiBoundary';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { routableExtensionRenderedEvent } from '../../../core-plugin-api/src/analytics/Tracker';
import { AppNode, ErrorApi, errorApiRef, useApi } from '../apis';
import {
  PluginWrapperApi,
  pluginWrapperApiRef,
} from '../apis/definitions/PluginWrapperApi';
import { coreExtensionData } from '../wiring';
import { AppNodeProvider } from './AppNodeProvider';
import { Progress } from './DefaultSwappableComponents';

function useOptionalErrorApi(): ErrorApi | undefined {
  try {
    return useApi(errorApiRef);
  } catch {
    return undefined;
  }
}

function useOptionalPluginWrapperApi(): PluginWrapperApi | undefined {
  try {
    return useApi(pluginWrapperApiRef);
  } catch {
    return undefined;
  }
}
type RouteTrackerProps = PropsWithChildren<{
  enabled?: boolean;
}>;

const RouteTracker = (props: RouteTrackerProps) => {
  const { enabled, children } = props;
  const analytics = useAnalytics();

  // This event, never exposed to end-users of the analytics API,
  // helps inform which extension metadata gets associated with a
  // navigation event when the route navigated to is a gathered
  // mountpoint.
  useEffect(() => {
    if (enabled) {
      analytics.captureEvent(routableExtensionRenderedEvent, '');
    }
  }, [analytics, enabled]);

  return <>{children}</>;
};

/** @public */
export interface ExtensionBoundaryProps {
  errorPresentation?: 'error-api' | 'error-display';
  node: AppNode;
  children: ReactNode;
}

/** @public */
export function ExtensionBoundary(props: ExtensionBoundaryProps) {
  const { node, children } = props;

  const errorApi = useOptionalErrorApi();

  const hasRoutePathOutput = Boolean(
    node.instance?.getData(coreExtensionData.routePath),
  );

  const plugin = node.spec.plugin;
  const pluginId = plugin.pluginId ?? plugin.id ?? 'app';

  const pluginWrapperApi = useOptionalPluginWrapperApi();

  const PluginWrapper = useMemo(() => {
    return pluginWrapperApi?.getPluginWrapper(pluginId);
  }, [pluginWrapperApi, pluginId]);

  // Skipping "routeRef" attribute in the new system, the extension "id" should provide more insight
  const attributes = {
    extensionId: node.spec.id,
    pluginId,
  };

  let content = (
    <AnalyticsContext attributes={attributes}>
      <RouteTracker enabled={hasRoutePathOutput}>{children}</RouteTracker>
    </AnalyticsContext>
  );

  if (PluginWrapper) {
    content = <PluginWrapper>{content}</PluginWrapper>;
  }

  if (props.errorPresentation === 'error-api') {
    content = (
      <ErrorApiBoundary node={node} errorApi={errorApi}>
        {content}
      </ErrorApiBoundary>
    );
  } else {
    content = (
      <ErrorDisplayBoundary plugin={plugin}>{content}</ErrorDisplayBoundary>
    );
  }

  return (
    <AppNodeProvider node={node}>
      <Suspense fallback={<Progress />}>{content}</Suspense>
    </AppNodeProvider>
  );
}

/** @public */
export namespace ExtensionBoundary {
  export function lazy(
    appNode: AppNode,
    loader: () => Promise<JSX.Element>,
  ): JSX.Element {
    const ExtensionComponent = reactLazy(() =>
      loader().then(element => ({ default: () => element })),
    );
    return (
      <ExtensionBoundary node={appNode}>
        <ExtensionComponent />
      </ExtensionBoundary>
    );
  }

  export function lazyComponent<TProps extends {}>(
    appNode: AppNode,
    loader: () => Promise<(props: TProps) => JSX.Element>,
  ): (props: TProps) => JSX.Element {
    const ExtensionComponent = reactLazy(() =>
      loader().then(Component => ({ default: Component })),
    ) as unknown as React.ComponentType<TProps>;

    return (props: TProps) => (
      <ExtensionBoundary node={appNode}>
        <ExtensionComponent {...props} />
      </ExtensionBoundary>
    );
  }
}
