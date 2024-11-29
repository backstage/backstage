/*
 * Copyright 2022 The Backstage Authors
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

import { EventParams } from './EventParams';

/**
 * Handles received events.
 * This may include triggering refreshes of catalog entities
 * or other actions to react on events.
 *
 * @public
 * @deprecated use the `EventsService` via the constructor, setter, or other means instead
 */
export interface EventSubscriber {
  /**
   * Supported event topics like "github", "bitbucketCloud", etc.
   *
   * @deprecated use the `EventsService` via the constructor, setter, or other means instead
   */
  supportsEventTopics(): string[];

  /**
   * React on a received event.
   *
   * @param params - parameters for the to be received event.
   * @deprecated you are not required to expose this anymore when using `EventsService`
   */
  onEvent(params: EventParams): Promise<void>;
}
