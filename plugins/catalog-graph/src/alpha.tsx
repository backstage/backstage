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

type Zod = Parameters<Parameters<typeof createSchemaFromZod>[0]>[0];

function getCompoundEntityRefConfigSchema(z: Zod) {
  return z.object({
    kind: z.string(),
    namespace: z.string(),
    name: z.string(),
  });
}

function getEntityGraphRelationsConfigSchema(z: Zod) {
  // Mapping EntityRelationsGraphProps to config
  // TODO: Define how className and render functions will be configured
  return z.object({
    rootEntityRef: getCompoundEntityRefConfigSchema(z)
      .or(z.array(getCompoundEntityRefConfigSchema(z)))
      .optional(),
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
  name: 'catalog-graph',
  configSchema: createSchemaFromZod(z =>
    z
      .object({
        // Filter is a config required to all entity cards
        filter: z.string().optional(),
        title: z.string().optional(),
        height: z.number().optional(),
        variant: z.enum(['flex', 'fullHeight', 'gridItem']).optional(),
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
      // Mapping intialState prop to config
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
