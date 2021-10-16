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
  EntityName,
  getEntityName,
  parseEntityName,
} from '@backstage/catalog-model';
import { upperFirst } from 'lodash';

const TECHDOCS_ANNOTATION = 'backstage.io/techdocs-ref';
const CATALOG_ANNOTATION_PREFIX = 'catalog:';

export function getTechdocsEntityRef(
  entity: Entity,
  caseSensitive?: boolean,
): EntityName {
  const projectId = entity.metadata.annotations?.[TECHDOCS_ANNOTATION];
  let entityRef: EntityName = getEntityName(entity);

  if (projectId?.startsWith(CATALOG_ANNOTATION_PREFIX)) {
    const ref = projectId.substr(CATALOG_ANNOTATION_PREFIX.length);
    entityRef = parseEntityName(ref);

    // Only do this if app-config techdocs.legacyUseCaseSensitiveTripletPaths is set
    if (caseSensitive) {
      entityRef.kind = upperFirst(entityRef.kind);
    }
  }

  return entityRef;
}
