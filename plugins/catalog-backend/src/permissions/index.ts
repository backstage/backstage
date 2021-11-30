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

import { RESOURCE_TYPE_CATALOG_ENTITY } from '@backstage/catalog-model';
import { createConditionExports } from '@backstage/plugin-permission-node';
import { hasAnnotation, isEntityKind, isEntityOwner } from './rules';

export const { conditions, createPolicyDecision } = createConditionExports({
  pluginId: 'catalog',
  // TODO(authorization-framework): what if a single plugin has
  // multiple resource types?
  resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
  rules: { hasAnnotation, isEntityKind, isEntityOwner },
});
