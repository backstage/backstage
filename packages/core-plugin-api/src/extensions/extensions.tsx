/*
 * Copyright 2020 The Backstage Authors
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

import React, { lazy, Suspense, useEffect } from 'react';
import { AnalyticsContext, useAnalytics } from '../analytics';
import { useApp } from '../app';
import { RouteRef, useRouteRef } from '../routing';
import { attachComponentData } from './componentData';
import { Extension, BackstagePlugin } from '../plugin';
import { PluginErrorBoundary } from './PluginErrorBoundary';
import { routableExtensionRenderedEvent } from '../analytics/Tracker';
import { ForwardedError } from '@backstage/errors';

/**
 * Lazy or synchronous retrieving of extension components.
 *
 * @public
 */
export type ComponentLoader<T> =
  | {
      lazy: () => Promise<T>;
    }
  | {
      sync: T;
    };

/**
 * Extension for components that can have its own URL route (top-level pages, tabs etc.).
 *
 * @remarks
 *
 * We do not use ComponentType as the return type, since it doesn't let us convey the children prop.
 * ComponentType inserts children as an optional prop whether the inner component accepts it or not,
 * making it impossible to make the usage of children type safe.
 *
 * See {@link https://backstage.io/docs/plugins/composability#extensions}.
 *
 * @public
 */
export function createRoutableExtension<
  T extends (props: any) => JSX.Element | null,
>(options: {
  /**
   * A loader for the component that is rendered by this extension.
   */
  component: () => Promise<T>;

  /**
   * The mount point to bind this routable extension to.
   *
   * If this extension is placed somewhere in the app element tree of a Backstage
   * app, callers will be able to route to this extensions by calling,
   * `useRouteRef` with this mount point.
   */
  mountPoint: RouteRef;

  /**
   * The name of this extension that will represent it at runtime. It is for example
   * used to identify this extension in analytics data.
   *
   * If possible the name should always be the same as the name of the exported
   * variable for this extension.
   */
  name?: string;
}): Extension<T> {
  const { component, mountPoint, name } = options;
  return createReactExtension({
    component: {
      lazy: () =>
        component().then(InnerComponent => {
          const RoutableExtensionWrapper: any = (props: any) => {
            const analytics = useAnalytics();

            // Validate that the routing is wired up correctly in the App.tsx
            try {
              useRouteRef(mountPoint);
            } catch (error) {
              if (typeof error === 'object' && error !== null) {
                const { message } = error as { message?: unknown };
                if (
                  typeof message === 'string' &&
                  message.startsWith('No path for ')
                ) {
                  throw new Error(
                    `Routable extension component with mount point ${mountPoint} was not discovered in the app element tree. ` +
                      'Routable extension components may not be rendered by other components and must be ' +
                      'directly available as an element within the App provider component.',
                  );
                }
              }
              throw error;
            }

            // This event, never exposed to end-users of the analytics API,
            // helps inform which extension metadata gets associated with a
            // navigation event when the route navigated to is a gathered
            // mountpoint.
            useEffect(() => {
              analytics.captureEvent(routableExtensionRenderedEvent, '');
            }, [analytics]);

            return <InnerComponent {...props} />;
          };

          const componentName =
            name ||
            (InnerComponent as { displayName?: string }).displayName ||
            InnerComponent.name ||
            'LazyComponent';

          RoutableExtensionWrapper.displayName = `RoutableExtension(${componentName})`;

          return RoutableExtensionWrapper as T;
        }),
    },
    data: {
      'core.mountPoint': mountPoint,
    },
    name,
  });
}

/**
 * Plain React component extension.
 *
 * @remarks
 *
 * We do not use ComponentType as the return type, since it doesn't let us convey the children prop.
 * ComponentType inserts children as an optional prop whether the inner component accepts it or not,
 * making it impossible to make the usage of children type safe.
 *
 * See {@link https://backstage.io/docs/plugins/composability#extensions}.
 *
 * @public
 */
export function createComponentExtension<
  T extends (props: any) => JSX.Element | null,
>(options: {
  /**
   * A loader or synchronously supplied component that is rendered by this extension.
   */
  component: ComponentLoader<T>;

  /**
   * The name of this extension that will represent it at runtime. It is for example
   * used to identify this extension in analytics data.
   *
   * If possible the name should always be the same as the name of the exported
   * variable for this extension.
   */
  name?: string;
}): Extension<T> {
  const { component, name } = options;
  return createReactExtension({ component, name });
}

/**
 * Used by {@link createComponentExtension} and {@link createRoutableExtension}.
 *
 * @remarks
 *
 * We do not use ComponentType as the return type, since it doesn't let us convey the children prop.
 * ComponentType inserts children as an optional prop whether the inner component accepts it or not,
 * making it impossible to make the usage of children type safe.
 *
 * See {@link https://backstage.io/docs/plugins/composability#extensions}.
 *
 * @public
 */
export function createReactExtension<
  T extends (props: any) => JSX.Element | null,
>(options: {
  /**
   * A loader or synchronously supplied component that is rendered by this extension.
   */
  component: ComponentLoader<T>;

  /**
   * Additional component data that is attached to the top-level extension component.
   */
  data?: Record<string, unknown>;

  /**
   * The name of this extension that will represent it at runtime. It is for example
   * used to identify this extension in analytics data.
   *
   * If possible the name should always be the same as the name of the exported
   * variable for this extension.
   */
  name?: string;
}): Extension<T> {
  const { data = {}, name } = options;
  if (!name) {
    // eslint-disable-next-line no-console
    console.warn(
      'Declaring extensions without name is DEPRECATED. ' +
        'Make sure that all usages of createReactExtension, createComponentExtension and createRoutableExtension provide a name.',
    );
  }

  let Component: T;
  if ('lazy' in options.component) {
    const lazyLoader = options.component.lazy;
    Component = lazy(() =>
      lazyLoader().then(
        component => ({ default: component }),
        error => {
          const ofExtension = name ? ` of the ${name} extension` : '';
          throw new ForwardedError(
            `Failed lazy loading${ofExtension}, try to reload the page`,
            error,
          );
        },
      ),
    ) as unknown as T;
  } else {
    Component = options.component.sync;
  }
  const componentName =
    name ||
    (Component as { displayName?: string }).displayName ||
    Component.name ||
    'Component';

  return {
    expose(plugin: BackstagePlugin) {
      const Result: any = (props: any) => {
        const app = useApp();
        const { Progress } = app.getComponents();
        // todo(iamEAP): Account for situations where this is attached via
        // separate calls to attachComponentData().
        const mountPoint = data?.['core.mountPoint'] as
          | { id?: string }
          | undefined;

        return (
          <Suspense fallback={<Progress />}>
            <PluginErrorBoundary app={app} plugin={plugin}>
              <AnalyticsContext
                attributes={{
                  pluginId: plugin.getId(),
                  ...(name && { extension: name }),
                  ...(mountPoint && { routeRef: mountPoint.id }),
                }}
              >
                <Component {...props} />
              </AnalyticsContext>
            </PluginErrorBoundary>
          </Suspense>
        );
      };

      attachComponentData(Result, 'core.plugin', plugin);
      attachComponentData(Result, 'core.extensionName', name);
      for (const [key, value] of Object.entries(data)) {
        attachComponentData(Result, key, value);
      }

      Result.displayName = `Extension(${componentName})`;
      return Result;
    },
  };
}
