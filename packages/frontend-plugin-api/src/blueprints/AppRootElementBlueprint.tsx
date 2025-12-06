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

import { ExtensionBoundary } from '@backstage/frontend-plugin-api';
import { coreExtensionData, createExtensionBlueprint } from '../wiring';

/**
 * Creates extensions that render a React element at the app root, outside of
 * the app layout. This is useful for example for shared popups and similar.
 *
 * @public
 */
export const AppRootElementBlueprint = createExtensionBlueprint({
  kind: 'app-root-element',
  attachTo: { id: 'app/root', input: 'elements' },
  output: [coreExtensionData.reactElement],
  *factory(params: { element: JSX.Element }, { node }) {
    yield coreExtensionData.reactElement(
      <ExtensionBoundary node={node} errorPresentation="error-api">
        {params.element}
      </ExtensionBoundary>,
    );
  },
});
