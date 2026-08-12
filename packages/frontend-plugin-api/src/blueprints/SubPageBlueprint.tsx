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

import { IconElement } from '../icons/types';
import { RouteRef } from '../routing';
import {
  coreExtensionData,
  createExtensionBlueprint,
  createExtensionInput,
} from '../wiring';
import { ExtensionBoundary } from '../components';
import { optionalStringSchema } from '../schema/optionalStringSchema';
import { PageRouterBlueprint } from './PageRouterBlueprint';

/**
 * Creates extensions that are sub-page React components attached to a parent page.
 * Sub-pages are rendered as tabs within the parent page's header.
 *
 * A subpage is an ordinary route one level below its parent page: the page
 * publishes the subpath, top-level route matching registers it, and the match
 * names the subpage to show. The optional `router` input is passed to the
 * parent page as internal metadata rather than rendered here. The page then
 * selects exactly one adapter: the selected subpage override, the page
 * override, or the app-wide default, in that order. Without its own override,
 * a subpage inherits the page adapter at the page mount while its content
 * still receives the selected subpage's `PageMount`.
 *
 * An inherited adapter's native routing APIs remain scoped to the page. Use
 * the framework's `useHref` or `RouteLink` for targets that should resolve
 * from the selected subpage, or attach an explicit router when the native APIs
 * need the subpage itself as their root.
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
    router: createExtensionInput([PageRouterBlueprint.dataRefs.component], {
      singleton: true,
      optional: true,
    }),
  },
  output: [
    coreExtensionData.routePath,
    coreExtensionData.reactElement,
    coreExtensionData.title,
    coreExtensionData.routeRef.optional(),
    coreExtensionData.icon.optional(),
    PageRouterBlueprint.dataRefs.component.optional(),
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
    const routePath = config.path ?? params.path;
    const RouterOverride = inputs.router?.get(
      PageRouterBlueprint.dataRefs.component,
    );

    yield coreExtensionData.routePath(routePath);
    yield coreExtensionData.title(config.title ?? params.title);
    yield coreExtensionData.reactElement(
      ExtensionBoundary.lazy(node, params.loader),
    );
    if (RouterOverride) {
      yield PageRouterBlueprint.dataRefs.component(RouterOverride);
    }
    if (params.routeRef) {
      yield coreExtensionData.routeRef(params.routeRef);
    }
    if (params.icon) {
      yield coreExtensionData.icon(params.icon);
    }
  },
});
