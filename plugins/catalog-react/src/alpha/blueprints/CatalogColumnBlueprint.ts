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

import { createExtensionBlueprint } from '@backstage/frontend-plugin-api';
import type { Entity } from '@backstage/catalog-model';
import type { ColumnSize } from '@backstage/ui';
import type { ReactElement } from 'react';
import { z } from 'zod/v4';
import {
  catalogColumnCellDataRef,
  catalogColumnHeaderDataRef,
} from './extensionData';

/**
 * Blueprint for contributing a column to the v2 catalog index page.
 *
 * @alpha
 */
export const CatalogColumnBlueprint = createExtensionBlueprint({
  kind: 'catalog-column',
  attachTo: { id: 'page:catalog', input: 'columns' },
  output: [
    catalogColumnHeaderDataRef.optional(),
    catalogColumnCellDataRef.optional(),
  ],
  dataRefs: {
    header: catalogColumnHeaderDataRef,
    cell: catalogColumnCellDataRef,
  },
  configSchema: {
    visible: z.boolean().default(true),
  },
  *factory(
    params: {
      id: string;
      label: string;
      cell: (entity: Entity) => ReactElement;
      header?: () => ReactElement;
      orderField?: string;
      searchFields?: string[];
      filter?: (entity: Entity) => boolean;
      width?: ColumnSize;
    },
    { config },
  ) {
    if (!config.visible) {
      return;
    }
    const { cell, ...header } = params;
    yield catalogColumnHeaderDataRef(
      Object.fromEntries(
        Object.entries(header).filter(([, v]) => v !== undefined),
      ) as typeof header,
    );
    yield catalogColumnCellDataRef(cell);
  },
});
