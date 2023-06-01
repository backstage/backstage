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

/**
 * Signals service for publishing and subscribing to messages suitable for use by
 * Backstage plugins.
 *
 * @public
 */
export interface SignalsService {
  /**
   * Connects the service to the backend. Must be called before publishing or subscribing
   * to data.
   */
  connect(): void;

  /**
   * Disconnects the service from the backend and cleans all subscriptions.
   */
  disconnect(): void;

  /**
   * Publishes a message from this plugin with optional topic.
   *
   * @param message - Message to be published
   * @param target - Optional plugin specific topic or user/group entity references this message is targeted for
   */
  publish(
    message: unknown,
    target?: {
      topic?: string;
      entityRefs?: string[];
    },
  ): void;
}
