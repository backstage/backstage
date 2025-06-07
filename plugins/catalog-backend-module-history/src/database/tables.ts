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

import { EventsTableEntry, SubscriptionsTableEntry } from '../types';

/**
 * The raw form of a single history event table row as seen through knex.
 */
export interface EventsTableRow {
  event_id: string;
  event_at: Date | string;
  event_type: string;
  entity_ref: string | null;
  entity_id: string | null;
  entity_json: string | null;
  location_id: string | null;
  location_ref: string | null;
}

/**
 * Create the normalized form of a single history event table row.
 */
export function toEventsTableEntry(row: EventsTableRow): EventsTableEntry {
  return {
    eventId: String(row.event_id),
    eventAt: toDate(row.event_at),
    eventType: row.event_type,
    entityRef: row.entity_ref ?? undefined,
    entityId: row.entity_id ?? undefined,
    entityJson: row.entity_json ?? undefined,
    locationId: row.location_id ?? undefined,
    locationRef: row.location_ref ?? undefined,
  };
}

/**
 * The raw form of a single history subscription table row as seen through knex.
 */
export interface SubscriptionsTableRow {
  subscription_id: string;
  created_at: Date | string;
  active_at: Date | string;
  state: 'idle' | 'waiting';
  ack_id: string | null;
  ack_timeout_at: Date | string | null;
  last_acknowledged_event_id: number | string;
  last_sent_event_id: number | string;
  filter_entity_ref: string | null;
  filter_entity_id: string | null;
}

/**
 * Create the normalized form of a single history subscription table row.
 */
export function toSubscriptionsTableEntry(
  row: SubscriptionsTableRow,
): SubscriptionsTableEntry {
  return {
    subscriptionId: row.subscription_id,
    createdAt: toDate(row.created_at),
    activeAt: toDate(row.active_at),
    state: row.state,
    ackId: row.ack_id ?? undefined,
    ackTimeoutAt: row.ack_timeout_at ? toDate(row.ack_timeout_at) : undefined,
    lastAcknowledgedEventId: String(row.last_acknowledged_event_id),
    lastSentEventId: String(row.last_sent_event_id),
    filterEntityRef: row.filter_entity_ref ?? undefined,
    filterEntityId: row.filter_entity_id ?? undefined,
  };
}

function toDate(value: Date | string | number): Date {
  return typeof value === 'string' || typeof value === 'number'
    ? new Date(value)
    : value;
}
