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

import { ReactNode, useContext, useMemo } from 'react';
import { IconElement } from '../icons/types';
import { RouteRef, RoutingContractContext } from '../routing';
import {
  coreExtensionData,
  createExtensionBlueprint,
  createExtensionInput,
} from '../wiring';
import { ExtensionBoundary } from '../components';
import { optionalStringSchema } from '../schema/optionalStringSchema';
import { useApi, useApiHolder } from '../apis/system';
import {
  pageRouterApiRef,
  type PageRouterComponent,
} from '../apis/definitions/PageRouterApi';
import { PageRouterBlueprint } from './PageRouterBlueprint';
import { configApiRef } from '../apis/definitions/ConfigApi';
import { getAppBasename } from './getAppBasename';

/**
 * Wraps subpage content with the subpage's router input override, or the
 * app-plugin default from {@link pageRouterApiRef}.
 *
 * Uses the subpage's own {@link RoutingContract} (provided by the parent page
 * at `parentBase + '/' + subPath`). Empty router input resolves the API-holder
 * default — the same singleton pattern as {@link PageBlueprint}.
 */
function SubPageRouterWrapper(props: {
  RouterOverride?: PageRouterComponent;
  children: ReactNode;
}) {
  const { RouterOverride, children } = props;
  const contract = useContext(RoutingContractContext);
  const apiHolder = useApiHolder();
  const configApi = useApi(configApiRef);
  const appBasename = useMemo(() => getAppBasename(configApi), [configApi]);

  if (!contract) {
    return <>{children}</>;
  }

  const pageRouterApi = apiHolder.get(pageRouterApiRef);
  const Router =
    RouterOverride ?? pageRouterApi?.getDefaultRouter() ?? undefined;

  if (!Router) {
    return <>{children}</>;
  }

  // Concrete contract basePath is the subpage mount path; adapters match
  // app-absolute locations against this pattern.
  return (
    <Router
      contract={contract}
      routePattern={contract.basePath}
      appBasename={appBasename || undefined}
    >
      {children}
    </Router>
  );
}

/**
 * Creates extensions that are sub-page React components attached to a parent page.
 * Sub-pages are rendered as tabs within the parent page's header.
 *
 * Each subpage receives its own scoped {@link RoutingContract} from the parent
 * page at `parentBase + '/' + subPath`. An optional `router` input (via
 * {@link PageRouterBlueprint} attached to this sub-page) overrides the default
 * adapter; empty input resolves the app-plugin default from
 * {@link pageRouterApiRef}.
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
      <SubPageRouterWrapper RouterOverride={RouterOverride}>
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
