/*
 * Copyright 2023 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import { createExtensionDataRef } from '@backstage/frontend-plugin-api';

/** @internal */
export const entityContentTitleDataRef = createExtensionDataRef<string>().with({
  id: 'catalog.entity-content-title',
});

/** @internal */
export const entityFilterFunctionDataRef = createExtensionDataRef<
  (entity: Entity) => boolean
>().with({ id: 'catalog.entity-filter-function' });

/** @internal */
export const entityFilterExpressionDataRef =
  createExtensionDataRef<string>().with({
    id: 'catalog.entity-filter-expression',
  });
