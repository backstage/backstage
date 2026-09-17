/*
 * Copyright 2020 The Backstage Authors
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

import { createCatalogModelLayer } from '../model/createCatalogModelLayer';
import type { Entity } from '../entity/Entity';
import jsonSchema from '../schema/kinds/Resource.v1alpha1.schema.json';
import { ajvCompiledJsonSchemaValidator } from './util';

/**
 * Backstage catalog Resource kind Entity. Represents infrastructure required to operate Components.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/features/software-catalog/system-model}
 *
 * @public
 */
export interface ResourceEntityV1alpha1 extends Entity {
  apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
  kind: 'Resource';
  spec: {
    type: string;
    owner: string;
    dependsOn?: string[];
    dependencyOf?: string[];
    system?: string;
  };
}

/**
 * {@link KindValidator} for {@link ResourceEntityV1alpha1}.
 *
 * @public
 */
export const resourceEntityV1alpha1Validator =
  ajvCompiledJsonSchemaValidator(jsonSchema);

/**
 * Extends the catalog model with the Resource kind.
 *
 * @alpha
 */
export const resourceEntityModel = createCatalogModelLayer({
  layerId: 'catalog.backstage.io/kind-resource',
  builder: model => {
    model.addKind({
      group: 'backstage.io',
      names: {
        kind: 'Resource',
        singular: 'resource',
        plural: 'resources',
      },
      description:
        'A Resource describes the infrastructure a system needs to operate, like databases, topics, or buckets.',
      versions: [
        {
          name: ['v1alpha1', 'v1beta1'],
          relationFields: [
            {
              selector: { path: 'spec.owner' },
              relation: 'ownedBy',
              defaultKind: 'Group',
              defaultNamespace: 'inherit',
              allowedKinds: ['Group', 'User'],
            },
            {
              selector: { path: 'spec.dependsOn' },
              relation: 'dependsOn',
              defaultNamespace: 'inherit',
            },
            {
              selector: { path: 'spec.dependencyOf' },
              relation: 'dependencyOf',
              defaultNamespace: 'inherit',
            },
            {
              selector: { path: 'spec.system' },
              relation: 'partOf',
              defaultKind: 'System',
              defaultNamespace: 'inherit',
            },
          ],
          schema: {
            jsonSchema,
          },
        },
      ],
    });
  },
});
