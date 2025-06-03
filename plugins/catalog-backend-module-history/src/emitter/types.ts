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

import { JsonObject } from '@backstage/types';
import { CatalogEvent } from '../service/endpoints/types';

/**
 * The events backend topic that the catalog history events are emitted on.
 *
 * @public
 */
export const CATALOG_HISTORY_EVENT_TOPIC = 'backstage.catalog.history.event';

/**
 * A history event as emitted by the catalog backend to the events backend.
 *
 * @public
 */
export interface CatalogHistoryEventPayload {
  /** A unique identifier for this particular event; a string form of an ever increasing big integer */
  eventId: string;
  /** When the event happened, as an ISO timestamp string */
  eventAt: string;
  /** The distinct type of event */
  eventType: string;
  /** The entity ref related to the event, where applicable */
  entityRef?: string;
  /** The entity uid related to the event, where applicable */
  entityId?: string;
  /** The body of the entity related to the event, where applicable */
  entity?: JsonObject;
  /** The location id related to the event, where applicable */
  locationId?: string;
  /** The location ref related to the event, where applicable */
  locationRef?: string;
}

export function toEventPayload(
  event: CatalogEvent,
): CatalogHistoryEventPayload {
  return {
    eventId: event.eventId,
    eventAt: event.eventAt.toISOString(),
    eventType: event.eventType,
    entityId: event.entityId,
    entityRef: event.entityRef,
    entity: event.entityJson ? JSON.parse(event.entityJson) : undefined,
    locationId: event.locationId,
    locationRef: event.locationRef,
  };
}
