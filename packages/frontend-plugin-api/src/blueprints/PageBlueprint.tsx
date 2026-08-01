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

import { JSX, ReactNode } from 'react';
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
import { useApi } from '../apis/system';
import type { AppNode } from '../apis';
import { routeResolutionApiRef } from '../apis/definitions/RouteResolutionApi';
import { pluginHeaderActionsApiRef } from '../apis/definitions/PluginHeaderActionsApi';
import { RouteResolutionApi } from '../apis/definitions/RouteResolutionApi';
import { optionalStringSchema } from '../schema/optionalStringSchema';
import type {
  PageRouterComponent,
  PageRouterSubPage,
} from '../apis/definitions/PageRouterApi';
import { PageRouterBlueprint } from './PageRouterBlueprint';
import { PageRouterWrapper } from './PageRouterWrapper';

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

function PluginPageShell(props: {
  node: AppNode;
  RouterOverride?: PageRouterComponent;
  title: string;
  icon?: IconElement;
  noHeader?: boolean;
  tabs?: PageLayoutTab[];
  subPages?: readonly PageRouterSubPage[];
  indexPath?: string;
  titleRouteRef?: RouteRef;
  pluginId: string;
  children?: ReactNode;
}) {
  const {
    node,
    RouterOverride,
    title,
    icon,
    noHeader,
    tabs,
    subPages,
    indexPath,
    titleRouteRef,
    pluginId,
    children,
  } = props;
  const pageMount = usePageMount();
  const routeResolutionApi = useApi(routeResolutionApiRef);
  const titleLink = resolveTitleLink(routeResolutionApi, titleRouteRef);
  const headerActionsApi = useApi(pluginHeaderActionsApiRef);
  const headerActions = headerActionsApi.getPluginHeaderActions(pluginId);

  return (
    <ExtensionBoundary node={node}>
      <PageLayout
        title={title}
        icon={icon}
        noHeader={noHeader}
        tabs={tabs}
        titleLink={titleLink}
        headerActions={headerActions}
      >
        <PageRouterWrapper
          mount={pageMount}
          RouterOverride={RouterOverride}
          subPages={subPages}
          indexPath={indexPath}
        >
          {children}
        </PageRouterWrapper>
      </PageLayout>
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
 * handed to the adapter as data — their author-written paths and rendered
 * elements — so each adapter builds the route tree in its own routing library
 * (see {@link PageRouterSubPage}). Tabbed sub-pages therefore work under any
 * adapter, not just React Router ones. A `loader`'s content is opaque and is
 * simply rendered inside the adapter's context.
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
    // One pass over the sub-page input serves both consumers: the page chrome
    // (tabs) and the router adapter (routes). Breadcrumb registration is
    // applied here so adapters only ever see finished elements.
    const subPages: PageRouterSubPage[] = pages.map(page => {
      const path = page.get(coreExtensionData.routePath);
      const label = page.get(coreExtensionData.title) || path;
      return {
        path,
        label,
        icon: page.get(coreExtensionData.icon),
        element: (
          <BreadcrumbEntry entry={{ label, href: path }}>
            {page.get(coreExtensionData.reactElement)}
          </BreadcrumbEntry>
        ),
      };
    });
    const tabs: PageLayoutTab[] = subPages.map(({ path, label, icon }) => ({
      id: path,
      label,
      icon,
      href: path,
    }));
    return (
      <PluginPageShell
        node={node}
        RouterOverride={RouterOverride}
        title={resolvedTitle}
        icon={resolvedIcon}
        tabs={tabs}
        subPages={subPages}
        indexPath={subPages[0]?.path}
        titleRouteRef={titleRouteRef}
        pluginId={pluginId}
      />
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
