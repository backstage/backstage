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
  /**
   * Configuration options for the stack overflow plugin
   */
  stackoverflow?: {
    /**
     * The base url of the Stack Overflow API used for the plugin
     */
    baseUrl?: string;

    /**
     * The API key to authenticate to Stack Overflow API
     * @visibility secret
     */
    apiKey?: string;

    /**
     * The name of the team for a Stack Overflow for Teams account
     */
    teamName?: string;

    /**
     * The API Access Token to authenticate to Stack Overflow API
     * @visibility secret
     */
    apiAccessToken?: string;

    /**
     * Type representing the request parameters.
     */
    requestParams?: {
      [key: string]: string | string[] | number;
    };
  };
}
