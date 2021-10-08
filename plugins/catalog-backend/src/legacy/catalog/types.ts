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

import { Location } from '@backstage/catalog-model';

//
// Locations
//

/** @deprecated This was part of the legacy catalog engine */
export type LocationUpdateStatus = {
  timestamp: string | null;
  status: string | null;
  message: string | null;
};

/** @deprecated This was part of the legacy catalog engine */
export type LocationUpdateLogEvent = {
  id: string;
  status: 'fail' | 'success';
  location_id: string;
  entity_name: string;
  created_at?: string;
  message?: string;
};

/** @deprecated This was part of the legacy catalog engine */
export type LocationResponse = {
  data: Location;
  currentStatus: LocationUpdateStatus;
};

/** @deprecated This was part of the legacy catalog engine */
export type LocationsCatalog = {
  addLocation(location: Location): Promise<Location>;
  removeLocation(id: string): Promise<void>;
  locations(): Promise<LocationResponse[]>;
  location(id: string): Promise<LocationResponse>;
  locationHistory(id: string): Promise<LocationUpdateLogEvent[]>;
  logUpdateSuccess(
    locationId: string,
    entityName?: string | string[],
  ): Promise<void>;
  logUpdateFailure(
    locationId: string,
    error?: Error,
    entityName?: string,
  ): Promise<void>;
};
