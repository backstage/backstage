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

import { createCatalogModelLayer } from '@backstage/catalog-model/alpha';
import type { JsonObject } from '@backstage/types';
import jsonSchema from './Template.v1beta3.schema.json';

/**
 * Extends the catalog model with the Template kind.
 *
 * @alpha
 */
export const scaffolderCatalogModelLayer = createCatalogModelLayer({
  layerId: 'scaffolder.backstage.io/kind-template',
  builder: model => {
    model.addKind({
      group: 'scaffolder.backstage.io',
      names: {
        kind: 'Template',
        singular: 'template',
        plural: 'templates',
      },
      description: 'A template for scaffolding a new component',
      versions: [
        {
          name: 'v1beta3',
          relationFields: [
            {
              selector: { path: 'spec.owner' },
              relation: 'ownedBy',
              defaultKind: 'Group',
              // TODO: This was inherit since before, but should ownership in general be default instead?
              defaultNamespace: 'inherit',
              allowedKinds: ['Group', 'User'],
            },
          ],
          schema: {
            jsonSchema: jsonSchema as JsonObject,
          },
        },
      ],
    });
  },
});
