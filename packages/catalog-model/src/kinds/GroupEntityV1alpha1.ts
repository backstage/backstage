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
import jsonSchema from '../schema/kinds/Group.v1alpha1.schema.json';
import { ajvCompiledJsonSchemaValidator } from './util';

/**
 * Backstage catalog Group kind Entity.
 *
 * @public
 */
export interface GroupEntityV1alpha1 extends Entity {
  apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
  kind: 'Group';
  spec: {
    type: string;
    profile?: {
      displayName?: string;
      email?: string;
      picture?: string;
    };
    parent?: string;
    children: string[];
    members?: string[];
  };
}

/**
 * {@link KindValidator} for {@link GroupEntityV1alpha1}.
 * @public
 */
export const groupEntityV1alpha1Validator =
  ajvCompiledJsonSchemaValidator(jsonSchema);

/**
 * Extends the catalog model with the Group kind.
 *
 * @alpha
 */
export const groupEntityModel = createCatalogModelLayer({
  layerId: 'catalog.backstage.io/kind-group',
  builder: model => {
    model.addKind({
      group: 'backstage.io',
      names: {
        kind: 'Group',
        singular: 'group',
        plural: 'groups',
      },
      description:
        'A Group describes an organizational entity, such as a team, a business unit, or a loose collection of people.',
      versions: [
        {
          name: ['v1alpha1', 'v1beta1'],
          relationFields: [
            {
              selector: { path: 'spec.parent' },
              relation: 'childOf',
              defaultKind: 'Group',
              defaultNamespace: 'inherit',
              allowedKinds: ['Group'],
            },
            {
              selector: { path: 'spec.children' },
              relation: 'parentOf',
              defaultKind: 'Group',
              defaultNamespace: 'inherit',
              allowedKinds: ['Group'],
            },
            {
              selector: { path: 'spec.members' },
              relation: 'hasMember',
              defaultKind: 'User',
              defaultNamespace: 'inherit',
              allowedKinds: ['User'],
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
