/*
 * Copyright 2021 The Backstage Authors
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
  catalogModuleDefinitions,
  CatalogClient,
} from '@backstage/catalog-client';
import { commonModuleDefinitions } from '@backstage/backend-common';

import {
  createDependencyConfig,
  createDependencyDefinitions,
  createDependencyModule,
  createDependencyDefinition,
} from '@backstage/app-context-common';
import { BadgeBuilder, DefaultBadgeBuilder } from '../lib';
import { BadgeFactories } from '../types';

export const badgesModuleDefinitions = createDependencyDefinitions({
  id: '@backstage/plugin-badges-backend',
  definitions: {
    badgeFactories: createDependencyDefinition<BadgeFactories>(
      Symbol.for('@backstage/plugin-badges-backend.BadgeFactories'),
    ),
    badgeBuilder: createDependencyDefinition<BadgeBuilder>(
      Symbol.for('@backstage/plugin-badges-backend.BadgeBuilder'),
    ),
  },
});

export const badgesModule = createDependencyModule({
  id: '@backstage/plugin-badges-backend',
  dependencies: [
    createDependencyConfig({
      id: catalogModuleDefinitions.definitions.catalogApi,
      dependencies: {
        discoveryApi:
          commonModuleDefinitions.definitions.pluginEndpointDiscovery,
      },
      factory: ({ discoveryApi }) =>
        new CatalogClient({
          discoveryApi: discoveryApi,
        }),
    }),
    createDependencyConfig({
      id: badgesModuleDefinitions.definitions.badgeFactories,
      factory: () => ({}),
    }),
    createDependencyConfig({
      id: badgesModuleDefinitions.definitions.badgeBuilder,
      dependencies: {
        badgeFactories: badgesModuleDefinitions.definitions.badgeFactories,
      },
      factory: ({ badgeFactories }) => new DefaultBadgeBuilder(badgeFactories),
    }),
  ],
});
