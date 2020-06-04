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

import { LocationSpec, Entity } from '@backstage/catalog-model';

export type LocationProcessor = {
  /**
   * Reads the contents of a location.
   *
   * @param location The location to read
   * @returns The output if the location could be read successfully, or
   *          undefined if the location is not to be handled by this processor
   * @throws NotFoundError if the location is handled by this reader, and the
   *         target did not exist
   * @throws Any other Error if the location is handled by this reader, and it
   *         could not be read successfully
   */
  readLocation?(
    location: LocationSpec,
  ): Promise<LocationProcessorResult[] | undefined>;

  parseData?(
    data: Buffer,
    location: LocationSpec,
  ): Promise<LocationProcessorResult[] | undefined>;

  processEntity?(entity: Entity, location: LocationSpec): Promise<Entity>;

  handleError?(error: Error, location: LocationSpec): Promise<void>;
};

export type LocationProcessorResult =
  | { type: 'error'; error: Error; location: LocationSpec } // An error occurred
  | { type: 'location'; location: LocationSpec; optional: boolean } // A location to read
  | { type: 'data'; data: Buffer; location: LocationSpec } // Some raw data was read
  | { type: 'entity'; entity: Entity; location: LocationSpec }; // An entity was produced
