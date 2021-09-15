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
  createComponentExtension,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import { catalogGraphPlugin } from './plugin';
import { catalogGraphRouteRef } from './routes';

export const EntityCatalogGraphCard = catalogGraphPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () =>
        import('./components/CatalogGraphCard').then(m => m.CatalogGraphCard),
    },
  }),
);

export const CatalogGraphPage = catalogGraphPlugin.provide(
  createRoutableExtension({
    component: () =>
      import('./components/CatalogGraphPage').then(m => m.CatalogGraphPage),
    mountPoint: catalogGraphRouteRef,
  }),
);
