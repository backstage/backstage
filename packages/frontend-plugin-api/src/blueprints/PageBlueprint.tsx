/*
 * Copyright 2024 The Backstage Authors
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

import { JSX, ReactNode, useContext, useEffect, useMemo } from 'react';
import { IconElement } from '../icons/types';
import {
  RouteRef,
  type RouteDescriptor,
  createRouteDescriptor,
} from '../routing';
import {
  RoutingContractContext,
  useRoutingContract,
} from '../routing/RoutingContractContext';
import {
  coreExtensionData,
  createExtensionBlueprint,
  createExtensionInput,
} from '../wiring';
import { ExtensionBoundary, PageLayout, PageLayoutTab } from '../components';
import { useApi, useApiHolder } from '../apis/system';
import type { AppNode } from '../apis';
import { routeResolutionApiRef } from '../apis/definitions/RouteResolutionApi';
import { pluginHeaderActionsApiRef } from '../apis/definitions/PluginHeaderActionsApi';
import { RouteResolutionApi } from '../apis/definitions/RouteResolutionApi';
import { optionalStringSchema } from '../schema/optionalStringSchema';
import {
  pageRouterApiRef,
  type PageRouterComponent,
} from '../apis/definitions/PageRouterApi';
import { PageRouterBlueprint } from './PageRouterBlueprint';
import { configApiRef } from '../apis/definitions/ConfigApi';
import { getAppBasename } from './getAppBasename';

function resolveTitleLink(
  routeResolutionApi: RouteResolutionApi,
  routeRef: RouteRef | undefined,
): string | undefined {
  if (!routeRef) {
    return undefined;
  }
  try {
    return routeResolutionApi.resolve(routeRef)?.();
  } catch {
    // Route ref may require params not available in the current context
    return undefined;
  }
}

/**
 * Library-agnostic index redirect used when descriptor tabs have no index
 * route — replaces the former React Router `<Navigate>` in PageBlueprint.
 * Uses the page {@link RoutingContract} so `to` stays scoped to the page.
 */
function DescriptorIndexRedirect(props: { to: string }) {
  const contract = useRoutingContract();
  const { to } = props;

  useEffect(() => {
    contract?.navigate(to.startsWith('/') ? to : `/${to}`, { replace: true });
  }, [contract, to]);

  return null;
}

/**
 * Wraps page content with the page's router input override, or the app-plugin
 * default from {@link pageRouterApiRef}.
 *
 * When no {@link RoutingContract} is present (e.g. isolated `renderInTestApp`
 * without AppRouteSwitch), children render without a page adapter so the root
 * test/app chrome router remains in effect.
 *
 * When `routes` is provided, they are passed to the adapter for compilation
 * into the adapter's native route tree (React Router today; TanStack later).
 *
 * When `routes` is omitted and `opaqueChildren` is set, `children` is opaque
 * page content (e.g. from a `loader`) that may itself compose React Router
 * elements internally. If the default adapter reports
 * `supportsOpaqueChildren: false` (see {@link PageRouterCapabilities}), this
 * fails fast rather than silently dropping in-page routing — see the
 * TanStack Router adapter, which owns rendering via a compiled route tree and
 * cannot host opaque children.
 */
function PageRouterWrapper(props: {
  routePattern: string;
  RouterOverride?: PageRouterComponent;
  routes?: readonly RouteDescriptor[];
  /**
   * Marks `children` as opaque page content that the default adapter may be
   * unable to render without `routes` descriptors. Only set for the `loader`
   * branch — other branches either supply `routes` or render no routable
   * content.
   */
  opaqueChildren?: boolean;
  children: ReactNode;
}) {
  const { routePattern, RouterOverride, routes, opaqueChildren, children } =
    props;
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

  if (!RouterOverride && opaqueChildren && !routes?.length) {
    const capabilities = pageRouterApi?.getCapabilities?.();
    if (capabilities?.supportsOpaqueChildren === false) {
      throw new Error(
        'The active page router does not support opaque React Router ' +
          'children. Declare in-page routes with RouteDescriptors ' +
          '(PageBlueprint params.routes or SubPageBlueprint pages), or use ' +
          'a React Router page adapter.',
      );
    }
  }

  return (
    <Router
      contract={contract}
      routePattern={routePattern}
      appBasename={appBasename || undefined}
      routes={routes}
    >
      {children}
    </Router>
  );
}

