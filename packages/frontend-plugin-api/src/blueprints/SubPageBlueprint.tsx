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
import { PageMountContext, usePageMount } from '../routing/PageMountContext';
import {
  coreExtensionData,
  createExtensionBlueprint,
  createExtensionInput,
} from '../wiring';
import { ExtensionBoundary } from '../components';
import { optionalStringSchema } from '../schema/optionalStringSchema';
import { useApi } from '../apis/system';
import type { PageRouterComponent } from '../apis/definitions/PageRouterApi';
import { PageRouterBlueprint } from './PageRouterBlueprint';
import { configApiRef } from '../apis/definitions/ConfigApi';
import { getAppBasename } from './getAppBasename';

function joinMountPath(parentPath: string, subPath: string): string {
  const trimmedParent = parentPath.replace(/\/$/, '');
  const trimmedSub = subPath.replace(/^\//, '');
  return `${trimmedParent}/${trimmedSub}`;
}

/**
 * Provides the subpage's own {@link PageMount} (`parentBase + '/' + subPath`)
 * to its content, and optionally wraps it with the subpage's own router
 * input override.
 *
 * Empty router input resolves no adapter here — the parent page's `<Routes>`
 * (established by `PageBlueprint`) already owns routing dispatch between
 * sibling subpages, so a subpage only needs its own adapter when it wants
 * additional in-page routing of its own.
 */
function SubPageRouterWrapper(props: {
  path: string;
  RouterOverride?: PageRouterComponent;
  children: ReactNode;
}) {
  const { path, RouterOverride, children } = props;
  const parentMount = usePageMount();
  const configApi = useApi(configApiRef);
  const appBasename = useMemo(() => getAppBasename(configApi), [configApi]);

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

  const content = RouterOverride ? (
    <RouterOverride
      basePath={mount.basePath}
      routePattern={mount.routePattern}
      appBasename={appBasename || undefined}
    >
      {children}
    </RouterOverride>
  ) : (
    children
  );

  return (
    <PageMountContext.Provider value={mount}>
      {content}
    </PageMountContext.Provider>
  );
}

/**
 * Creates extensions that are sub-page React components attached to a parent page.
 * Sub-pages are rendered as tabs within the parent page's header.
 *
 * `PageBlueprint` composes each subpage's output path and element into a
 * native React Router `<Route>` on the parent page's `<Routes>`. Each
 * subpage also receives its own {@link PageMount} (`parentBase + '/' +
 * subPath`) for descendants (e.g. breadcrumbs). An optional `router` input
 * (via {@link PageRouterBlueprint} attached to this sub-page) additionally
 * wraps the subpage's own content with an adapter for further in-page
 * routing.
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
