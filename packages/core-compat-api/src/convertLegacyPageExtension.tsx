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

import {
  getComponentData,
  RouteRef as LegacyRouteRef,
} from '@backstage/core-plugin-api';
import {
  ExtensionDefinition,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import { ReactRouterV6PageRouter } from '@backstage/plugin-app-react-router-v6';
import kebabCase from 'lodash/kebabCase';
import { convertLegacyRouteRef } from './convertLegacyRouteRef';
import { ComponentType } from 'react';
import { compatWrapper } from './compatWrapper';

/** @public */
export function convertLegacyPageExtension(
  LegacyExtension: ComponentType<{}>,
  overrides?: {
    name?: string;
    path?: string;
    /**
     * @deprecated Use the `path` param instead.
     */
    defaultPath?: [Error: `Use the 'path' override instead`];
  },
): ExtensionDefinition {
  const element = <LegacyExtension />;

  const extName = getComponentData<string>(element, 'core.extensionName');
  if (!extName) {
    throw new Error('Extension has no name');
  }

  const mountPoint = getComponentData<LegacyRouteRef>(
    element,
    'core.mountPoint',
  );

  const name = extName.endsWith('Page')
    ? extName.slice(0, -'Page'.length)
    : extName;
  const kebabName = kebabCase(name);

  return PageBlueprint.make({
    name: overrides?.name ?? kebabName,
    params: {
      path: overrides?.path ?? `/${kebabName}`,
      noHeader: true,
      routeRef: mountPoint && convertLegacyRouteRef(mountPoint),
      // A legacy page is a React Router v6 page by definition: the old
      // frontend system mounts every page in a real v6 route tree, and
      // `createRoutableExtension` calls `useRouteRef` from
      // `@backstage/core-plugin-api` — which reads `useLocation` — before the
      // page's own component renders at all. The new frontend system provides
      // no routing library context at page depth, so the converter declares
      // the one the page it is converting has always had. That is what lets a
      // legacy plugin keep working once converted without its author changing
      // anything, which is the whole promise of this package.
      //
      // Declared here, at the page, and not in `compatWrapper` or in the
      // entity card and content converters: those produce page *content*, and
      // an adapter there would re-scope to the page's own mount and drop the
      // route match of the entity tab the content is rendered under, changing
      // how that content's own nested routes resolve.
      loader: async () => (
        <ReactRouterV6PageRouter>
          {compatWrapper(element)}
        </ReactRouterV6PageRouter>
      ),
    },
  });
}
