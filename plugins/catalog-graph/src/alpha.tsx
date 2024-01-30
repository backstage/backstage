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

import React from 'react';
import {
  createPageExtension,
  createPlugin,
  createSchemaFromZod,
} from '@backstage/frontend-plugin-api';
import {
  compatWrapper,
  convertLegacyRouteRef,
} from '@backstage/core-compat-api';
import { catalogGraphRouteRef, catalogEntityRouteRef } from './routes';
import { Direction } from './components';

const CatalogGraphPage = createPageExtension({
  defaultPath: '/catalog-graph',
  routeRef: convertLegacyRouteRef(catalogGraphRouteRef),
  configSchema: createSchemaFromZod(z =>
    z.object({
      path: z.string().default('/catalog-graph'),
      selectedKinds: z.array(z.string()).optional(),
      selectedRelations: z.array(z.string()).optional(),
      rootEntityRefs: z.array(z.string()).optional(),
      maxDepth: z.number().optional(),
      unidirectional: z.boolean().optional(),
      mergeRelations: z.boolean().optional(),
      direction: z.nativeEnum(Direction).optional(),
      showFilters: z.boolean().optional(),
      curve: z.enum(['curveStepBefore', 'curveMonotoneX']).optional(),
    }),
  ),
  loader: ({ config: { path, ...initialState } }) =>
    import('./components/CatalogGraphPage').then(m =>
      compatWrapper(<m.CatalogGraphPage initialState={initialState} />),
    ),
});

export default createPlugin({
  id: 'catalog-graph',
  routes: {
    catalogGraph: convertLegacyRouteRef(catalogGraphRouteRef),
  },
  externalRoutes: {
    catalogEntity: convertLegacyRouteRef(catalogEntityRouteRef),
  },
  extensions: [CatalogGraphPage],
});
