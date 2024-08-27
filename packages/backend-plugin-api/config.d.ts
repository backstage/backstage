/*
 * Copyright 2024 The Backstage Authors
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
  backend?: {
    /**
     * An absolute path to a directory that can be used as a working dir, for
     * example as scratch space for large operations.
     *
     * @remarks
     *
     * Note that this must be an absolute path.
     *
     * If not set, the operating system's designated temporary directory is
     * commonly used, but that is implementation defined per plugin.
     *
     * Plugins are encouraged to heed this config setting if present, to allow
     * deployment in severely locked-down or limited environments.
     */
    workingDirectory?: string;
  };
}
