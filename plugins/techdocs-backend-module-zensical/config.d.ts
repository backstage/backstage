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

export interface Config {
  techdocs?: {
    generator?: {
      /**
       * Override behavior specific to Zensical.
       */
      zensical?: {
        /**
         * Docker image to use for Zensical builds. Defaults to the Zensical
         * image published by Backstage; techdocs.generator.dockerImage is not
         * used, since it configures the MkDocs image.
         */
        dockerImage?: string;
      };
    };
  };
}
