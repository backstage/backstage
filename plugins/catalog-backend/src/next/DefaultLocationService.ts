/*
 * Copyright 2021 Spotify AB
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
  LocationSpec,
  Location,
  Entity,
  LOCATION_ANNOTATION,
  ORIGIN_LOCATION_ANNOTATION,
} from '@backstage/catalog-model';
import {
  LocationService,
  LocationStore,
  CatalogProcessingOrchestrator,
} from './types';

export class DefaultLocationService implements LocationService {
  constructor(
    private readonly store: LocationStore,
    private readonly orchestrator: CatalogProcessingOrchestrator,
  ) {}

  async createLocation(
    spec: LocationSpec,
    dryRun: boolean,
  ): Promise<{ location: Location; entities: Entity[] }> {
    if (dryRun) {
      const entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Location',
        metadata: {
          name: `${spec.type}:${spec.target}`,
          namespace: 'default',
          annotations: {
            [LOCATION_ANNOTATION]: `${spec.type}:${spec.target}`,
            [ORIGIN_LOCATION_ANNOTATION]: `${spec.type}:${spec.target}`,
          },
        },
        spec: {
          location: { type: spec.type, target: spec.target },
        },
      };
      const processed = await this.orchestrator.process({
        entity,
        eager: true,
        state: new Map(),
      });
      if (processed.ok) {
        return {
          location: { ...spec, id: `${spec.type}:${spec.target}` },
          entities: [processed.completedEntity],
        };
      }

      throw Error('error handling not implemented.');
    }

    const location = await this.store.createLocation(spec);
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
}
