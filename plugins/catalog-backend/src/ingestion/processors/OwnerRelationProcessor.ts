/*
 * Copyright 2020 Spotify AB
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
  ENTITY_DEFAULT_NAMESPACE,
  LocationSpec,
  parseEntityRef,
  ApiEntityV1alpha1,
  ComponentEntityV1alpha1,
  RELATION_OWNED_BY,
  RELATION_OWNER_OF,
  getEntityName,
} from '@backstage/catalog-model';
import { CatalogProcessor, CatalogProcessorEmit } from './types';
import * as result from './results';

const includedKinds = new Set(['api', 'component']);

export class OwnerRelationProcessor implements CatalogProcessor {
  async postProcessEntity(
    entity: Entity,
    _location: LocationSpec,
    emit: CatalogProcessorEmit,
  ): Promise<Entity> {
    if (!includedKinds.has(entity.kind.toLowerCase())) {
      return entity;
    }
    const apiOrComponentEntity = entity as
      | ApiEntityV1alpha1
      | ComponentEntityV1alpha1;

    const owner = apiOrComponentEntity.spec?.owner;
    if (owner) {
      const namespace = entity.metadata.namespace ?? ENTITY_DEFAULT_NAMESPACE;

      const selfRef = getEntityName(entity);
      const ownerRef = parseEntityRef(owner, {
        defaultKind: 'group',
        defaultNamespace: namespace,
      });

      emit(
        result.relation({
          source: selfRef,
          type: RELATION_OWNED_BY,
          target: ownerRef,
        }),
      );
      emit(
        result.relation({
          source: ownerRef,
          type: RELATION_OWNER_OF,
          target: selfRef,
        }),
      );
    }

    return entity;
  }
}
