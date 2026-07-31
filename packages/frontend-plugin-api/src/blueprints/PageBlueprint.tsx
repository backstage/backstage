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

import { JSX, ReactNode, useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { IconElement } from '../icons/types';
import { RouteRef } from '../routing';
import { usePageMount } from '@internal/frontend';
import {
  coreExtensionData,
  createExtensionBlueprint,
  createExtensionInput,
} from '../wiring';
import { ExtensionBoundary, PageLayout, PageLayoutTab } from '../components';
import { BreadcrumbEntry } from '../breadcrumbs';
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
 * Wraps page content with the page's router input override, or the app-plugin
 * default from {@link pageRouterApiRef}.
 *
 * When there is no `PageMount` present (e.g. isolated `renderInTestApp`
 * without `AppRouteSwitch`), children render without a page adapter so the
 * root test/app chrome router remains in effect.
 *
 * `children` are opaque — typically a native React Router `<Routes>` tree —
 * so any adapter used here must be able to host arbitrary React Router
 * content unless it overrides this page directly (see
 * {@link PageRouterCapabilities.supportsOpaqueChildren}).
 */
function PageRouterWrapper(props: {
  RouterOverride?: PageRouterComponent;
  /** Whether `children` may contain routable (e.g. React Router) content. */
  hasRoutableContent?: boolean;
  children: ReactNode;
}) {
  const { RouterOverride, hasRoutableContent, children } = props;
  const pageMount = usePageMount();
  const apiHolder = useApiHolder();
  const configApi = useApi(configApiRef);
  const appBasename = useMemo(() => getAppBasename(configApi), [configApi]);

  if (!pageMount) {
    return <>{children}</>;
  }

  const pageRouterApi = apiHolder.get(pageRouterApiRef);
  const Router =
    RouterOverride ?? pageRouterApi?.getDefaultRouter() ?? undefined;

  if (!Router) {
    return <>{children}</>;
  }

  if (!RouterOverride && hasRoutableContent) {
    const capabilities = pageRouterApi?.getCapabilities?.();
    if (capabilities?.supportsOpaqueChildren === false) {
      throw new Error(
        'The active page router does not support opaque React Router ' +
          'children. Use a React Router page adapter, or attach a ' +
          'PageRouterBlueprint override for this page.',
      );
    }
  }

  return (
    <Router
      basePath={pageMount.basePath}
      routePattern={pageMount.routePattern}
      appBasename={appBasename || undefined}
    >
      {children}
    </Router>
  );
}

function PluginPageShell(props: {
  node: AppNode;
  RouterOverride?: PageRouterComponent;
  hasRoutableContent?: boolean;
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
    RouterOverride,
    hasRoutableContent,
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
        RouterOverride={RouterOverride}
        hasRoutableContent={hasRoutableContent}
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
 * Sub-pages attached to the `pages` input (e.g. via `SubPageBlueprint`) are
 * composed into a native React Router `<Routes>` tree, so tabbed sub-pages
 * work the same under every React Router-compatible adapter. A `loader`'s
 * opaque content (which may itself compose React Router elements) is
 * supported the same way — both rely on the active page router reporting
 * {@link PageRouterCapabilities.supportsOpaqueChildren} (React Router
 * adapters do; adapters that fully own their route tree, e.g. TanStack, do
 * not and fail fast instead).
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
        RouterOverride,
        resolvedTitle,
        resolvedIcon,
        titleRouteRef,
        pluginId,
        noHeader,
        loader: params.loader,
        pages: inputs.pages,
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

function createPageElement(options: {
  node: AppNode;
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
}): JSX.Element {
  const {
    node,
    RouterOverride,
    resolvedTitle,
    resolvedIcon,
    titleRouteRef,
    pluginId,
    noHeader,
    loader,
    pages,
  } = options;

  if (loader) {
    return (
      <PluginPageShell
        node={node}
        RouterOverride={RouterOverride}
        hasRoutableContent
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
    return (
      <PluginPageShell
        node={node}
        RouterOverride={RouterOverride}
        hasRoutableContent
        title={resolvedTitle}
        icon={resolvedIcon}
        tabs={tabs}
        titleRouteRef={titleRouteRef}
        pluginId={pluginId}
      >
        <Routes>
          {firstPagePath && (
            <Route index element={<Navigate to={firstPagePath} replace />} />
          )}
          {pages.map(page => {
            const path = page.get(coreExtensionData.routePath);
            const pageTitle = page.get(coreExtensionData.title);
            const element = page.get(coreExtensionData.reactElement);
            return (
              <Route
                key={path}
                path={`${path}/*`}
                element={
                  <BreadcrumbEntry
                    entry={{ label: pageTitle || path, href: path }}
                  >
                    {element}
                  </BreadcrumbEntry>
                }
              />
            );
          })}
        </Routes>
      </PluginPageShell>
    );
  }

  return (
    <PluginPageShell
      node={node}
      RouterOverride={RouterOverride}
      title={resolvedTitle}
      icon={resolvedIcon}
      titleRouteRef={titleRouteRef}
      pluginId={pluginId}
    />
  );
}
