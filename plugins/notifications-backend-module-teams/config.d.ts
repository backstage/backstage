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

import { HumanDuration } from '@backstage/types';

export interface Config {
  /**
   * Configuration options for notifications-backend-module-teams */
  notifications: {
    processors: {
      teams: {
        /**
         * Concurrency limit for message sending, defaults to 2
         */
        concurrencyLimit?: number;
        /**
         * Throttle duration between message sending, defaults to 100ms
         */
        throttleInterval?: HumanDuration;
        /**
         * Configuration for broadcast notifications
         */
        broadcastConfig?: {
          /**
           * Teams webhook URLs for broadcast notifications
           */
          webhooks?: string[];
        };
        cache?: {
          /**
           * Webhook cache TTL, defaults to 1 hour
           */
          ttl?: HumanDuration;
        };
      };
    };
  };
}
