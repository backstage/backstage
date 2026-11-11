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

import {
  ExtensionBoundary,
  coreExtensionData,
  createExtensionBlueprint,
} from '@backstage/frontend-plugin-api';

/**
 * Adds content to the app's navigation that is not a link to a page, such as
 * a list of user shortcuts or a search button.
 *
 * @remarks
 * Links to pages come from `PageBlueprint` extensions and need no extension of
 * their own.
 *
 * A nav element only renders where the app lists it, in the `elements` config
 * of the `app/nav` extension. The app decides which elements show, in which
 * slot, and in what order, so plugins can't add themselves to the navigation.
 *
 * @public
 */
export const NavElementBlueprint = createExtensionBlueprint({
  kind: 'nav-element',
  attachTo: { id: 'app/nav', input: 'elements' },
  output: [coreExtensionData.reactElement],
  *factory(params: { loader: () => Promise<JSX.Element> }, { node }) {
    yield coreExtensionData.reactElement(
      ExtensionBoundary.lazy(node, params.loader),
    );
  },
});
