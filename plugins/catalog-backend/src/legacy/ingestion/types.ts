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

import {
  Entity,
  EntityRelationSpec,
  Location,
  LocationSpec,
} from '@backstage/catalog-model';

//
// LocationReader
//

/** @deprecated This class was part of the legacy catalog engine */
export type HigherOrderOperation = {
  addLocation(
    spec: LocationSpec,
    options?: { dryRun?: boolean },
  ): Promise<AddLocationResult>;
  refreshAllLocations(): Promise<void>;
};

/** @deprecated This class was part of the legacy catalog engine */
export type AddLocationResult = {
  location: Location;
  entities: Entity[];
};

//
// LocationReader
//

/** @deprecated This class was part of the legacy catalog engine */
export type LocationReader = {
  /**
   * Reads the contents of a location.
   *
   * @param location The location to read
   * @throws An error if the location was handled by this reader, but could not
   *         be read
   */
  read(location: LocationSpec): Promise<ReadLocationResult>;
};

/** @deprecated This class was part of the legacy catalog engine */
export type ReadLocationResult = {
  entities: ReadLocationEntity[];
  errors: ReadLocationError[];
};

/** @deprecated This class was part of the legacy catalog engine */
export type ReadLocationEntity = {
  location: LocationSpec;
  entity: Entity;
  relations: EntityRelationSpec[];
};

/** @deprecated This class was part of the legacy catalog engine */
export type ReadLocationError = {
  location: LocationSpec;
  error: Error;
};
