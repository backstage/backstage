/*
 * Copyright 2020 The Backstage Authors
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
  Entity,
  CompoundEntityRef,
  parseEntityRef,
} from '@backstage/catalog-model';

// TODO(freben): This should be returning entity refs instead
/**
 * Get the related entity references.
 *
 * @public
 */
export function getEntityRelations(
  entity: Entity | undefined,
  relationType: string,
  filter?: { kind: string },
): CompoundEntityRef[] {
  let entityNames =
    entity?.relations
      ?.filter(r => r.type === relationType)
      .map(r => parseEntityRef(r.targetRef)) || [];

  if (filter?.kind) {
    entityNames = entityNames.filter(
      e =>
        e.kind.toLocaleLowerCase('en-US') ===
        filter.kind.toLocaleLowerCase('en-US'),
    );
  }

  return entityNames;
}
