/*
 * Copyright 2022 The Backstage Authors
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
 * Access metadata about the current plugin.
 *
 * See the {@link https://backstage.io/docs/backend-system/core-services/plugin-metadata | service documentation} for more details.
 *
 * @public
 */
export interface PluginMetadataService {
  /**
   * The ID of the current plugin.
   */
  getId(): string;
}
