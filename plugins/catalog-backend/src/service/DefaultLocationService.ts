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
  Entity,
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  stringifyEntityRef,
  CompoundEntityRef,
  parseEntityRef,
} from '@backstage/catalog-model';
import { Location } from '@backstage/catalog-client';
import { CatalogProcessingOrchestrator } from '../processing/types';
import { LocationInput, LocationService, LocationStore } from './types';
import { locationSpecToMetadataName } from '../util/conversion';
import { InputError } from '@backstage/errors';
import { DeferredEntity } from '@backstage/plugin-catalog-node';

export type DefaultLocationServiceOptions = {
  allowedLocationTypes: string[];
};

export class DefaultLocationService implements LocationService {
  constructor(
    private readonly store: LocationStore,
    private readonly orchestrator: CatalogProcessingOrchestrator,
    private readonly options: DefaultLocationServiceOptions = {
      allowedLocationTypes: ['url'],
    },
  ) {}

  async createLocation(
    input: LocationInput,
    dryRun: boolean,
  ): Promise<{ location: Location; entities: Entity[]; exists?: boolean }> {
    if (!this.options.allowedLocationTypes.includes(input.type)) {
      throw new InputError(
        `Registered locations must be of an allowed type ${JSON.stringify(
          this.options.allowedLocationTypes,
        )}`,
      );
    }
    if (dryRun) {
      return this.dryRunCreateLocation(input);
    }
    const location = await this.store.createLocation(input);
    return { location, entities: [] };
  }

  listLocations(): Promise<Location[]> {
    return this.store.listLocations();
  }
  getLocation(id: string): Promise<Location> {
    return this.store.getLocation(id);
  }
  deleteLocation(id: string): Promise<void> {
    return this.store.deleteLocation(id);
  }

  getLocationByEntity(
    entityRef: CompoundEntityRef | string,
  ): Promise<Location> {
    return this.store.getLocationByEntity(parseEntityRef(entityRef));
  }

  private async processEntities(
    unprocessedEntities: DeferredEntity[],
  ): Promise<Entity[]> {
    const entities: Entity[] = [];
    while (unprocessedEntities.length) {
      const currentEntity = unprocessedEntities.pop();
      if (!currentEntity) {
        continue;
      }
      const processed = await this.orchestrator.process({
        entity: currentEntity.entity,
        state: {}, // we process without the existing cache
      });

      if (processed.ok) {
        if (
          entities.some(
            e =>
              stringifyEntityRef(e) ===
              stringifyEntityRef(processed.completedEntity),
          )
        ) {
          throw new InputError(
            `Duplicate nested entity: ${stringifyEntityRef(
              processed.completedEntity,
            )}`,
          );
        }
        unprocessedEntities.push(...processed.deferredEntities);
        entities.push(processed.completedEntity);
      } else {
        throw new InputError(processed.errors.map(String).join(', '));
      }
    }
    return entities;
  }

  private async dryRunCreateLocation(
    spec: LocationInput,
  ): Promise<{ location: Location; entities: Entity[]; exists?: boolean }> {
    // Run the existence check in parallel with the processing
    const existsPromise = this.store
      .listLocations()
      .then(locations =>
        locations.some(l => l.type === spec.type && l.target === spec.target),
      );

    const entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Location',
      metadata: {
        name: locationSpecToMetadataName({
          type: spec.type,
          target: spec.target,
        }),
        namespace: 'default',
        annotations: {
          [ANNOTATION_LOCATION]: `${spec.type}:${spec.target}`,
          [ANNOTATION_ORIGIN_LOCATION]: `${spec.type}:${spec.target}`,
        },
      },
      spec: {
        type: spec.type,
        target: spec.target,
      },
    };
    const unprocessedEntities: DeferredEntity[] = [
      { entity, locationKey: `${spec.type}:${spec.target}` },
    ];
    const entities: Entity[] = await this.processEntities(unprocessedEntities);

    return {
      exists: await existsPromise,
      location: { ...spec, id: `${spec.type}:${spec.target}` },
      entities,
    };
  }
}
