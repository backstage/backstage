/*
 * Copyright 2023 The Backstage Authors
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
import { Entity } from '@backstage/catalog-model';

/**
 * Unprocessed entity data stored in the database.
 * @public
 */
export type UnprocessedEntity = {
  entity_id: string;
  entity_ref: string;
  unprocessed_entity: Entity;
  unprocessed_hash?: string;
  processed_entity?: Entity;
  result_hash?: string;
  cache?: UnprocessedEntityCache;
  next_update_at: string | Date;
  last_discovery_at: string | Date; // remove?
  errors?: UnprocessedEntityError[];
  location_key?: string;
};

/**
 * Unprocessed entity cache stored in the database.
 * @public
 */
export type UnprocessedEntityCache = {
  ttl: number;
  cache: object;
};

/**
 * Unprocessed entity error information stored in the database.
 * @public
 */
export type UnprocessedEntityError = {
  name: string;
  message: string;
  cause: {
    name: string;
    message: string;
    stack: string;
  };
};
