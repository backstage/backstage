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

import * as yup from 'yup';

export type DatabaseEntity = {
  id: string;
  locationId?: string;
  name: string;
};

export type AddDatabaseEntity = {
  locationId?: string;
  name: string;
};

export const addDatabaseEntitySchema: yup.Schema<AddDatabaseEntity> = yup
  .object({
    locationId: yup.string().optional(),
    name: yup.string().required(),
  })
  .noUnknown();

export type DatabaseLocation = {
  id: string;
  type: string;
  target: string;
};

export type AddDatabaseLocation = {
  type: string;
  target: string;
};

export const addDatabaseLocationSchema: yup.Schema<AddDatabaseLocation> = yup
  .object({
    type: yup.string().required(),
    target: yup.string().required(),
  })
  .noUnknown();

export enum DatabaseLocationUpdateLogStatus {
  FAIL = 'fail',
  SUCCESS = 'success',
}

export type DatabaseLocationUpdateLogEvent = {
  id: string;
  status: DatabaseLocationUpdateLogStatus;
  location_id: string;
  entity_name: string;
  created_at?: string;
  message?: string;
};
