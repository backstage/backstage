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

import { Entity, LocationEntity } from '@backstage/catalog-model';
import { ScmIntegrationRegistry } from '@backstage/integration';
import path from 'path';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import {
  processingResult,
  CatalogProcessor,
  CatalogProcessorEmit,
} from '@backstage/plugin-catalog-node';

export function toAbsoluteUrl(
  integrations: ScmIntegrationRegistry,
  base: LocationSpec,
  target: string,
): string {
  try {
    if (base.type === 'file') {
      if (target.startsWith('.')) {
        return path.join(path.dirname(base.target), target);
      }
      return target;
    }
    return integrations.resolveUrl({ url: target, base: base.target });
  } catch (e) {
    return target;
  }
}

/**
 * @public
 * @deprecated This processor should no longer be used
 */
export type LocationEntityProcessorOptions = {
  integrations: ScmIntegrationRegistry;
};

/**
 * Legacy processor, should not be used.
 *
 * @remarks
 *
 * In the old catalog architecture, this processor translated Location entities
 * into URLs that should be fetched. This is no longer needed since the engine
 * handles this internally.
 *
 * @public
 * @deprecated This processor should no longer be used
 */
export class LocationEntityProcessor implements CatalogProcessor {
  constructor(private readonly options: LocationEntityProcessorOptions) {}

  getProcessorName(): string {
    return 'LocationEntityProcessor';
  }

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
          processingResult.inputError(
            location,
            `LocationEntityProcessor cannot handle ${type} type location with target ${location.target} that ends with a path separator`,
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
        const target = toAbsoluteUrl(
          this.options.integrations,
          location,
          maybeRelativeTarget,
        );
        emit(processingResult.location({ type, target }));
      }
    }

    return entity;
  }
}
