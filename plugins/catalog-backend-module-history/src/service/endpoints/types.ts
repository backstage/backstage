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

/**
 * A single history event, received through a consumer's subscription.
 *
 * @public
 */
export interface CatalogEvent {
  /** A unique identifier for this particular event */
  eventId: string;
  /** When the event happened */
  eventAt: Date;
  /** The distinct type of event */
  eventType: string;
  /** The entity ref related to the event, where applicable */
  entityRef?: string;
  /** The entity uid related to the event, where applicable */
  entityId?: string;
  /** The JSON serialized body of the entity related to the event, where applicable */
  entityJson?: string;
  /** The location id related to the event, where applicable */
  locationId?: string;
  /** The location ref related to the event, where applicable */
  locationRef?: string;
}

/**
 * A subscription to catalog events.
 *
 * @public
 */
export interface CatalogEventSubscription {
  /** The ID of the subscription */
  subscriptionId: string;
  /** An ISO timestamp string for when the subscription was created */
  createdAt: Date;
  /** An ISO timestamp string for when the subscription was last active */
  activeAt: Date;
  /** The entity ref filter for the subscription */
  filterEntityRef?: string;
  /** The entity uid filter for the subscription */
  filterEntityId?: string;
}
