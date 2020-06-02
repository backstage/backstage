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

import { InputError } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { v4 as uuidv4 } from 'uuid';
import {
  EntitiesCatalog,
  Location,
  LocationsCatalog,
  LocationSpec,
} from '../catalog';
import { IngestionModel } from '../ingestion';
import { AddLocationResult, HigherOrderOperation } from './types';

const LOCATION_ANNOTATION = 'backstage.io/managed-by-location';

/**
 * Placeholder for operations that span several catalogs and/or stretches out
 * in time.
 *
 * TODO(freben): Find a better home for these, possibly refactoring to use the
 * database more directly.
 */
export class HigherOrderOperations implements HigherOrderOperation {
  private readonly entitiesCatalog: EntitiesCatalog;
  private readonly locationsCatalog: LocationsCatalog;
  private readonly ingestionModel: IngestionModel;

  constructor(
    entitiesCatalog: EntitiesCatalog,
    locationsCatalog: LocationsCatalog,
    ingestionModel: IngestionModel,
  ) {
    this.entitiesCatalog = entitiesCatalog;
    this.locationsCatalog = locationsCatalog;
    this.ingestionModel = ingestionModel;
  }

  /**
   * Adds a single location to the catalog.
   *
   * The location is inspected and fetched, and all of the resulting data is
   * validated. If everything goes well, the location and entities are stored
   * in the catalog.
   *
   * If the location already existed, the old location is returned instead and
   * the catalog is left unchanged.
   *
   * @param spec The location to add
   */
  async addLocation(spec: LocationSpec): Promise<AddLocationResult> {
    // Attempt to find a previous location matching the spec
    const previousLocations = await this.locationsCatalog.locations();
    const previousLocation = previousLocations.find(
      l => spec.type === l.data.type && spec.target === l.data.target,
    );
    const location: Location = previousLocation
      ? previousLocation.data
      : {
          id: uuidv4(),
          type: spec.type,
          target: spec.target,
        };

    // Read the location fully, bailing on any errors
    const readerOutput = await this.ingestionModel.readLocation(
      location.type,
      location.target,
    );
    const inputEntities: Entity[] = [];
    for (const entry of readerOutput) {
      if (entry.type === 'error') {
        throw new InputError(
          `Failed to read location ${location.type} ${location.target}, ${entry.error}`,
        );
      } else {
        // Append the location reference annotation
        entry.data.metadata.annotations = {
          ...entry.data.metadata.annotations,
          [LOCATION_ANNOTATION]: location.id,
        };
        inputEntities.push(entry.data);
      }
    }

    // TODO(freben): At this point, we could detect orphaned entities, by way
    // of having a LOCATION_ANNOTATION pointing to the location but not being
    // in the entities list. But we aren't sure what to do about those yet.

    // Write
    if (!previousLocation) {
      await this.locationsCatalog.addLocation(location);
    }
    const outputEntities: Entity[] = [];
    for (const entity of inputEntities) {
      const out = await this.entitiesCatalog.addOrUpdateEntity(
        entity,
        location.id,
      );
      outputEntities.push(out);
    }

    return { location, entities: outputEntities };
  }
}
