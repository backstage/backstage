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

import { TranslationRefTuple } from '../translation/TranslationRef';
import { translationApiRef } from '../apis';
import { IconElement } from '../icons/types';
import { RouteRef } from '../routing';
import { coreExtensionData, createExtensionBlueprint } from '../wiring';
import { ExtensionBoundary } from '../components';
import { optionalStringSchema } from '../schema/optionalStringSchema';

/**
 * Creates extensions that are sub-page React components attached to a parent page.
 * Sub-pages are rendered as tabs within the parent page's header.
 *
 * A subpage is an ordinary route-bearing extension below its parent page.
 * The app matches the extension tree, and the parent page renders the selected
 * child. The app provides the matched route ancestry around its entire output.
 *
 * Existing sub-pages retain implicit React Router v6 matches for compatibility.
 * To select a library explicitly, render its adapter inside the sub-page's
 * lazily loaded component. Adapters compose, so a sub-page may use a different routing library
 * from its parent page.
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
 *
 * In the lazy component module:
 * ```tsx
 * import { ReactRouterV6PageRouter } from '@backstage/frontend-adapter-react-router-v6';
 *
 * export const Overview = () => (
 *   <ReactRouterV6PageRouter>
 *     <OverviewContent />
 *   </ReactRouterV6PageRouter>
 * );
 * ```
 */
export const SubPageBlueprint = createExtensionBlueprint({
  kind: 'sub-page',
  attachTo: { relative: { kind: 'page' }, input: 'pages' },
  output: [
    coreExtensionData.routePath,
    coreExtensionData.reactElement,
    coreExtensionData.title,
    coreExtensionData.titleTranslation.optional(),
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
      title: string | TranslationRefTuple<undefined>;
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
    { config, node, apis },
  ) {
    yield coreExtensionData.routePath(config.path ?? params.path);
    const translation =
      typeof params.title === 'object' ? params.title : undefined;
    const translationApi =
      translation && config.title === undefined
        ? apis.get(translationApiRef)
        : undefined;
    if (translation && config.title === undefined && !translationApi) {
      throw new Error(
        `Translation API (core.translation) is required to resolve title '${translation.ref.id}:${translation.key}'`,
      );
    }
    const title =
      config.title ??
      (typeof params.title === 'object'
        ? translationApi!
            .getTranslation<Record<string, string>>(params.title.ref)
            .t(params.title.key)
        : params.title);
    yield coreExtensionData.title(title);
    if (translation) {
      yield coreExtensionData.titleTranslation(translation);
    }

    yield coreExtensionData.reactElement(
      ExtensionBoundary.lazy(node, params.loader),
    );
    if (params.routeRef) {
      yield coreExtensionData.routeRef(params.routeRef);
    }
    if (params.icon) {
      yield coreExtensionData.icon(params.icon);
    }
  },
});
