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

import { HumanDuration } from '@backstage/types';

export interface Config {
  catalog?: {
    /**
     * Configuration for the catalog history functionality
     */
    history?: {
      /**
       * Controls the settings for the history event publishing.
       */
      publishEvents?: {
        /**
         * Whether to publish history events onto the Backstage events-backend
         * bus, on the 'backstage.catalog.history.event' topic.
         *
         * @defaultValue false
         */
        enabled?: boolean;
      };

      /**
       * The maximum amount of time that catalog history events are retained.
       *
       * @remarks
       *
       * This deletion happens on a per-event basis, i.e. you will see old
       * individual events being deleted but newer ones stay around. Note that
       * this applies to all event types, meaning that the creation events will
       * be removed first.
       */
      eventMaxRetentionTime?: HumanDuration | string;

      /**
       * The amount of time that catalog history events are retained, after the
       * deletion of an entity.
       *
       * @remarks
       *
       * This deletion does not happen on a per-event basis; rather, the entire
       * history is deleted all at once when the most recent event is older than
       * this limit.
       *
       * Deletion happens by entity ref. Registering a new entity with the same
       * ref (but not necessarilyt he same ID) as a deleted entity will
       * contribute to renewing the retention of history events for that entity
       * ref. This way you can keep track of entities being re-appropriated in
       * a new place after deletion etc.
       */
      eventRetentionTimeAfterDeletion?: HumanDuration | string;

      /**
       * The amount of time that a subscription will wait for an acknowledgement
       * before a delivery is considered failed and gets marked for re-delivery.
       */
      subscriptionAckTimeout?: HumanDuration | string;

      /**
       * The amount of time that catalog history subscriptions are kept around
       * after no activity is detected on them.
       */
      subscriptionRetentionTimeAfterInactive?: HumanDuration | string;
    };
  };
}
