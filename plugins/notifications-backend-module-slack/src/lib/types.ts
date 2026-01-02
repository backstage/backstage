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

export interface SlackNotificationOptions {
  url: string;
  payload: string;
}

/**
 * Configuration for routing broadcast notifications to specific Slack channels
 * based on origin and/or topic.
 */
export type BroadcastRoute = {
  /** The origin to match (e.g., 'plugin:catalog', 'external:my-service') */
  origin?: string;
  /** The topic to match (e.g., 'entity-updated', 'alerts') */
  topic?: string;
  /** The Slack channel(s) to send to */
  channels: string[];
};
