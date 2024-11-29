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

/**
 * @public
 */
export interface EventParams<TPayload = unknown> {
  /**
   * Topic for which this event should be published.
   */
  topic: string;
  /**
   * Event payload.
   */
  eventPayload: TPayload;
  /**
   * Metadata (e.g., HTTP headers and similar for events received from external).
   */
  metadata?: Record<string, string | string[] | undefined>;
}
