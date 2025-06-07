/*
 * Copyright 2024 The Backstage Authors
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

import { Event } from '../../schema/openapi/generated/models';
import { EventsTableEntry } from '../../types';

/**
 * Converts a database entry to the shape expected in service responses.
 */
export function toResponseEvent(event: EventsTableEntry): Event {
  return {
    eventId: event.eventId,
    eventAt: event.eventAt.toISOString(),
    eventType: event.eventType,
    entityRef: event.entityRef,
    entityId: event.entityId,
    entityJson: event.entityJson ? JSON.parse(event.entityJson) : undefined,
    locationId: event.locationId,
    locationRef: event.locationRef,
  };
}
