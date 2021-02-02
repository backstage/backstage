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
/**
 * TechDocs schema below is an abstract of what's used within techdocs-backend and for its visibility
 * to view the complete TechDocs schema please refer: plugins/techdocs/config.d.ts
 * */
export interface Config {
  /** Configuration options for the techdocs-backend plugin */
  techdocs: {
    /**
     * documentation building process depends on the builder attr
     * attr: 'builder' - accepts a string value
     * e.g. builder: 'local'
     * alternative: 'external' etc.
     * @see http://backstage.io/docs/features/techdocs/configuration
     */
    builder: 'local' | 'external';
    /**
     * techdocs publisher information
     */
    publisher: {
      /**
       * attr: 'type' - accepts a string value
       * e.g. type: 'local'
       * aleternatives: 'googleGcs' etc.
       * @see http://backstage.io/docs/features/techdocs/configuration
       */
      type: 'local' | 'googleGcs' | 'awsS3';
    };
    /**
     * attr: 'storageUrl' - accepts a string value
     * e.g. storageUrl: http://localhost:7000/api/techdocs/static/docs
     * @deprecated
     */
    storageUrl?: string;
  };
}
