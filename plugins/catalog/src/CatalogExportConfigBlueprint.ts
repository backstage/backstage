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
  createExtensionBlueprint,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';
import type { CatalogExportSettings } from './components/CatalogExportButton';

/** @internal */
export const catalogExportConfigDataRef = createExtensionDataRef<{
  exporters?: CatalogExportSettings['exporters'];
  columns?: CatalogExportSettings['columns'];
  onSuccess?: CatalogExportSettings['onSuccess'];
  onError?: CatalogExportSettings['onError'];
}>().with({
  id: 'catalog.export-customization',
});

/**
 * Blueprint for creating catalog export configuration extensions.
 * @public
 */
export const CatalogExportConfigBlueprint = createExtensionBlueprint({
  kind: 'catalog-export-config',
  attachTo: { id: 'page:catalog', input: 'exportConfig' },
  output: [catalogExportConfigDataRef],
  factory(params: {
    exporters?: CatalogExportSettings['exporters'];
    columns?: CatalogExportSettings['columns'];
    onSuccess?: CatalogExportSettings['onSuccess'];
    onError?: CatalogExportSettings['onError'];
  }) {
    return [catalogExportConfigDataRef(params)];
  },
});
