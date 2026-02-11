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

import { ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { IconElement } from '../icons/types';
import { RouteRef } from '../routing';
import {
  coreExtensionData,
  createExtensionBlueprint,
  createExtensionInput,
} from '../wiring';
import { ExtensionBoundary, PageLayout, PageTab } from '../components';
import { useApi } from '../apis/system';
import { headerActionsApiRef } from '../apis/definitions/HeaderActionsApi';

function useHeaderActions(pluginId: string): ReactNode {
  const headerActionsApi = useApi(headerActionsApiRef);
  const actions = headerActionsApi.getHeaderActions(pluginId);
  if (actions.length === 0) {
    return undefined;
  }
  return <>{actions}</>;
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
    ]),
  },
  output: [
    coreExtensionData.routePath,
    coreExtensionData.reactElement,
    coreExtensionData.routeRef.optional(),
    coreExtensionData.title.optional(),
    coreExtensionData.icon.optional(),
  ],
  config: {
    schema: {
      path: z => z.string().optional(),
      title: z => z.string().optional(),
    },
  },
  *factory(
    params: {
      /**
       * @deprecated Use the `path` param instead.
       */
      defaultPath?: [Error: `Use the 'path' param instead`];
      path: string;
      title?: string;
      icon?: IconElement;
      loader?: () => Promise<JSX.Element>;
      routeRef?: RouteRef;
    },
    { config, node, inputs },
  ) {
    const title =
      config.title ??
      params.title ??
      node.spec.plugin.title ??
      node.spec.plugin.pluginId;
    const icon = params.icon ?? node.spec.plugin.icon;
    const pluginId = node.spec.plugin.pluginId;

    yield coreExtensionData.routePath(config.path ?? params.path);
    if (params.loader) {
      const loader = params.loader;
      const PageContent = () => {
        const headerActions = useHeaderActions(pluginId);
        return (
          <PageLayout title={title} icon={icon} headerActions={headerActions}>
            {ExtensionBoundary.lazy(node, loader)}
          </PageLayout>
        );
      };
      yield coreExtensionData.reactElement(<PageContent />);
    } else if (inputs.pages.length > 0) {
      // Parent page with sub-pages - render header with tabs
      const tabs: PageTab[] = inputs.pages.map(page => {
        const path = page.get(coreExtensionData.routePath);
        const tabTitle = page.get(coreExtensionData.title);
        return {
          id: path,
          label: tabTitle || path,
          href: path,
          matchStrategy: 'prefix' as const,
        };
      });

      const PageContent = () => {
        const firstPagePath = inputs.pages[0]?.get(coreExtensionData.routePath);
        const headerActions = useHeaderActions(pluginId);

        return (
          <PageLayout
            title={title}
            icon={icon}
            tabs={tabs}
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
        const headerActions = useHeaderActions(pluginId);
        return (
          <PageLayout title={title} icon={icon} headerActions={headerActions} />
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
