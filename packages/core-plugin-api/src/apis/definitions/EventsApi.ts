/*
 * Copyright 2023 The Backstage Authors
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

import { ApiRef, createApiRef } from '../system';

/**
 * Events API for subscribing to messages suitable for use by
 * Backstage frontend plugins.
 *
 * @public
 */
export interface EventsApi {
  /**
   * Subscribe to messages from specific plugin optionally to specific topic.
   * @param pluginId - Plugin id
   * @param onMessage - Callback function to be called when data is received
   * @param topic - Optional plugin specific topic
   */
  subscribe(
    pluginId: string,
    onMessage: (data: unknown) => void,
    topic?: string,
  ): void;

  /**
   * Unsubscribe from messages from specific plugin optionally to specific topic.
   * @param pluginId - Plugin id
   * @param topic - Optional plugin specific topic
   */
  unsubscribe(pluginId: string, topic?: string): void;
}

/**
 * The {@link ApiRef} of {@link EventsApi}.
 *
 * @public
 */
export const eventsApiRef: ApiRef<EventsApi> = createApiRef({
  id: 'core.events',
});
