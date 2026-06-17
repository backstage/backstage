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

import { z } from 'zod/v4';
import { JSX } from 'react';
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
import { routeResolutionApiRef } from '../apis/definitions/RouteResolutionApi';
import { pluginHeaderActionsApiRef } from '../apis/definitions/PluginHeaderActionsApi';
import { RouteResolutionApi } from '../apis/definitions/RouteResolutionApi';

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
    path: z.string().optional(),
    title: z.string().optional(),
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

    yield coreExtensionData.routePath(config.path ?? params.path);
    if (params.loader) {
      const loader = params.loader;
      const PageContent = () => {
        const routeResolutionApi = useApi(routeResolutionApiRef);
        const titleLink = resolveTitleLink(routeResolutionApi, titleRouteRef);
        const headerActionsApi = useApi(pluginHeaderActionsApiRef);
        const headerActions = headerActionsApi.getPluginHeaderActions(pluginId);

        return (
          <PageLayout
            title={resolvedTitle}
            icon={resolvedIcon}
            noHeader={noHeader}
            titleLink={titleLink}
            headerActions={headerActions}
          >
            {ExtensionBoundary.lazy(node, loader)}
          </PageLayout>
        );
      };
      yield coreExtensionData.reactElement(<PageContent />);
    } else if (inputs.pages.length > 0) {
      // Parent page with sub-pages - render header with tabs
      const tabs: PageLayoutTab[] = inputs.pages.map(page => {
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

      const PageContent = () => {
        const firstPagePath = inputs.pages[0]?.get(coreExtensionData.routePath);
        const routeResolutionApi = useApi(routeResolutionApiRef);
        const titleLink = resolveTitleLink(routeResolutionApi, titleRouteRef);

        const headerActionsApi = useApi(pluginHeaderActionsApiRef);
        const headerActions = headerActionsApi.getPluginHeaderActions(pluginId);

        return (
          <PageLayout
            title={resolvedTitle}
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
              {inputs.pages.map((page, index) => {
                const path = page.get(coreExtensionData.routePath);
                const element = page.get(coreExtensionData.reactElement);
                return (
                  <Route key={index} path={`${path}/*`} element={element} />
                );
              })}
            </Routes>
          </PageLayout>
        );
      };

      yield coreExtensionData.reactElement(<PageContent />);
    } else {
      const PageContent = () => {
        const routeResolutionApi = useApi(routeResolutionApiRef);
        const titleLink = resolveTitleLink(routeResolutionApi, titleRouteRef);
        const headerActionsApi = useApi(pluginHeaderActionsApiRef);
        const headerActions = headerActionsApi.getPluginHeaderActions(pluginId);
        return (
          <PageLayout
            title={resolvedTitle}
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
