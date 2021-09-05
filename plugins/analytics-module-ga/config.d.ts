/*
 * Copyright 2020 The Backstage Authors
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
    // TODO: Only marked as optional because backstage-cli config:check in the
    // context of the monorepo is too strict. Ideally, this would be marked as
    // required.
    analytics?: {
      provider: 'ga';
      ga: {
        /**
         * Google Analytics tracking ID, e.g. UA-000000-0
         * @visibility frontend
         */
        trackingId: string;

        /**
         * Whether or not to log analytics debug statements to the console.
         * Defaults to false.
         *
         * @visibility frontend
         */
        debug?: boolean;

        /**
         * Prevents events from actually being sent when set to true. Defaults
         * to false.
         *
         * @visibility frontend
         */
        testMode?: boolean;

        /**
         * Configuration informing how Analytics Domain and Event Context
         * metadata will be captured in Google Analytics.
         */
        customDimensionsMetrics?: Array<{
          /**
           * Specifies whether the corresponding metadata should be collected
           * as a Google Analytics custom dimension or custom metric.
           *
           * @visibility frontend
           */
          type: 'dimension' | 'metric';

          /**
           * The index of the Google Analytics custom dimension or metric that
           * the metadata should be written to.
           *
           * @visibility frontend
           */
          index: number;

          /**
           * Specifies whether the desired value lives as an attribute on the
           * Analytics Domain or the Event's Context.
           *
           * @visibility frontend
           */
          source: 'domain' | 'context';

          /**
           * The attribute on the domain or context that should be captured.
           * e.g. to capture the Plugin ID associated with an event, the source
           * should be set to "domain" and the attribute should be set to
           * pluginId.
           *
           * @visibility frontend
           */
          attribute: string;
        }>;
      };
    };
  };
}
