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
 * The normalized form of a single history event table row.
 */
export interface EventsTableEntry {
  /** A unique identifier for this particular event; a string form of an ever increasing big integer */
  eventId: string;
  /** When the event happened */
  eventAt: Date;
  /** The distinct type of event */
  eventType: string;
  /** The entity ref related to the event, where applicable */
  entityRef?: string;
  /** The entity uid related to the event, where applicable */
  entityId?: string;
  /** The JSON serialized body of the affected entity before the change, where applicable (for updates only) */
  entityJsonBefore?: string;
  /** The JSON serialized body of the entity related to the event, where applicable */
  entityJson?: string;
  /** The location id related to the event, where applicable */
  locationId?: string;
  /** The location ref before the change, where applicable (for updates only) */
  locationRefBefore?: string;
  /** The location ref related to the event, where applicable */
  locationRef?: string;
}

/**
 * The normalized form of a single history subscription table row.
 */
export interface SubscriptionsTableEntry {
  /** The ID of the subscription */
  subscriptionId: string;
  /** An ISO timestamp string for when the subscription was created */
  createdAt: Date;
  /** An ISO timestamp string for when the subscription was last active */
  activeAt: Date;
  /** The state of the subscription */
  state: 'idle' | 'waiting';
  /** The unique ID that must be used to acknowledge the last sent batch of events, if in "waiting" state */
  ackId?: string;
  /** The deadline for acknowledging the last sent batch of events, if in "waiting" state */
  ackTimeoutAt?: Date;
  /** The ID of the last acknowledged event */
  lastAcknowledgedEventId: string;
  /** The ID of the last sent event */
  lastSentEventId: string;
  /** The entity ref filter for the subscription */
  filterEntityRef?: string;
  /** The entity uid filter for the subscription */
  filterEntityId?: string;
}

export interface SummaryTableEntry {
  /** The ID of the summary entry */
  summaryId: string;
  /** The type of the reference, e.g. "entity_ref" or "entity_id" */
  refType: string;
  /** The value of the reference, e.g. an entity ref */
  refValue: string;
  /** The ID of the latest history event for this summary row */
  eventId: string;
}
