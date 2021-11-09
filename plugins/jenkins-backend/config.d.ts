/*
 * Copyright 2020 Spotify AB
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
  jenkins?: {
    /**
     * Default instance baseUrl, can be specified on a named instance called "default"
     */
    baseUrl?: string;
    /**
     * Default instance username, can be specified on a named instance called "default"
     */
    username?: string;
    /**
     * Default Instance apiKey, can be specified on a named instance called "default"
     * @visibility secret
     */
    apiKey?: string;

    instances?: {
      /**
       * Name of the instance, this will be used in an annotation on catalog entities to refer to jobs on this instance.
       *
       * Use a name of "default" to specify the jenkins instance details if the annotation doesn't explicitly name an
       * instance.
       */
      name: string;

      baseUrl: string;
      username: string;
      /** @visibility secret */
      apiKey: string;
    }[];
  };
}
