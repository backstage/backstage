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
  /* Configuration options for the incident plugin
   * @visibility frontend
   */
  incident?: {
    /**
     * The API key that provides access to the incident.io API.
     * @see https://app.incident.io/settings/api-keys
     */
    apiKey: string;

    /**
     * The base URL of the incident dashboard, only useful in development.
     * @visibility frontend
     */
    baseUrl?: string;

    /**
     * The endpoint to use for API calls, only useful for development.
     */
    endpoint?: string;

    /*
     * @visibility frontend
     */
    fields: {
      /**
       * The custom field ID that associated API entities to incidents.
       * @visibility frontend
       */
      api?: string;
      /**
       * The custom field ID that associated Component entities to incidents.
       * @visibility frontend
       */
      component?: string;
      /**
       * The custom field ID that associated Domain entities to incidents.
       * @visibility frontend
       */
      domain?: string;
      /**
       * The custom field ID that associated System entities to incidents.
       * @visibility frontend
       */
      system?: string;
    };
  };
}
