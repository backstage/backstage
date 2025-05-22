/*
 * Copyright 2025 The Backstage Authors
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

/**
 * The events backend topic that the catalog history events are emitted on.
 *
 * @public
 */
export const CATALOG_HISTORY_EVENT_TOPIC = 'backstage.catalog.history.event';

/**
 * A history event as emitted by the catalog backend.
 *
 * @public
 */
export interface CatalogHistoryEvent {
  eventId: string;
  eventAt: string;
  eventType: string;
  entityRef?: string;
  entityId?: string;
  locationId?: string;
  locationRef?: string;
}
