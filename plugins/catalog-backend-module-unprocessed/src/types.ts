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

export type HydratedRefreshState = {
  entity_id: string;
  entity_ref: string;
  unprocessed_entity: Entity;
  unprocessed_hash?: string;
  processed_entity?: Entity;
  result_hash?: string;
  cache?: RefreshStateCache;
  next_update_at: string | Date;
  last_discovery_at: string | Date; // remove?
  errors?: RefreshStateError[];
  location_key?: string;
};

export type RefreshState = {
  entity_id: string;
  entity_ref: string;
  unprocessed_entity: string;
  unprocessed_hash?: string;
  processed_entity?: string;
  result_hash?: string;
  cache?: string;
  next_update_at: string | Date;
  last_discovery_at: string | Date; // remove?
  errors?: string;
  location_key?: string;
};
export type RefreshStateCache = {
  ttl: number;
  cache: object;
};

export type RefreshStateError = {
  name: string;
  message: string;
  cause: {
    name: string;
    message: string;
    stack: string;
  };
};

export interface UnprocessedEntitiesRequest {
  reason: 'failed' | 'pending';
  owner?: string;
  authorizationToken?: string;
}

export interface UnprocessedEntitiesResponse {
  type: 'pending' | 'failed';
  entities: HydratedRefreshState[];
}
