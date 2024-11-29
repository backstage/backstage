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

/**
 * Returns true if the given entity has labels annotation given by the
 * catalog. For use by EntitySwitch
 *
 * @public
 */
export function hasLabels(entity: Entity) {
  return entity?.metadata?.labels
    ? Object.keys(entity?.metadata?.labels).some(Boolean)
    : false;
}
