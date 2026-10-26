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

import { JSX } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { createSnapshotSourceCollection } from '@internal/frontend';
import { SnapshotSource } from '@backstage/types';
import { TranslationMessageRef } from '../translation/TranslationMessageRef';
import { resolveTranslationTitle } from '../translation/resolveTranslationTitle';
import { Routes, Route, Navigate } from 'react-router-dom';
import { IconElement } from '../icons/types';
import { RouteRef } from '../routing';
import {
  coreExtensionData,
  createExtensionBlueprint,
  createExtensionInput,
} from '../wiring';
import { ExtensionBoundary, PageLayout, PageLayoutTab } from '../components';
import { useApi } from '../apis/system';
import { BreadcrumbEntry } from '../breadcrumbs';
import { routeResolutionApiRef } from '../apis/definitions/RouteResolutionApi';
import { pluginHeaderActionsApiRef } from '../apis/definitions/PluginHeaderActionsApi';
import { RouteResolutionApi } from '../apis/definitions/RouteResolutionApi';
import { optionalStringSchema } from '../schema/optionalStringSchema';

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
 * Creates extensions that are routable React page components.
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
      coreExtensionData.titleSource.optional(),
      coreExtensionData.icon.optional(),
    ]),
  },
  output: [
    coreExtensionData.routePath,
    coreExtensionData.reactElement,
    coreExtensionData.routeRef.optional(),
    coreExtensionData.title.optional(),
    coreExtensionData.titleSource.optional(),
    coreExtensionData.icon.optional(),
  ],
  configSchema: {
    path: optionalStringSchema,
    title: optionalStringSchema,
  },
  *factory(
    params: {
      path: string;
      /** A plain title or a message reference resolved using the translation API. */
      title?: string | TranslationMessageRef;
      icon?: IconElement;
      loader?: () => Promise<JSX.Element>;
      routeRef?: RouteRef;
      /**
       * Hide the default plugin page header, making the page fill up all available space.
       */
      noHeader?: boolean;
    },
    { config, node, inputs, apis },
  ) {
    const { title, source } = resolveTranslationTitle(
      params.title,
      config.title,
      apis,
    );
    const icon = params.icon;
    const pluginId = node.spec.plugin.pluginId;
    const noHeader = params.noHeader ?? false;
    const resolvedTitle =
      title ?? node.spec.plugin.title ?? node.spec.plugin.pluginId;
    const resolvedIcon = icon ?? node.spec.plugin.icon;
    const titleRouteRef =
      (node.spec.plugin.routes as { root?: RouteRef }).root ?? params.routeRef;

    const titleSource: SnapshotSource<string> = source ?? {
      getSnapshot: () => resolvedTitle,
      subscribe: () => () => {},
    };
    if (source) {
      yield coreExtensionData.titleSource(source);
    }
    const childSources = new Map<string, SnapshotSource<string>>();
    if (!params.loader) {
      for (const page of inputs.pages) {
        const childSource = page.get(coreExtensionData.titleSource);
        if (childSource) childSources.set(page.node.spec.id, childSource);
      }
    }
    const childTitlesSource = createSnapshotSourceCollection(childSources);

    yield coreExtensionData.routePath(config.path ?? params.path);
    if (params.loader) {
      const content = ExtensionBoundary.lazy(node, params.loader);
      const PageContent = () => {
        const currentTitle = useSyncExternalStore(
          titleSource.subscribe,
          titleSource.getSnapshot,
        );
        const routeResolutionApi = useApi(routeResolutionApiRef);
        const titleLink = resolveTitleLink(routeResolutionApi, titleRouteRef);
        const headerActionsApi = useApi(pluginHeaderActionsApiRef);
        const headerActions = headerActionsApi.getPluginHeaderActions(pluginId);

        return (
          <PageLayout
            title={currentTitle}
            icon={resolvedIcon}
            noHeader={noHeader}
            titleLink={titleLink}
            headerActions={headerActions}
          >
            {content}
          </PageLayout>
        );
      };
      yield coreExtensionData.reactElement(<PageContent />);
    } else if (inputs.pages.length > 0) {
      const PageContent = () => {
        const currentTitle = useSyncExternalStore(
          titleSource.subscribe,
          titleSource.getSnapshot,
        );
        const childTitles = useSyncExternalStore(
          childTitlesSource.subscribe,
          childTitlesSource.getSnapshot,
        );
        const pages = inputs.pages.map(page => {
          const path = page.get(coreExtensionData.routePath);
          const tabTitle =
            childTitles.get(page.node.spec.id) ??
            page.get(coreExtensionData.title) ??
            path;
          return { page, path, title: tabTitle };
        });
        const tabs: PageLayoutTab[] = pages.map(
          ({ page, path, title: tabTitle }) => ({
            id: path,
            label: tabTitle || path,
            icon: page.get(coreExtensionData.icon),
            href: path,
          }),
        );
        const firstPagePath = inputs.pages[0]?.get(coreExtensionData.routePath);
        const routeResolutionApi = useApi(routeResolutionApiRef);
        const titleLink = resolveTitleLink(routeResolutionApi, titleRouteRef);

        const headerActionsApi = useApi(pluginHeaderActionsApiRef);
        const headerActions = headerActionsApi.getPluginHeaderActions(pluginId);
        return (
          <PageLayout
            title={currentTitle}
            icon={resolvedIcon}
            tabs={tabs}
            titleLink={titleLink}
            headerActions={headerActions}
          >
            <Routes>
              {firstPagePath && (
                <Route
                  index
                  element={<Navigate to={firstPagePath} replace />}
                />
              )}
              {pages.map(({ page, path, title: tabTitle }, index) => {
                const element = page.get(coreExtensionData.reactElement);
                return (
                  <Route
                    key={index}
                    path={`${path}/*`}
                    element={
                      <BreadcrumbEntry
                        entry={{ label: tabTitle || path, href: path }}
                      >
                        {element}
                      </BreadcrumbEntry>
                    }
                  />
                );
              })}
            </Routes>
          </PageLayout>
        );
      };

      yield coreExtensionData.reactElement(<PageContent />);
    } else {
      const PageContent = () => {
        const currentTitle = useSyncExternalStore(
          titleSource.subscribe,
          titleSource.getSnapshot,
        );
        const routeResolutionApi = useApi(routeResolutionApiRef);
        const titleLink = resolveTitleLink(routeResolutionApi, titleRouteRef);
        const headerActionsApi = useApi(pluginHeaderActionsApiRef);
        const headerActions = headerActionsApi.getPluginHeaderActions(pluginId);
        return (
          <PageLayout
            title={currentTitle}
            icon={resolvedIcon}
            titleLink={titleLink}
            headerActions={headerActions}
          />
        );
      };
      yield coreExtensionData.reactElement(<PageContent />);
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