function PluginPageShell(props: {
  node: AppNode;
  routePattern: string;
  RouterOverride?: PageRouterComponent;
  routes?: readonly RouteDescriptor[];
  opaqueChildren?: boolean;
  title: string;
  icon?: IconElement;
  noHeader?: boolean;
  tabs?: PageLayoutTab[];
  titleRouteRef?: RouteRef;
  pluginId: string;
  children?: ReactNode;
}) {
  const {
    node,
    routePattern,
    RouterOverride,
    routes,
    opaqueChildren,
    title,
    icon,
    noHeader,
    tabs,
    titleRouteRef,
    pluginId,
    children,
  } = props;
  const routeResolutionApi = useApi(routeResolutionApiRef);
  const titleLink = resolveTitleLink(routeResolutionApi, titleRouteRef);
  const headerActionsApi = useApi(pluginHeaderActionsApiRef);
  const headerActions = headerActionsApi.getPluginHeaderActions(pluginId);

  return (
    <ExtensionBoundary node={node}>
      <PageRouterWrapper
        routePattern={routePattern}
        RouterOverride={RouterOverride}
        routes={routes}
        opaqueChildren={opaqueChildren}
      >
        <PageLayout
          title={title}
          icon={icon}
          noHeader={noHeader}
          tabs={tabs}
          titleLink={titleLink}
          headerActions={headerActions}
        >
          {children}
        </PageLayout>
      </PageRouterWrapper>
    </ExtensionBoundary>
  );
}

/**
 * Creates extensions that are routable React page components.
 *
 * Pages may optionally attach a `router` input (via {@link PageRouterBlueprint})
 * to override the default React Router v6 adapter registered by the app plugin.
 * When the input is empty, the default is resolved from {@link pageRouterApiRef}.
 *
 * In-page routes can be declared as library-agnostic {@link RouteDescriptor}
 * trees via the `routes` param, or composed from sub-pages attached to the
 * `pages` input (e.g. via `SubPageBlueprint`). Both are compiled into
 * descriptors and handed to the page router adapter, so tabbed sub-pages work
 * the same under every adapter. Opaque React Router children inside a
 * `loader` remain supported when the active page router reports
 * {@link PageRouterCapabilities.supportsOpaqueChildren} (React Router
 * adapters). Adapters that do not support opaque children (e.g. TanStack)
 * require descriptors and fail fast on the loader path.
 *
 * @public
 */
export const PageBlueprint = createExtensionBlueprint({
  kind: 'page',
  attachTo: { id: 'app/routes', input: 'routes' },
  inputs: {
    pages: createExtensionInput([
      coreExtensionData.routePath,
      coreExtensionData.routeRef.optional(),
      coreExtensionData.reactElement,
      coreExtensionData.title.optional(),
      coreExtensionData.icon.optional(),
    ]),
    router: createExtensionInput([PageRouterBlueprint.dataRefs.component], {
      singleton: true,
      optional: true,
    }),
  },
  output: [
    coreExtensionData.routePath,
    coreExtensionData.reactElement,
    coreExtensionData.routeRef.optional(),
    coreExtensionData.title.optional(),
    coreExtensionData.icon.optional(),
  ],
  configSchema: {
    path: optionalStringSchema,
    title: optionalStringSchema,
  },
  *factory(
    params: {
      path: string;
      title?: string;
      icon?: IconElement;
      loader?: () => Promise<JSX.Element>;
      /**
       * Library-agnostic in-page route tree for subpage / tab routing.
       * Used when no `pages` input extensions are attached — the `pages`
       * input takes precedence and is compiled into descriptors the same
       * way. Opaque React Router children in `loader` remain supported.
       * Compiled by the page router adapter.
       */
      routes?: readonly RouteDescriptor[];
      routeRef?: RouteRef;
      /**
       * Hide the default plugin page header, making the page fill up all available space.
       */
      noHeader?: boolean;
    },
    { config, node, inputs },
  ) {
    const title = config.title ?? params.title;
    const icon = params.icon;
    const pluginId = node.spec.plugin.pluginId;
    const noHeader = params.noHeader ?? false;
    const resolvedTitle =
      title ?? node.spec.plugin.title ?? node.spec.plugin.pluginId;
    const resolvedIcon = icon ?? node.spec.plugin.icon;
    const titleRouteRef =
      (node.spec.plugin.routes as { root?: RouteRef }).root ?? params.routeRef;
    const routePath = config.path ?? params.path;
    const RouterOverride = inputs.router?.get(
      PageRouterBlueprint.dataRefs.component,
    );

    yield coreExtensionData.routePath(routePath);
    yield coreExtensionData.reactElement(
      createPageElement({
        node,
        routePath,
        RouterOverride,
        resolvedTitle,
        resolvedIcon,
        titleRouteRef,
        pluginId,
        noHeader,
        loader: params.loader,
        pages: inputs.pages,
        routes: params.routes,
      }),
    );
    if (params.routeRef) {
      yield coreExtensionData.routeRef(params.routeRef);
    }
    if (title) {
      yield coreExtensionData.title(title);
    }
    if (icon) {
      yield coreExtensionData.icon(icon);
    }
  },
});

