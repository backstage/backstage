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
import { createEntityCardExtension } from '@backstage/plugin-catalog-react/alpha';
import { catalogGraphRouteRef, catalogEntityRouteRef } from './routes';
import { Direction } from './components';

function getEntityGraphRelationsConfigSchema(
  z: Parameters<Parameters<typeof createSchemaFromZod>[0]>[0],
) {
  // Mapping EntityRelationsGraphProps to config
  // The classname and render functions are configurable only via extension overrides
  return z.object({
    kinds: z.array(z.string()).optional(),
    relations: z.array(z.string()).optional(),
    maxDepth: z.number().optional(),
    unidirectional: z.boolean().optional(),
    mergeRelations: z.boolean().optional(),
    direction: z.nativeEnum(Direction).optional(),
    relationPairs: z.array(z.tuple([z.string(), z.string()])).optional(),
    zoom: z.enum(['enabled', 'disabled', 'enable-on-click']).optional(),
    curve: z.enum(['curveStepBefore', 'curveMonotoneX']).optional(),
  });
}

const CatalogGraphEntityCard = createEntityCardExtension({
  name: 'relations',
  configSchema: createSchemaFromZod(z =>
    z
      .object({
        // Filter is a config required to all entity cards
        filter: z.string().optional(),
        title: z.string().optional(),
        height: z.number().optional(),
        // Skipping a "variant" config for now, defaulting to "gridItem" in the component
        // For more details, see this comment: https://github.com/backstage/backstage/pull/22619#discussion_r1477333252
      })
      .merge(getEntityGraphRelationsConfigSchema(z)),
  ),
  loader: async ({ config: { filter, ...props } }) =>
    import('./components/CatalogGraphCard').then(m =>
      compatWrapper(<m.CatalogGraphCard {...props} />),
    ),
});

const CatalogGraphPage = createPageExtension({
  defaultPath: '/catalog-graph',
  routeRef: convertLegacyRouteRef(catalogGraphRouteRef),
  configSchema: createSchemaFromZod(z =>
    z.object({
      // Path is a default config required to all pages
      path: z.string().default('/catalog-graph'),
      // Mapping intialState prop to config, these are the initial filter values, as opposed to configuration of the available filter values
      initialState: z
        .object({
          selectedKinds: z.array(z.string()).optional(),
          selectedRelations: z.array(z.string()).optional(),
          rootEntityRefs: z.array(z.string()).optional(),
          maxDepth: z.number().optional(),
          unidirectional: z.boolean().optional(),
          mergeRelations: z.boolean().optional(),
          direction: z.nativeEnum(Direction).optional(),
          showFilters: z.boolean().optional(),
          curve: z.enum(['curveStepBefore', 'curveMonotoneX']).optional(),
        })
        .merge(getEntityGraphRelationsConfigSchema(z))
        .optional(),
    }),
  ),
  loader: ({ config: { path, ...props } }) =>
    import('./components/CatalogGraphPage').then(m =>
      compatWrapper(<m.CatalogGraphPage {...props} />),
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
  extensions: [CatalogGraphPage, CatalogGraphEntityCard],
});
