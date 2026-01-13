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

import { ReactNode } from 'react';
import { ApiRef, createApiRef } from '../system';
import type { ExtensionBoundary } from '../../components';

/**
 * The Plugin Wrapper API allows plugins to wrap their extensions with providers. This API is only intended for internal use by the Backstage frontend system. To provide contexts to plugin components, use {@link ExtensionBoundary} instead.
 *
 * @public
 */
export type PluginWrapperApi = {
  /**
   * Returnes the root wrapper that manages the global plugin state across plugin wrapper instances.
   */
  getRootWrapper(): (props: { children: ReactNode }) => JSX.Element | null;

  /**
   * Returns a wrapper component for a specific plugin, or undefined if no wrappers exist. Do not use this API directly, instead use {@link ExtensionBoundary} to wrap your plugin components if needed.
   */
  getPluginWrapper(
    pluginId: string,
  ): ((props: { children: ReactNode }) => JSX.Element | null) | undefined;
};

/**
 * The API reference of {@link PluginWrapperApi}.
 *
 * @public
 */
export const pluginWrapperApiRef: ApiRef<PluginWrapperApi> = createApiRef({
  id: 'core.plugin-wrapper',
});
