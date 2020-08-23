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
  GroupEntity,
  LocationSpec,
} from '@backstage/catalog-model';
import { CatalogProcessor, CatalogProcessorEmit } from './types';
import * as result from './results';

export class GroupPopulatorProcessor implements CatalogProcessor {
  async postProcessEntity(
    entity: Entity,
    _location: LocationSpec,
    emit: CatalogProcessorEmit,
  ): Promise<Entity> {
    if (entity.kind.toLowerCase() !== 'group') {
      return entity;
    }
    const spec = entity.spec as GroupEntity['spec'];

    const { parent, children } = spec;
    const self = {
      kind: entity.kind,
      name: entity.metadata.name,
      namespace: entity.metadata.namespace ?? ENTITY_DEFAULT_NAMESPACE,
    };

    if (parent) {
      emit(
        result.relation({
          type: 'parent',
          source: self,
          target: { ...self, name: parent },
        }),
      );
      emit(
        result.relation({
          type: 'child',
          source: { ...self, name: parent },
          target: self,
        }),
      );
    }

    if (children) {
      for (const child of children) {
        emit(
          result.relation({
            type: 'child',
            source: self,
            target: { ...self, name: child },
          }),
        );
        emit(
          result.relation({
            type: 'parent',
            source: { ...self, name: child },
            target: self,
          }),
        );
      }
    }

    return entity;
  }
}
