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

export interface Config {
  app: {
    analytics?: {
      nr: {
        /**
         * New Relic Account ID, e.g. 1234567
         * @visibility frontend
         */
        accountId: string;

        /**
         * New Relic Application ID, e.g. 987654321
         * @visibility frontend
         */
        applicationId: string;

        /**
         * New Relic License Key, e.g. NRJS-12a3456bc78de9123f4
         * @visibility frontend
         */
        licenseKey: string;

        /**
         * Whether to enabled distributed tracing, defaults to false
         * @visibility frontend
         */
        distributedTracingEnabled: boolean;

        /**
         * Whether to enabled tracing of cookies, defaults to false
         * @visibility frontend
         */
        cookiesEnabled: boolean;

        /**
         * Whether to use New Relic's EU Datacenter endpoints, defaults to false
         * @visibility frontend
         */
        useEuEndpoint: boolean;
      };
    };
  };
}
