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

import {
  ExtensionBoundary,
  coreExtensionData,
  createExtensionBlueprint,
} from '@backstage/frontend-plugin-api';

/**
 * Creates Catalog Filter Extensions
 * @alpha
 */
export const CatalogFilterBlueprint = createExtensionBlueprint({
  kind: 'catalog-filter',
  attachTo: { id: 'page:catalog', input: 'filters' },
  output: [coreExtensionData.reactElement],
  factory(params: { loader: () => Promise<JSX.Element> }, { node }) {
    return [
      coreExtensionData.reactElement(
        ExtensionBoundary.lazy(node, params.loader),
      ),
    ];
  },
});
