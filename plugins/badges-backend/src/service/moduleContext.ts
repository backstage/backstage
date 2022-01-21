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

import { CatalogClient, catalogApiDep } from '@backstage/catalog-client';
import { pluginEndpointDiscoveryDep } from '@backstage/backend-common';

import {
  createDependencyConfig,
  createDependencyRef,
} from '@backstage/app-context-common';
import { BadgeBuilder, DefaultBadgeBuilder } from '../lib';
import { BadgeFactories } from '../types';

export const badgeFactoriesDep = createDependencyRef<BadgeFactories>(
  Symbol.for('@backstage/plugin-badges-backend.BadgeFactories'),
);
export const badgeBuilderDep = createDependencyRef<BadgeBuilder>(
  Symbol.for('@backstage/plugin-badges-backend.BadgeBuilder'),
);
export const dependencies = [
  createDependencyConfig({
    id: catalogApiDep,
    dependencies: {
      discoveryApi: pluginEndpointDiscoveryDep,
    },
    factory: ({ discoveryApi }) =>
      new CatalogClient({
        discoveryApi: discoveryApi,
      }),
  }),
  createDependencyConfig({
    id: badgeFactoriesDep,
    factory: () => ({}),
  }),
  createDependencyConfig({
    id: badgeBuilderDep,
    dependencies: {
      badgeFactories: badgeFactoriesDep,
    },
    factory: ({ badgeFactories }) => new DefaultBadgeBuilder(badgeFactories),
  }),
];
