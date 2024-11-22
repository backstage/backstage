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

export interface Config {
  events?: {
    /**
     * Timeout in milliseconds for how long to wait before closing subscription events
     * requests to ensure they don't stall or that events get stuck. Defaults to 55 seconds.
     */
    notifyTimeoutMs?: number;

    http?: {
      /**
       * Topics for which a route has to be registered
       * at which we can receive events via HTTP POST requests
       * (i.e. received from webhooks).
       */
      topics?: string[];
    };
  };
}
