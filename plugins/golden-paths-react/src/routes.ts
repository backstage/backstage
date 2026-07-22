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
import { createRouteRef, createSubRouteRef } from '@backstage/core-plugin-api';

/** @public */
export const rootRouteRef = createRouteRef({
  id: 'golden-paths',
});

/** @public */
export const detailsRouteRef = createSubRouteRef({
  id: 'golden-paths.details',
  parent: rootRouteRef,
  path: '/:namespace/:name',
});

/** @public */
export const initialParamsRouteRef = createSubRouteRef({
  id: 'golden-paths.initial-params',
  parent: rootRouteRef,
  path: '/:namespace/:name/initial-params',
});

/** @public */
export const executeRouteRef = createSubRouteRef({
  id: 'golden-paths.execute',
  parent: rootRouteRef,
  path: '/tasks/:taskId',
});

/** @public */
export const tasksRouteRef = createSubRouteRef({
  id: 'golden-paths.tasks',
  parent: rootRouteRef,
  path: '/tasks',
});