function withIndexRedirect(
  routes: readonly RouteDescriptor[],
  firstPath: string | undefined,
): readonly RouteDescriptor[] {
  if (!firstPath || routes.some(route => route.index)) {
    return routes;
  }
  return [
    createRouteDescriptor({
      index: true,
      component: () => <DescriptorIndexRedirect to={firstPath} />,
    }),
    ...routes,
  ];
}

function createPageElement(options: {
  node: AppNode;
  routePath: string;
  RouterOverride?: PageRouterComponent;
  resolvedTitle: string;
  resolvedIcon?: IconElement;
  titleRouteRef?: RouteRef;
  pluginId: string;
  noHeader: boolean;
  loader?: () => Promise<JSX.Element>;
  pages: readonly {
    get(ref: any): any;
  }[];
  routes?: readonly RouteDescriptor[];
}): JSX.Element {
  const {
    node,
    routePath,
    RouterOverride,
    resolvedTitle,
    resolvedIcon,
    titleRouteRef,
    pluginId,
    noHeader,
    loader,
    pages,
    routes,
  } = options;

  if (loader) {
    return (
      <PluginPageShell
        node={node}
        routePattern={routePath}
        RouterOverride={RouterOverride}
        opaqueChildren
        title={resolvedTitle}
        icon={resolvedIcon}
        noHeader={noHeader}
        titleRouteRef={titleRouteRef}
        pluginId={pluginId}
      >
        {ExtensionBoundary.lazy(node, loader)}
      </PluginPageShell>
    );
  }

  if (pages.length > 0) {
    const tabs: PageLayoutTab[] = pages.map(page => {
      const path = page.get(coreExtensionData.routePath);
      const tabTitle = page.get(coreExtensionData.title);
      const tabIcon = page.get(coreExtensionData.icon);
      return {
        id: path,
        label: tabTitle || path,
        icon: tabIcon,
        href: path,
      };
    });
    const firstPagePath = pages[0]?.get(coreExtensionData.routePath);
    const pageDescriptors: RouteDescriptor[] = pages.map(page => {
      const path = page.get(coreExtensionData.routePath);
      const pageTitle = page.get(coreExtensionData.title);
      const pageIcon = page.get(coreExtensionData.icon);
      const element = page.get(coreExtensionData.reactElement);
      return createRouteDescriptor({
        path,
        title: pageTitle,
        icon: pageIcon,
        component: () => element,
      });
    });
    return (
      <PluginPageShell
        node={node}
        routePattern={routePath}
        RouterOverride={RouterOverride}
        routes={withIndexRedirect(pageDescriptors, firstPagePath)}
        title={resolvedTitle}
        icon={resolvedIcon}
        tabs={tabs}
        titleRouteRef={titleRouteRef}
        pluginId={pluginId}
      />
    );
  }

  if (routes?.length) {
    const tabs: PageLayoutTab[] = routes
      .filter(route => !route.index && route.path)
      .map(route => ({
        id: route.id ?? route.path!,
        label: route.title || route.path!,
        icon: route.icon,
        href: route.path!,
      }));
    return (
      <PluginPageShell
        node={node}
        routePattern={routePath}
        RouterOverride={RouterOverride}
        routes={withIndexRedirect(routes, tabs[0]?.href)}
        title={resolvedTitle}
        icon={resolvedIcon}
        tabs={tabs.length > 0 ? tabs : undefined}
        titleRouteRef={titleRouteRef}
        pluginId={pluginId}
      />
    );
  }

  return (
    <PluginPageShell
      node={node}
      routePattern={routePath}
      RouterOverride={RouterOverride}
      title={resolvedTitle}
      icon={resolvedIcon}
      titleRouteRef={titleRouteRef}
      pluginId={pluginId}
    />
  );
}
