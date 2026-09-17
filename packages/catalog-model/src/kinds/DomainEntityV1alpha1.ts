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
import jsonSchema from '../schema/kinds/Domain.v1alpha1.schema.json';
import { ajvCompiledJsonSchemaValidator } from './util';

/**
 * Backstage Domain kind Entity. Domains group Systems together.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/features/software-catalog/system-model}
 *
 * @public
 */
export interface DomainEntityV1alpha1 extends Entity {
  apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
  kind: 'Domain';
  spec: {
    owner: string;
    subdomainOf?: string;
    type?: string;
  };
}

/**
 * {@link KindValidator} for {@link DomainEntityV1alpha1}.
 *
 * @public
 */
export const domainEntityV1alpha1Validator =
  ajvCompiledJsonSchemaValidator(jsonSchema);

/**
 * Extends the catalog model with the Domain kind.
 *
 * @alpha
 */
export const domainEntityModel = createCatalogModelLayer({
  layerId: 'catalog.backstage.io/kind-domain',
  builder: model => {
    model.addKind({
      group: 'backstage.io',
      names: {
        kind: 'Domain',
        singular: 'domain',
        plural: 'domains',
      },
      description:
        'A Domain groups a collection of systems that share terminology, domain models, business purpose, or documentation.',
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
              selector: { path: 'spec.subdomainOf' },
              relation: 'partOf',
              defaultKind: 'Domain',
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
