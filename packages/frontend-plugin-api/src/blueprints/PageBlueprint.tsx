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
import {
  usePageMount,
  useSubPageSelection,
  type SubPageSelection,
} from '@internal/frontend';
import {
  coreExtensionData,
  createExtensionBlueprint,
  createExtensionDataRef,
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
import type { PageRouterComponent } from '../apis/definitions/PageRouterApi';
import { PageRouterBlueprint } from './PageRouterBlueprint';
import { PageRouterWrapper } from './PageRouterWrapper';

/**
 * One sub-page of a page, as the page itself sees it: a tab to show in the
 * chrome, and the content to render when that tab is the one selected.
 *
 * Deliberately not part of any public contract — sub-pages are ordinary routes
 * one level below the page, and nothing outside this blueprint needs to know
 * that the page is composed from them.
 */
interface PageSubPage {
  /** The sub-page path exactly as its author wrote it, e.g. `overview`. */
  path: string;
  /** The sub-page's tab label, defaulting to {@link PageSubPage.path}. */
  label: string;
  /** The sub-page's tab icon, if the author supplied one. */
  icon?: IconElement;
  /** The fully rendered sub-page content, framework concerns already applied. */
  element: ReactNode;
}

/**
 * The sub-page paths a page declares, in registration order, so that top-level
 * route matching can register them as routes of their own.
 */
const subPagePathsDataRef = createExtensionDataRef<string[]>().with({
  id: 'core.page.subPagePaths',
});

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
 * The content of the sub-page the current location selects.
 *
 * Selection is a routing decision, made once by top-level matching, so the
 * page only has to look up the element that belongs to the selected path.
 * Without a selection at all the page is being rendered outside route matching
 * (e.g. an isolated `renderInTestApp`), where the first sub-page stands in for
 * the list — that is where the page root would have led anyway.
 */
function selectSubPageContent(
  subPages: readonly PageSubPage[],
  selection: SubPageSelection | undefined,
): ReactNode {
  if (!selection) {
    return subPages[0]?.element;
  }
  const selectedPath = selection.selected?.path;
  return subPages.find(subPage => subPage.path === selectedPath)?.element;
}

function PluginPageShell(props: {
  node: AppNode;
  RouterOverride?: PageRouterComponent;
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
    RouterOverride,
    title,
    icon,
    noHeader,
    tabs,
    subPages,
    titleRouteRef,
    pluginId,
    children,
  } = props;
  const pageMount = usePageMount();
  const subPageSelection = useSubPageSelection();
  const routeResolutionApi = useApi(routeResolutionApiRef);
  const titleLink = resolveTitleLink(routeResolutionApi, titleRouteRef);
  const headerActionsApi = useApi(pluginHeaderActionsApiRef);
  const headerActions = headerActionsApi.getPluginHeaderActions(pluginId);

  const content = subPages
    ? selectSubPageContent(subPages, subPageSelection)
    : children;

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
        <PageRouterWrapper mount={pageMount} RouterOverride={RouterOverride}>
          {content}
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
 * Sub-pages attached to the `pages` input (e.g. via `SubPageBlueprint`) become
 * ordinary routes one level below the page: their paths are published so that
 * top-level route matching can register them, and matching then names the one
 * to show. Tabbed sub-pages therefore work under any adapter, since no adapter
 * ever builds a route. Whatever content the page ends up showing — a
 * `loader`'s element or the selected sub-page — is opaque to the adapter and
 * simply rendered inside its context.
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
    subPagePathsDataRef.optional(),
  ],
  dataRefs: {
    subPagePaths: subPagePathsDataRef,
  },
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
    // A page written around a `loader` owns its whole content region, so
    // anything attached to its `pages` input has nothing to be shown in.
    const subPages = params.loader ? [] : collectSubPages(inputs.pages);

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
        subPages,
      }),
    );
    if (subPages.length > 0) {
      // Route matching registers these one level below the page, which is what
      // makes a sub-page an ordinary route rather than something the page has
      // to dispatch between itself.
      yield subPagePathsDataRef(subPages.map(subPage => subPage.path));
    }
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
    get(ref: any): any;
  }[],
): PageSubPage[] {
  return pages.map(page => {
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
}

function createPageElement(options: {
  node: AppNode;
  RouterOverride?: PageRouterComponent;
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
    RouterOverride,
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
        RouterOverride={RouterOverride}
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
      RouterOverride={RouterOverride}
      title={resolvedTitle}
      icon={resolvedIcon}
      titleRouteRef={titleRouteRef}
      pluginId={pluginId}
    />
  );
}
