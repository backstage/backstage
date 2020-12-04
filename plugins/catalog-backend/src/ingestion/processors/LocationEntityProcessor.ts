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

import { Entity, LocationEntity, LocationSpec } from '@backstage/catalog-model';
import * as result from './results';
import { CatalogProcessor, CatalogProcessorEmit } from './types';
import path from 'path';

export function toAbsoluteUrl(base: LocationSpec, target: string): string {
  try {
    if (base.type === 'file') {
      if (target.startsWith('.')) {
        return path.join(path.dirname(base.target), target);
      }
      return target;
    }
    return new URL(target, base.target).toString();
  } catch (e) {
    return target;
  }
}

export class LocationRefProcessor implements CatalogProcessor {
  async postProcessEntity(
    entity: Entity,
    location: LocationSpec,
    emit: CatalogProcessorEmit,
  ): Promise<Entity> {
    if (entity.kind === 'Location') {
      const locationEntity = entity as LocationEntity;

      const type = locationEntity.spec.type || location.type;
      if (type === 'file' && location.target.endsWith(path.sep)) {
        emit(
          result.inputError(
            location,
            `LocationRefProcessor cannot handle ${type} type location with target ${location.target} that ends with a path separator`,
          ),
        );
      }

      const targets = new Array<string>();
      if (locationEntity.spec.target) {
        targets.push(locationEntity.spec.target);
      }
      if (locationEntity.spec.targets) {
        targets.push(...locationEntity.spec.targets);
      }

      for (const maybeRelativeTarget of targets) {
        const target = toAbsoluteUrl(location, maybeRelativeTarget);
        emit(result.location({ type, target }, false));
      }
    }

    return entity;
  }
}
