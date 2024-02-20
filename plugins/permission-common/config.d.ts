/*
 * Copyright 2021 The Backstage Authors
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
  /** Configuration options for Backstage permissions and authorization */
  permission?: {
    /**
     * Whether authorization is enabled in Backstage. Defaults to false, which means authorization
     * requests will be automatically allowed without invoking the authorization policy.
     * @visibility frontend
     */
    enabled?: boolean;
    /**
     * Authorization cache configuration. Defaults to disabled.
     */
    cache?: {
      /**
       * Whether to enable the authorization cache. Defaults to false. Enabling also requires
       * that the CacheService is available for the router.
       */
      enabled?: boolean;
      /**
       * Maximum time to live for authorization cache items in milliseconds. Defaults to 10 minutes or
       * the amount of user's session time left, whichever is shorter.
       */
      ttl?: number;
    };
  };
}
