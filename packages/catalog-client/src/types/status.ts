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
  UNSTABLE_EntityStatusLevel,
  UNSTABLE_EntityStatusValue,
} from '@backstage/catalog-model';
import { SerializedError } from '@backstage/errors';

/*
 * This is the entity status field that's emitted by the catalog processing
 * engine, to inform about the status of an entity.
 *
 * Example:
 *
 * "status": {
 *   "backstage.io/catalog-processing": {
 *     "status": "error",
 *     "items": [
 *       {
 *         "status": "error",
 *         "error": {
 *           "name": "InputError",
 *           "message": "Syntax error: ..."
 *         }
 *       }
 *     ]
 *   }
 * }
 */

/**
 * The entity `status` key for the status of the processing engine in regards
 * to entity.
 */
export const ENTITY_STATUS_CATALOG_PROCESSING_KEY =
  'backstage.io/catalog-processing';

/**
 * The status value for the `backstage.io/catalog-processing` key.
 */
export type UNSTABLE_CatalogProcessingStatus = UNSTABLE_EntityStatusValue & {
  items?: UNSTABLE_CatalogProcessingStatusItem[];
};

export type UNSTABLE_CatalogProcessingStatusItem = {
  status: UNSTABLE_EntityStatusLevel;
  message?: string;
  error?: SerializedError;
};
