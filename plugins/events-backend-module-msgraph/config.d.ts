/*
 * Copyright 2026 The Backstage Authors
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

import type { HumanDuration } from '@backstage/types';

export interface Config {
  events?: {
    modules?: {
      /**
       * events-backend-module-msgraph plugin configuration.
       */
      msgraph?: {
        /**
         * An optional delay to wait before starting the subscription process.
         * This might be useful to sync URL accessibility with k8s liveness/readiness probes.
         * Supported formats:
         * - A string in the format of '1d', '2 seconds' etc. as supported by the `ms`
         *   library.
         * - A standard ISO formatted duration string, e.g. 'P2DT6H' or 'PT1M'.
         * - An object with individual units (in plural) as keys, e.g. `{ days: 2, hours: 6 }`.
         */
        startupDelay?: HumanDuration | string;

        /**
         * The URL to receive Microsoft Graph change notifications at. This must be a publicly accessible URL that Microsoft Graph can reach.
         */
        notificationUrl: string;
        /**
         * The resources to listen for changes on. Currently only 'groups' and 'users' are supported.
         */
        subscriptionResources: Array<'groups' | 'users'>;
        /**
         * The tenant whose graph data we want to be notified about.
         */
        tenantId: string;
        /**
         * The OAuth client ID to use for authenticating requests.
         */
        clientId: string;
        /**
         * The OAuth client secret to use for authenticating requests.
         *
         * @visibility secret
         */
        clientSecret: string;
      };
    };
  };
}
