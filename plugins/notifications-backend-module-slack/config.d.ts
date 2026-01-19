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
  notifications?: {
    processors?: {
      slack?: Array<{
        /**
         * Slack Bot Token. Usually starts with `xoxb-`.
         * @visibility secret
         */
        token?: string;
        /**
         * Broadcast notification receivers when receiver is set to config
         * These can be Slack User IDs, Slack User Email addresses, Slack Channel
         * Names, or Slack Channel IDs. Any valid identifier that chat.postMessage can accept.
         * @deprecated Use broadcastRoutes instead for more granular control
         */
        broadcastChannels?: string[];
        /**
         * Optional username to display as the sender of the notification
         */
        username?: string;
        /**
         * Routes for broadcast notifications based on origin and/or topic.
         * Routes are evaluated in order, first match wins.
         * Origin+topic matches take precedence over origin-only matches.
         */
        broadcastRoutes?: Array<{
          /**
           * The origin to match (e.g., 'plugin:catalog', 'external:my-service')
           */
          origin?: string;
          /**
           * The topic to match (e.g., 'entity-updated', 'alerts')
           */
          topic?: string;
          /**
           * The Slack channel(s) to send to. Can be channel IDs, channel names, or user IDs.
           */
          channel: string | string[];
        }>;
        /**
         * Concurrency limit for Slack notifications per backend instance of the notifications plugin, defaults to 10.
         */
        concurrencyLimit?: number;
        /**
         * Throttle duration between Slack notifications per backend instance of the notifications plugin, defaults to 1 minute.
         */
        throttleInterval?: HumanDuration | string;
      }>;
    };
  };
}
