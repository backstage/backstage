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

import { JSX, ReactNode, useEffect } from 'react';
import { IconElement } from '../icons/types';
import { RouteRef } from '../routing';
import {
  PageMountProvider,
  joinRoutePath,
  usePageMount,
  useAppRouteMatches,
  useAppHistoryLocation,
  type PageMount,
} from '@internal/frontend';
import {
  coreExtensionData,
  createExtensionBlueprint,
  createExtensionInput,
} from '../wiring';
import { ExtensionBoundary, PageLayout, PageLayoutTab } from '../components';
import { BreadcrumbEntry } from '../breadcrumbs';
import { useApi, useApiHolder } from '../apis/system';
import type { AppNode } from '../apis';
import {
  routeResolutionApiRef,
  RouteResolutionApi,
} from '../apis/definitions/RouteResolutionApi';
import { pluginHeaderActionsApiRef } from '../apis/definitions/PluginHeaderActionsApi';

import { optionalStringSchema } from '../schema/optionalStringSchema';
import { appHistoryApiRef } from '../routing/AppHistoryApi';

/**
 * One sub-page of a page, as the page itself sees it: a tab to show in the
 * chrome, and the content to render when that tab is the one selected.
 *
 * Deliberately not part of any public contract — sub-pages are ordinary routes
 * one level below the page, and nothing outside this blueprint needs to know
 * that the page is composed from them.
 */
interface PageSubPage {
  node: AppNode;
  /** The sub-page path exactly as its author wrote it, e.g. `overview`. */
  path: string;
  /** The sub-page's tab label, defaulting to {@link PageSubPage.path}. */
  label: string;
  /** The sub-page's tab icon, if the author supplied one. */
  icon?: IconElement;
  /** The fully rendered sub-page content, framework concerns already applied. */
  element: ReactNode;
}

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

/** Parent-owned selection from the same matched branch as the app route. */
function PageContent(props: {
  subPages?: readonly PageSubPage[];
  children?: ReactNode;
}) {
  const { subPages, children } = props;
  const matches = useAppRouteMatches();
  const pageMount = usePageMount();
  const history = useApiHolder().get(appHistoryApiRef);
  const location = useAppHistoryLocation(history);
  const selected = matches
    ? subPages?.find(page => matches.some(match => match.node === page.node))
    : subPages?.[0];
  const firstPath = subPages?.[0]?.path;
  useEffect(() => {
    if (
      matches &&
      firstPath &&
      pageMount &&
      location &&
      location.pathname.replace(/\/$/, '') ===
        pageMount.basePath.replace(/\/$/, '')
    ) {
      const target = joinRoutePath(pageMount.basePath, firstPath);
      if (target !== pageMount.basePath) {
        history?.navigate(`${target}${location.search}${location.hash}`, {
          replace: true,
        });
      }
    }
  }, [matches, firstPath, pageMount, location, history]);
  const content = selected?.element ?? children;
  // Isolated extension tests have no selected branch; retain their supplied
  // mount while rendering the first child. Production mounts come from nodes.
  if (!matches && selected && pageMount) {
    const mount: PageMount = {
      basePath: joinRoutePath(pageMount.basePath, selected.path),
      routePattern: joinRoutePath(pageMount.routePattern, selected.path),
    };
    return <PageMountProvider mount={mount}>{content}</PageMountProvider>;
  }
  return <>{content}</>;
}

function PluginPageShell(props: {
  node: AppNode;
  title: string;
  icon?: IconElement;
  noHeader?: boolean;
  tabs?: PageLayoutTab[];
  subPages?: readonly PageSubPage[];
  titleRouteRef?: RouteRef;
  pluginId: string;
  children?: ReactNode;
}) {
  const {
    node,
    title,
    icon,
    noHeader,
    tabs,
    subPages,
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
      <PageLayout
        title={title}
        icon={icon}
        noHeader={noHeader}
        tabs={tabs}
        titleLink={titleLink}
        headerActions={headerActions}
      >
        <PageContent subPages={subPages}>{children}</PageContent>
      </PageLayout>
    </ExtensionBoundary>
  );
}

/**
 * Creates extensions that are routable React page components.
 *
 * Existing pages retain implicit React Router v6 matches for compatibility.
 * Development warnings identify consumers of that fallback. Pages can migrate
 * independently by rendering an explicit adapter inside their `loader`:
 *
 * ```tsx
 * PageBlueprint.make({
 *   params: {
 *     path: '/catalog',
 *     loader: () =>
 *       import('./Page').then(m => (
 *         <ReactRouterV6PageRouter>
 *           <m.Page />
 *         </ReactRouterV6PageRouter>
 *       )),
 *   },
 * });
 * ```
 *
 * Adapters are added rather than selected, so they nest: a sub-page written
 * with one routing library works under a page written with another, and
 * neither has to know about the other.
 *
 * Sub-pages attached to the `pages` input (e.g. via `SubPageBlueprint`) are
 * ordinary route-bearing extensions. The page renders the child selected by
 * the app's matched extension branch and redirects its index to the first
 * sub-page. Extension boundaries provide the actual route ancestry to links
 * and adapters; the page retains ownership of its shell and child rendering.
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
    // A page written around a `loader` owns its whole content region, so
    // anything attached to its `pages` input has nothing to be shown in.
    const subPages = params.loader ? [] : collectSubPages(inputs.pages);

    yield coreExtensionData.routePath(routePath);
    yield coreExtensionData.reactElement(
      createPageElement({
        node,
        resolvedTitle,
        resolvedIcon,
        titleRouteRef,
        pluginId,
        noHeader,
        loader: params.loader,
        subPages,
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

/**
 * Reads the `pages` input into the shape the page itself works in.
 *
 * One pass serves both consumers: the page chrome (tabs) and content
 * selection. Breadcrumb registration is applied here so that whatever renders
 * a sub-page only ever sees a finished element.
 */
function collectSubPages(
  pages: readonly {
    node: AppNode;
    get(ref: any): any;
  }[],
): PageSubPage[] {
  return pages.map(page => {
    const path = page.get(coreExtensionData.routePath);
    const label = page.get(coreExtensionData.title) || path;
    return {
      node: page.node,
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
}

function createPageElement(options: {
  node: AppNode;
  resolvedTitle: string;
  resolvedIcon?: IconElement;
  titleRouteRef?: RouteRef;
  pluginId: string;
  noHeader: boolean;
  loader?: () => Promise<JSX.Element>;
  subPages: readonly PageSubPage[];
}): JSX.Element {
  const {
    node,
    resolvedTitle,
    resolvedIcon,
    titleRouteRef,
    pluginId,
    noHeader,
    loader,
    subPages,
  } = options;

  if (loader) {
    return (
      <PluginPageShell
        node={node}
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

  if (subPages.length > 0) {
    const tabs: PageLayoutTab[] = subPages.map(({ path, label, icon }) => ({
      id: path,
      label,
      icon,
      href: path,
    }));
    return (
      <PluginPageShell
        node={node}
        title={resolvedTitle}
        icon={resolvedIcon}
        tabs={tabs}
        subPages={subPages}
        titleRouteRef={titleRouteRef}
        pluginId={pluginId}
      />
    );
  }

  return (
    <PluginPageShell
      node={node}
      title={resolvedTitle}
      icon={resolvedIcon}
      titleRouteRef={titleRouteRef}
      pluginId={pluginId}
    />
  );
}
