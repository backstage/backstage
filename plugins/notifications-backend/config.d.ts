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
   * Configuration options for notifications-backend
   */
  notifications?: {
    /**
     * Concurrency limit for notification sending, defaults to 10
     */
    concurrencyLimit?: number;
    /**
     * Throttle duration between notification sending, defaults to 50ms
     */
    throttleInterval?: HumanDuration | string;
    /**
     * Default settings for user specific notification settings
     */
    defaultSettings?: {
      channels?: {
        /**
         * Channel identifier (e.g., 'Web', 'Email')
         */
        id: string;
        /**
         * Optional flag to enable/disable the channel by default.
         * If not set, defaults to true for backwards compatibility.
         * When set to false, the channel uses an opt-in strategy where
         * origins are disabled by default unless explicitly enabled.
         */
        enabled?: boolean;
        origins?: {
          /**
           * Origin identifier (e.g., 'plugin:catalog', 'external:jenkins')
           */
          id: string;
          /**
           * Whether notifications from this origin are enabled by default
           */
          enabled: boolean;
          topics?: {
            /**
             * Topic identifier (e.g., 'entity-refresh', 'build-failure')
             */
            id: string;
            /**
             * Whether notifications for this topic are enabled by default
             */
            enabled: boolean;
          }[];
        }[];
      }[];
    };
    /*
     * Time to keep the notifications in the database, defaults to 365 days.
     * Can be disabled by setting to false.
     */
    retention?: HumanDuration | string | false;
  };
}
