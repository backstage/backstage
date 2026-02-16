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

import { lazy as reactLazy } from 'react';
import { ExtensionBoundary } from '../components';
import {
  coreExtensionData,
  createExtensionBlueprint,
  createExtensionBlueprintParams,
} from '../wiring';

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
export const HeaderActionBlueprint = createExtensionBlueprint({
  kind: 'header-action',
  attachTo: { id: 'api:app/header-actions', input: 'actions' },
  output: [coreExtensionData.reactElement],
  defineParams(params: { loader: () => Promise<JSX.Element> }) {
    return createExtensionBlueprintParams(params);
  },
  *factory(params, { node }) {
    const LazyAction = reactLazy(() =>
      params.loader().then(element => ({ default: () => element })),
    );
    yield coreExtensionData.reactElement(
      <ExtensionBoundary node={node} errorPresentation="error-api">
        <LazyAction />
      </ExtensionBoundary>,
    );
  },
});
