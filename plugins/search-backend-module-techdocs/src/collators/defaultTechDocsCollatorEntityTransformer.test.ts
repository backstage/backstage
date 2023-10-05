/*
 * Copyright 2022 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import { defaultTechDocsCollatorEntityTransformer } from './defaultTechDocsCollatorEntityTransformer';

describe('defaultTechDocsCollatorEntityTransformer', () => {
  it('should transform the entity with the correct properties', () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'test-component',
        description: 'A test component',
        annotations: {
          'backstage.io/techdocs-ref': 'docs',
        },
      },
      spec: {
        type: 'service',
        owner: 'test@example.com',
      },
    };

    const transformedEntity = defaultTechDocsCollatorEntityTransformer(entity);

    expect(transformedEntity).toEqual({
      kind: entity.kind,
      namespace: entity.metadata.namespace || 'default',
      annotations: entity.metadata.annotations || '',
      name: entity.metadata.name || '',
      title: entity.metadata.title || '',
      text: 'A test component',
      componentType: entity.spec?.type?.toString() || 'other',
      type: entity.spec?.type?.toString() || 'other',
      lifecycle: (entity.spec?.lifecycle as string) || '',
      owner: (entity.spec?.owner as string) || '',
      path: '',
    });
  });
});
