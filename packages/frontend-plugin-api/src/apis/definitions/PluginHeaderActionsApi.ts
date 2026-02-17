/*
 * Copyright 2025 The Backstage Authors
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

import { JSX } from 'react';
import { createApiRef } from '../system';

/**
 * API for retrieving plugin-scoped header actions.
 *
 * @remarks
 *
 * Header actions are provided via
 * {@link @backstage/frontend-plugin-api#PluginHeaderActionBlueprint}
 * and automatically scoped to the providing plugin.
 *
 * @public
 */
export type PluginHeaderActionsApi = {
  /**
   * Returns the header actions for a given plugin.
   */
  getPluginHeaderActions(pluginId: string): Array<JSX.Element | null>;
};

/**
 * The `ApiRef` of {@link PluginHeaderActionsApi}.
 *
 * @public
 */
export const pluginHeaderActionsApiRef = createApiRef<PluginHeaderActionsApi>({
  id: 'core.plugin-header-actions',
});
