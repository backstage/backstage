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
  costInsights: {
    /**
     * @visibility frontend
     */
    engineerCost: number;

    /**
     * @visibility frontend
     */
    engineerThreshold?: number;

    /**
     * @visibility frontend
     */
    baseCurrency?: {
      /**
       * @visibility frontend
       */
      locale?: string;
      options?: {
        /**
         * @visibility frontend
         */
        localeMatcher?: string | undefined;
        /**
         * @visibility frontend
         */
        style?: string | undefined;
        /**
         * @visibility frontend
         */
        currency?: string | undefined;
        /**
         * @visibility frontend
         */
        currencySign?: string | undefined;
        /**
         * @visibility frontend
         */
        useGrouping?: boolean | undefined;
        /**
         * @visibility frontend
         */
        minimumIntegerDigits?: number | undefined;
        /**
         * @visibility frontend
         */
        minimumFractionDigits?: number | undefined;
        /**
         * @visibility frontend
         */
        maximumFractionDigits?: number | undefined;
        /**
         * @visibility frontend
         */
        minimumSignificantDigits?: number | undefined;
        /**
         * @visibility frontend
         */
        maximumSignificantDigits?: number | undefined;
      };
    };

    products?: {
      [kind: string]: {
        /**
         * @visibility frontend
         */
        name: string;

        /**
         * @visibility frontend
         */
        icon?: 'compute' | 'data' | 'database' | 'storage' | 'search' | 'ml';
      };
    };

    metrics?: {
      [kind: string]: {
        /**
         * @visibility frontend
         */
        name: string;

        /**
         * @visibility frontend
         */
        default?: boolean;
      };
    };

    currencies?: {
      [id: string]: {
        /**
         * @visibility frontend
         */
        label: string;

        /**
         * @visibility frontend
         */
        unit: string;

        /**
         * @visibility frontend
         */
        kind?: string;

        /**
         * @visibility frontend
         */
        prefix?: string;

        /**
         * @visibility frontend
         */
        rate?: number;

        /**
         * @visibility frontend
         */
        default?: boolean;
      };
    };
  };
}
