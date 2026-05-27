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

import { z } from 'zod/v4';
import { Routes, Route, Navigate } from 'react-router-dom';
import { IconElement } from '../icons/types';
import { RouteRef } from '../routing';
import {
  coreExtensionData,
  createExtensionBlueprint,
  createExtensionInput,
} from '../wiring';
import { ExtensionBoundary } from '../components';

/**
 * Creates extensions that are sub-page React components attached to a parent page.
 * Sub-pages are rendered as tabs within the parent page's header.
 * Sub-pages can also accept their own child sub-pages for nested routing.
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
    pages: createExtensionInput([
      coreExtensionData.routePath,
      coreExtensionData.reactElement,
      coreExtensionData.title,
      coreExtensionData.routeRef.optional(),
      coreExtensionData.icon.optional(),
      coreExtensionData.routeChildren.optional(),
    ]),
  },
  output: [
    coreExtensionData.routePath,
    coreExtensionData.reactElement,
    coreExtensionData.title,
    coreExtensionData.routeRef.optional(),
    coreExtensionData.icon.optional(),
    coreExtensionData.routeChildren.optional(),
  ],
  configSchema: {
    path: z.string().optional(),
    title: z.string().optional(),
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
    yield coreExtensionData.routePath(config.path ?? params.path);
    yield coreExtensionData.title(config.title ?? params.title);

    if (inputs.pages.length > 0) {
      const lazyContent = ExtensionBoundary.lazy(node, params.loader);
      const firstChildPath = inputs.pages[0]?.get(coreExtensionData.routePath);

      const SubPageWithChildren = () => (
        <>
          {lazyContent}
          <Routes>
            {firstChildPath && (
              <Route index element={<Navigate to={firstChildPath} replace />} />
            )}
            {inputs.pages.map((page, index) => {
              const path = page.get(coreExtensionData.routePath);
              const element = page.get(coreExtensionData.reactElement);
              return <Route key={index} path={`${path}/*`} element={element} />;
            })}
          </Routes>
        </>
      );

      yield coreExtensionData.reactElement(<SubPageWithChildren />);

      yield coreExtensionData.routeChildren(
        inputs.pages.map(page => ({
          path: page.get(coreExtensionData.routePath),
          title: page.get(coreExtensionData.title),
          children: page.get(coreExtensionData.routeChildren),
        })),
      );
    } else {
      yield coreExtensionData.reactElement(
        ExtensionBoundary.lazy(node, params.loader),
      );
    }

    if (params.routeRef) {
      yield coreExtensionData.routeRef(params.routeRef);
    }
    if (params.icon) {
      yield coreExtensionData.icon(params.icon);
    }
  },
});
