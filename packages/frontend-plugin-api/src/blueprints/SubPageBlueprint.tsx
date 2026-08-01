/*
 * Copyright 2026 The Backstage Authors
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

import { ReactNode, useMemo } from 'react';
import { IconElement } from '../icons/types';
import { RouteRef } from '../routing';
import { PageMountProvider, usePageMount } from '@internal/frontend';
import {
  coreExtensionData,
  createExtensionBlueprint,
  createExtensionInput,
} from '../wiring';
import { ExtensionBoundary } from '../components';
import { optionalStringSchema } from '../schema/optionalStringSchema';
import type { PageRouterComponent } from '../apis/definitions/PageRouterApi';
import { PageRouterBlueprint } from './PageRouterBlueprint';
import { PageRouterWrapper } from './PageRouterWrapper';

function joinMountPath(parentPath: string, subPath: string): string {
  const trimmedParent = parentPath.replace(/\/$/, '');
  const trimmedSub = subPath.replace(/^\//, '');
  return `${trimmedParent}/${trimmedSub}`;
}

/**
 * Provides the subpage's own `PageMount` (`parentBase + '/' + subPath`) to its
 * content, and runs that content through the same adapter resolution a page
 * uses — the subpage's own `router` input when it has one, otherwise the
 * app-plugin default.
 *
 * Resolving an adapter here (rather than letting content inherit whatever
 * routing context the parent page's adapter happened to leave behind) is what
 * keeps a subpage scoped to its own mount. The subpage's content is opaque:
 * the author picked both the content and, if they attached one, the adapter,
 * so there is nothing for the framework to reconcile.
 */
function SubPageRouterWrapper(props: {
  path: string;
  RouterOverride?: PageRouterComponent;
  children: ReactNode;
}) {
  const { path, RouterOverride, children } = props;
  const parentMount = usePageMount();

  const mount = useMemo(() => {
    if (!parentMount) {
      return undefined;
    }
    return {
      basePath: joinMountPath(parentMount.basePath, path),
      routePattern: joinMountPath(parentMount.routePattern, path),
    };
  }, [parentMount, path]);

  if (!mount) {
    return <>{children}</>;
  }

  return (
    <PageMountProvider mount={mount}>
      <PageRouterWrapper mount={mount} RouterOverride={RouterOverride}>
        {children}
      </PageRouterWrapper>
    </PageMountProvider>
  );
}

/**
 * Creates extensions that are sub-page React components attached to a parent page.
 * Sub-pages are rendered as tabs within the parent page's header.
 *
 * `PageBlueprint` hands each subpage's output path and element to the parent
 * page's router adapter, which routes between them using its own routing
 * library. Each subpage also receives its own `PageMount`
 * (`parentBase + '/' + subPath`) for descendants (e.g. breadcrumbs), and its
 * content is scoped to that mount by its own adapter — the optional `router`
 * input (via {@link PageRouterBlueprint} attached to this sub-page) when
 * present, otherwise the app-plugin default.
 *
 * @public
 * @example
 * ```tsx
 * const overviewRouteRef = createRouteRef();
 *
 * const mySubPage = SubPageBlueprint.make({
 *   attachTo: { id: 'page:my-plugin', input: 'pages' },
 *   name: 'overview',
 *   params: {
 *     path: 'overview',
 *     title: 'Overview',
 *     routeRef: overviewRouteRef,
 *     loader: () => import('./components/Overview').then(m => <m.Overview />),
 *   },
 * });
 * ```
 */
export const SubPageBlueprint = createExtensionBlueprint({
  kind: 'sub-page',
  attachTo: { relative: { kind: 'page' }, input: 'pages' },
  inputs: {
    router: createExtensionInput([PageRouterBlueprint.dataRefs.component], {
      singleton: true,
      optional: true,
    }),
  },
  output: [
    coreExtensionData.routePath,
    coreExtensionData.reactElement,
    coreExtensionData.title,
    coreExtensionData.routeRef.optional(),
    coreExtensionData.icon.optional(),
  ],
  configSchema: {
    path: optionalStringSchema,
    title: optionalStringSchema,
  },
  *factory(
    params: {
      /**
       * The path for this sub-page, relative to the parent page. Must **not** start with '/'.
       *
       * @example 'overview', 'settings', 'details'
       */
      path: string;
      /**
       * The title displayed in the tab for this sub-page.
       */
      title: string;
      /**
       * Optional icon for this sub-page, displayed in the tab.
       */
      icon?: IconElement;
      /**
       * A function that returns a promise resolving to the React element to render.
       * This enables lazy loading of the sub-page content.
       */
      loader: () => Promise<JSX.Element>;
      /**
       * Optional route reference for this sub-page.
       */
      routeRef?: RouteRef;
    },
    { config, node, inputs },
  ) {
    const routePath = config.path ?? params.path;
    const RouterOverride = inputs.router?.get(
      PageRouterBlueprint.dataRefs.component,
    );

    yield coreExtensionData.routePath(routePath);
    yield coreExtensionData.title(config.title ?? params.title);
    yield coreExtensionData.reactElement(
      <SubPageRouterWrapper path={routePath} RouterOverride={RouterOverride}>
        {ExtensionBoundary.lazy(node, params.loader)}
      </SubPageRouterWrapper>,
    );
    if (params.routeRef) {
      yield coreExtensionData.routeRef(params.routeRef);
    }
    if (params.icon) {
      yield coreExtensionData.icon(params.icon);
    }
  },
});
