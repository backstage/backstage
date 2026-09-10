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

/** @public */
export interface RootInstanceMetadataServicePluginInfo {
  readonly pluginId: string;
  readonly modules: ReadonlyArray<{
    moduleId: string;
  }>;
}

/** @public */
export interface RootInstanceMetadataService {
  /**
   * The globally unique identifier of this specific Backstage backend
   * instance.
   *
   * Every backend instance has its own identifier. The identifier is stable
   * for the lifetime of the instance, must never be reused for another backend
   * instance, and should be treated as an opaque string.
   */
  getId(): string;

  getInstalledPlugins: () => Promise<
    ReadonlyArray<RootInstanceMetadataServicePluginInfo>
  >;
}
