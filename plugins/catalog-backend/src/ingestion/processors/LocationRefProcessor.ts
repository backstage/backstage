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

import { Entity, LocationRef, LocationSpec } from '@backstage/catalog-model';
import * as result from './results';
import { LocationProcessor, LocationProcessorEmit } from './types';

export class LocationRefProcessor implements LocationProcessor {
  async processEntity(
    entity: Entity,
    _location: LocationSpec,
    emit: LocationProcessorEmit,
  ): Promise<Entity> {
    if (entity.kind === 'LocationRef') {
      const location = entity as LocationRef;
      if (location.spec.target) {
        emit(
          result.location(
            { type: location.spec.type, target: location.spec.target },
            false,
          ),
        );
      }
      if (location.spec.targets) {
        for (const target of location.spec.targets) {
          emit(result.location({ type: location.spec.type, target }, false));
        }
      }
    }

    return entity;
  }
}
