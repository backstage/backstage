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

import { ComponentType, ReactNode } from 'react';
import { createApiRef } from '@backstage/frontend-plugin-api';

/**
 * The Plugin Wrapper API is used to wrap plugin extensions with providers,
 * plugins should generally use `ExtensionBoundary` instead.
 *
 * @remarks
 *
 * This API is primarily intended for internal use by the Backstage frontend
 * system, but can be used for advanced use-cases. If you do override it, be
 * sure to include the default implementation as well.
 *
 * @alpha
 */
export type PluginWrapperApi = {
  /**
   * Returns a wrapper component for a specific plugin, or undefined if no
   * wrappers exist. Do not use this API directly, instead use
   * `ExtensionBoundary` to wrap your plugin components if needed.
   */
  getPluginWrapper(
    pluginId: string,
  ): ComponentType<{ children: ReactNode }> | undefined;
};

/**
 * The API reference of {@link PluginWrapperApi}.
 *
 * @alpha
 */
export const pluginWrapperApiRef = createApiRef<PluginWrapperApi>({
  id: 'core.plugin-wrapper.alpha',
});
