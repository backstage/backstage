/*
 * Copyright 2021 The Backstage Authors
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

import { FactRetrieverContext } from '@backstage/plugin-tech-insights-node';
import { CatalogClient } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import isEmpty from 'lodash/isEmpty';
import camelCase from 'lodash/camelCase';
import { get } from 'lodash';

export const createEntityFactRetriever = ({
  annotations = [],
}: {
  annotations?: string[];
}) => ({
  id: 'entityRetriever',
  version: '0.0.1',
  schema: {
    hasOwner: {
      type: 'boolean',
      description: 'The spec.owner field is set',
    },
    hasGroupOwner: {
      type: 'boolean',
      description: 'The spec.owner field is set and refers to a group',
    },
    hasDescription: {
      type: 'boolean',
      description: 'The entity has an owned_by relation',
    },
    ...annotations.reduce((acc: object, it: string) => {
      return {
        ...acc,
        [camelCase(`hasAnnotation-${it}`)]: {
          type: 'boolean',
          description: `The entity has the annotation: ${it} `,
        },
      };
    }, {}),
  },
  handler: async ({ discovery }: FactRetrieverContext) => {
    const catalogClient = new CatalogClient({
      discoveryApi: discovery,
    });
    const entities = await catalogClient.getEntities();

    return entities.items.map((entity: Entity) => {
      return {
        entity: {
          namespace: entity.metadata.namespace!!,
          kind: entity.kind,
          name: entity.metadata.name,
        },
        facts: {
          hasOwner: Boolean(entity.spec?.owner),
          hasGroupOwner: Boolean(
            entity.spec?.owner &&
              (entity.spec?.owner as string).startsWith('group:'),
          ),
          hasDescription: Boolean(entity.metadata?.description),
          hasTags: !isEmpty(entity.metadata?.tags),
          ...annotations.reduce(
            (acc: object, annotation: string) => ({
              ...acc,
              [camelCase(`hasAnnotation-${annotation}`)]: Boolean(
                get(entity, ['metadata', 'annotations', annotation]),
              ),
            }),
            {},
          ),
        },
      };
    });
  },
});
