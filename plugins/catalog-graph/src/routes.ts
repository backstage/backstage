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
  createExternalRouteRef,
  createRouteRef,
} from '@backstage/core-plugin-api';

/**
 * Route pointing to the standalone catalog graph page.
 *
 * @public
 */
export const catalogGraphRouteRef = createRouteRef({
  id: 'catalog-graph',
});

/**
 * Route pointing to the entity page.
 * Used to navigate from the graph to an entity.
 *
 * @public
 * @deprecated This route is no longer used and can be removed
 */
export const catalogEntityRouteRef = createExternalRouteRef({
  id: 'catalog-entity',
  params: ['namespace', 'kind', 'name'],
  optional: true,
  defaultTarget: 'catalog.catalogEntity',
});
