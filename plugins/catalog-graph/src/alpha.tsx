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
  createFrontendPlugin,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import {
  compatWrapper,
  convertLegacyRouteRef,
} from '@backstage/core-compat-api';
import { EntityCardBlueprint } from '@backstage/plugin-catalog-react/alpha';
import { catalogGraphRouteRef, catalogEntityRouteRef } from './routes';
import { Direction } from '@backstage/plugin-catalog-graph';

const CatalogGraphEntityCard = EntityCardBlueprint.makeWithOverrides({
  name: 'relations',
  config: {
    schema: {
      kinds: z => z.array(z.string()).optional(),
      relations: z => z.array(z.string()).optional(),
      maxDepth: z => z.number().optional(),
      unidirectional: z => z.boolean().optional(),
      mergeRelations: z => z.boolean().optional(),
      direction: z => z.nativeEnum(Direction).optional(),
      relationPairs: z => z.array(z.tuple([z.string(), z.string()])).optional(),
      zoom: z => z.enum(['enabled', 'disabled', 'enable-on-click']).optional(),
      curve: z => z.enum(['curveStepBefore', 'curveMonotoneX']).optional(),
      // Skipping a "variant" config for now, defaulting to "gridItem" in the component
      // For more details, see this comment: https://github.com/backstage/backstage/pull/22619#discussion_r1477333252
      title: z => z.string().optional(),
      height: z => z.number().optional(),
    },
  },
  factory(originalFactory, { config }) {
    return originalFactory({
      loader: async () =>
        import('./components/CatalogGraphCard').then(m =>
          compatWrapper(<m.CatalogGraphCard {...config} />),
        ),
    });
  },
});

const CatalogGraphPage = PageBlueprint.makeWithOverrides({
  config: {
    schema: {
      selectedKinds: z => z.array(z.string()).optional(),
      selectedRelations: z => z.array(z.string()).optional(),
      rootEntityRefs: z => z.array(z.string()).optional(),
      maxDepth: z => z.number().optional(),
      unidirectional: z => z.boolean().optional(),
      mergeRelations: z => z.boolean().optional(),
      direction: z => z.nativeEnum(Direction).optional(),
      showFilters: z => z.boolean().optional(),
      curve: z => z.enum(['curveStepBefore', 'curveMonotoneX']).optional(),
      kinds: z => z.array(z.string()).optional(),
      relations: z => z.array(z.string()).optional(),
      relationPairs: z => z.array(z.tuple([z.string(), z.string()])).optional(),
      zoom: z => z.enum(['enabled', 'disabled', 'enable-on-click']).optional(),
    },
  },
  factory(originalFactory, { config }) {
    return originalFactory({
      defaultPath: '/catalog-graph',
      routeRef: convertLegacyRouteRef(catalogGraphRouteRef),
      loader: () =>
        import('./components/CatalogGraphPage').then(m =>
          compatWrapper(<m.CatalogGraphPage {...config} />),
        ),
    });
  },
});

export default createFrontendPlugin({
  id: 'catalog-graph',
  routes: {
    catalogGraph: convertLegacyRouteRef(catalogGraphRouteRef),
  },
  externalRoutes: {
    catalogEntity: convertLegacyRouteRef(catalogEntityRouteRef),
  },
  extensions: [CatalogGraphPage, CatalogGraphEntityCard],
});

export { catalogGraphTranslationRef } from './translation';
