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

import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  Entity,
  stringifyEntityRef,
  stringifyLocationRef,
} from '@backstage/catalog-model';
import { assertError } from '@backstage/errors';
import {
  CatalogProcessor,
  CatalogProcessorResult,
  DeferredEntity,
  EntityRelationSpec,
} from '@backstage/plugin-catalog-node';
import { locationSpecToLocationEntity } from '../util/conversion';
import {
  getEntityLocationRef,
  getEntityOriginLocationRef,
  validateEntityEnvelope,
} from './util';
import { RefreshKeyData } from './types';
import { LoggerService } from '@backstage/backend-plugin-api';

/**
 * Helper class for aggregating all of the emitted data from processors.
 */
export class ProcessorOutputCollector {
  private readonly errors = new Array<Error>();
  private readonly relations = new Array<EntityRelationSpec>();
  private readonly deferredEntities = new Array<DeferredEntity>();
  private readonly refreshKeys = new Array<RefreshKeyData>();
  private done = false;

  constructor(
    private readonly logger: LoggerService,
    private readonly parentEntity: Entity,
  ) {}

  generic(): (i: CatalogProcessorResult) => void {
    return i => this.receive(this.logger, i);
  }

  forProcessor(
    processor: CatalogProcessor,
  ): (i: CatalogProcessorResult) => void {
    const logger = this.logger.child({
      processor: processor.getProcessorName(),
    });
    return i => this.receive(logger, i);
  }

  results() {
    this.done = true;
    return {
      errors: this.errors,
      relations: this.relations,
      refreshKeys: this.refreshKeys,
      deferredEntities: this.deferredEntities,
    };
  }

  private receive(logger: LoggerService, i: CatalogProcessorResult) {
    if (this.done) {
      logger.warn(
        `Item of type "${
          i.type
        }" was emitted after processing had completed. Stack trace: ${
          new Error().stack
        }`,
      );
      return;
    }

    if (i.type === 'entity') {
      let entity: Entity;
      const location = stringifyLocationRef(i.location);

      try {
        entity = validateEntityEnvelope(i.entity);
      } catch (e) {
        assertError(e);
        logger.debug(`Envelope validation failed at ${location}, ${e}`);
        this.errors.push(e);
        return;
      }

      // The processor contract says you should return the "trunk" (current)
      // entity, not emit it. But it happens that this is misunderstood or
      // accidentally forgotten. This can lead to circular references which at
      // best is wasteful, so we try to be helpful by ignoring such emitted
      // entities.
      const entityRef = stringifyEntityRef(entity);
      if (entityRef === stringifyEntityRef(this.parentEntity)) {
        logger.warn(
          `Ignored emitted entity ${entityRef} whose ref was identical to the one being processed. This commonly indicates mistakenly emitting the input entity instead of returning it.`,
        );
        return;
      }

      // Note that at this point, we have only validated the envelope part of
      // the entity data. Annotations are not part of that, so we have to be
      // defensive and report an error if the annotations isn't a valid object, to avoid
      // hiding errors when adding location annotations.
      const annotations = entity.metadata.annotations || {};
      if (typeof annotations !== 'object' || Array.isArray(annotations)) {
        this.errors.push(
          new Error('metadata.annotations must be a valid object'),
        );
        return;
      }
      const originLocation = getEntityOriginLocationRef(this.parentEntity);
      entity = {
        ...entity,
        metadata: {
          ...entity.metadata,
          annotations: {
            ...annotations,
            [ANNOTATION_ORIGIN_LOCATION]: originLocation,
            [ANNOTATION_LOCATION]: location,
          },
        },
      };

      const locationKey =
        i.locationKey === undefined ? location : i.locationKey ?? undefined;
      this.deferredEntities.push({ entity, locationKey });
    } else if (i.type === 'location') {
      const entity = locationSpecToLocationEntity({
        location: i.location,
        parentEntity: this.parentEntity,
      });
      const locationKey = getEntityLocationRef(entity);
      this.deferredEntities.push({ entity, locationKey });
    } else if (i.type === 'relation') {
      this.relations.push(i.relation);
    } else if (i.type === 'error') {
      this.errors.push(i.error);
    } else if (i.type === 'refresh') {
      this.refreshKeys.push({ key: i.key });
    }
  }
}
