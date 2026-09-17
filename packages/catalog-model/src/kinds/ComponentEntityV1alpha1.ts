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
import jsonSchema from '../schema/kinds/Component.v1alpha1.schema.json';
import { ajvCompiledJsonSchemaValidator } from './util';

/**
 * Backstage catalog Component kind Entity. Represents a single, individual piece of software.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/features/software-catalog/system-model}
 *
 * @public
 */
export interface ComponentEntityV1alpha1 extends Entity {
  apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
  kind: 'Component';
  spec: {
    type: string;
    lifecycle: string;
    owner: string;
    subcomponentOf?: string;
    providesApis?: string[];
    consumesApis?: string[];
    dependsOn?: string[];
    dependencyOf?: string[];
    system?: string;
  };
}

/**
 * {@link KindValidator} for {@link ComponentEntityV1alpha1}.
 *
 * @public
 */
export const componentEntityV1alpha1Validator =
  ajvCompiledJsonSchemaValidator(jsonSchema);

/**
 * Extends the catalog model with the Component kind.
 *
 * @alpha
 */
export const componentEntityModel = createCatalogModelLayer({
  layerId: 'catalog.backstage.io/kind-component',
  builder: model => {
    model.addKind({
      group: 'backstage.io',
      names: {
        kind: 'Component',
        singular: 'component',
        plural: 'components',
      },
      description:
        'A Component describes a software component, usually with a distinct deployable or linkable artifact.',
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
              selector: { path: 'spec.subcomponentOf' },
              relation: 'partOf',
              defaultKind: 'Component',
              defaultNamespace: 'inherit',
            },
            {
              selector: { path: 'spec.providesApis' },
              relation: 'providesApi',
              defaultKind: 'API',
              defaultNamespace: 'inherit',
            },
            {
              selector: { path: 'spec.consumesApis' },
              relation: 'consumesApi',
              defaultKind: 'API',
              defaultNamespace: 'inherit',
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
