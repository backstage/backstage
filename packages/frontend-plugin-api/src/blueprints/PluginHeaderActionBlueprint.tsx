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

import {
  createExtensionBlueprint,
  createExtensionBlueprintParams,
  createExtensionDataRef,
} from '../wiring';

const actionDataRef = createExtensionDataRef<
  () => Promise<JSX.Element>
>().with({ id: 'core.plugin-header-action.loader' });

/**
 * Creates extensions that provide plugin-scoped header actions.
 *
 * @remarks
 *
 * These actions are automatically scoped to the plugin that provides them
 * and will appear in the header of all pages belonging to that plugin.
 *
 * @public
 */
export const PluginHeaderActionBlueprint = createExtensionBlueprint({
  kind: 'plugin-header-action',
  attachTo: { id: 'api:app/header-actions', input: 'actions' },
  output: [actionDataRef],
  dataRefs: {
    action: actionDataRef,
  },
  defineParams(params: { loader: () => Promise<JSX.Element> }) {
    return createExtensionBlueprintParams(params);
  },
  *factory(params) {
    yield actionDataRef(params.loader);
  },
});
