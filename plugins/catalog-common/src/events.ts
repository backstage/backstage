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

import { EventParams } from '@backstage/backend-common';

/**
 * Base type for all events emitted from the Backstage software catalog (catalog-backend).
 * @public
 */
export type CatalogEvent<
  TPayload extends CatalogEventPayload = CatalogEventPayload,
> = EventParams<TPayload> & {
  topic: 'backstage.catalog';
};

/**
 * Payload for catalog events; contains minimally a type (e.g. `catalog.entity.insert`), and often
 * a related entityRef.
 * @public
 */
export type CatalogEventPayload = {
  type: string;
  originatingEntityRef?: string;
};
